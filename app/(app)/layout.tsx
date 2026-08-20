import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/auth'
import { Logo } from '@/components/Logo'

/**
 * Gerbang autentikasi untuk semua halaman di dalam grup (app).
 *
 * Sengaja dijaga di sini, bukan di middleware. Dua alasan:
 * - bcrypt tidak bisa jalan di Edge runtime, jadi middleware butuh config Auth.js
 *   yang dipecah dua — satu bagian lagi yang bisa salah tanpa terasa.
 * - Di Next 16 `middleware.ts` sudah deprecated, diganti `proxy.ts`.
 *
 * Catatan: ini melindungi HALAMAN. Route handler API harus memeriksa sesinya
 * sendiri lewat `requireUserId()` — layout tidak menyentuh route API.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-line bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={30} />
            <span className="text-[15px] font-semibold tracking-tight">Lingua Lab</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-[13px] text-faint sm:inline">{session.user.name}</span>
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/login' })
              }}
            >
              <button type="submit" className="btn-ghost btn-sm">
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">{children}</div>
    </div>
  )
}
