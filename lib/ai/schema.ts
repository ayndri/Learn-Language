import { z } from 'zod'

/**
 * Zod → responseSchema Gemini.
 *
 * Kenapa diturunkan dari Zod, bukan ditulis dua kali: schema yang sama harus dipakai
 * untuk (a) membatasi keluaran AI dan (b) memvalidasi hasilnya di server. Kalau
 * keduanya ditulis terpisah, cepat atau lambat keduanya beda dan bug-nya sulit dilacak.
 *
 * Gemini menerima subset OpenAPI 3.0, bukan JSON Schema penuh — jadi kunci yang tidak
 * dikenal harus dibuang, bukan diteruskan (Gemini menolak request-nya kalau ada).
 */

const ALLOWED_KEYS = new Set([
  'type',
  'format',
  'description',
  'nullable',
  'enum',
  'items',
  'properties',
  'required',
  'propertyOrdering',
  'minItems',
  'maxItems',
])

type JsonObject = Record<string, unknown>

function sanitize(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(sanitize)
  if (node === null || typeof node !== 'object') return node

  const input = node as JsonObject
  const out: JsonObject = {}

  for (const [key, value] of Object.entries(input)) {
    if (!ALLOWED_KEYS.has(key)) continue // buang $schema, additionalProperties, dst
    if (key === 'properties' && value && typeof value === 'object') {
      const props: JsonObject = {}
      for (const [propKey, propVal] of Object.entries(value as JsonObject)) {
        props[propKey] = sanitize(propVal)
      }
      out.properties = props
    } else {
      out[key] = sanitize(value)
    }
  }

  // Urutan field yang eksplisit membuat keluaran lebih konsisten antar request.
  if (out.properties && !out.propertyOrdering) {
    out.propertyOrdering = Object.keys(out.properties as JsonObject)
  }

  return out
}

export function toGeminiSchema(schema: z.ZodType): JsonObject {
  const json = z.toJSONSchema(schema, { io: 'output' }) as unknown
  return sanitize(json) as JsonObject
}
