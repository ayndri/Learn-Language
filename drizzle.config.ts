import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// Next.js membaca .env.local otomatis, tapi drizzle-kit (CLI) tidak — muat manual.
loadEnv({ path: '.env.local', quiet: true })

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL belum diset — cek .env.local')
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL },
  verbose: true,
  strict: true,
})
