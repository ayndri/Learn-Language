// eslint-config-next 16 sudah mengekspor flat config langsung — tidak perlu FlatCompat.
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const config = [
  ...coreWebVitals,
  ...typescript,
  { ignores: ['.next/**', 'node_modules/**', 'drizzle/**'] },
]

export default config
