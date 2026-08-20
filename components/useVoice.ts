'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Ketersediaan voice TTS untuk sebuah bahasa.
 *
 * Tiga keadaan, bukan dua — dan itu penting:
 *
 *   'loading'  daftar voice belum dimuat. `getVoices()` di Chrome mengembalikan
 *              array kosong pada pemanggilan pertama dan baru terisi setelah
 *              event `voiceschanged`.
 *   'yes'/'no' sudah pasti.
 *
 * Kalau keadaan ini disederhanakan jadi boolean, saat pertama render nilainya
 * `false` — dan kartu dikte akan sempat menampilkan teks jawabannya sebagai
 * "fallback" sebelum voice-nya siap. Membocorkan jawaban dalam sekejap.
 *
 * Dipakai `useSyncExternalStore`, bukan useEffect + useState: speechSynthesis
 * memang external store, dan pola ini menghindari setState di dalam effect.
 */
export type VoiceStatus = 'loading' | 'yes' | 'no'

function hasSpeech(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function subscribe(onChange: () => void): () => void {
  if (!hasSpeech()) return () => {}
  window.speechSynthesis.addEventListener('voiceschanged', onChange)
  return () => window.speechSynthesis.removeEventListener('voiceschanged', onChange)
}

export function useVoiceStatus(lang: string): VoiceStatus {
  const base = lang.split('-')[0]

  const getSnapshot = useCallback((): VoiceStatus => {
    if (!hasSpeech()) return 'no'
    const voices = window.speechSynthesis.getVoices()
    if (voices.length === 0) return 'loading'
    return voices.some((v) => v.lang.split('-')[0] === base) ? 'yes' : 'no'
  }, [base])

  return useSyncExternalStore(subscribe, getSnapshot, () => 'loading')
}

/** Bacakan sebuah teks. Aman dipanggil walau voice-nya belum tentu ada. */
export function speak(text: string, lang: string, rate = 1): void {
  if (!hasSpeech()) return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = rate
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
}
