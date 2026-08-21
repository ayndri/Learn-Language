import type { VocabTheme } from '@/lib/languages/vocab-theme'

/**
 * KOSAKATA INTI SPANYOL — A1 → C2, per tema.
 *
 * Batasannya sama jujurnya dengan tiga bahasa sebelumnya: ini bukan "semua kata
 * yang keluar di DELE". Yang ada di sini kosakata INTI — kata yang paling sering
 * dipakai di tiap tingkat, disusun per tema supaya bisa diperiksa mana yang
 * belum ada. Acuan pembagiannya inventario léxico Plan Curricular del Instituto
 * Cervantes; sisanya masuk lewat contoh kalimat dan bacaan.
 *
 * Dua hal yang membedakan daftar ini dari daftar Jepang/Korea/Mandarin:
 *
 * KATA BENDA DITULIS DENGAN ARTIKELNYA. `la mano`, bukan `mano` — karena gender
 * adalah bagian dari katanya, dan `mano` yang berakhir -o tapi feminin adalah
 * jenis kata yang paling sering dihafal salah. Artikelnya di sini berfungsi
 * sebagai penanda gender, jadi kartunya tidak bisa lahir salah.
 *
 * VERBA DITULIS DALAM INFINITIVO. `hablar`, bukan `hablo` — itu bentuk yang
 * dicari di kamus dan yang menjadi dasar seluruh konjugasinya. Golongan
 * konjugasinya (-ar/-er/-ir, atau tak beraturan) ikut di kartunya, bukan di
 * sini.
 */

const A1: VocabTheme[] = [
  { level: 'A1', title: 'Salam dan Sapaan', context: 'menyapa dan berpamitan', words: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'adiós', 'hasta luego', 'por favor', 'gracias', 'de nada', 'perdón', 'lo siento', 'mucho gusto'] },
  { level: 'A1', title: 'Diri dan Keluarga', context: 'memperkenalkan diri dan keluarga', words: ['la familia', 'el padre', 'la madre', 'el hijo', 'la hija', 'el hermano', 'la hermana', 'el abuelo', 'la abuela', 'el marido', 'la mujer', 'el nombre'] },
  { level: 'A1', title: 'Angka dan Waktu', context: 'menyebut jumlah dan jam', words: ['uno', 'dos', 'tres', 'cien', 'la hora', 'el minuto', 'el día', 'la semana', 'el mes', 'el año', 'hoy', 'mañana'] },
  { level: 'A1', title: 'Hari dan Bulan', context: 'membaca kalender', words: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo', 'enero', 'julio', 'diciembre', 'el fin de semana', 'el cumpleaños'] },
  { level: 'A1', title: 'Di Rumah', context: 'menjelaskan tempat tinggal', words: ['la casa', 'el piso', 'la habitación', 'la cocina', 'el baño', 'el salón', 'la puerta', 'la ventana', 'la mesa', 'la silla', 'la cama', 'la llave'] },
  { level: 'A1', title: 'Makanan', context: 'makan sehari-hari', words: ['la comida', 'el pan', 'el arroz', 'la carne', 'el pescado', 'el huevo', 'la fruta', 'la verdura', 'el queso', 'la sopa', 'la sal', 'el azúcar'] },
  { level: 'A1', title: 'Minuman dan Rasa', context: 'memesan minum', words: ['el agua', 'el café', 'el té', 'la leche', 'el zumo', 'la cerveza', 'el vino', 'rico', 'salado', 'dulce', 'caliente', 'frío'] },
  { level: 'A1', title: 'Warna dan Sifat', context: 'menggambarkan benda', words: ['el color', 'blanco', 'negro', 'rojo', 'azul', 'verde', 'grande', 'pequeño', 'nuevo', 'viejo', 'bonito', 'feo'] },
  { level: 'A1', title: 'Kota dan Tempat', context: 'menyebut lokasi', words: ['la ciudad', 'la calle', 'la tienda', 'el mercado', 'el banco', 'la farmacia', 'el hospital', 'la escuela', 'el restaurante', 'el hotel', 'la plaza', 'el parque'] },
  { level: 'A1', title: 'Bepergian', context: 'naik apa ke mana', words: ['el coche', 'el autobús', 'el tren', 'el avión', 'la bicicleta', 'el taxi', 'la estación', 'el aeropuerto', 'el billete', 'el viaje', 'la maleta', 'el mapa'] },
  { level: 'A1', title: 'Kata Kerja Harian', context: 'kegiatan sehari-hari', words: ['ser', 'estar', 'tener', 'ir', 'hacer', 'hablar', 'comer', 'beber', 'vivir', 'trabajar', 'estudiar', 'dormir'] },
  { level: 'A1', title: 'Letak dan Arah', context: 'menjelaskan posisi', words: ['aquí', 'allí', 'cerca', 'lejos', 'a la derecha', 'a la izquierda', 'delante', 'detrás', 'encima', 'debajo', 'al lado', 'entre'] },
]

const A2: VocabTheme[] = [
  { level: 'A2', title: 'Pekerjaan', context: 'menyebut profesi', words: ['el trabajo', 'la oficina', 'la empresa', 'el jefe', 'el compañero', 'el sueldo', 'la reunión', 'el horario', 'la entrevista', 'el médico', 'el profesor', 'el camarero'] },
  { level: 'A2', title: 'Tubuh dan Kesehatan', context: 'ke dokter', words: ['el cuerpo', 'la cabeza', 'el ojo', 'la mano', 'el pie', 'el estómago', 'la espalda', 'estar enfermo', 'doler', 'la fiebre', 'la medicina', 'la receta'] },
  { level: 'A2', title: 'Cuaca dan Musim', context: 'basa-basi cuaca', words: ['el tiempo', 'el sol', 'la lluvia', 'la nieve', 'el viento', 'la nube', 'hace calor', 'hace frío', 'la primavera', 'el verano', 'el otoño', 'el invierno'] },
  { level: 'A2', title: 'Pakaian dan Belanja', context: 'membeli barang', words: ['la ropa', 'la camisa', 'el pantalón', 'el vestido', 'el zapato', 'el abrigo', 'la talla', 'el precio', 'caro', 'barato', 'la oferta', 'probarse'] },
  { level: 'A2', title: 'Perasaan', context: 'menyampaikan suasana hati', words: ['contento', 'triste', 'enfadado', 'cansado', 'nervioso', 'preocupado', 'aburrido', 'sorprendido', 'tener miedo', 'tener ganas de', 'echar de menos', 'alegrarse'] },
  { level: 'A2', title: 'Sifat Orang', context: 'menggambarkan kepribadian', words: ['simpático', 'amable', 'serio', 'tímido', 'trabajador', 'perezoso', 'generoso', 'honesto', 'inteligente', 'divertido', 'tranquilo', 'el carácter'] },
  { level: 'A2', title: 'Rumah dan Perabot', context: 'menata dan menyewa rumah', words: ['el alquiler', 'mudarse', 'el mueble', 'el armario', 'la nevera', 'la lavadora', 'el sofá', 'la ducha', 'limpiar', 'ordenar', 'el vecino', 'el ascensor'] },
  { level: 'A2', title: 'Waktu Luang', context: 'hobi dan hiburan', words: ['el ocio', 'la película', 'la música', 'el libro', 'el deporte', 'nadar', 'correr', 'bailar', 'cantar', 'el concierto', 'la fiesta', 'quedar'] },
  { level: 'A2', title: 'Telepon dan Pesan', context: 'menghubungi orang', words: ['el teléfono', 'el móvil', 'llamar', 'colgar', 'el mensaje', 'contestar', 'dejar un recado', 'la dirección', 'el correo electrónico', 'enviar', 'recibir', 'la contraseña'] },
  { level: 'A2', title: 'Restoran', context: 'makan di luar', words: ['la carta', 'el primer plato', 'el postre', 'la propina', 'la cuenta', 'pedir', 'reservar', 'la mesa para dos', 'sin gluten', 'para llevar', 'el desayuno', 'la cena'] },
  { level: 'A2', title: 'Kata Keterangan', context: 'menghaluskan maksud', words: ['siempre', 'nunca', 'a veces', 'a menudo', 'ya', 'todavía', 'casi', 'demasiado', 'bastante', 'quizá', 'de repente', 'por fin'] },
]

const B1: VocabTheme[] = [
  { level: 'B1', title: 'Pendidikan', context: 'membicarakan studi', words: ['la carrera', 'la asignatura', 'el examen', 'aprobar', 'suspender', 'la nota', 'la beca', 'matricularse', 'graduarse', 'el título', 'la investigación', 'la biblioteca'] },
  { level: 'B1', title: 'Pendapat dan Diskusi', context: 'menyampaikan pandangan', words: ['la opinión', 'el punto de vista', 'estar de acuerdo', 'la razón', 'el motivo', 'discutir', 'convencer', 'dudar', 'suponer', 'aclarar', 'reconocer', 'el argumento'] },
  { level: 'B1', title: 'Masyarakat', context: 'membaca berita ringan', words: ['la sociedad', 'la cultura', 'la costumbre', 'la generación', 'la población', 'el ciudadano', 'el gobierno', 'la ley', 'el derecho', 'el problema', 'la solución', 'el cambio'] },
  { level: 'B1', title: 'Uang', context: 'mengatur keuangan', words: ['la cuenta', 'ahorrar', 'gastar', 'pagar a plazos', 'el préstamo', 'deber', 'la factura', 'el descuento', 'el impuesto', 'invertir', 'el presupuesto', 'devolver'] },
  { level: 'B1', title: 'Teknologi', context: 'memakai gawai dan internet', words: ['el ordenador', 'la pantalla', 'el archivo', 'descargar', 'guardar', 'borrar', 'buscar', 'la red', 'la aplicación', 'cargar', 'la avería', 'actualizar'] },
  { level: 'B1', title: 'Lingkungan', context: 'isu lingkungan', words: ['el medio ambiente', 'la contaminación', 'la basura', 'reciclar', 'el residuo', 'ahorrar energía', 'el clima', 'la sequía', 'proteger', 'el recurso', 'sostenible', 'el daño'] },
  { level: 'B1', title: 'Hubungan Sosial', context: 'berinteraksi', words: ['la relación', 'el malentendido', 'discutir', 'reconciliarse', 'confiar', 'apoyar', 'pedir un favor', 'rechazar', 'la promesa', 'la confianza', 'el respeto', 'colaborar'] },
  { level: 'B1', title: 'Kata Kerja Abstrak', context: 'menulis lebih formal', words: ['incluir', 'aumentar', 'disminuir', 'ofrecer', 'mantener', 'conseguir', 'evitar', 'permitir', 'suponer', 'lograr', 'mejorar', 'depender'] },
  { level: 'B1', title: 'Sifat Abstrak', context: 'menilai dengan tepat', words: ['importante', 'necesario', 'posible', 'evidente', 'suficiente', 'adecuado', 'complejo', 'concreto', 'habitual', 'sorprendente', 'grave', 'útil'] },
  { level: 'B1', title: 'Kesehatan dan Kebiasaan', context: 'menjaga tubuh', words: ['la salud', 'el hábito', 'hacer ejercicio', 'adelgazar', 'engordar', 'descansar', 'el estrés', 'la dieta', 'la vacuna', 'el síntoma', 'el tratamiento', 'recuperarse'] },
  { level: 'B1', title: 'Kata Penghubung', context: 'menyusun paragraf', words: ['además', 'sin embargo', 'en cambio', 'por lo tanto', 'aunque', 'a pesar de', 'mientras', 'en cuanto a', 'es decir', 'por ejemplo', 'en resumen', 'de hecho'] },
]

const B2: VocabTheme[] = [
  { level: 'B2', title: 'Politik dan Hukum', context: 'berita politik', words: ['el estado', 'la política', 'la medida', 'las elecciones', 'el partido', 'el parlamento', 'la sentencia', 'el juez', 'el delito', 'la reforma', 'la corrupción', 'la igualdad'] },
  { level: 'B2', title: 'Ekonomi', context: 'berita bisnis', words: ['la economía', 'la empresa', 'el mercado', 'la competencia', 'el beneficio', 'la pérdida', 'la crisis', 'el paro', 'la inversión', 'la exportación', 'el consumo', 'la deuda'] },
  { level: 'B2', title: 'Media dan Opini Publik', context: 'membaca kolom', words: ['los medios', 'la prensa', 'la noticia', 'el titular', 'la publicidad', 'la campaña', 'la opinión pública', 'denunciar', 'criticar', 'destacar', 'la polémica', 'el rumor'] },
  { level: 'B2', title: 'Sains dan Kesehatan', context: 'artikel ilmiah populer', words: ['la investigación', 'el estudio', 'el experimento', 'demostrar', 'la prueba', 'la célula', 'el gen', 'la vacuna', 'el contagio', 'el efecto secundario', 'la hipótesis', 'el hallazgo'] },
  { level: 'B2', title: 'Data dan Laporan', context: 'membaca laporan', words: ['la estadística', 'el porcentaje', 'la media', 'el dato', 'la encuesta', 'analizar', 'el resultado', 'la tendencia', 'el aumento', 'el descenso', 'suponer un', 'reflejar'] },
  { level: 'B2', title: 'Pikiran dan Kesadaran', context: 'tulisan reflektif', words: ['la conciencia', 'la percepción', 'el recuerdo', 'el prejuicio', 'el valor', 'la perspectiva', 'la actitud', 'la intención', 'el propósito', 'la impresión', 'el planteamiento', 'el enfoque'] },
  { level: 'B2', title: 'Kata Kerja Tulisan', context: 'dokumen dan laporan', words: ['llevar a cabo', 'plantear', 'destacar', 'implicar', 'suponer', 'derivar', 'fomentar', 'garantizar', 'ejercer', 'someter', 'atribuir', 'constatar'] },
  { level: 'B2', title: 'Teman Palsu', context: 'kata yang menipu penutur Indonesia dan Inggris', words: ['actualmente', 'realizar', 'asistir', 'sensible', 'éxito', 'embarazada', 'introducir', 'largo', 'librería', 'discutir', 'pretender', 'soportar'] },
  { level: 'B2', title: 'Kolokasi', context: 'pasangan kata yang harus tepat', words: ['tomar una decisión', 'prestar atención', 'hacer una pregunta', 'correr el riesgo', 'poner en marcha', 'dar lugar a', 'tener en cuenta', 'llamar la atención', 'sacar una foto', 'guardar silencio', 'echar una mano', 'darse cuenta'] },
]

const C1: VocabTheme[] = [
  { level: 'C1', title: 'Pemikiran Abstrak', context: 'esai dan filsafat', words: ['el pensamiento', 'la ideología', 'la creencia', 'la ética', 'la moral', 'la verdad', 'la contradicción', 'lo abstracto', 'lo concreto', 'la premisa', 'la libertad', 'el fundamento'] },
  { level: 'C1', title: 'Analisis dan Kritik', context: 'ulasan akademik', words: ['el planteamiento', 'la reflexión', 'la interpretación', 'la coherencia', 'refutar', 'sustentar', 'matizar', 'cuestionar', 'inferir', 'contrastar', 'la evidencia', 'la validez'] },
  { level: 'C1', title: 'Seni dan Sastra', context: 'kritik seni', words: ['la obra', 'el autor', 'el estilo', 'la metáfora', 'el símbolo', 'la trama', 'el personaje', 'la puesta en escena', 'el matiz', 'conmover', 'la sensibilidad', 'el legado'] },
  { level: 'C1', title: 'Perasaan Mendalam', context: 'prosa dan esai pribadi', words: ['la nostalgia', 'la añoranza', 'el desasosiego', 'el alivio', 'la resignación', 'el consuelo', 'el afán', 'la ilusión', 'el rencor', 'la ternura', 'la culpa', 'el asombro'] },
  { level: 'C1', title: 'Kata Sifat Bernuansa', context: 'penilaian dalam tulisan', words: ['notable', 'escaso', 'ingente', 'ambiguo', 'riguroso', 'contundente', 'sutil', 'imprescindible', 'inevitable', 'insólito', 'contraproducente', 'sesgado'] },
  { level: 'C1', title: 'Verba Formal', context: 'dokumen resmi', words: ['acometer', 'suscitar', 'incidir', 'esgrimir', 'aducir', 'propiciar', 'entrañar', 'subsanar', 'acatar', 'dirimir', 'paliar', 'vislumbrar'] },
]

const C2: VocabTheme[] = [
  { level: 'C2', title: 'Sejarah dan Peradaban', context: 'tulisan sejarah', words: ['la civilización', 'el imperio', 'el vestigio', 'heredar', 'la conquista', 'el auge', 'el declive', 'la fuente', 'el legado', 'el hito', 'la coyuntura', 'el precedente'] },
  { level: 'C2', title: 'Bahasa dan Linguistik', context: 'tulisan tentang bahasa', words: ['el léxico', 'la sintaxis', 'el dialecto', 'la etimología', 'la ortografía', 'el fonema', 'la traducción', 'la lengua materna', 'adquirir', 'el contexto', 'el registro', 'el acento'] },
  { level: 'C2', title: 'Idiom', context: 'percakapan dan tulisan populer', words: ['no tener pelos en la lengua', 'estar en las nubes', 'ser pan comido', 'meter la pata', 'tomar el pelo', 'dar en el clavo', 'echar leña al fuego', 'ponerse las botas', 'estar hecho polvo', 'irse por las ramas', 'dar largas', 'a duras penas'] },
  { level: 'C2', title: 'Peribahasa', context: 'tuturan sehari-hari', words: ['más vale tarde que nunca', 'no hay mal que por bien no venga', 'a caballo regalado no le mires el diente', 'en casa del herrero cuchillo de palo', 'quien mucho abarca poco aprieta', 'más vale prevenir que curar', 'a quien madruga Dios le ayuda', 'no por mucho madrugar amanece más temprano', 'el que no llora no mama', 'de tal palo tal astilla', 'agua pasada no mueve molino', 'cada loco con su tema'] },
  { level: 'C2', title: 'Penghubung Formal', context: 'menyusun tulisan akademik', words: ['por consiguiente', 'no obstante', 'asimismo', 'en aras de', 'habida cuenta de', 'a tenor de', 'en detrimento de', 'si bien', 'cuanto más', 'de ahí que', 'a la sazón', 'en definitiva'] },
]

export const ES_VOCAB_THEMES: VocabTheme[] = [...A1, ...A2, ...B1, ...B2, ...C1, ...C2]
