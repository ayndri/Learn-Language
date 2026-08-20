/**
 * Ledakan warna kecil untuk momen selesai sesi.
 *
 * Murni CSS — tidak ada library confetti, tidak ada canvas, tidak ada request
 * ke luar. Arah tiap partikel ditentukan lewat custom property `--dx/--dy`
 * yang dipakai keyframe `burst`.
 *
 * `prefers-reduced-motion` sudah ditangani global di globals.css, jadi bagi yang
 * mematikan animasi ini otomatis tidak bergerak.
 */
const PARTICLES = [
  { dx: -70, dy: -60, color: 'bg-brand', delay: 0 },
  { dx: 60, dy: -75, color: 'bg-sun', delay: 60 },
  { dx: -95, dy: 10, color: 'bg-good', delay: 30 },
  { dx: 90, dy: -20, color: 'bg-lv-a2', delay: 90 },
  { dx: -40, dy: -95, color: 'bg-lv-c1', delay: 120 },
  { dx: 30, dy: -105, color: 'bg-brand', delay: 20 },
  { dx: -110, dy: -35, color: 'bg-sun', delay: 150 },
  { dx: 105, dy: 25, color: 'bg-good', delay: 80 },
  { dx: 0, dy: -115, color: 'bg-lv-a2', delay: 45 },
  { dx: -25, dy: 60, color: 'bg-sun', delay: 110 },
  { dx: 45, dy: 65, color: 'bg-brand', delay: 135 },
  { dx: -60, dy: 45, color: 'bg-lv-c1', delay: 70 },
]

export function Celebrate() {
  return (
    <div aria-hidden="true" className="pointer-events-none relative mx-auto size-0">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={`absolute size-2.5 animate-burst rounded-full ${p.color}`}
          style={
            {
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              animationDelay: `${p.delay}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
