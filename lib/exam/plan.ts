import { splitCount } from '@/lib/ai/exam'
import { blueprint, type BlueprintBlock, type ExamSize } from '@/lib/exam/blueprint'

/**
 * Cetak biru → daftar langkah generate.
 *
 * Satu langkah = satu panggilan AI. Blok besar dipecah (30 percakapan pendek jadi
 * 3 langkah), dan setiap bacaan/rekaman panjang jadi langkahnya sendiri.
 *
 * Dipecah begini karena dua alasan: keluaran AI yang panjang mudah terpotong dan
 * kualitasnya menurun di bagian akhir, dan kalau satu langkah gagal yang lain
 * tidak ikut hilang.
 */
export type ExamStep = {
  key: string
  label: string
  section: 1 | 2 | 3
  block: BlueprintBlock
  /** jumlah soal yang diminta pada langkah ini */
  count: number
  /** indeks kelompok ke berapa (untuk memvariasikan topik) */
  groupIndex: number
}

export function examSteps(size: ExamSize): ExamStep[] {
  const steps: ExamStep[] = []

  for (const block of blueprint(size)) {
    if (block.groups === 0) {
      const chunks = splitCount(block.perGroup)
      chunks.forEach((count, i) => {
        steps.push({
          key: `${block.type}-${i}`,
          label:
            chunks.length > 1
              ? `${block.label} (${i + 1}/${chunks.length})`
              : block.label,
          section: block.section,
          block: { ...block, perGroup: count },
          count,
          groupIndex: i,
        })
      })
    } else {
      for (let g = 0; g < block.groups; g++) {
        steps.push({
          key: `${block.type}-g${g}`,
          label:
            block.groups > 1 ? `${block.label} ${g + 1}/${block.groups}` : block.label,
          section: block.section,
          block,
          count: block.perGroup,
          groupIndex: g,
        })
      }
    }
  }

  return steps
}
