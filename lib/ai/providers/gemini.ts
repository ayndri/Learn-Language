import { AiError, type AiProvider, type AiTask, type GenerateArgs, type GenerateTextArgs } from '@/lib/ai/provider'
import { toGeminiSchema } from '@/lib/ai/schema'

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

/**
 * Model dibaca dari env dan default-nya memakai alias `*-latest`.
 *
 * Jangan hardcode nomor versi: Google mempensiunkan model cukup cepat
 * (gemini-2.5-* sudah membalas 404 per Agustus 2026), dan alias ikut naik sendiri.
 */
const LESSON_MODEL = () => process.env.GEMINI_MODEL_LESSON ?? 'gemini-flash-latest'
const ITEMS_MODEL = () => process.env.GEMINI_MODEL_ITEMS ?? 'gemini-flash-lite-latest'

/**
 * Daftar model untuk sebuah pekerjaan, urut dari yang paling diinginkan.
 *
 * Model pilihan didahulukan, tapi ada cadangannya: free tier kadang membalas
 * 503 "high demand" yang tidak ada hubungannya dengan kuota kita. Kalau itu
 * terjadi, lebih baik pelajaran tetap jadi memakai model yang lebih ringan
 * daripada seluruh penyiapan gagal.
 */
function modelsFor(task: AiTask): string[] {
  const preferred = task === 'lesson' ? LESSON_MODEL() : ITEMS_MODEL()
  const fallback = task === 'lesson' ? ITEMS_MODEL() : LESSON_MODEL()
  return preferred === fallback ? [preferred] : [preferred, fallback]
}

type GeminiPart = { text?: string; thought?: boolean }

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] }
    finishReason?: string
  }>
  promptFeedback?: { blockReason?: string }
  error?: { message?: string; status?: string }
}

const MAX_ATTEMPTS = 3

async function callGemini(task: AiTask, body: Record<string, unknown>): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new AiError('GEMINI_API_KEY belum diset — cek .env.local')

  let lastError: unknown

  // Coba model pilihan sampai habis percobaan, baru pindah ke cadangan.
  for (const model of modelsFor(task)) {
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      let res: Response
      try {
        res = await fetch(`${BASE_URL}/${model}:generateContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
          body: JSON.stringify(body),
        })
      } catch (cause) {
        lastError = cause
        await backoff(attempt)
        continue
      }

      const raw = (await res.json().catch(() => null)) as GeminiResponse | null

      if (res.status === 429 || res.status >= 500) {
        const message = raw?.error?.message ?? `HTTP ${res.status}`

        // `limit: 0` berarti model ini memang tidak tersedia di free tier —
        // retry tidak akan pernah berhasil, langsung pindah model.
        if (message.includes('limit: 0')) {
          lastError = new AiError(`Model "${model}" tidak tersedia di free tier.`, message, true)
          break
        }

        lastError = new AiError(message, raw, true)
        if (attempt < MAX_ATTEMPTS) {
          // 503 = lonjakan permintaan di sisi Google, bukan kuota kita. Butuh
          // jeda lebih panjang daripada 429 yang biasanya cuma soal RPM.
          await backoff(attempt, message, res.status === 503)
          continue
        }
        break // habis percobaan untuk model ini → coba cadangannya
      }

      if (!res.ok) {
        throw new AiError(raw?.error?.message ?? `Gemini menolak request (HTTP ${res.status})`, raw)
      }

      if (raw?.promptFeedback?.blockReason) {
        throw new AiError(`Prompt diblokir: ${raw.promptFeedback.blockReason}`, raw)
      }

      const candidate = raw?.candidates?.[0]
      if (candidate?.finishReason && !['STOP', 'MAX_TOKENS'].includes(candidate.finishReason)) {
        throw new AiError(`Generate berhenti dengan alasan: ${candidate.finishReason}`, raw)
      }

      // Model thinking mengembalikan part bertanda `thought` — itu bukan jawaban.
      const text = (candidate?.content?.parts ?? [])
        .filter((p) => !p.thought && typeof p.text === 'string')
        .map((p) => p.text)
        .join('')

      if (!text.trim()) throw new AiError('Gemini mengembalikan respons kosong', raw)
      return text
    }
  }

  throw new AiError(
    lastError instanceof AiError
      ? `Semua model gagal: ${lastError.message}`
      : 'Gemini gagal setelah beberapa kali percobaan',
    lastError,
    true,
  )
}

function backoff(attempt: number, message?: string, overloaded = false): Promise<void> {
  // Gemini menyertakan "Please retry in 2.09s" pada balasan 429 — pakai kalau ada.
  const suggested = message?.match(/retry in ([\d.]+)s/)?.[1]
  const base = overloaded ? 3000 : 1000
  const ms = suggested ? Math.ceil(Number(suggested) * 1000) + 250 : base * 2 ** (attempt - 1)
  return new Promise((resolve) => setTimeout(resolve, Math.min(ms, 20_000)))
}

export function geminiProvider(): AiProvider {
  return {
    name: 'gemini',

    async generate<T>({ task, schema, prompt, system, temperature = 0.3 }: GenerateArgs<T>): Promise<T> {
      const text = await callGemini(task, {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
        generationConfig: {
          temperature,
          responseMimeType: 'application/json',
          responseSchema: toGeminiSchema(schema),
        },
      })

      let parsed: unknown
      try {
        parsed = JSON.parse(text)
      } catch (cause) {
        throw new AiError('Keluaran Gemini bukan JSON valid', cause)
      }

      // responseSchema membatasi BENTUK, bukan isi. Validasi ulang tetap wajib:
      // schema tidak bisa menyatakan hal seperti "tepat satu lubang di kalimat".
      const result = schema.safeParse(parsed)
      if (!result.success) {
        throw new AiError(
          `Keluaran Gemini tidak sesuai schema: ${result.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`,
          parsed,
        )
      }
      return result.data
    },

    async generateText({ task, prompt, system, temperature = 0.4 }: GenerateTextArgs): Promise<string> {
      return callGemini(task, {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
        generationConfig: { temperature },
      })
    },
  }
}
