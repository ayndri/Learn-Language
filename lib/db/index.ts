import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '@/lib/db/schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL belum diset — cek .env.local')
}

// Driver serverless + neon-http, bukan node-postgres: koneksi TCP yang persisten
// tidak cocok di serverless Vercel (tiap invocation instance-nya bisa berbeda).
const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql, { schema })
