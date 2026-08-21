/**
 * PERCAKAPAN SPANYOL — kalimat siap pakai per situasi.
 *
 * Alasan bagian ini ada berbeda lagi dari tiga bahasa sebelumnya. Untuk Korea
 * karena tingkat tutur; untuk Mandarin karena bahasa percakapan hampir tidak
 * sama dengan bahasa buku. Untuk bahasa Spanyol alasannya: **satu ungkapan
 * bisa benar di satu negara dan aneh — atau kasar — di negara lain.**
 *
 * `coger el autobús` normal di Spanyol dan tidak bisa diucapkan di Argentina.
 * `¿Qué tal?` di Spanyol, `¿Qué onda?` di Meksiko, `¿Qué más?` di Kolombia.
 * `ustedes` di seluruh Amerika Latin, `vosotros` di Spanyol. Dan `vos hablás`
 * bukan kesalahan `tú hablas` — itu sistem tersendiri yang dipakai puluhan juta
 * orang. Dua puluh negara memakai bahasa ini sebagai bahasa resmi, dan
 * memperlakukan salah satunya sebagai "yang benar" adalah cara tercepat membuat
 * pelajar terdengar aneh di tempat yang salah.
 *
 * Karena itu tiap pelajaran di sini menyebutkan bukan cuma kalimatnya, tapi
 * juga di mana kalimat itu wajar diucapkan — dan mana yang aman dipakai
 * di mana pun.
 *
 * Yang dilatih di sini bukan aturan, tapi UCAPAN: rangkaian tetap yang memang
 * keluar dari mulut penutur asli, beserta tingkat keformalannya. Karena itu
 * jenis latihannya pun berbeda — tidak ada soal mengisi lubang; yang ada
 * ungkapan, terjemahan kalimat, dikte, dan berbicara.
 */

export type ConversationLesson = {
  level: string
  title: string
  /** ungkapan tetap yang wajib tercakup — ditulis apa adanya */
  focus: string
  context: string
}

export const ES_CONVERSATION: ConversationLesson[] = [
  // ------------------------------------------------------------------ A1
  {
    level: 'A1',
    title: 'Menyapa',
    focus:
      '¡Hola! · Buenos días / Buenas tardes / Buenas noches (dan batas waktunya: tardes mulai ' +
      'setelah makan siang, bukan jam 12) · ¿Qué tal? · ¿Cómo estás? / ¿Cómo está usted? · ' +
      'Adiós · Hasta luego (yang jauh lebih sering dipakai daripada adiós) · Nos vemos',
    context: 'menyapa dan berpamitan setiap hari',
  },
  {
    level: 'A1',
    title: 'Memperkenalkan Diri',
    focus:
      'Me llamo… · Soy… · Soy de Indonesia · Vivo en… · Tengo … años · Encantado / Encantada ' +
      '(berubah menurut gender PENUTURNYA) · Mucho gusto · ¿Y tú? — beserta dua nama keluarga ' +
      'yang lazim di dunia berbahasa Spanyol',
    context: 'perkenalan pertama di kelas atau kantor',
  },
  {
    level: 'A1',
    title: 'Terima Kasih dan Maaf',
    focus:
      'Gracias · Muchas gracias · De nada · No hay de qué · Perdón (menyenggol orang) vs ' +
      'Lo siento (menyesal) vs Disculpe (memanggil orang, minta jalan) — tiga "maaf" yang ' +
      'tidak bisa saling ditukar · Con permiso',
    context: 'menanggapi bantuan dan kesalahan',
  },
  {
    level: 'A1',
    title: 'Di Kelas',
    focus:
      '¿Puede repetir, por favor? · Más despacio, por favor · No entiendo · ¿Cómo se dice … en ' +
      'español? · ¿Qué significa…? · ¿Cómo se escribe? · Tengo una pregunta · Perdón por llegar tarde',
    context: 'bertahan di kelas bahasa Spanyol',
  },
  {
    level: 'A1',
    title: 'Di Restoran',
    focus:
      '¿Tiene mesa para dos? · La carta, por favor · Para mí, … · Yo quiero… · ¿Qué me ' +
      'recomienda? · Sin cebolla, por favor · La cuenta, por favor · ¿Está incluido el servicio? · ' +
      'Camarero (Spanyol) vs mesero (Amerika Latin)',
    context: 'memesan makan dari awal sampai bayar',
  },
  {
    level: 'A1',
    title: 'Berbelanja',
    focus:
      '¿Cuánto cuesta? · ¿Cuánto es? · Es muy caro · ¿Tiene otra talla? · ¿Puedo probármelo? · ' +
      '¿Puedo pagar con tarjeta? · Solo estoy mirando · Me lo llevo',
    context: 'membeli barang di pasar dan toko',
  },
  {
    level: 'A1',
    title: 'Menanyakan Arah',
    focus:
      'Perdone, ¿dónde está…? · ¿Cómo llego a…? · ¿Está lejos de aquí? · Siga todo recto · ' +
      'Gire a la derecha / a la izquierda · ¿Cuánto se tarda? · Estoy perdido / perdida',
    context: 'tersesat dan mencari tempat',
  },

  // ------------------------------------------------------------------ A2
  {
    level: 'A2',
    title: 'Bertelepon',
    focus:
      '¿Sí? / ¿Diga? (Spanyol) · ¿Bueno? (Meksiko) · ¿Aló? (Amerika Selatan) — sapaan telepon ' +
      'yang berbeda tiap negara · ¿Está…? · ¿De parte de quién? · Un momento, por favor · ' +
      'No está en este momento · ¿Le puedo dejar un recado? · Se ha equivocado',
    context: 'menelepon kantor dan menitip pesan',
  },
  {
    level: 'A2',
    title: 'Membuat Janji',
    focus:
      '¿Cuándo estás libre? · ¿Te va bien el jueves? · ¿A qué hora quedamos? · ¿Dónde nos ' +
      'vemos? · Quedamos a las siete · Voy a llegar un poco tarde · ¿Lo dejamos para otro día? · ' +
      'quedar (Spanyol) ≠ quedarse — perbedaan yang mengubah artinya',
    context: 'mengatur waktu bertemu',
  },
  {
    level: 'A2',
    title: 'Transportasi',
    focus:
      '¿Este autobús va a…? · Un billete de ida y vuelta · ¿En qué parada me bajo? · ¿Me puede ' +
      'avisar? · ¿Cuánto es hasta el centro? · A esta dirección, por favor · ' +
      'coger el autobús (Spanyol) vs tomar el autobús — dan kenapa coger TIDAK boleh dipakai ' +
      'di Argentina, Meksiko, dan beberapa negara lain',
    context: 'bus, kereta, dan taksi',
  },
  {
    level: 'A2',
    title: 'Ke Dokter',
    focus:
      'No me siento bien · Me duele la cabeza / el estómago · Tengo fiebre · Me encuentro mal · ' +
      '¿Desde cuándo? · Soy alérgico a… · ¿Cuántas veces al día? · ¿Antes o después de las comidas?',
    context: 'menjelaskan keluhan dan memahami resep',
  },
  {
    level: 'A2',
    title: 'Di Rumah Orang',
    focus:
      '¿Se puede? · Pasa, pasa · Siéntate · ¿Quieres tomar algo? · No, gracias, de verdad · ' +
      'Está buenísimo · Bueno, me voy a ir ya · Gracias por todo · A ver si nos vemos pronto',
    context: 'bertamu dan menerima tamu',
  },
  {
    level: 'A2',
    title: 'Basa-basi Sehari-hari',
    focus:
      '¿Qué tal el fin de semana? · Bien, como siempre · ¡Cuánto tiempo! · ¿Qué hay de nuevo? · ' +
      'Nada nuevo · ¡Qué calor hace! · Que te vaya bien · Cuídate — dan ragam ¿Qué onda? ' +
      '(Meksiko), ¿Qué más? (Kolombia), ¿Cómo andás? (Argentina)',
    context: 'mengobrol sebentar dengan tetangga dan rekan kerja',
  },

  // ------------------------------------------------------------------ B1
  {
    level: 'B1',
    title: 'Meminta dan Menolak',
    focus:
      '¿Me podrías hacer un favor? · ¿Te importaría…? · ¿Sería posible…? (condicional sebagai ' +
      'pelunak — bahasa Spanyol melunakkan dengan KALA, bukan dengan menambah kata "tolong") · ' +
      'Me temo que no · Ojalá pudiera · Es que… (pembuka penolakan yang hampir wajib)',
    context: 'meminta bantuan dan menolak tanpa menyinggung',
  },
  {
    level: 'B1',
    title: 'Menyampaikan Pendapat',
    focus:
      'Creo que… · Me parece que… · Desde mi punto de vista… · En mi opinión… · ' +
      'Estoy de acuerdo contigo · No estoy del todo de acuerdo · Depende · ' +
      'dan aturan modus yang menyertainya: creo que VIENE tapi no creo que VENGA',
    context: 'diskusi santai dan rapat kecil',
  },
  {
    level: 'B1',
    title: 'Menyewa dan Mengurus Rumah',
    focus:
      '¿Cuánto es el alquiler? · ¿Están incluidos los gastos? · ¿Cuántos meses de fianza? · ' +
      '¿Puedo ver el piso? · ¿Cuándo puedo mudarme? · Se ha roto el… · ¿Podría venir a arreglarlo?',
    context: 'mencari tempat tinggal',
  },
  {
    level: 'B1',
    title: 'Bercerita',
    focus:
      'Pues resulta que… · Total, que… · Y entonces… · De repente… · Al final… · ' +
      '¿Y sabes qué pasó? · No te lo vas a creer — penanda cerita lisan, beserta pergantian ' +
      'indefinido dan imperfecto yang menjaga alurnya',
    context: 'menceritakan kejadian dengan hidup',
  },
  {
    level: 'B1',
    title: 'Mengeluh dan Menyelesaikan Masalah',
    focus:
      'Quería poner una reclamación · Esto no es lo que pedí · ¿Me lo puede cambiar? · ' +
      'Quiero que me devuelvan el dinero · Llevo media hora esperando · Entiendo, pero… · ' +
      'Quisiera hablar con el encargado',
    context: 'komplain di toko, hotel, dan layanan',
  },

  // ------------------------------------------------------------------ B2
  {
    level: 'B2',
    title: 'Wawancara Kerja',
    focus:
      'Háblame de ti · ¿Por qué te interesa este puesto? · Mi punto fuerte es… · ' +
      'Como punto débil, diría que… · Tengo experiencia en… · ¿Cuáles serían mis funciones? · ' +
      '¿Cuál es el salario? · ¿Cuándo podría empezar? · el currículum · la carta de presentación',
    context: 'melamar kerja dalam bahasa Spanyol',
  },
  {
    level: 'B2',
    title: 'Rapat dan Kerja Sama',
    focus:
      'Si me permiten… · Voy a exponer brevemente… · En cuanto a lo que decías… · ' +
      'Quisiera añadir un matiz · ¿Podrías concretar? · ¿Nos ponemos de acuerdo en…? · ' +
      'Lo dejamos así entonces · ¿Quién se encarga de esto?',
    context: 'rapat kantor dan koordinasi kerja',
  },
  {
    level: 'B2',
    title: 'Berdebat dengan Sopan',
    focus:
      'Entiendo tu postura, pero… · No lo veo así · Eso es discutible · Con todos mis respetos… · ' +
      'Precisamente por eso… · Ahí te doy la razón · Habría que matizar eso · ' +
      'Dejémoslo en que cada uno tiene su opinión',
    context: 'diskusi serius dan debat',
  },
  {
    level: 'B2',
    title: 'Kabar Baik dan Buruk',
    focus:
      '¡Enhorabuena! (Spanyol) · ¡Felicidades! · ¡Cuánto me alegro! · Te acompaño en el ' +
      'sentimiento · Lo siento muchísimo · Si necesitas algo, aquí estoy · Ánimo · ' +
      'Ya verás que todo se soluciona',
    context: 'mengucapkan selamat dan menghibur',
  },
  {
    level: 'B2',
    title: 'Adat dan Etiket',
    focus:
      'Dos besos sebagai salam di Spanyol (dan satu di Amerika Latin) — kapan berlaku dan kapan ' +
      'tidak · jam makan yang jauh lebih malam · sobremesa · brindis: ¡Salud! · pagar a escote / ' +
      'ir a medias · siapa yang membayar kalau mengajak · tuteo langsung yang normal di Spanyol ' +
      'tapi kasar di beberapa negara Amerika Latin',
    context: 'jamuan makan, undangan, dan pertemuan sosial',
  },

  // ------------------------------------------------------------------ C1
  {
    level: 'C1',
    title: 'Presentasi dan Pidato',
    focus:
      'Buenos días a todos, hoy voy a hablar de… · En primer lugar… · Cabe destacar que… · ' +
      'Como acabo de señalar… · Permítanme un ejemplo · Para concluir… · ' +
      'Muchas gracias por su atención, quedo a su disposición para preguntas',
    context: 'presentasi kerja dan kuliah',
  },
  {
    level: 'C1',
    title: 'Bahasa Lisan Sehari-hari',
    focus:
      '¿En serio? · ¡No me digas! · Qué exagerado · Ni de broma · Vaya… · O sea… · ' +
      'Es que no me da la vida · Estoy hecho polvo · Me da igual · ' +
      'plus vale/venga (Spanyol), órale (Meksiko), dale (Argentina), chévere/bacano — ' +
      'dan kenapa semua ini TIDAK boleh masuk tulisan formal',
    context: 'memahami serial, film, dan obrolan sehari-hari',
  },
  {
    level: 'C1',
    title: 'Surat dan Email Resmi',
    focus:
      'Estimado señor / Estimada señora · Muy señores míos · Le escribo en relación con… · ' +
      'Le agradecería que… (subjuntivo!) · Quedo a la espera de su respuesta · ' +
      'Atentamente / Un cordial saludo — dan bedanya dengan penutup email santai (Un abrazo)',
    context: 'surat lamaran, keluhan resmi, dan korespondensi kerja',
  },

  // ------------------------------------------------------------------ C2
  {
    level: 'C2',
    title: 'Maksud Tersirat',
    focus:
      'Kalimat yang artinya bukan bunyinya: Ya veremos (= tidak) · Está complicado (= tidak ' +
      'bisa) · Si tú lo dices… · No está mal (litotes: sebenarnya bagus) · Bueno, bueno… · ' +
      'Tú mismo (= terserah, dan tanggung sendiri) · ¡Anda ya! — ironi lewat nada dan urutan kata',
    context: 'membaca maksud di balik kalimat sopan',
  },
  {
    level: 'C2',
    title: 'Ragam Antarnegara',
    focus:
      'Kata yang berubah arti — atau jadi kasar — antarnegara: coger, concha, pico, chucho, ' +
      'guagua, torta · sapaan dan konjugasi voseo (vos tenés, vení) · perbedaan kosakata ' +
      'sehari-hari (ordenador/computadora, móvil/celular, zumo/jugo, coche/carro/auto) · ' +
      'dan cara aman menanyakannya',
    context: 'berbicara dengan penutur dari negara yang berbeda',
  },
]
