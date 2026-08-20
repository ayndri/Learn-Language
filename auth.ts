import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

/**
 * Login username + password untuk satu orang.
 *
 * Dua hal yang perlu diingat kalau nanti diubah:
 *
 * 1. `strategy: 'jwt'` itu WAJIB, bukan pilihan. Credentials provider Auth.js
 *    tidak mendukung sesi database — karena itu tidak ada tabel sessions/accounts.
 *
 * 2. Halaman login ini terbuka di internet begitu dideploy. Pakai passphrase panjang.
 *    Pesan error sengaja tidak membedakan "username tidak ada" dan "password salah".
 */

/**
 * Hash dummy untuk username yang tidak ada. Tanpa ini, request dengan username
 * asing balik jauh lebih cepat daripada username benar — selisih waktunya cukup
 * untuk menebak username mana yang valid.
 */
const DUMMY_HASH = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw) {
        const username = String(raw?.username ?? '').trim().toLowerCase()
        const password = String(raw?.password ?? '')
        if (!username || !password) return null

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, username))
          .limit(1)

        const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH)
        if (!user || !ok) return null

        return { id: user.id, name: user.username }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id
      return token
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
  },
})

/**
 * User id dari sesi, atau null.
 *
 * Ini yang dipakai di SERVER COMPONENT. Next merender layout dan page secara
 * paralel, jadi kalau page melempar error saat belum login, error itu tetap
 * masuk log walaupun layout sudah memanggil redirect(). Page memakai fungsi ini
 * lalu redirect sendiri — `redirect()` adalah alur kendali yang dimengerti Next.
 */
export async function currentUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

/**
 * User id dari sesi, atau lempar.
 *
 * Ini yang dipakai di ROUTE HANDLER API — di sana melempar memang benar,
 * dan layout tidak melindungi route API sama sekali.
 */
export async function requireUserId(): Promise<string> {
  const id = await currentUserId()
  if (!id) throw new Error('UNAUTHORIZED')
  return id
}
