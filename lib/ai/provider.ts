import type { z } from 'zod'
import { geminiProvider } from '@/lib/ai/providers/gemini'

/**
 * SATU pintu ke AI untuk seluruh aplikasi.
 *
 * Alasannya praktis, bukan estetis: kuota free tier berubah tanpa pemberitahuan
 * (Desember 2025 Google memotongnya, dan model Pro sudah hilang dari free tier).
 * Kalau panggilan AI tersebar di banyak file, ganti provider = refactor.
 * Dengan interface ini, ganti provider = ganti satu baris di bawah.
 */

/**
 * Dua "pekerjaan" dengan kebutuhan berbeda:
 * - `lesson`: sedikit request, kualitas paling penting (penjelasan grammar yang salah
 *   tidak bisa kamu deteksi saat masih pemula) → pakai model terkuat yang gratis.
 * - `items`:  banyak request, keluarannya terstruktur → pakai model berkuota longgar.
 */
export type AiTask = 'lesson' | 'items'

export type GenerateArgs<T> = {
  task: AiTask
  schema: z.ZodType<T>
  prompt: string
  system?: string
  /** 0 = paling deterministik. Untuk konten belajar, rendah lebih baik. */
  temperature?: number
}

export type GenerateTextArgs = {
  task: AiTask
  prompt: string
  system?: string
  temperature?: number
}

export interface AiProvider {
  readonly name: string
  /** Keluaran terstruktur, sudah divalidasi terhadap `schema` */
  generate<T>(args: GenerateArgs<T>): Promise<T>
  /** Keluaran teks bebas — dipakai untuk materi (Markdown) */
  generateText(args: GenerateTextArgs): Promise<string>
}

export class AiError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
    readonly retryable = false,
  ) {
    super(message)
    this.name = 'AiError'
  }
}

/** Ganti di sini kalau pindah provider. Groq tinggal ditambahkan sebagai fallback. */
export function ai(): AiProvider {
  return geminiProvider()
}
