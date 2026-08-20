import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // bcryptjs & drizzle jalan di server saja — biarkan Next tidak mencoba bundle-nya ke client
  serverExternalPackages: ['bcryptjs'],
}

export default nextConfig
