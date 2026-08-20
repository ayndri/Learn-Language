/**
 * Tanda visual aplikasi. Bentuknya balon percakapan dengan dua garis —
 * dua bahasa yang berdampingan.
 */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-soft"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size * 0.58}
        height={size * 0.58}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      >
        <path d="M4 5.5h16v10H9l-5 4v-14z" strokeLinejoin="round" />
        <path d="M8 9h8M8 12h5" />
      </svg>
    </span>
  )
}
