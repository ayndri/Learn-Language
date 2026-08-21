'use client'

import { useState, useTransition } from 'react'
import { deleteItemAction, updateItemAction } from './actions'

export type EditableItem = {
  id: string
  type: string
  label: string
  /** ringkasan satu baris untuk daftar */
  preview: string
  fields: Record<string, unknown>
}

/**
 * Koreksi dan hapus item latihan.
 *
 * Isi item diedit sebagai JSON, dan itu keputusan sadar. Bentuk `fields`
 * berbeda untuk tiap jenis (dan untuk `vocab` berbeda tiap BAHASA), jadi form
 * per-jenis berarti dua belas form yang harus ikut berubah tiap kali registry
 * bertambah. JSON tidak seramah itu, tapi selalu benar — dan yang memakainya
 * satu orang yang juga menulis aplikasinya.
 *
 * Pengamannya ada di server: isian divalidasi ulang terhadap schema Zod jenis
 * item itu sebelum disimpan, jadi JSON yang bentuknya salah ditolak, bukan
 * merusak kartu.
 */
export function EditItems({ items }: { items: EditableItem[] }) {
  const [open, setOpen] = useState(false)
  const [list, setList] = useState(items)

  if (list.length === 0) return null

  return (
    <section className="space-y-2.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <h2 className="text-[13px] font-semibold tracking-wide text-faint uppercase">
          Periksa item latihan
        </h2>
        <span className="text-xs text-faint">
          {list.length} item · {open ? 'tutup' : 'buka'}
        </span>
      </button>

      {open && (
        <>
          <p className="px-1 text-xs text-faint">
            Item dibuat AI. Kalau ada yang salah, betulkan atau buang di sini — kartu yang salah
            akan diulang terus oleh penjadwalnya sampai kamu hafal yang keliru.
          </p>
          <ul className="space-y-2">
            {list.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onDeleted={() => setList((p) => p.filter((x) => x.id !== item.id))}
                onSaved={(fields, preview) =>
                  setList((p) => p.map((x) => (x.id === item.id ? { ...x, fields, preview } : x)))
                }
              />
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

function ItemRow({
  item,
  onDeleted,
  onSaved,
}: {
  item: EditableItem
  onDeleted: () => void
  onSaved: (fields: Record<string, unknown>, preview: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(() => JSON.stringify(item.fields, null, 2))
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const save = () => {
    setError(null)
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(text)
    } catch {
      setError('JSON-nya belum benar — cek tanda kutip dan koma.')
      return
    }
    startTransition(async () => {
      const r = await updateItemAction(item.id, parsed)
      if (r.error) setError(r.error)
      else {
        onSaved(parsed, r.ok ?? '')
        setEditing(false)
      }
    })
  }

  const remove = () => {
    startTransition(async () => {
      const r = await deleteItemAction(item.id)
      if (r.error) setError(r.error)
      else onDeleted()
    })
  }

  return (
    <li className="card overflow-hidden">
      <div className="flex items-start gap-3 px-4 py-3">
        <span className="badge shrink-0 bg-canvas text-faint">{item.label}</span>
        <span className="min-w-0 flex-1 truncate text-sm">{item.preview}</span>
        <span className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="btn-ghost btn-sm"
            aria-label="Edit item"
          >
            {editing ? 'Tutup' : 'Edit'}
          </button>
          {confirming ? (
            <button
              type="button"
              onClick={remove}
              disabled={pending}
              className="btn-sm rounded-xl bg-bad px-2.5 font-semibold text-white disabled:opacity-50"
            >
              {pending ? '…' : 'Yakin?'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="btn-ghost btn-sm text-bad"
              aria-label="Hapus item"
            >
              Hapus
            </button>
          )}
        </span>
      </div>

      {editing && (
        <div className="space-y-2 border-t border-line bg-canvas/40 p-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={Math.min(16, text.split('\n').length + 1)}
            spellCheck={false}
            className="input resize-y font-mono text-xs leading-relaxed"
          />
          {error && (
            <p role="alert" className="rounded-xl bg-bad-soft px-3 py-2 text-[13px] text-bad">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="btn-primary btn-sm w-full disabled:opacity-50"
          >
            {pending ? 'Menyimpan…' : 'Simpan item'}
          </button>
        </div>
      )}

      {!editing && error && (
        <p role="alert" className="border-t border-line bg-bad-soft px-4 py-2 text-[13px] text-bad">
          {error}
        </p>
      )}
    </li>
  )
}
