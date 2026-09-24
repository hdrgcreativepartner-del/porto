# HDRG Creative Partner

Landing page dan portofolio resmi HDRG Creative Partner, dengan halaman studi kasus serta panel admin untuk memperbarui konten langsung ke GitHub.

- **Website:** https://hdrgcreativepartner-del.github.io/porto/
- **Panel admin:** https://hdrgcreativepartner-del.github.io/porto/admin/
- **Panduan upload dan ukuran:** [PANDUAN-UPLOAD.md](PANDUAN-UPLOAD.md)
- **Folder logo klien:** [assets/clients](assets/clients/)
- **Folder portofolio:** [assets/portfolio](assets/portfolio/)

## Update konten

Gunakan panel admin untuk menambah/edit karya, mengunggah cover, mengurutkan foto/video, menambahkan embed YouTube, menulis caption, dan mengelola logo. Login menggunakan fine-grained GitHub token untuk repo `porto` dengan izin Contents read/write. Token hanya berada di memori tab; tidak ada token atau password yang disimpan dalam repo.

Alternatif: unggah langsung ke folder GitHub dan commit ke `main`. Satu folder per proyek; `cover.webp`, `01.webp`, `02.webp`, serta `project.json` opsional. GitHub Pages membuat indeks unggahan otomatis pada setiap publikasi. Karya baru tidak memerlukan perubahan kode.

## Menjalankan lokal

```sh
python3 scripts/preview.py
```

Buka http://localhost:8000. Server kecil ini menyediakan indeks file lokal dengan format yang sama dengan hasil build GitHub Pages. Tidak perlu instalasi paket. Bila menggunakan server statis biasa tanpa Jekyll, website memakai katalog cadangan enam karya lama dari `content.js`.

## GitHub Pages

Pengaturan: **Settings → Pages → Deploy from a branch → main → / (root)**.

`media-index.json` diproses oleh Jekyll bawaan GitHub Pages dengan mengumpulkan `site.static_files`. **Jangan menambahkan `.nojekyll`** karena indeks unggahan memerlukan proses ini. HTML/CSS/JS tetap statis; tidak ada backend, database, token build, atau workflow khusus. `_config.yml` mengecualikan dokumentasi, skrip lokal, dan template dari website.

## Struktur kode

| File / folder | Fungsi |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | Landing page, galeri, filter, menu mobile, draft WhatsApp |
| `project.html`, `project.js` | Studi kasus vertikal, perbesar gambar, tautan proyek |
| `media.js` | Validasi URL YouTube, format media, dan pembuatan player |
| `catalog.js`, `media-index.json` | Membaca folder unggahan otomatis |
| `content.js` | Nomor WhatsApp dan katalog cadangan bila indeks tidak tersedia |
| `admin/` | Editor konten dan klien; autentikasi GitHub melalui token |
| `assets/portfolio/` | Proyek aktif beserta metadata |
| `assets/clients/` | Logo klien, ditampilkan otomatis |
| `assets/brand/` | Logo resmi HDRG, favicon, social card |
| `assets/work/` | Aset versi awal, dipertahankan untuk kompatibilitas tautan |

Admin membaca kondisi terbaru dari GitHub, menyimpan semua perubahan sebagai satu commit, lalu memperbarui `main` tanpa force push. Bila head repo berubah sejak dibuka, penyimpanan dihentikan agar pembaruan lain tidak tertimpa. Panel hanya mengelola jalur aset konten. Izin sebenarnya tetap ditegakkan oleh GitHub.

## Identitas dan konteks

Identitas biru `#245eec`, logo asli HDRG Creative Partner, tagline “From ideas to visual experiences.” Kontak: +62 857 4689 4195, hdrg.creativepartner@gmail.com, @hdrg.creativepartner. Berbasis di Jember sejak 2012.

Materi IDNOG menampilkan desain publikasi/layout dokumentasi, bukan klaim kepemilikan fotografi di dalamnya. Mechanical Elephant, tipografi Peering, dan visualisasi panggung diberi penjelasan sebagai eksplorasi berbantuan AI. Smart Santri berstatus prototipe. Tidak ada testimoni, klien, atau angka hasil baru yang dikarang. Logo klien menunggu aset resmi dari pemilik.

Hak atas logo dan materi visual tetap pada pemilik masing-masing. Tidak ada lisensi open-source untuk aset visual. Form brief membuka draft WhatsApp tanpa mengirim otomatis atau menyimpan data formulir.


## Pemeriksaan media

Jalankan `node --test tests/media.test.cjs` untuk memeriksa validasi tautan YouTube, urutan campuran, penemuan video, dan kompatibilitas metadata gambar lama.
