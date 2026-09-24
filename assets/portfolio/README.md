# Portofolio HDRG

Satu proyek = satu folder. Gunakan huruf kecil dan tanda hubung, misalnya `expo-konstruksi-jatim`.

| Isi folder proyek | Fungsi |
| --- | --- |
| `cover.webp` | Thumbnail galeri; rekomendasi 1600 × 1200 px |
| `01-opening.webp` | Gambar detail pertama |
| `02-process.webp` | Gambar detail berikutnya |
| `03-result.webp` | Gambar detail berikutnya |
| `project.json` | Judul, kategori, cerita, urutan, kredit; opsional |

**Cara termudah:** buka [Panel admin](https://hdrgcreativepartner-del.github.io/porto/admin/) → **Proyek baru**, lalu isi formulir dan unggah gambar. Folder serta `project.json` dibuat otomatis.

**Unggah lewat GitHub:** siapkan folder proyek di komputer → drag folder ke halaman **Add file → Upload files** dalam folder `assets/portfolio` → **Commit changes**. Tunggu publikasi GitHub Pages selesai.

Lebar gambar detail **1600 px**, tinggi bebas. Untuk cerita panjang, ekspor menjadi beberapa gambar dengan tinggi sekitar **1000–2400 px** per potongan. Detail tampil sesuai rasio asli tanpa dipotong. Cover ditampilkan dengan rasio 4:3 dan boleh terpotong di tepinya.

Format JPG / PNG / WebP / AVIF / SVG. Target cover di bawah 500 KB dan detail di bawah 1 MB per gambar. Panel admin membatasi 4 MB per file dan 20 MB unggahan baru per penyimpanan.

- Tanpa `project.json`, judul diambil dari nama folder, kategori Brand & Design, urutan gambar mengikuti nama file.
- `cover.*` tidak diulang dalam isi proyek. Bila hanya ada cover, cover menjadi satu-satunya gambar detail.
- Tanpa cover, gambar pertama menjadi thumbnail.
- `project.json` dapat menentukan urutan, alt, caption, dan kategori. Gambar tambahan yang belum ada di metadata tetap ditambahkan otomatis.
- Folder `_template` adalah contoh; tidak ditampilkan di website.
- Hapus folder proyek untuk menghapusnya dari katalog. Atau matikan **Tampilkan di website** melalui panel admin untuk menyembunyikannya.
- Repo bersifat publik: proyek yang disembunyikan tetap dapat diakses melalui file repo.

Enam folder proyek yang sudah terisi adalah karya dan eksplorasi yang sebelumnya sudah ada pada website HDRG, dipindahkan ke struktur ini agar bisa diedit melalui panel.

[Panduan lengkap](../../PANDUAN-UPLOAD.md)


## Video

Panel admin menerima tautan YouTube serta unggahan MP4/WebM (maksimum 25 MB per video, total media baru 50 MB per simpan). Gunakan cover gambar 1600 × 1200 px. Foto dan video dapat diurutkan bersama melalui bagian **Foto & video**. Untuk video panjang, gunakan YouTube. Lihat [panduan video](../../PANDUAN-UPLOAD.md#menambahkan-video). File MP4/WebM yang diunggah langsung ke folder proyek juga ditemukan otomatis.
