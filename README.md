# HDRG Creative Partner

Landing page dan portofolio resmi HDRG Creative Partner. Situs statis, responsif, tanpa instalasi paket, tanpa backend, dan siap untuk GitHub Pages atau hosting biasa.

## Menjalankan

Buka `index.html`, atau jalankan server lokal dari folder ini:

```sh
python3 -m http.server 8000
```

Kemudian buka `http://localhost:8000`.

## Mengaktifkan GitHub Pages

1. Buka **Settings → Pages** pada repositori `hdrgcreativepartner-del/porto`.
2. Pilih **Deploy from a branch** sebagai Source.
3. Pilih branch **main**, folder **/ (root)**, lalu **Save**.
4. Alamat situs setelah deployment berhasil: `https://hdrgcreativepartner-del.github.io/porto/`.

File `.nojekyll` membuat aset disajikan sebagai file statis. Tidak diperlukan proses build atau GitHub Actions tambahan. Perubahan berikutnya pada `main` akan diterbitkan oleh GitHub Pages setelah pengaturan di atas aktif.

## Isi situs

- Hero dengan logo resmi dan eksplorasi visual HDRG.
- Enam entri portofolio dengan filter kategori dan dialog detail proyek.
- Layanan, profil, proses kerja, serta kontak.
- Formulir brief yang membuka draft WhatsApp; tidak otomatis mengirim pesan, tidak menyimpan data formulir, dan tidak membutuhkan backend.
- Menu mobile, navigasi keyboard, Escape untuk menutup dialog, reduced-motion support, metadata Open Graph dan JSON-LD.
- Halaman 404.

## Mengubah konten

| File / folder | Isi |
| --- | --- |
| `index.html` | Teks landing page, layanan, profil, kontak, metadata SEO |
| `content.js` | Daftar proyek, kategori, deskripsi, dan nomor WhatsApp |
| `app.js` | Filter, detail proyek, menu mobile, draft WhatsApp |
| `styles.css` | Layout, responsivitas, dan warna brand |
| `assets/brand/` | Enam logo asli pemilik brand, favicon, social card |
| `assets/work/` | Salinan aset portofolio yang dioptimalkan ke WebP |

Tambahkan proyek dengan menyalin satu objek dalam `window.HDRG.projects` pada `content.js`. Setiap `id` harus unik. Gunakan kategori `design`, `event`, `digital`, atau `lab`. Gunakan jalur aset relatif `./assets/work/nama-file.webp`. Jumlah karya dihitung otomatis.

Jika mengubah nomor kontak, perbarui `whatsapp` di `content.js` dan fallback link serta metadata `telephone` di `index.html`. Jika pindah domain atau direktori, perbarui canonical, Open Graph, JSON-LD, dan tautan beranda di `404.html`.

## Identitas & konteks karya

Warna biru `#2563eb` mengikuti logo yang disediakan. Kontak bisnis yang digunakan: **+62 857 4689 4195**, **hdrg.creativepartner@gmail.com**, dan **@hdrg.creativepartner**.

Galeri membedakan proyek, identitas brand, prototipe, dan eksplorasi konsep. Materi IDNOG adalah desain publikasi/layout dokumentasi; situs tidak mengklaim kepemilikan fotografi di dalam materi. Mechanical Elephant, tipografi Peering, serta visualisasi panggung diberi penjelasan sebagai eksplorasi berbantuan AI. Smart Santri ditampilkan sebagai prototipe/trial.

Hak atas logo dan materi proyek tetap pada pemilik masing-masing. Tidak ada lisensi open-source yang diberikan untuk aset visual.
