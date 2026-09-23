/* Kontak dan katalog cadangan. Konten aktif dibaca otomatis dari assets/portfolio/.
   Gunakan panel admin atau PANDUAN-UPLOAD.md untuk memperbarui karya. */
window.HDRG = {
  whatsapp: '6285746894195',
  projects: [
    {
      id: 'idnog-11', title: 'IDNOG 11', subtitle: 'Connecting networks. Creating impact.', year: '2026',
      categories: ['design', 'event'], label: 'Event visual · Campaign design', type: 'Proyek', layout: 'posters',
      cover: './assets/work/idnog-speaker.webp', secondary: './assets/work/idnog-conference.webp',
      alt: 'Desain publikasi pembicara dan dokumentasi konferensi IDNOG 11',
      summary: 'Bahasa visual yang konsisten untuk pertemuan komunitas operator jaringan Indonesia—dari komunikasi sebelum acara sampai momen di atas panggung.',
      description: 'Pengembangan materi publikasi, konten sosial media, dan visual acara untuk IDNOG 11 serta Peering Nusantara 2. Pendekatan visual mempertemukan karakter teknologi dengan informasi yang jelas dan mudah dikenali.',
      scope: ['Desain materi publikasi & speaker', 'Konten dan perencanaan sosial media', 'Bumper opening & visual acara'],
      note: 'Galeri menampilkan materi publikasi dan layout dokumentasi acara. Foto di dalam layout merupakan dokumentasi kegiatan IDNOG; lingkup yang ditampilkan di sini adalah pengolahan desain dan komunikasi visual.',
      images: [
        {src:'./assets/work/idnog-speaker.webp', alt:'Materi speaker Gideon Hoe untuk IDNOG 11'},
        {src:'./assets/work/idnog-speaker-nokia.webp', alt:'Materi speaker Songkhram Sundaranu untuk IDNOG 11'},
        {src:'./assets/work/idnog-conference.webp', alt:'Layout dokumentasi konferensi hari pertama'},
        {src:'./assets/work/idnog-event.webp', alt:'Layout dokumentasi opening speech IDNOG 11'}
      ]
    },
    {
      id:'peering', title:'Make Peering Great Again', subtitle:'A message with character.', year:'2026',
      categories:['design','lab'], label:'Typography · Creative exploration', type:'Eksplorasi', layout:'peering',
      cover:'./assets/work/peering.webp', alt:'Eksplorasi tipografi Make Peering Great Again hitam di atas putih',
      summary:'Pesan singkat dengan kepribadian yang kuat. Eksplorasi tipografi untuk semangat kolaborasi komunitas peering.',
      description:'Permainan bentuk, ritme, dan skala huruf menghadirkan komposisi yang ekspresif. Eksplorasi ini menguji bagaimana sebuah pesan komunitas bisa tampil sebagai visual yang punya karakter sendiri.',
      scope:['Eksplorasi tipografi','Arah visual kampanye','AI-assisted creative exploration'],
      note:'Karya eksplorasi visual berbantuan AI. Ditampilkan sebagai studi konsep, bukan klaim aplikasi final pada acara atau merchandise.',
      images:[{src:'./assets/work/peering.webp',alt:'Komposisi lengkap eksplorasi tipografi Make Peering Great Again'}]
    },
    {
      id:'mechanical-elephant', title:'Mechanical Elephant', subtitle:'Power, reimagined.', year:'2026',
      categories:['lab'], label:'AI art direction · Character exploration', type:'Creative Lab', layout:'elephant',
      cover:'./assets/work/mechanical-elephant.webp', alt:'Gajah mekanis sinematik dengan aksen emas',
      summary:'Pertemuan karakter organik dan estetika teknologi. Eksplorasi karakter yang dirancang untuk menarik perhatian sejak pandangan pertama.',
      description:'Detail metal, cahaya keemasan, dan komposisi simetris membangun karakter yang kuat dan dramatis. Studi ini mengeksplorasi potensi visual berbantuan AI sebagai titik awal pengembangan aset kreatif.',
      scope:['Konsep karakter','AI art direction & prompting','Eksplorasi atmosfer sinematik'],
      note:'Eksplorasi visual berbantuan AI. Gambar diam, bukan cuplikan animasi atau dokumentasi produksi.',
      images:[{src:'./assets/work/mechanical-elephant.webp',alt:'Detail keseluruhan karakter Mechanical Elephant'}]
    },
    {
      id:'smart-santri',title:'Smart Santri',subtitle:'A thoughtful digital learning space.',year:'2026',
      categories:['digital'],label:'Web app · Education',type:'Prototipe',layout:'digital',
      cover:'./assets/work/smart-santri.webp',alt:'Tampilan landing page Smart Santri, portal digital sekolah',
      summary:'Ruang digital yang mempertemukan absensi, pembelajaran, dan informasi sekolah dalam satu pengalaman yang mudah dipahami.',
      description:'Pengembangan prototipe aplikasi sekolah dengan landing page, absensi siswa dan guru, ruang belajar, materi dan tugas, ekstrakurikuler, serta kabar sekolah. Dirancang untuk menjembatani kebutuhan sekolah dan keseharian penggunanya.',
      scope:['Landing page & antarmuka','Struktur portal sekolah','Prototipe aplikasi web'],
      note:'Status: prototipe / trial. Tangkapan layar menampilkan versi percobaan dengan data contoh, bukan sistem produksi yang telah terimplementasi di sekolah.',
      link:{url:'https://github.com/hdrgcreativepartner-del/smartsantri',label:'Lihat proyek di GitHub'},
      images:[{src:'./assets/work/smart-santri.webp',alt:'Pratinjau halaman beranda Smart Santri'}]
    },
    {
      id:'stage-concept',title:'Stage & Visual Experience',subtitle:'A bigger canvas for ideas.',year:'2026',
      categories:['event','lab'],label:'Stage visualization · Concept',type:'Konsep',layout:'stage',
      cover:'./assets/work/stage-concept.webp',alt:'Konsep panggung bergerak dengan susunan LED dan pencahayaan merah',
      summary:'Eksplorasi hubungan antara panggung, susunan LED, pencahayaan, dan penonton dalam satu pengalaman visual.',
      description:'Visualisasi membantu membayangkan komposisi panggung sebelum masuk ke pengembangan teknis. Studi ini berfokus pada bentuk, pembagian layar, dan atmosfer acara sebagai bahan diskusi arah kreatif.',
      scope:['Konsep komposisi panggung','Eksplorasi tata letak LED','AI-assisted visualization'],
      note:'Visualisasi konsep berbantuan AI, bukan foto acara yang telah diproduksi atau gambar kerja konstruksi.',
      images:[{src:'./assets/work/stage-concept.webp',alt:'Visualisasi utuh konsep panggung bergerak dengan LED'}]
    },
    {
      id:'hdrg-identity',title:'HDRG Creative Partner',subtitle:'An identity, with purpose.',year:'IDENTITY',
      categories:['design'],label:'Brand identity · Own brand',type:'Identitas brand',layout:'identity',
      cover:'./assets/brand/hdrg-white.png',alt:'Logo resmi HDRG Creative Partner',
      summary:'Satu identitas untuk berbagai disiplin kreatif. Sistem logo HDRG Creative Partner dalam versi utama dan monokrom.',
      description:'Identitas HDRG membawa pendekatan yang tegas dan fleksibel. Simbol yang ringkas berpadu dengan wordmark untuk penggunaan pada media digital, materi publikasi, dan kebutuhan presentasi.',
      scope:['Identitas HDRG Creative Partner','Logo utama','Aplikasi logo monokrom'],
      note:'Menggunakan aset logo resmi HDRG yang disediakan oleh pemilik brand.',
      images:[{src:'./assets/brand/hdrg-color.png',alt:'Logo utama HDRG Creative Partner',className:'logo-on-dark'},{src:'./assets/brand/hdrg-white.png',alt:'Logo putih HDRG Creative Partner',className:'logo-on-blue'},{src:'./assets/brand/hdrg-black.png',alt:'Logo hitam HDRG Creative Partner',className:'logo-on-white'}]
    }
  ]
};
