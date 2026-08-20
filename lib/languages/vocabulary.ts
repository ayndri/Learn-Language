/**
 * KURIKULUM KOSAKATA — Academic Word List (Coxhead, 2000)
 *
 * Kenapa ini data, sama seperti kurikulum grammar:
 *
 * Sebelum ini, grammar sudah sistematis tapi kosakata dibiarkan **kebetulan** —
 * apa pun yang kepikiran AI untuk topik pelajaran itu. Untuk TOEFL justru
 * kosakata yang sering jadi penentu di Reading, dan "kebetulan" bukan strategi.
 *
 * AWL berisi 570 word family yang paling sering muncul di teks akademik lintas
 * bidang, di luar 2.000 kata paling umum. Disusun jadi 10 sublist berdasarkan
 * frekuensi: Sublist 1 paling sering, Sublist 10 paling jarang. Yang ditulis di
 * sini adalah **headword**-nya — turunannya (analyse → analysis, analytical)
 * dibiarkan muncul sendiri di contoh kalimat.
 *
 * Cakupannya bisa dihitung: 9 sublist × 60 + 1 × 30 = 570.
 */

export const AWL_SUBLISTS: string[][] = [
  // ------------------------------------------------------- Sublist 1 (60)
  [
    'analyse', 'approach', 'area', 'assess', 'assume', 'authority', 'available',
    'benefit', 'concept', 'consist', 'constitute', 'context', 'contract', 'create',
    'data', 'define', 'derive', 'distribute', 'economy', 'environment', 'establish',
    'estimate', 'evident', 'export', 'factor', 'finance', 'formula', 'function',
    'identify', 'income', 'indicate', 'individual', 'interpret', 'involve', 'issue',
    'labour', 'legal', 'legislate', 'major', 'method', 'occur', 'percent', 'period',
    'policy', 'principle', 'proceed', 'process', 'require', 'research', 'respond',
    'role', 'section', 'sector', 'significant', 'similar', 'source', 'specific',
    'structure', 'theory', 'vary',
  ],
  // ------------------------------------------------------- Sublist 2 (60)
  [
    'achieve', 'acquire', 'administrate', 'affect', 'appropriate', 'aspect', 'assist',
    'category', 'chapter', 'commission', 'community', 'complex', 'compute', 'conclude',
    'conduct', 'consequent', 'construct', 'consume', 'credit', 'culture', 'design',
    'distinct', 'element', 'equate', 'evaluate', 'feature', 'final', 'focus', 'impact',
    'injure', 'institute', 'invest', 'item', 'journal', 'maintain', 'normal', 'obtain',
    'participate', 'perceive', 'positive', 'potential', 'previous', 'primary',
    'purchase', 'range', 'region', 'regulate', 'relevant', 'reside', 'resource',
    'restrict', 'secure', 'seek', 'select', 'site', 'strategy', 'survey', 'text',
    'tradition', 'transfer',
  ],
  // ------------------------------------------------------- Sublist 3 (60)
  [
    'alternative', 'circumstance', 'comment', 'compensate', 'component', 'consent',
    'considerable', 'constant', 'constrain', 'contribute', 'convene', 'coordinate',
    'core', 'corporate', 'correspond', 'criteria', 'deduce', 'demonstrate', 'document',
    'dominate', 'emphasis', 'ensure', 'exclude', 'framework', 'fund', 'illustrate',
    'immigrate', 'imply', 'initial', 'instance', 'interact', 'justify', 'layer', 'link',
    'locate', 'maximise', 'minor', 'negate', 'outcome', 'partner', 'philosophy',
    'physical', 'proportion', 'publish', 'react', 'register', 'rely', 'remove',
    'scheme', 'sequence', 'sex', 'shift', 'specify', 'sufficient', 'task', 'technical',
    'technique', 'technology', 'valid', 'volume',
  ],
  // ------------------------------------------------------- Sublist 4 (60)
  [
    'access', 'adequate', 'annual', 'apparent', 'approximate', 'attitude', 'attribute',
    'civil', 'code', 'commit', 'communicate', 'concentrate', 'confer', 'contrast',
    'cycle', 'debate', 'despite', 'dimension', 'domestic', 'emerge', 'error', 'ethnic',
    'goal', 'grant', 'hence', 'hypothesis', 'implement', 'implicate', 'impose',
    'integrate', 'internal', 'investigate', 'job', 'label', 'mechanism', 'obvious',
    'occupy', 'option', 'output', 'overall', 'parallel', 'parameter', 'phase',
    'predict', 'principal', 'prior', 'professional', 'project', 'promote', 'regime',
    'resolve', 'retain', 'series', 'statistic', 'status', 'stress', 'subsequent',
    'sum', 'summary', 'undertake',
  ],
  // ------------------------------------------------------- Sublist 5 (60)
  [
    'academy', 'adjust', 'alter', 'amend', 'aware', 'capacity', 'challenge', 'clause',
    'compound', 'conflict', 'consult', 'contact', 'decline', 'discrete', 'draft',
    'enable', 'energy', 'enforce', 'entity', 'equivalent', 'evolve', 'expand',
    'expose', 'external', 'facilitate', 'fundamental', 'generate', 'generation',
    'image', 'liberal', 'licence', 'logic', 'margin', 'medical', 'mental', 'modify',
    'monitor', 'network', 'notion', 'objective', 'orient', 'perspective', 'precise',
    'prime', 'psychology', 'pursue', 'ratio', 'reject', 'revenue', 'stable', 'style',
    'substitute', 'sustain', 'symbol', 'target', 'transit', 'trend', 'version',
    'welfare', 'whereas',
  ],
  // ------------------------------------------------------- Sublist 6 (60)
  [
    'abstract', 'accurate', 'acknowledge', 'aggregate', 'allocate', 'assign', 'attach',
    'author', 'bond', 'brief', 'capable', 'cite', 'cooperate', 'discriminate',
    'display', 'diverse', 'domain', 'edit', 'enhance', 'estate', 'exceed', 'expert',
    'explicit', 'federal', 'fee', 'flexible', 'furthermore', 'gender', 'ignorance',
    'incentive', 'incidence', 'incorporate', 'index', 'inhibit', 'initiate', 'input',
    'instruct', 'intelligence', 'interval', 'lecture', 'migrate', 'minimum',
    'ministry', 'motive', 'neutral', 'nevertheless', 'overseas', 'precede', 'presume',
    'rational', 'recover', 'reveal', 'scope', 'subsidy', 'tape', 'trace', 'transform',
    'transport', 'underlie', 'utilise',
  ],
  // ------------------------------------------------------- Sublist 7 (60)
  [
    'adapt', 'adult', 'advocate', 'aid', 'channel', 'chemical', 'classic',
    'comprehensive', 'comprise', 'confirm', 'contrary', 'convert', 'couple', 'decade',
    'definite', 'deny', 'differentiate', 'dispose', 'dynamic', 'eliminate',
    'empirical', 'equip', 'extract', 'file', 'finite', 'foundation', 'global', 'grade',
    'guarantee', 'hierarchy', 'identical', 'ideology', 'infer', 'innovate', 'insert',
    'intervene', 'isolate', 'media', 'mode', 'paradigm', 'phenomenon', 'priority',
    'prohibit', 'publication', 'quote', 'release', 'reverse', 'simulate', 'sole',
    'somewhat', 'submit', 'successor', 'survive', 'thesis', 'topic', 'transmit',
    'ultimate', 'unique', 'visible', 'voluntary',
  ],
  // ------------------------------------------------------- Sublist 8 (60)
  [
    'abandon', 'accompany', 'accumulate', 'ambiguous', 'append', 'appreciate',
    'arbitrary', 'automate', 'bias', 'chart', 'clarify', 'commodity', 'complement',
    'conform', 'contemporary', 'contradict', 'crucial', 'currency', 'denote', 'detect',
    'deviate', 'displace', 'drama', 'eventual', 'exhibit', 'exploit', 'fluctuate',
    'guideline', 'highlight', 'implicit', 'induce', 'inevitable', 'infrastructure',
    'inspect', 'intense', 'manipulate', 'minimise', 'nuclear', 'offset', 'paragraph',
    'plus', 'practitioner', 'predominant', 'prospect', 'radical', 'random',
    'reinforce', 'restore', 'revise', 'schedule', 'tense', 'terminate', 'theme',
    'thereby', 'uniform', 'vehicle', 'via', 'virtual', 'visual', 'widespread',
  ],
  // ------------------------------------------------------- Sublist 9 (60)
  [
    'accommodate', 'analogy', 'anticipate', 'assure', 'attain', 'behalf', 'bulk',
    'cease', 'coherent', 'coincide', 'commence', 'compatible', 'concurrent', 'confine',
    'controversy', 'converse', 'device', 'devote', 'diminish', 'distort', 'duration',
    'erode', 'ethic', 'format', 'found', 'inherent', 'insight', 'integral',
    'intermediate', 'manual', 'mature', 'mediate', 'medium', 'military', 'minimal',
    'mutual', 'norm', 'overlap', 'passive', 'portion', 'preliminary', 'protocol',
    'qualitative', 'refine', 'relax', 'restrain', 'revolution', 'rigid', 'route',
    'scenario', 'sphere', 'subordinate', 'supplement', 'suspend', 'team', 'temporary',
    'trigger', 'unify', 'violate', 'vision',
  ],
  // ------------------------------------------------------- Sublist 10 (30)
  [
    'adjacent', 'albeit', 'assemble', 'collapse', 'colleague', 'compile', 'conceive',
    'convince', 'depress', 'encounter', 'enormous', 'forthcoming', 'incline',
    'integrity', 'intrinsic', 'invoke', 'levy', 'likewise', 'nonetheless',
    'notwithstanding', 'odd', 'ongoing', 'panel', 'persist', 'pose', 'reluctance',
    'so-called', 'straightforward', 'undergo', 'whereby',
  ],
]

/** Jumlah kata per pelajaran kosakata. 15 × 38 pelajaran ≈ 570 kata. */
export const WORDS_PER_LESSON = 15

export type VocabLesson = {
  title: string
  words: string[]
  /** sublist keberapa — makin besar makin jarang dipakai, jadi makin sulit */
  sublist: number
}

/**
 * AWL → daftar pelajaran kosakata.
 *
 * Dipotong per 15 kata, tidak melintasi sublist, supaya tiap pelajaran punya
 * tingkat kesulitan yang seragam.
 */
export function vocabLessons(): VocabLesson[] {
  const out: VocabLesson[] = []
  AWL_SUBLISTS.forEach((words, i) => {
    const sublist = i + 1
    for (let start = 0; start < words.length; start += WORDS_PER_LESSON) {
      const chunk = words.slice(start, start + WORDS_PER_LESSON)
      const part = Math.floor(start / WORDS_PER_LESSON) + 1
      const parts = Math.ceil(words.length / WORDS_PER_LESSON)
      out.push({
        title:
          parts > 1
            ? `Kosakata Akademik ${sublist}.${part}`
            : `Kosakata Akademik ${sublist}`,
        words: chunk,
        sublist,
      })
    }
  })
  return out
}

export function totalAwlWords(): number {
  return AWL_SUBLISTS.reduce((a, s) => a + s.length, 0)
}
