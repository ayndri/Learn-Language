'use client'

import { useState, useTransition } from 'react'
import Markdown from 'react-markdown'
import { updateLessonAction } from './actions'

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
}: {
  unitId: string
  initial: string
  verified: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(initial)
  const [saved, setSaved] = useState(initial)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

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
          <div className="lesson">
            <Markdown>{saved}</Markdown>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-line bg-canvas/60 px-5 py-2.5">
          <span className="text-xs text-faint">
            {verified ? 'Sudah kamu periksa.' : 'Ada yang keliru? Perbaiki langsung.'}
          </span>
          <button type="button" onClick={() => setEditing(true)} className="btn-ghost btn-sm">
            Edit materi
          </button>
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
