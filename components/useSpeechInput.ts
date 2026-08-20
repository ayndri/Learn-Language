'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Masukan suara lewat Web Speech Recognition.
 *
 * Gratis, tanpa API key, tanpa upload audio ke mana pun — pengenalannya dilakukan
 * browser. Dukungannya TERBATAS: Chrome & Edge (dengan prefiks `webkit`), Chrome
 * Android. Firefox dan Safari iOS belum. Karena itu `supported` harus selalu
 * dicek, dan kartunya punya jalan keluar berupa mengetik.
 *
 * Penting soal akurasi: hasil transkrip untuk aksen non-penutur-asli sering
 * melenceng. Transkrip di sini dipakai sebagai PETUNJUK, bukan penentu — item
 * berbicara dinilai dengan mode `typed-self`, jadi kamu yang memutuskan.
 */

type MinimalRecognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
}

type RecognitionCtor = new () => MinimalRecognition

function getCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor
    webkitSpeechRecognition?: RecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export type SpeechInput = {
  supported: boolean
  listening: boolean
  transcript: string
  error: string | null
  start: () => void
  stop: () => void
  reset: () => void
}

export function useSpeechInput(lang: string): SpeechInput {
  // Ditentukan sekali saat state dibuat, bukan di dalam effect — dukungan browser
  // tidak berubah selama halaman hidup.
  const [supported] = useState(() => getCtor() !== null)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const ref = useRef<MinimalRecognition | null>(null)

  // Berhenti mendengarkan kalau komponennya dilepas — kalau tidak, mikrofon
  // tetap aktif setelah pindah ke item berikutnya.
  useEffect(() => {
    return () => {
      ref.current?.abort()
      ref.current = null
    }
  }, [])

  const start = useCallback(() => {
    const Ctor = getCtor()
    if (!Ctor) return

    ref.current?.abort()
    setError(null)
    setTranscript('')

    const rec = new Ctor()
    rec.lang = lang
    rec.continuous = false
    rec.interimResults = false
    // Beberapa alternatif diminta, tapi yang dipakai alternatif pertama —
    // sisanya cadangan kalau nanti mau ditampilkan.
    rec.maxAlternatives = 3

    rec.onresult = (e) => {
      const first = e.results[0]?.[0]?.transcript ?? ''
      setTranscript(first.trim())
    }
    rec.onerror = (e) => {
      setError(
        e.error === 'not-allowed'
          ? 'Akses mikrofon ditolak. Izinkan dulu di setelan browser.'
          : e.error === 'no-speech'
            ? 'Tidak ada suara terdengar. Coba lagi.'
            : `Pengenalan suara gagal (${e.error}).`,
      )
      setListening(false)
    }
    rec.onend = () => setListening(false)

    ref.current = rec
    setListening(true)
    try {
      rec.start()
    } catch {
      setListening(false)
    }
  }, [lang])

  const stop = useCallback(() => {
    ref.current?.stop()
    setListening(false)
  }, [])

  const reset = useCallback(() => {
    ref.current?.abort()
    setListening(false)
    setTranscript('')
    setError(null)
  }, [])

  return { supported, listening, transcript, error, start, stop, reset }
}
