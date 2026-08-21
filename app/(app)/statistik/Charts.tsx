'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

/**
 * Grafik dipisah ke komponen client karena Recharts butuh DOM.
 *
 * Warnanya diambil dari token tema lewat CSS variable, bukan hex yang ditulis
 * ulang di sini — supaya kalau paletnya diubah, grafiknya ikut berubah.
 */
const BRAND = 'var(--color-brand)'
const GOOD = 'var(--color-good)'
const LINE = 'var(--color-line)'
const FAINT = 'var(--color-faint)'

const axis = { stroke: FAINT, fontSize: 11, tickLine: false }

function tooltipStyle() {
  return {
    contentStyle: {
      borderRadius: 12,
      border: '1px solid var(--color-line)',
      fontSize: 12,
      boxShadow: '0 8px 24px rgb(33 28 46 / 0.08)',
    },
    labelStyle: { fontWeight: 600 },
  }
}

/** Aktivitas harian: total review + berapa yang benar */
export function ActivityChart({
  data,
}: {
  data: { day: string; reviews: number; correct: number }[]
}) {
  const shaped = data.map((d) => ({
    label: d.day.slice(5).replace('-', '/'),
    benar: d.correct,
    salah: Math.max(0, d.reviews - d.correct),
  }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={shaped} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={LINE} />
        <XAxis dataKey="label" {...axis} interval="preserveStartEnd" />
        <YAxis {...axis} allowDecimals={false} />
        <Tooltip {...tooltipStyle()} />
        <Bar dataKey="benar" stackId="a" fill={GOOD} radius={[0, 0, 0, 0]} />
        <Bar dataKey="salah" stackId="a" fill={LINE} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

/**
 * Tren skor simulasi.
 *
 * `domain` datang dari format ujiannya, bukan dihardcode: TOEFL ITP berskala
 * 310–677 dan JLPT 0–180. Menggambar keduanya pada sumbu yang sama akan
 * membuat salah satunya tampak datar sempurna padahal berubah banyak.
 */
export function ExamTrendChart({
  data,
  domain,
}: {
  data: { label: string; total: number }[]
  domain: [number, number]
}) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={LINE} />
        <XAxis dataKey="label" {...axis} />
        <YAxis domain={domain} {...axis} />
        <Tooltip {...tooltipStyle()} />
        <Line
          type="monotone"
          dataKey="total"
          stroke={BRAND}
          strokeWidth={2.5}
          dot={{ r: 4, fill: BRAND }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
