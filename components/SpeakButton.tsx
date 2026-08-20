'use client'

import { speak, useVoiceStatus } from '@/components/useVoice'

/**
 * Tombol pelafalan via Web Speech API — gratis, tanpa API key, tanpa file audio.
 *
 * Ketersediaan voice tergantung OS: `en-US` hampir selalu ada, `ja-JP`/`ko-KR`
 * di Windows bisa perlu language pack. Kalau voice-nya tidak ada, tombolnya
 * DISEMBUNYIKAN — tombol mati tanpa penjelasan lebih membingungkan daripada
 * tombol yang tidak muncul.
 */
export function SpeakButton({ text, lang }: { text: string; lang: string }) {
  const status = useVoiceStatus(lang)
  if (status !== 'yes') return null

  return (
    <button
      type="button"
      aria-label={`Bacakan: ${text}`}
      onClick={() => speak(text, lang)}
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-faint transition hover:bg-canvas hover:text-brand"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      </svg>
    </button>
  )
}
