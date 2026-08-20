import Link from 'next/link'
import { ImportForm } from './ImportForm'

export default function TeksPage() {
  return (
    <main className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Dari bacaanmu</h1>
          <p className="mt-0.5 text-[13px] text-muted">
            Tempel abstrak jurnal, artikel, atau apa pun yang kamu baca.
          </p>
        </div>
        <Link href="/" className="btn-ghost btn-sm shrink-0">
          ← Dashboard
        </Link>
      </div>

      <ImportForm />

      <section className="card space-y-2 p-5 text-[13px] text-muted">
        <p className="font-semibold text-ink">Yang diambil dan yang tidak</p>
        <ul className="space-y-1.5 pl-4">
          <li className="list-disc">
            Kata yang <strong>cukup umum untuk berguna lagi</strong>, tapi cukup jarang untuk
            belum kamu kuasai.
          </li>
          <li className="list-disc">
            <strong>Tidak</strong> diambil: 1.000 kata paling umum, nama orang/tempat, angka,
            dan singkatan khusus satu bidang.
          </li>
          <li className="list-disc">
            Kata yang <strong>sudah ada</strong> di koleksimu dilewati — jadi menempel dua
            artikel dengan topik mirip tidak menghasilkan duplikat.
          </li>
          <li className="list-disc">
            Contoh kalimatnya diambil dari teksmu, jadi konteksnya nyata — bukan contoh karangan.
          </li>
        </ul>
      </section>
    </main>
  )
}
