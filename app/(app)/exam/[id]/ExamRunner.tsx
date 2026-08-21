'use client'

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { speak, useVoiceStatus } from '@/components/useVoice'
import { answerExamAction, answerExamWritingAction, finishExamAction } from '../actions'

/** Soal seperti yang dikirim ke klien — TANPA kunci jawaban. */
export type RunnerQuestion = {
  id: string
  section: 1 | 2 | 3
  part: string
  type: string
  audioScript: string | null
  stem: string
  /** kosong = soal karangan, dijawab dengan teks */
  options: string[]
  /** bobot nilai soal karangan */
  maxScore: number | null
  groupId: string | null
}

export type RunnerGroup = {
  id: string
  kind: string
  title: string | null
  body: string
}

export type RunnerProps = {
  examId: string
  ttsLang: string
  questions: RunnerQuestion[]
  groups: RunnerGroup[]
  /** batas waktu tiap seksi sebagai epoch ms, dihitung dari startedAt di server */
  deadlines: Record<number, number>
  sectionNames: Record<number, string>
  /** seksi yang berisi soal menyimak — 1 di TOEFL, 3 di JLPT */
  listeningSection: number
  /** 'latin' | 'japanese' | dst — penentu font, sama seperti di halaman latihan */
  script: string
  /** dipakai saat memberi tahu bahwa suara bahasa ini tidak tersedia */
  languageName: string
  /**
   * Keterangan kotak karangan, dari `lib/exam/formats.ts`.
   *
   * Undefined untuk format tanpa soal karangan (TOEFL, JLPT, TOPIK I) — dan
   * itu tidak masalah, karena format itu tidak pernah memunculkan kotaknya.
   */
  writing?: { placeholder: string; unit: string; rubric: string }
  initialAnswers: Record<string, number>
  /** jawaban karangan yang sudah tersimpan, per id soal */
  initialTexts: Record<string, string>
}

const LETTERS = ['A', 'B', 'C', 'D']

/**
 * Jawaban karangan (TOPIK 쓰기, HSK 书写).
 *
 * Dinilai saat tombol ditekan, bukan otomatis tiap ketikan: tiap penilaian satu
 * panggilan AI, dan menilai draf setengah jadi cuma membakar kuota sambil
 * memberi angka yang salah.
 *
 * Placeholder, satuan panjang, dan nama rubriknya datang dari FORMAT, bukan
 * ditulis di sini. Dulu ketiganya ditulis langsung sebagai teks Korea — dan
 * begitu bahasa kedua yang punya soal karangan masuk, kotak jawaban HSK ikut
 * bertuliskan "한국어로 답을 쓰세요…" beserta rubrik TOPIK.
 */
function WritingAnswer({
  examId,
  question,
  script,
  spec,
  initial,
  onSaved,
}: {
  examId: string
  question: RunnerQuestion
  script: string
  spec: RunnerProps['writing']
  initial: string
  onSaved: (text: string) => void
}) {
  const [text, setText] = useState(initial)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  // Karakter, bukan kata: bahasa Korea dan Mandarin tidak dipisah spasi per
  // kata, dan syarat panjang di TOPIK maupun HSK memang dihitung per karakter.
  const chars = [...text.trim()].length

  const save = () => {
    setError(null)
    setResult(null)
    startTransition(async () => {
      const r = await answerExamWritingAction(examId, question.id, text)
      if (r.error) setError(r.error)
      else {
        setResult(r.ok ?? null)
        onSaved(text)
      }
    })
  }

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder={spec?.placeholder ?? 'Tulis jawabanmu…'}
        className={`input min-h-52 resize-y leading-relaxed script-${script}`}
      />

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-faint">
          {chars}
          {spec?.unit ?? ' karakter'}
          {question.maxScore ? ` · ${question.maxScore} poin` : ''}
        </span>
        <button
          type="button"
          onClick={save}
          disabled={pending || !text.trim()}
          className="btn-outline btn-sm shrink-0 disabled:opacity-50"
        >
          {pending ? 'Menilai…' : result ? 'Nilai ulang' : 'Simpan & nilai'}
        </button>
      </div>

      {result && (
        <p className="rounded-2xl bg-good-soft px-3 py-2 text-[13px] leading-relaxed text-good">
          {result}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-2xl bg-bad-soft px-3 py-2 text-[13px] text-bad">
          {error}
        </p>
      )}
      <p className="text-xs text-faint">
        Nilai karangan diberikan AI dengan {spec?.rubric ?? 'rubrik resmi ujiannya'}. Anggap
        komentarnya, bukan angkanya — penilai manusia pun berbeda-beda pada tulisan yang sama.
      </p>
    </div>
  )
}

function formatLeft(ms: number): string {
  if (ms <= 0) return '00:00'
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function ExamRunner(props: RunnerProps) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>(props.initialAnswers)
  const [texts, setTexts] = useState<Record<string, string>>(props.initialTexts)
  const [now, setNow] = useState<number | null>(null)
  const [showNav, setShowNav] = useState(false)
  const [pending, startTransition] = useTransition()
  const [finishing, startFinish] = useTransition()

  const finish = useCallback(() => {
    // finishExamAction melakukan redirect ke halaman hasil.
    startFinish(async () => {
      await finishExamAction(props.examId)
    })
  }, [props.examId])

  const q = props.questions[index]
  const group = useMemo(
    () => props.groups.find((g) => g.id === q?.groupId) ?? null,
    [props.groups, q?.groupId],
  )

  /**
   * Satu jam untuk dua hal: memperbarui tampilan waktu, dan memindahkan kamu ke
   * seksi berikutnya saat waktu seksi ini habis.
   *
   * Keduanya dikerjakan di dalam callback interval, bukan di badan effect —
   * aturan purity React 19 melarang setState sinkron di badan effect, dan
   * `now` juga tidak boleh diisi saat render karena waktu server dan klien
   * berbeda (hydration mismatch).
   *
   * Perpindahan seksi TIDAK mengunci soal sebelumnya. Ini latihan pribadi: yang
   * penting kamu merasakan tekanan waktunya, bukan dihukum karena lewat beberapa detik.
   */
  useEffect(() => {
    const tick = () => {
      const t = Date.now()
      setNow(t)
      setIndex((i) => {
        const cur = props.questions[i]
        if (!cur) return i
        const dl = props.deadlines[cur.section]
        if (!dl || t < dl) return i
        const nxt = props.questions.findIndex((x) => x.section > cur.section)
        return nxt >= 0 ? nxt : i
      })
    }
    const first = setTimeout(tick, 0)
    const timer = setInterval(tick, 1000)
    return () => {
      clearTimeout(first)
      clearInterval(timer)
    }
  }, [props.questions, props.deadlines])

  const deadline = q ? props.deadlines[q.section] : undefined
  const msLeft = deadline && now ? deadline - now : null

  const choose = useCallback(
    (optionIndex: number) => {
      if (!q) return
      setAnswers((p) => ({ ...p, [q.id]: optionIndex }))
      // Disimpan langsung supaya menutup tab tidak menghilangkan jawaban.
      startTransition(async () => {
        await answerExamAction(props.examId, q.id, optionIndex)
      })
    },
    [q, props.examId],
  )

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => Math.min(props.questions.length - 1, Math.max(0, i + delta)))
    },
    [props.questions.length],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA') return
      const letter = ['a', 'b', 'c', 'd'].indexOf(e.key.toLowerCase())
      if (letter >= 0) {
        e.preventDefault()
        choose(letter)
        return
      }
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [choose, go])

  const answeredCount = Object.keys(answers).length + Object.keys(texts).length
  const isListening = q?.section === props.listeningSection
  const audioText = q?.audioScript ?? (isListening ? group?.body : null)

  if (!q) return null

  return (
    <div className="space-y-4">
      {/* --- bar atas --- */}
      <div className="card sticky top-16 z-10 space-y-2 p-3">
        <div className="flex items-center justify-between gap-2 text-[13px]">
          <span className="min-w-0 truncate font-semibold">
            <span className="text-faint">S{q.section} · </span>
            {props.sectionNames[q.section]}
            <span className="text-faint"> · Part {q.part}</span>
          </span>
          <span
            className={`badge shrink-0 font-mono ${
              msLeft !== null && msLeft < 120_000 ? 'bg-bad-soft text-bad' : 'bg-canvas text-muted'
            }`}
          >
            {msLeft === null ? '--:--' : formatLeft(msLeft)}
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${((index + 1) / props.questions.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-faint">
          <span>
            Soal {index + 1} / {props.questions.length}
          </span>
          <button type="button" onClick={() => setShowNav((v) => !v)} className="hover:underline">
            {answeredCount} terjawab · {showNav ? 'tutup' : 'buka'} peta
          </button>
        </div>

        {/*
          Peta soal: 6 kolom di HP, 10 di layar lebar.
          Dengan 10 kolom di layar 320px tiap tombol jadi ~23px — terlalu kecil
          untuk disentuh jempol (patokan yang lazim ~44px). 6 kolom memberi ~40px.
        */}
        {showNav && (
          <div className="grid max-h-36 grid-cols-6 gap-1.5 overflow-y-auto pt-1 sm:grid-cols-10 sm:gap-1">
            {props.questions.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => {
                  setIndex(i)
                  setShowNav(false)
                }}
                className={`min-h-8 rounded-md py-1 text-[11px] font-medium sm:min-h-0 ${
                  i === index
                    ? 'bg-brand text-white'
                    : answers[x.id] !== undefined || texts[x.id]
                      ? 'bg-brand-soft text-brand'
                      : 'bg-canvas text-faint'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* --- bahan bersama: bacaan atau rekaman --- */}
      {group && !isListening && (
        <details open className="card overflow-hidden">
          <summary className="cursor-pointer list-none border-b border-line bg-canvas/60 px-4 py-2.5 text-[13px] font-semibold">
            {group.title ?? 'Bacaan'}
          </summary>
          <div
            className={`max-h-72 overflow-y-auto px-5 py-4 text-sm leading-relaxed whitespace-pre-line script-${props.script}`}
          >
            {group.body}
          </div>
        </details>
      )}

      {isListening && audioText && (
        <AudioPanel
          text={audioText}
          lang={props.ttsLang}
          languageName={props.languageName}
          script={props.script}
        />
      )}

      {/* --- soal --- */}
      <div className="card animate-rise space-y-4 p-5">
        <p className={`text-[15px] leading-relaxed whitespace-pre-line script-${props.script}`}>
          {q.stem}
        </p>

        {q.options.length === 0 ? (
          <WritingAnswer
            key={q.id}
            examId={props.examId}
            question={q}
            script={props.script}
            spec={props.writing}
            initial={texts[q.id] ?? ''}
            onSaved={(text) => setTexts((p) => ({ ...p, [q.id]: text }))}
          />
        ) : (
        <ul className="space-y-2">
          {q.options.map((opt, i) => {
            const picked = answers[q.id] === i
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => choose(i)}
                  className={`flex w-full items-start gap-3 rounded-2xl border-2 px-3.5 py-2.5 text-left text-sm transition ${
                    picked
                      ? 'border-brand bg-brand-soft'
                      : 'border-line-strong bg-surface hover:border-brand'
                  }`}
                >
                  <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      picked ? 'bg-brand text-white' : 'bg-canvas text-faint'
                    }`}
                  >
                    {LETTERS[i]}
                  </span>
                  <span className={`min-w-0 script-${props.script}`}>{opt}</span>
                </button>
              </li>
            )
          })}
        </ul>
        )}
      </div>

      {/* --- navigasi --- */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="btn-outline btn-sm"
        >
          ← Sebelumnya
        </button>

        {index < props.questions.length - 1 ? (
          <button type="button" onClick={() => go(1)} className="btn-primary btn-sm flex-1">
            Berikutnya →
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            disabled={finishing}
            className="btn-primary btn-sm flex-1"
          >
            {finishing ? 'Menghitung…' : 'Selesai & lihat hasil'}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between px-1 text-xs text-faint">
        <span>
          Pintasan: <span className="kbd">A</span>–<span className="kbd">D</span> memilih,{' '}
          <span className="kbd">←</span>
          <span className="kbd">→</span> pindah soal
        </span>
        {pending && <span className="text-brand">menyimpan…</span>}
      </div>

      {index < props.questions.length - 1 && (
        <button
          type="button"
          onClick={finish}
          disabled={finishing}
          className="w-full text-center text-xs text-faint hover:underline disabled:opacity-50"
        >
          selesaikan sekarang walau belum semua terjawab
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------

/**
 * Pemutar rekaman untuk seksi Listening.
 *
 * Naskahnya dibacakan Web Speech API — tidak ada file audio yang perlu dibuat
 * atau disimpan. Naskahnya sendiri TIDAK ditampilkan; kalau terlihat, ini jadi
 * soal membaca, bukan mendengar.
 */
function AudioPanel({
  text,
  lang,
  languageName,
  script,
}: {
  text: string
  lang: string
  languageName: string
  script: string
}) {
  const status = useVoiceStatus(lang)
  const [played, setPlayed] = useState(0)

  if (status === 'no') {
    // Tanpa voice, soal listening mustahil dikerjakan. Naskahnya ditampilkan
    // sebagai jalan terakhir, dengan penjelasan kenapa.
    return (
      <div className="card space-y-2 p-4">
        <p className="rounded-2xl bg-warn-soft px-3 py-2 text-xs text-warn">
          Tidak ada suara {languageName} di perangkat ini, jadi naskahnya ditampilkan. Di tes
          asli bagian ini hanya didengar.
        </p>
        <p className={`text-sm leading-relaxed whitespace-pre-line text-muted script-${script}`}>
          {text}
        </p>
      </div>
    )
  }

  return (
    <div className="card flex items-center gap-4 p-4">
      <button
        type="button"
        disabled={status === 'loading'}
        onClick={() => {
          speak(text, lang, 0.92)
          setPlayed((n) => n + 1)
        }}
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand transition hover:brightness-97 disabled:opacity-50"
        aria-label="Putar rekaman"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H3v6h3l5 4V5z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      </button>
      <div className="min-w-0 text-sm">
        <p className="font-semibold">{played === 0 ? 'Putar rekaman' : 'Putar ulang'}</p>
        <p className="text-xs text-faint">
          {played === 0
            ? 'Naskahnya tidak ditampilkan — ini bagian mendengar.'
            : `sudah diputar ${played}× · di tes asli hanya sekali`}
        </p>
      </div>
    </div>
  )
}
