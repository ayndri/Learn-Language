'use client'

import { SpeakButton } from '@/components/SpeakButton'
import { speak, useVoiceStatus } from '@/components/useVoice'
import { parseAnnotations, targetPhrase, type Annotation } from '@/lib/items/annotate'

/**
 * Kata bahasa target beserta cara membaca, arti, dan bunyinya.
 *
 * Empat hal ditampilkan dengan cara yang berbeda-beda, dan pemisahan itu
 * disengaja:
 *
 * CARA MEMBACA selalu terlihat, di atas katanya, memakai `<ruby>` — elemen HTML
 * yang memang dibuat untuk ini dan sudah dipakai puluhan tahun untuk furigana.
 * Bukan tooltip: cara membaca dibutuhkan SETIAP KALI matamu melewati kata itu,
 * dan sesuatu yang dibutuhkan setiap kali tidak boleh disembunyikan di balik
 * interaksi. Browser juga menangani perataannya sendiri, jadi tidak ada tumpukan
 * `absolute` yang merusak tinggi baris.
 *
 * ARTI disembunyikan sampai diminta. Alasannya kebalikannya: kalau arti tiap
 * kata ikut tercetak, kalimat bahasa targetnya berubah jadi daftar kosakata dan
 * kamu berhenti benar-benar membacanya — matamu akan langsung ke terjemahannya.
 * Yang dilatih justru mencoba dulu, baru memeriksa.
 *
 * BUNYI keluar saat kata itu diklik. Ini bukan tombol terpisah, dan itu keputusan
 * yang paling terasa di layar: satu kalimat contoh bisa berisi enam kata, dan
 * enam ikon pengeras suara di antara enam kata membuat kalimatnya tidak bisa
 * dibaca lagi sebagai kalimat. Jadi katanya SENDIRI yang jadi tombolnya.
 *
 * CATATAN muncul di baris kedua tooltipnya, lebih redup. Isinya hal yang membuat
 * kata itu tidak sesederhana kelihatannya: bacaan lain (多音字 seperti 行
 * xíng/háng), kata bernada berbeda yang mudah tertukar (mā/má/mǎ/mà), atau
 * peringatan bahwa kata yang sama berarti lain di bahasa lain (手紙 = surat di
 * Jepang, tisu toilet di Mandarin). Ketiganya masalah yang sama — satu bentuk
 * tertulis yang membawa lebih dari satu hal — jadi satu bidang melayani
 * ketiganya.
 *
 * Yang dibacakan `word.text` — bukan `word.reading`. Ini penting dan mudah
 * terbalik: menyuruh suara zh-CN membaca "mā" (huruf Latin) menghasilkan ejaan
 * huruf atau kata asing yang tidak dikenali, sementara "妈" dibaca dengan benar.
 * Cara baca itu untuk MATA; aksaranya yang untuk telinga. Justru karena itu
 * anotasi yang membuat suaranya mungkin: tanpa `{{...}}`, tidak ada cara
 * mengetahui bagian mana dari materi yang berbahasa target dan bagian mana yang
 * berbahasa Indonesia.
 */
function Word({ word, lang }: { word: Annotation; lang: string }) {
  const voice = useVoiceStatus(lang)
  const canSpeak = voice === 'yes'

  const body = word.reading ? (
    <ruby>
      {word.text}
      {/* <rp> untuk browser tanpa dukungan ruby: bacaannya jadi "kata (baca)"
          dalam tanda kurung, bukan menempel tanpa pemisah. */}
      <rp>(</rp>
      <rt>{word.reading}</rt>
      <rp>)</rp>
    </ruby>
  ) : (
    word.text
  )

  // Tidak ada arti DAN tidak ada suara → tidak ada yang bisa dilakukan, jadi
  // jangan jadikan tombol. Elemen yang bisa difokus tapi tidak melakukan apa pun
  // membuat navigasi keyboard penuh perhentian kosong, dan di pembaca layar
  // terdengar seperti tombol rusak.
  if (!word.meaning && !word.note && !canSpeak) return <span className="annotated">{body}</span>

  const hint = [word.meaning, word.note, canSpeak ? 'klik untuk mendengar' : null]
    .filter(Boolean)
    .join(' · ')

  return (
    <button
      type="button"
      onClick={canSpeak ? () => speak(word.text, lang) : undefined}
      // `title` tetap dipasang sebagai jaring: kalau tooltip-nya terpotong tepi
      // kartu (kartu materi memakai overflow-hidden untuk sudut membulatnya),
      // arti katanya masih bisa dibaca lewat tooltip bawaan browser.
      title={hint}
      aria-label={canSpeak ? `${word.text} — bacakan` : undefined}
      className={`annotated group relative underline decoration-dotted decoration-from-font underline-offset-4 transition hover:text-brand focus:text-brand focus:outline-none ${
        canSpeak ? 'cursor-pointer' : 'cursor-help'
      }`}
    >
      {body}
      {(word.meaning || word.note) && (
        <span
          role="tooltip"
          // `whitespace-nowrap` HANYA kalau tidak ada catatan. Arti selalu satu-dua
          // kata jadi aman satu baris, tapi catatan bisa memuat empat pembanding
          // nada sekaligus — dipaksa satu baris, tooltipnya melebar melewati
          // layar HP dan bagian yang penting justru terpotong.
          className={`pointer-events-none absolute top-full left-1/2 z-20 mt-1 -translate-x-1/2 rounded-xl bg-ink px-2.5 py-1.5 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100 ${
            word.note ? 'w-max max-w-64' : 'whitespace-nowrap'
          }`}
        >
          {word.meaning}
          {canSpeak && <span className="ml-1.5 opacity-60">🔊</span>}
          {/*
            Catatan ditaruh di baris KEDUA dengan warna lebih redup, bukan
            disambung ke artinya. Bedanya bukan kerapian: arti adalah jawaban
            atas "ini apa", sedangkan catatan adalah peringatan "hati-hati, ada
            kemungkinan lain". Disambung jadi satu baris, keduanya terbaca sama
            pentingnya dan yang dicari mata jadi lebih lambat ketemu.
          */}
          {word.note && (
            <span className="mt-0.5 block border-t border-white/20 pt-0.5 font-normal opacity-75">
              {word.note}
            </span>
          )}
        </span>
      )}
    </button>
  )
}

/**
 * Satu string → teks biasa + kata beranotasi, ditutup satu tombol dengar untuk
 * seluruh bagian berbahasa targetnya.
 *
 * Tombol di ujung baris itu yang membuat bagian "Contoh dalam kalimat" berguna:
 * mengklik kata satu per satu memberi tahu bunyi tiap kata, tapi tidak pernah
 * memberi tahu bunyi KALIMATNYA — dan yang paling sulit dari bahasa bernada atau
 * bertekanan justru sambungan antar katanya. Yang dibacakan hanya potongan
 * beranotasi yang dirangkai, jadi terjemahan Indonesia di baris yang sama tidak
 * ikut terbaca dengan suara bahasa asing.
 *
 * Muncul hanya kalau ada minimal dua kata beranotasi: untuk satu kata, tombol
 * kalimat cuma mengulang apa yang sudah dilakukan kata itu sendiri.
 */
export function Annotated({ children, lang }: { children: string; lang: string }) {
  const parts = parseAnnotations(children)
  const wordCount = parts.filter((p) => p.kind === 'word').length
  const phrase = targetPhrase(parts)

  return (
    <>
      {parts.map((part, i) =>
        part.kind === 'text' ? (
          part.value
        ) : (
          // Indeks sebagai key: potongan-potongan ini tidak pernah diurut ulang,
          // ditambah, atau dihapus — mereka lahir dan mati bersama stringnya.
          <Word key={i} word={part.word} lang={lang} />
        ),
      )}
      {wordCount > 1 && phrase && (
        <span className="ml-1 inline-flex translate-y-1 align-baseline">
          <SpeakButton text={phrase} lang={lang} />
        </span>
      )}
    </>
  )
}
