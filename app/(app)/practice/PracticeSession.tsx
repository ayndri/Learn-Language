'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { Celebrate } from '@/components/Celebrate'
import { SpeakButton } from '@/components/SpeakButton'
import { useSpeechInput } from '@/components/useSpeechInput'
import { speak, useVoiceStatus } from '@/components/useVoice'
import type { FieldDef } from '@/lib/languages/types'
import type { GradingMode } from '@/lib/items/types'
import {
  submitChoice,
  submitProducedAnswer,
  submitSelfRating,
  submitTypedAnswer,
  submitWriting,
  type ReviewResult,
} from './actions'

export type PracticeItem = {
  id: string
  type: string
  label: string
  instruction: string
  grading: GradingMode
  /** 'voice' = jawaban diucapkan, bukan ditulis */
  inputMode: 'text' | 'voice'
  fields: Record<string, unknown>
}

export type SessionProps = {
  items: PracticeItem[]
  /** field template `vocab` bahasa ini — penentu apa yang ditampilkan di sisi belakang */
  vocabFields: FieldDef[]
  primaryKey: string
  ttsLang: string
  script: string
  languageName: string
}

const RATINGS = [
  { value: 1, label: 'Lupa', key: '1', cls: 'bg-bad-soft text-bad' },
  { value: 2, label: 'Susah', key: '2', cls: 'bg-warn-soft text-warn' },
  { value: 3, label: 'Bisa', key: '3', cls: 'bg-brand-soft text-brand' },
  { value: 4, label: 'Gampang', key: '4', cls: 'bg-good-soft text-good' },
] as const

type Row = { label: string; value: string; speakable?: boolean }

function intervalText(days?: number): string {
  if (days === undefined) return ''
  if (days <= 0) return 'muncul lagi hari ini'
  if (days === 1) return 'muncul lagi besok'
  return `muncul lagi dalam ${days} hari`
}

// ===========================================================================

export function PracticeSession(props: SessionProps) {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const [pending, startTransition] = useTransition()
  /** Combo = jawaban benar berturut-turut dalam sesi ini. Bukan gamifikasi kosong:
   *  ini satu-satunya umpan balik yang bilang "kamu sedang lancar" saat sesi panjang. */
  const [combo, setCombo] = useState(0)
  const [bestCombo, setBestCombo] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const item = props.items[index]
  const done = index >= props.items.length
  const progress = Math.round((index / props.items.length) * 100)

  const next = useCallback(() => {
    setRevealed(false)
    setAnswer('')
    setResult(null)
    setStartedAt(Date.now())
    setIndex((i) => i + 1)
  }, [])

  const bumpCombo = useCallback((ok: boolean) => {
    if (ok) {
      setCorrectCount((n) => n + 1)
      setCombo((c) => {
        const v = c + 1
        setBestCombo((b) => Math.max(b, v))
        return v
      })
    } else {
      setCombo(0)
    }
  }, [])

  /** Sudah dinilai & tercatat → tinggal lanjut */
  const settled = result?.scheduledDays !== undefined
  /** Sudah diperiksa tapi menunggu kamu menilai sendiri (mode typed-self) */
  const awaitingSelf = result?.needsSelfRating === true

  const rate = useCallback(
    (rating: 1 | 2 | 3 | 4) => {
      if (!item || pending) return
      const elapsed = Date.now() - startedAt
      startTransition(async () => {
        const r = await submitSelfRating(item.id, rating, elapsed, answer || undefined)
        if (r.error) {
          setResult(r)
          return
        }
        // Untuk item yang dinilai sendiri, "benar" = Bisa atau Gampang.
        bumpCombo(rating >= 3)
        next()
      })
    },
    [item, pending, startedAt, answer, next, bumpCombo],
  )

  const pick = useCallback(
    (optionIndex: number) => {
      if (!item || pending) return
      const elapsed = Date.now() - startedAt
      startTransition(async () => {
        const r = await submitChoice(item.id, optionIndex, elapsed)
        setAnswer(String(optionIndex))
        setResult(r)
        if (!r.error) bumpCombo(Boolean(r.correct))
      })
    },
    [item, pending, startedAt, bumpCombo],
  )

  const submit = useCallback(() => {
    if (!item || pending || !answer.trim()) return
    const elapsed = Date.now() - startedAt
    startTransition(async () => {
      const fn =
        item.grading === 'ai'
          ? submitWriting
          : item.grading === 'typed-self'
            ? submitProducedAnswer
            : submitTypedAnswer
      const r = await fn(item.id, answer, elapsed)
      setResult(r)
      // Mode typed-self yang belum tercatat jangan dihitung dulu — combonya
      // ditentukan saat kamu memberi nilai sendiri.
      if (!r.error && !r.needsSelfRating) bumpCombo(Boolean(r.correct))
    })
  }, [item, pending, answer, startedAt, bumpCombo])

  /**
   * Shortcut keyboard. Review itu pekerjaan berulang — memindahkan tangan ke mouse
   * ratusan kali sehari adalah alasan orang berhenti pakai app SRS.
   */
  useEffect(() => {
    if (done || !item) return
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      const typing = el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA'

      // lanjut ke item berikutnya
      if (settled && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        next()
        return
      }
      // pilihan ganda: A-D memilih langsung
      if (item.grading === 'choice' && !settled && !typing) {
        const letter = ['a', 'b', 'c', 'd'].indexOf(e.key.toLowerCase())
        if (letter >= 0) {
          e.preventDefault()
          pick(letter)
          return
        }
      }
      // menilai sendiri: berlaku untuk mode self (setelah dibuka) dan typed-self
      const canRate = (item.grading === 'self' && revealed) || awaitingSelf
      if (canRate && !typing && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault()
        rate(Number(e.key) as 1 | 2 | 3 | 4)
        return
      }
      if (item.grading === 'self' && !revealed && !typing && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        setRevealed(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [done, item, settled, awaitingSelf, revealed, next, rate, pick])

  if (done) {
    const total = props.items.length
    const pct = Math.round((correctCount / total) * 100)
    return (
      <div className="card animate-rise space-y-5 p-8 text-center">
        <Celebrate />
        <div className="animate-pop text-5xl">{pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '🌱'}</div>
        <div>
          <p className="text-lg font-bold">
            {pct >= 80 ? 'Mantap!' : pct >= 50 ? 'Lumayan!' : 'Nggak apa-apa'}
          </p>
          <p className="mt-1 text-[13px] text-muted">
            {pct >= 80
              ? 'Sesi ini kamu lancar banget.'
              : pct >= 50
                ? 'Yang salah bakal muncul lagi lebih cepat.'
                : 'Yang sulit akan sering kembali sampai nempel. Itu memang cara kerjanya.'}
          </p>
        </div>

        <div className="grid grid-cols-3 divide-x divide-line rounded-2xl bg-canvas py-3">
          <div>
            <p className="text-lg font-bold">{total}</p>
            <p className="text-[11px] text-faint">dikerjakan</p>
          </div>
          <div>
            <p className="text-lg font-bold text-good">{correctCount}</p>
            <p className="text-[11px] text-faint">benar</p>
          </div>
          <div>
            <p className="text-lg font-bold text-sun">{bestCombo}</p>
            <p className="text-[11px] text-faint">combo terbaik</p>
          </div>
        </div>

        <div className="space-y-2">
          <Link href="/learn" className="btn-primary w-full">
            Lanjutkan →
          </Link>
          <Link href="/" className="block text-xs text-faint hover:underline">
            atau kembali ke dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2 text-[13px] text-muted">
          <span className="font-medium">
            {index + 1} <span className="text-faint">/ {props.items.length}</span>
          </span>
          <span className="flex items-center gap-2">
            {combo >= 3 && (
              <span className="badge animate-pop bg-sun-soft text-sun">🔥 {combo} beruntun</span>
            )}
            <span className="badge bg-canvas text-faint">{item.label}</span>
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-brand transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card
        key={item.id}
        item={item}
        props={props}
        revealed={revealed}
        onReveal={() => setRevealed(true)}
        answer={answer}
        setAnswer={setAnswer}
        result={result}
        settled={settled}
        awaitingSelf={awaitingSelf}
        pending={pending}
        onSubmit={submit}
        onPick={pick}
        onRate={rate}
        onNext={next}
      />

      {result?.error && (
        <p role="alert" className="rounded-xl bg-bad-soft px-3 py-2 text-[13px] font-medium text-bad">
          {result.error}
        </p>
      )}
    </div>
  )
}

// ===========================================================================

type CardProps = {
  item: PracticeItem
  props: SessionProps
  revealed: boolean
  onReveal: () => void
  answer: string
  setAnswer: (v: string) => void
  result: ReviewResult | null
  settled: boolean
  awaitingSelf: boolean
  pending: boolean
  onSubmit: () => void
  onPick: (optionIndex: number) => void
  onRate: (r: 1 | 2 | 3 | 4) => void
  onNext: () => void
}

function Card(c: CardProps) {
  const { item } = c
  // Umpan balik fisik: melar sedikit kalau benar, bergetar kalau salah.
  const anim = c.settled
    ? c.result?.correct === false
      ? 'animate-shake'
      : 'animate-pop'
    : 'animate-rise'
  return (
    <div className={`card overflow-hidden ${anim}`}>
      <p className="border-b border-line bg-canvas/60 px-5 py-2 text-xs text-muted">
        {item.instruction}
      </p>

      {item.grading === 'choice' ? (
        <ChoicePrompt {...c} />
      ) : item.type === 'listening' ? (
        <ListenPrompt {...c} />
      ) : item.type === 'writing' ? (
        <WritingPrompt {...c} />
      ) : (
        <StandardPrompt {...c} />
      )}

      <Footer {...c} />
    </div>
  )
}

// --------------------------------------------------------------------- muka

/** Sisi depan untuk vocab / phrase / cloze / sentence / script */
function StandardPrompt(c: CardProps) {
  const { item, props, result } = c
  const f = item.fields
  const script = props.script

  if (item.type === 'cloze') {
    const sentence = String(f.sentence ?? '')
    const [before, after] = sentence.split(/_{3,}/)
    const show = c.settled
    return (
      <div className="flex min-h-36 items-center justify-center px-6 py-9">
        <p className={`text-center text-xl leading-relaxed script-${script}`}>
          {before}
          <span
            className={`mx-1 inline-block min-w-20 border-b-2 text-center align-baseline font-semibold ${
              show ? 'border-good text-good' : 'border-line-strong'
            }`}
          >
            {show ? result?.expected : ' '}
          </span>
          {after}
        </p>
      </div>
    )
  }

  const big =
    item.type === 'vocab'
      ? String(f[props.primaryKey] ?? '—')
      : item.type === 'phrase'
        ? String(f.phrase ?? '—')
        : item.type === 'sentence' || item.type === 'speaking'
          ? String(f.source_id ?? '—')
          : String(f.glyph ?? '—')

  // Kalimat sumber untuk terjemahan & ucapan ditulis dalam bahasa Indonesia —
  // jangan pakai font/TTS bahasa target untuk itu.
  const isTargetLanguage = item.type !== 'sentence' && item.type !== 'speaking'

  return (
    <div className="flex min-h-36 flex-col items-center justify-center gap-2 px-6 py-9">
      <div className="flex items-center gap-1.5">
        <p
          className={`text-center font-semibold tracking-tight ${
            item.type === 'script' ? 'text-5xl' : 'text-2xl'
          } ${isTargetLanguage ? `script-${script}` : ''}`}
        >
          {big}
        </p>
        {isTargetLanguage && <SpeakButton text={big} lang={props.ttsLang} />}
      </div>
      {(item.type === 'sentence' || item.type === 'speaking') && (
        <p className="text-xs text-faint">
          {item.type === 'speaking' ? 'ucapkan' : 'tulis'} dalam {props.languageName}
        </p>
      )}
    </div>
  )
}

/** Dikte: teksnya tidak boleh terlihat sebelum dijawab */
function ListenPrompt(c: CardProps) {
  const { item, props } = c
  const text = String(item.fields.text ?? '')
  const status = useVoiceStatus(props.ttsLang)
  const played = useRef<string | null>(null)

  // Memutar suara itu efek ke sistem eksternal — tempatnya memang di effect.
  // Ref-nya menyimpan id item, bukan boolean, supaya tiap item baru diputar
  // sekali saja meski komponennya dipakai ulang.
  useEffect(() => {
    if (status !== 'yes' || played.current === item.id) return
    played.current = item.id
    speak(text, props.ttsLang, 0.9)
  }, [status, item.id, text, props.ttsLang])

  return (
    <div className="flex min-h-36 flex-col items-center justify-center gap-3 px-6 py-9">
      {status === 'no' ? (
        // Tanpa voice, dikte mustahil dikerjakan. Turunkan jadi latihan membaca
        // dan katakan kenapa — jangan tinggalkan kartu kosong yang bikin bingung.
        <>
          <p className="rounded-xl bg-warn-soft px-3 py-2 text-center text-xs text-warn">
            Tidak ada suara {props.languageName} di perangkat ini, jadi teksnya ditampilkan.
          </p>
          <p className={`text-center text-lg script-${props.script}`}>{text}</p>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => speak(text, props.ttsLang, 0.9)}
            disabled={status === 'loading'}
            className="flex size-20 items-center justify-center rounded-full bg-brand-soft text-brand transition hover:brightness-97 disabled:opacity-50"
            aria-label="Putar ulang"
          >
            <svg
              width="30"
              height="30"
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
          <p className={`text-xs ${c.settled ? `text-ink script-${props.script}` : 'text-faint'}`}>
            {c.settled ? text : 'ketuk untuk mendengar lagi'}
          </p>
        </>
      )}
    </div>
  )
}

/** Menulis: instruksi + arahan + panjang minimal */
function WritingPrompt(c: CardProps) {
  const f = c.item.fields
  const words = c.answer.trim() ? c.answer.trim().split(/\s+/).length : 0
  const min = Number(f.min_words ?? 25)

  return (
    <div className="space-y-3 px-5 py-5">
      <p className="text-base leading-relaxed font-medium">{String(f.prompt_id ?? '')}</p>
      {typeof f.guidance_id === 'string' && (
        <p className="rounded-xl bg-brand-soft px-3 py-2 text-[13px] text-brand">{f.guidance_id}</p>
      )}
      <p className="text-xs text-faint">
        Minimal {min} kata · sekarang {words}
      </p>
    </div>
  )
}

// ------------------------------------------------------------------ belakang

function backRows(item: PracticeItem, props: SessionProps): Row[] {
  const f = item.fields
  switch (item.type) {
    case 'vocab':
      // Dibangun dari field template, bukan daftar hardcoded — itulah sebabnya
      // kartu Jepang nanti otomatis menampilkan `reading` & `romaji`.
      return props.vocabFields
        .filter((fd) => fd.key !== props.primaryKey && f[fd.key] != null)
        .map((fd) => ({ label: fd.label, value: String(f[fd.key]), speakable: fd.speakable }))
    case 'phrase':
      return [
        { label: 'Arti', value: String(f.meaning_id ?? '') },
        { label: 'Nuansa', value: String(f.register ?? '') },
        { label: 'Dipakai saat', value: String(f.situation_id ?? '') },
      ].filter((r) => r.value)
    case 'cloze':
      return [
        { label: 'Kenapa', value: String(f.explanation_id ?? '') },
        { label: 'Artinya', value: String(f.translation_id ?? '') },
      ].filter((r) => r.value)
    case 'sentence':
    case 'speaking':
      return [
        { label: 'Acuan', value: String(f.target ?? ''), speakable: true },
        { label: 'Catatan', value: String(f.note_id ?? '') },
      ].filter((r) => r.value)
    case 'listening':
      return [
        { label: 'Kalimatnya', value: String(f.text ?? ''), speakable: true },
        { label: 'Artinya', value: String(f.translation_id ?? '') },
      ].filter((r) => r.value)
    case 'script':
      return [
        { label: 'Bunyi', value: String(f.sound ?? '') },
        { label: 'Contoh', value: String(f.example ?? ''), speakable: true },
        { label: 'Arti contoh', value: String(f.example_meaning_id ?? '') },
      ].filter((r) => r.value)
    default:
      return []
  }
}

function Details({ rows, props }: { rows: Row[]; props: SessionProps }) {
  if (rows.length === 0) return null
  return (
    <dl className="space-y-2.5 border-t border-line bg-canvas/50 px-5 py-4 text-sm">
      {rows.map((r) => (
        // Di HP label ditaruh DI ATAS nilainya. Kalau tetap sebaris, label 112px
        // menyisakan terlalu sedikit ruang untuk kalimat contoh di layar 320px.
        <div key={r.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
          <dt className="text-[13px] text-faint sm:w-28 sm:shrink-0">{r.label}</dt>
          <dd className="flex min-w-0 items-start gap-1">
            <span className={r.speakable ? `script-${props.script}` : ''}>{r.value}</span>
            {r.speakable && <SpeakButton text={r.value} lang={props.ttsLang} />}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function RatingButtons({
  pending,
  onRate,
  hint,
}: {
  pending: boolean
  onRate: (r: 1 | 2 | 3 | 4) => void
  hint?: string
}) {
  return (
    <div className="border-t border-line p-3">
      {hint && <p className="mb-2 text-center text-xs text-faint">{hint}</p>}
      <div className="grid grid-cols-4 gap-2">
        {RATINGS.map((r) => (
          <button
            key={r.value}
            type="button"
            disabled={pending}
            onClick={() => onRate(r.value)}
            className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-[11px] leading-tight font-semibold transition hover:brightness-97 disabled:opacity-50 sm:px-2 sm:py-2.5 sm:text-[13px] ${r.cls}`}
          >
            {r.label}
            <span className="text-[10px] opacity-60">{r.key}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// --------------------------------------------------------------------- kaki

function Footer(c: CardProps) {
  const { item, result } = c

  /**
   * Pilihan ganda punya jalurnya sendiri: tombol pilihan SEKALIGUS jadi tampilan
   * hasil (yang benar jadi hijau, pilihanmu yang salah jadi merah), jadi tidak
   * perlu blok "benar/salah" terpisah di atasnya.
   */
  if (item.grading === 'choice') {
    return (
      <>
        <ChoiceFooter {...c} />
        {c.settled && (
          <div className="space-y-2 border-t border-line p-4">
            <p className="text-center text-xs text-faint">{intervalText(result?.scheduledDays)}</p>
            <button type="button" autoFocus onClick={c.onNext} className="btn-primary w-full">
              Lanjut
              <span className="kbd">enter</span>
            </button>
          </div>
        )}
      </>
    )
  }

  // sudah dinilai & tercatat → tampilkan hasil + tombol lanjut
  if (c.settled) {
    return (
      <>
        {item.grading === 'ai' && result?.feedback ? (
          <WritingFeedbackView c={c} />
        ) : (
          <>
            {item.grading !== 'self' && (
              <div className="border-t border-line px-5 pt-4">
                <div
                  className={`flex flex-wrap items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium ${
                    result?.correct ? 'bg-good-soft text-good' : 'bg-bad-soft text-bad'
                  }`}
                >
                  <span>{result?.correct ? '✓ Benar!' : '✕ Belum tepat'}</span>
                  {!result?.correct && c.answer && (
                    <span className="font-normal opacity-70">jawabanmu: {c.answer}</span>
                  )}
                </div>
              </div>
            )}
            <Details rows={backRows(item, c.props)} props={c.props} />
          </>
        )}

        <div className="space-y-2 border-t border-line p-4">
          <p className="text-center text-xs text-faint">{intervalText(result?.scheduledDays)}</p>
          <button type="button" autoFocus onClick={c.onNext} className="btn-primary w-full">
            Lanjut
            <span className="kbd">enter</span>
          </button>
        </div>
      </>
    )
  }

  // typed-self: jawaban beda dari acuan → tampilkan acuan, kamu yang menilai
  if (c.awaitingSelf) {
    return (
      <>
        <div className="border-t border-line px-5 pt-4">
          <div className="rounded-xl bg-warn-soft px-3 py-2 text-[13px] text-warn">
            Jawabanmu beda dari acuan — tapi belum tentu salah. Bandingkan sendiri.
          </div>
          <p className="mt-3 text-sm">
            <span className="text-faint">Jawabanmu: </span>
            <span className={`script-${c.props.script}`}>{c.answer}</span>
          </p>
        </div>
        <Details rows={backRows(item, c.props)} props={c.props} />
        <RatingButtons pending={c.pending} onRate={c.onRate} hint="Seberapa dekat jawabanmu?" />
      </>
    )
  }

  // mode self: buka jawaban dulu, lalu nilai
  if (item.grading === 'self') {
    if (!c.revealed) {
      return (
        <div className="border-t border-line p-4">
          <button type="button" onClick={c.onReveal} className="btn-outline w-full">
            Tampilkan jawaban
            <span className="kbd">spasi</span>
          </button>
        </div>
      )
    }
    return (
      <>
        <Details rows={backRows(item, c.props)} props={c.props} />
        <RatingButtons pending={c.pending} onRate={c.onRate} />
      </>
    )
  }

  // mode ai: karangan bebas
  if (item.grading === 'ai') {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          c.onSubmit()
        }}
        className="space-y-3 border-t border-line p-4"
      >
        <textarea
          autoFocus
          rows={5}
          value={c.answer}
          onChange={(e) => c.setAnswer(e.target.value)}
          placeholder="Tulis jawabanmu di sini…"
          className="input resize-y"
        />
        <button type="submit" disabled={c.pending || !c.answer.trim()} className="btn-primary w-full">
          {c.pending ? 'Mengoreksi…' : 'Kirim untuk dikoreksi'}
        </button>
      </form>
    )
  }

  // masukan suara (item berbicara)
  if (item.inputMode === 'voice') return <VoiceFooter {...c} />

  // mode typed / typed-self: satu baris jawaban
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        c.onSubmit()
      }}
      className="space-y-3 border-t border-line p-4"
    >
      <input
        autoFocus
        value={c.answer}
        onChange={(e) => c.setAnswer(e.target.value)}
        placeholder={item.type === 'cloze' ? 'isi bagian yang kosong' : 'tulis jawabanmu'}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        className={`input text-center script-${c.props.script}`}
      />
      <button type="submit" disabled={c.pending || !c.answer.trim()} className="btn-primary w-full">
        {c.pending ? 'Memeriksa…' : 'Periksa'}
      </button>
    </form>
  )
}

function WritingFeedbackView({ c }: { c: CardProps }) {
  const fb = c.result?.feedback
  if (!fb) return null
  return (
    <div className="space-y-3 border-t border-line bg-canvas/50 px-5 py-4 text-sm">
      <div className="flex items-center gap-2">
        <span
          className={`badge ${
            fb.score >= 3 ? 'bg-good-soft text-good' : 'bg-warn-soft text-warn'
          }`}
        >
          {['', 'perlu diulang', 'lumayan', 'bagus', 'sangat bagus'][fb.score]}
        </span>
        <span className="text-xs text-faint">skor {fb.score}/4</span>
      </div>

      <div>
        <p className="mb-1 text-[13px] text-faint">Versi perbaikan</p>
        <p className={`rounded-xl bg-surface px-3 py-2 script-${c.props.script}`}>{fb.corrected}</p>
      </div>

      {fb.notes_id.length > 0 && (
        <div>
          <p className="mb-1 text-[13px] text-faint">Yang dibetulkan</p>
          <ul className="space-y-1 pl-4">
            {fb.notes_id.map((n, i) => (
              <li key={i} className="list-disc text-[13px]">
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="rounded-xl bg-good-soft px-3 py-2 text-[13px] text-good">{fb.praise_id}</p>
    </div>
  )
}


function VoiceFooter(c: CardProps) {
  const mic = useSpeechInput(c.props.ttsLang)
  const [typed, setTyped] = useState(false)

  // Transkrip mengalir ke state jawaban milik sesi, jadi tombol kirim,
  // pencatatan, dan penilaiannya memakai jalur yang sama dengan item lain.
  useEffect(() => {
    if (mic.transcript) c.setAnswer(mic.transcript)
    // c.setAnswer stabil (setState); sengaja hanya bergantung pada transkrip
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mic.transcript])

  // Tanpa dukungan browser, item ini tetap bisa dikerjakan dengan mengetik —
  // jangan buat latihannya mustahil hanya karena browsernya lain.
  if (!mic.supported || typed) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          c.onSubmit()
        }}
        className="space-y-3 border-t border-line p-4"
      >
        {!mic.supported && (
          <p className="rounded-2xl bg-warn-soft px-3 py-2 text-center text-xs text-warn">
            Browser ini belum mendukung pengenalan suara. Ketik saja jawabannya.
          </p>
        )}
        <input
          autoFocus
          value={c.answer}
          onChange={(e) => c.setAnswer(e.target.value)}
          placeholder="tulis yang ingin kamu ucapkan"
          autoComplete="off"
          spellCheck={false}
          className={`input text-center script-${c.props.script}`}
        />
        <button type="submit" disabled={c.pending || !c.answer.trim()} className="btn-primary w-full">
          {c.pending ? 'Memeriksa…' : 'Periksa'}
        </button>
      </form>
    )
  }

  return (
    <div className="space-y-3 border-t border-line p-4">
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => (mic.listening ? mic.stop() : mic.start())}
          className={`flex size-20 items-center justify-center rounded-full transition ${
            mic.listening
              ? 'animate-pop bg-bad text-white'
              : 'bg-brand-soft text-brand hover:brightness-97'
          }`}
          aria-label={mic.listening ? 'Selesai bicara' : 'Mulai bicara'}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
        </button>
        <p className="text-xs text-faint">
          {mic.listening ? 'mendengarkan… ketuk kalau sudah' : 'ketuk lalu ucapkan'}
        </p>
      </div>

      {c.answer && (
        <p className={`animate-rise rounded-2xl bg-canvas px-3 py-2 text-center text-sm script-${c.props.script}`}>
          {c.answer}
        </p>
      )}

      {mic.error && (
        <p className="rounded-2xl bg-bad-soft px-3 py-2 text-center text-xs text-bad">{mic.error}</p>
      )}

      <button
        type="button"
        onClick={c.onSubmit}
        disabled={c.pending || !c.answer.trim()}
        className="btn-primary w-full"
      >
        {c.pending ? 'Memeriksa…' : 'Periksa'}
      </button>

      <button
        type="button"
        onClick={() => {
          mic.reset()
          c.setAnswer('')
          setTyped(true)
        }}
        className="w-full text-center text-xs text-faint hover:underline"
      >
        susah kedengaran? ketik saja
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Pilihan ganda (bacaan, cari kesalahan)
// ---------------------------------------------------------------------------

/** Sisi depan: bacaan atau kalimat yang harus diperiksa */
function ChoicePrompt(c: CardProps) {
  const f = c.item.fields
  const passage = typeof f.passage === 'string' ? f.passage : null
  const sentence = typeof f.sentence === 'string' ? f.sentence : null
  const question = typeof f.question === 'string' ? f.question : null

  return (
    <div className="space-y-3 px-5 py-5">
      {passage && (
        <p
          className={`max-h-64 overflow-y-auto rounded-2xl bg-canvas px-4 py-3 text-sm leading-relaxed script-${c.props.script}`}
        >
          {passage}
        </p>
      )}

      {sentence && (
        // Untuk "cari kesalahan", tiap potongan diberi label A–D supaya bisa
        // dicocokkan dengan pilihan di bawahnya — persis seperti di lembar TOEFL.
        <p className={`text-[15px] leading-loose script-${c.props.script}`}>
          <MarkedSentence sentence={sentence} parts={(f.options as string[]) ?? []} />
        </p>
      )}

      {question && <p className="text-[15px] leading-relaxed font-medium">{question}</p>}
    </div>
  )
}

/** Sisipkan penanda A–D pada potongan kalimat yang jadi pilihan jawaban */
function MarkedSentence({ sentence, parts }: { sentence: string; parts: string[] }) {
  const nodes: React.ReactNode[] = []
  let rest = sentence
  let cursor = 0

  parts.forEach((part, i) => {
    const at = rest.toLowerCase().indexOf(part.trim().toLowerCase())
    if (at < 0) return
    nodes.push(<span key={`t${cursor}`}>{rest.slice(0, at)}</span>)
    nodes.push(
      <span key={`p${i}`} className="mx-0.5 rounded bg-brand-soft px-1 underline decoration-brand">
        {rest.slice(at, at + part.trim().length)}
        <sup className="ml-0.5 font-bold text-brand">{'ABCD'[i]}</sup>
      </span>,
    )
    rest = rest.slice(at + part.trim().length)
    cursor++
  })
  nodes.push(<span key="last">{rest}</span>)
  return <>{nodes}</>
}

function ChoiceFooter(c: CardProps) {
  const options = (c.item.fields.options as string[] | undefined) ?? []
  const chosen = c.answer === '' ? null : Number(c.answer)
  const answerIndex = c.result?.answerIndex

  return (
    <div className="space-y-2 border-t border-line p-4">
      {options.map((opt, i) => {
        const isChosen = chosen === i
        const isKey = answerIndex === i
        const revealed = c.settled
        return (
          <button
            key={i}
            type="button"
            disabled={c.pending || revealed}
            onClick={() => c.onPick(i)}
            className={`flex w-full items-start gap-3 rounded-2xl border-2 px-3.5 py-2.5 text-left text-sm transition disabled:cursor-default ${
              revealed && isKey
                ? 'border-good bg-good-soft'
                : revealed && isChosen
                  ? 'border-bad bg-bad-soft'
                  : isChosen
                    ? 'border-brand bg-brand-soft'
                    : 'border-line-strong bg-surface hover:border-brand'
            }`}
          >
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                revealed && isKey
                  ? 'bg-good text-white'
                  : revealed && isChosen
                    ? 'bg-bad text-white'
                    : 'bg-canvas text-faint'
              }`}
            >
              {'ABCD'[i]}
            </span>
            <span className="min-w-0">{opt}</span>
          </button>
        )
      })}

      {c.settled && c.result?.explanation && (
        <p className="animate-rise rounded-2xl bg-brand-soft px-3 py-2 text-[13px] text-brand">
          {c.result.explanation}
        </p>
      )}
    </div>
  )
}
