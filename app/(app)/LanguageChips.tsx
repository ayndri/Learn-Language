'use client'

import { useFormStatus } from 'react-dom'

export type LanguageChip = {
  trackId: string
  code: string
  name: string
  nativeName: string
  /** kartu jatuh tempo di bahasa ini; 0 = lencananya tidak muncul */
  due: number
}

/**
 * Tombol pemilih bahasa, beserta keadaan "sedang pindah".
 *
 * Kenapa ini komponen client padahal `<form>`-nya tetap di server: pindah bahasa
 * memerlukan panggilan ke server, dan di jaringan yang tidak cepat jedanya cukup
 * lama untuk membuat orang mengira kliknya tidak terbaca — lalu mengklik tombol
 * lain, yang membatalkan yang pertama. Gejalanya sama persis dengan tombol yang
 * rusak, padahal cuma tidak ada tandanya.
 *
 * `useFormStatus` dipakai, bukan `useState`, karena dua alasan:
 *
 *   Ia membaca keadaan form INDUKNYA, jadi statusnya selalu sama dengan yang
 *   benar-benar sedang dikirim — tidak mungkin melenceng seperti state manual
 *   yang lupa direset.
 *
 *   `data` berisi FormData yang sedang dikirim, jadi kita tahu tombol MANA yang
 *   diklik. Tanpa itu, satu-satunya pilihan adalah memutar semua tombol
 *   sekaligus — dan itu justru menyembunyikan informasi yang berguna: yang mana
 *   yang sedang dituju.
 *
 * Hook ini WAJIB dipanggil dari komponen di dalam `<form>`. Itu sebabnya yang
 * dipisah ke sini isi form-nya, bukan form-nya sendiri: `action` tetap server
 * action di komponen server, jadi pemilih bahasa tetap berfungsi sebelum
 * JavaScript selesai dimuat — cuma tanpa pemutarnya.
 */
export function LanguageChips({
  chips,
  activeCode,
}: {
  chips: LanguageChip[]
  activeCode: string
}) {
  const { pending, data } = useFormStatus()
  const switchingTo = pending ? String(data?.get('code') ?? '') : null

  return (
    <>
      {chips.map((c) => {
        const on = c.code === activeCode
        const busy = c.code === switchingTo
        return (
          <button
            key={c.trackId}
            type="submit"
            name="code"
            value={c.code}
            aria-pressed={on}
            aria-busy={busy}
            // Semua tombol dimatikan selama pindah, bukan cuma yang diklik:
            // mengklik bahasa kedua sebelum yang pertama selesai membatalkan
            // yang pertama, dan yang muncul di akhir jadi tidak bisa ditebak.
            disabled={pending}
            className={`badge gap-1.5 px-3 py-1.5 transition ${
              // Tombol yang sedang dituju langsung diberi gaya aktif, tanpa
              // menunggu server. Itu bagian dari tandanya: yang berubah bukan
              // cuma "ada yang sedang jalan", tapi "ke sini tujuannya".
              on || busy ? 'bg-brand text-white' : 'bg-canvas text-muted hover:text-ink'
            } ${pending && !busy ? 'opacity-40' : ''} disabled:cursor-wait`}
          >
            {busy ? (
              <span
                aria-hidden
                className="size-3 shrink-0 animate-spin rounded-full border-2 border-white/40 border-t-white"
              />
            ) : (
              <span className="opacity-60">{c.nativeName}</span>
            )}
            {c.name}
            {/*
              Angka jatuh tempo, dan HANYA kalau ada isinya.
              Lencana "0" di lima bahasa cuma jadi derau yang membuat angka yang
              benar-benar penting ikut tidak dilihat. Yang perlu menarik mata
              adalah bahasa yang sedang menumpuk — bukan yang bersih.

              Disembunyikan selagi tombolnya berputar: dua hal kecil berdempet di
              satu lencana lebih sulit dibaca daripada satu hal yang jelas.
            */}
            {c.due > 0 && !busy && (
              <span
                aria-label={`${c.due} kartu jatuh tempo`}
                className={`-mr-1 rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${
                  on ? 'bg-white/25 text-white' : 'bg-warn-soft text-warn'
                }`}
              >
                {c.due}
              </span>
            )}
          </button>
        )
      })}
    </>
  )
}
