'use client'

import { Children, type ReactNode } from 'react'
import Markdown from 'react-markdown'
import { Annotated } from '@/components/Annotated'
import { useVoiceStatus } from '@/components/useVoice'
import { hasAnnotations } from '@/lib/items/annotate'

/**
 * Materi pelajaran: Markdown biasa, plus anotasi cara baca & arti per kata.
 *
 * Anotasinya diproses di lapisan RENDER, bukan lewat remark plugin. Bedanya
 * nyata: plugin remark bekerja di pohon Markdown, jadi ia harus paham konteks
 * (jangan menyentuh isi blok kode, jangan merusak tautan) dan itu berarti
 * menambah satu tahap yang harus dipahami sebelum bisa mengubah apa pun di sini.
 * Menimpa daftar komponennya jauh lebih langsung: yang ditandai anotasi cuma
 * elemen yang MEMANG berisi prosa, dan sisanya — terutama `code` dan `pre` —
 * tidak ikut disentuh karena tidak ada di daftar. Blok kode yang berisi
 * `{{contoh}}` tampil apa adanya, dan itu memang yang benar.
 */

/**
 * Ganti setiap anak yang berupa string dengan versi beranotasinya.
 *
 * Hanya satu tingkat, dan itu cukup: elemen bersarang (`**{{kata}}**`) ikut
 * tertangani karena `strong` dan `em` juga ada di daftar komponen di bawah, jadi
 * stringnya diproses saat elemen itu sendiri dirender.
 */
function annotate(children: ReactNode, lang: string): ReactNode {
  return Children.map(children, (child) =>
    typeof child === 'string' && hasAnnotations(child) ? (
      <Annotated lang={lang}>{child}</Annotated>
    ) : (
      child
    ),
  )
}

export function LessonBody({
  children,
  ttsLang,
  languageName,
}: {
  children: string
  /** kode suara bahasa target, mis. 'zh-CN' — penentu tombol dengar */
  ttsLang: string
  /** dipakai saat memberi tahu bahwa suara bahasa ini tidak tersedia */
  languageName: string
}) {
  const voice = useVoiceStatus(ttsLang)

  return (
    <div className="lesson">
      {/*
        Suara yang tidak ada harus DIKATAKAN, bukan disembunyikan.

        `SpeakButton` sengaja menghilangkan dirinya kalau perangkatnya tidak punya
        suara bahasa itu — untuk tombol pelengkap di kartu latihan itu benar:
        tombol mati tanpa penjelasan lebih membingungkan daripada tombol yang
        tidak muncul.

        Di sini justru sebaliknya, dan ini pernah kejadian: materinya digenerate
        ulang, cara baca dan artinya muncul, tapi tidak ada satu pun suara — dan
        tidak ada apa pun di layar yang menjelaskan kenapa. Yang terlihat seperti
        fitur rusak sebenarnya paket bahasa Windows yang belum dipasang. Bedanya
        dengan kartu latihan: di sana suara itu tambahan, di sini suara itu
        setengah dari alasan bagian ini ada.

        Ditampilkan hanya kalau materinya MEMANG punya kata bahasa target —
        materi yang seluruhnya bahasa Indonesia tidak perlu diberi tahu apa pun.
      */}
      {voice === 'no' && hasAnnotations(children) && (
        <p className="mb-3 rounded-xl bg-warn-soft px-3 py-2 text-xs leading-relaxed text-warn">
          Perangkat ini belum punya suara {languageName}, jadi kata-katanya tidak bisa
          dibacakan — cara baca dan artinya tetap jalan. Di Windows:{' '}
          <strong>Setelan → Waktu &amp; bahasa → Suara → Tambahkan suara</strong>.
        </p>
      )}
      <Markdown
        components={{
          p: ({ children }) => <p>{annotate(children, ttsLang)}</p>,
          li: ({ children }) => <li>{annotate(children, ttsLang)}</li>,
          h2: ({ children }) => <h2>{annotate(children, ttsLang)}</h2>,
          h3: ({ children }) => <h3>{annotate(children, ttsLang)}</h3>,
          h4: ({ children }) => <h4>{annotate(children, ttsLang)}</h4>,
          strong: ({ children }) => <strong>{annotate(children, ttsLang)}</strong>,
          em: ({ children }) => <em>{annotate(children, ttsLang)}</em>,
          td: ({ children }) => <td>{annotate(children, ttsLang)}</td>,
          th: ({ children }) => <th>{annotate(children, ttsLang)}</th>,
          blockquote: ({ children }) => <blockquote>{annotate(children, ttsLang)}</blockquote>,
        }}
      >
        {children}
      </Markdown>
    </div>
  )
}
