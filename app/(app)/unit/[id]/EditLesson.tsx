'use client'

import { useState, useTransition } from 'react'
import { LessonBody } from '@/components/LessonBody'
import { generateLessonAction, updateLessonAction } from './actions'

/**
 * Koreksi materi.
 *
 * Ini bagian yang paling lama absen dan paling penting. Materi ditulis AI, dan
 * penjelasan tata bahasa yang salah TIDAK bisa dideteksi oleh orang yang baru
 * belajar — sementara SRS akan rajin mengulangnya sampai hafal. Tanpa tombol
 * ini, satu-satunya jalan memperbaiki adalah menghapus seluruh pelajarannya.
 *
 * Menyimpan juga menandai materi sebagai SUDAH DIPERIKSA, yang menghilangkan
 * label "belum diverifikasi". Penanda itu tidak berpindah sendiri: yang
 * memeriksa manusia, jadi yang mengubahnya juga harus tindakan manusia.
 */
export function EditLesson({
  unitId,
  initial,
  verified,
  ttsLang,
  languageName,
  hasAnnotations: annotated,
}: {
  unitId: string
  initial: string
  verified: boolean
  /** kode suara bahasa target — diteruskan ke tombol dengar di dalam materi */
  ttsLang: string
  languageName: string
  /** materi ini sudah memakai anotasi {{kata|baca|arti}} atau belum */
  hasAnnotations: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(initial)
  const [saved, setSaved] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const regenerate = () => {
    setError(null)
    startTransition(async () => {
      const r = await generateLessonAction(unitId)
      if (r.error) setError(r.error)
      // Tidak perlu setSaved: server action memanggil revalidatePath, jadi
      // halamannya dirender ulang dengan materi baru dari database. Menyimpan
      // salinannya di sini cuma menciptakan dua sumber kebenaran.
    })
  }

  const save = () => {
    setError(null)
    startTransition(async () => {
      const r = await updateLessonAction(unitId, text)
      if (r.error) setError(r.error)
      else {
        setSaved(text)
        setEditing(false)
      }
    })
  }

  if (!editing) {
    return (
      <div className="card overflow-hidden">
        <div className="p-5">
          <LessonBody ttsLang={ttsLang} languageName={languageName}>
            {saved}
          </LessonBody>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-canvas/60 px-5 py-2.5">
          <span className="text-xs text-faint">
            {verified ? 'Sudah kamu periksa.' : 'Ada yang keliru? Perbaiki langsung.'}
          </span>
          <div className="flex items-center gap-1">
            {/*
              SELALU ada, tapi labelnya berubah menurut keadaan materinya.

              Versi pertama menyembunyikan tombol ini begitu materinya sudah
              beranotasi, dengan alasan supaya tidak jadi undangan menekan
              berkali-kali. Alasannya masuk akal, akibatnya tidak: generator
              materi diperbaiki dua kali dalam satu hari (pertama menambah cara
              baca & arti, lalu menambah catatan bacaan lain dan peringatan
              lintas bahasa), dan tiap kali itu terjadi, materi yang SUDAH
              beranotasi jadi terkunci di versi lama tanpa jalan keluar selain
              menulis ulang sendiri.

              Jadi yang dipakai sekarang label, bukan penyembunyian. Materi tanpa
              anotasi mendapat label yang menjelaskan apa yang akan didapat;
              materi yang sudah beranotasi mendapat label netral yang tidak
              mengundang. Peringatan bahwa ini menimpa materinya tetap ada di
              `title`.
            */}
            <button
              type="button"
              onClick={regenerate}
              disabled={pending}
              title={
                annotated
                  ? 'Membuat ulang materi dari awal. Materi yang sekarang akan DITIMPA, termasuk suntinganmu dan tanda sudah diperiksa.'
                  : 'Materi ini belum punya cara baca dan arti per kata. Membuat ulang akan menambahkannya — dan menimpa materi yang sekarang.'
              }
              className="btn-ghost btn-sm disabled:opacity-50"
            >
              {pending ? 'Membuat…' : annotated ? 'Buat ulang' : '+ cara baca & arti'}
            </button>
            <button type="button" onClick={() => setEditing(true)} className="btn-ghost btn-sm">
              Edit materi
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card space-y-3 p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={18}
        className="input min-h-72 resize-y font-mono text-[13px] leading-relaxed"
      />
      <p className="text-xs text-faint">
        Ditulis dalam Markdown. Menyimpan sekaligus menandai materi ini sudah diperiksa.
      </p>
      {error && (
        <p role="alert" className="rounded-xl bg-bad-soft px-3 py-2 text-[13px] text-bad">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setText(saved)
            setEditing(false)
            setError(null)
          }}
          className="btn-outline btn-sm flex-1"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={save}
          disabled={pending || !text.trim()}
          className="btn-primary btn-sm flex-1 disabled:opacity-50"
        >
          {pending ? 'Menyimpan…' : 'Simpan'}
        </button>
      </div>
    </div>
  )
}
