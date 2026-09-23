# Mengelola website HDRG Creative Partner

Website: https://hdrgcreativepartner-del.github.io/porto/  
Panel admin: https://hdrgcreativepartner-del.github.io/porto/admin/

## Cara paling mudah: panel admin

1. Buka panel admin dan hubungkan akun dengan **fine-grained personal access token GitHub**.
2. Pilih **Portofolio → Proyek baru**, atau klik karya lama untuk mengedit.
3. Isi judul, deskripsi, kategori, dan klien. Unggah cover serta gambar detail. Gunakan ↑ ↓ untuk mengurutkan.
4. Klik **Simpan ke GitHub**. Satu pembaruan berisi semua gambar dan metadata akan disimpan ke branch `main`.
5. Tunggu proses publikasi GitHub Pages selesai. Lihat perkembangannya pada tautan **Status publikasi GitHub** di footer admin. Biasanya beberapa menit; durasi tergantung GitHub.

Untuk logo: pilih **Logo klien → Tambah logo klien → Simpan logo ke GitHub**. Nama dan latar logo bisa diubah dari panel.

### Membuat token untuk akses admin

- Buka https://github.com/settings/personal-access-tokens/new menggunakan akun pemilik repo.
- Pilih resource owner **hdrgcreativepartner-del**.
- Pilih **Only select repositories → porto**.
- Pada repository permissions, beri **Contents: Read and write**. Metadata read mengikuti akses repo. Tidak perlu izin workflow atau administrator.
- Tetapkan tanggal kedaluwarsa, buat token, lalu tempel di kolom login admin. Simpan salinan di pengelola sandi agar dapat digunakan pada sesi berikutnya.

Panel ini memakai autentikasi token melalui GitHub API. Ini **bukan tombol OAuth “Sign in with GitHub”**. OAuth memerlukan aplikasi GitHub dan layanan autentikasi tambahan karena GitHub Pages tidak menjalankan backend.

Token hanya ada di memori tab, tidak disimpan di localStorage, cookie, repo, atau URL. Muat ulang halaman / Keluar mengakhiri sesi. Jangan kirim token melalui chat atau menyimpannya dalam file proyek. Akses tulis ditentukan oleh GitHub; membuka halaman `/admin/` tidak memberi pengunjung akses mengubah konten.

## Acuan ukuran

| Aset | Rekomendasi dimensi | Format | Target ukuran file |
| --- | --- | --- | --- |
| Logo klien | **800 × 400 px**, kanvas 2:1, ruang aman 10–15% | PNG transparan, WebP, SVG | < 200 KB |
| Cover portofolio | **1600 × 1200 px**, rasio 4:3 | WebP atau JPG | < 500 KB |
| Detail / lembar studi kasus | **Lebar 1600 px**, tinggi fleksibel; saran 1000–2400 px per lembar | WebP, JPG, PNG | < 1 MB / lembar |
| Foto landscape | **1600 × 900 px** atau 1920 × 1080 px | WebP atau JPG | < 500 KB |

Angka di atas adalah rekomendasi untuk website ini, bukan syarat Behance. Detail proyek selalu mempertahankan rasio gambar. Cover memakai crop 4:3, jadi letakkan objek penting di area tengah. Gunakan sRGB dan jangan ekspor seluruh studi kasus sebagai satu gambar yang sangat panjang; pisahkan menjadi beberapa lembar.

Panel menerima PNG, JPG, JPEG, WebP, AVIF, dan SVG. Batas panel: **4 MB per file**, **20 MB total gambar baru per penyimpanan**. Gambar tidak dikompres atau diubah diam-diam oleh panel. Simpan master AI / PSD / PDF di tempat terpisah; unggah hasil ekspornya.

## Alternatif: drop file langsung di GitHub

Folder logo: [assets/clients](assets/clients/)  
Folder proyek: [assets/portfolio](assets/portfolio/)

Contoh nama file logo: `idnog.png`, `universitas-jember.svg`. Untuk logo putih, gunakan `nama-klien--dark.png` agar mendapat latar gelap.

Untuk proyek, buat folder `assets/portfolio/nama-proyek/` berisi:

```text
cover.webp
01-opening.webp
02-process.webp
03-result.webp
project.json
```

`project.json` opsional. Salin dari [template](assets/portfolio/_template/project.json) atau biarkan panel admin membuatkannya. Tanpa metadata, judul diambil dari nama folder dan kategori awal adalah Brand & Design. Gunakan nama folder huruf kecil, angka, dan tanda hubung.

Di GitHub, buka folder tujuan, klik **Add file → Upload files**, tarik file/folder, lalu **Commit changes** ke `main`. Katalog dan jumlah karya diperbarui otomatis setelah build Pages berhasil. Tidak perlu mengedit `index.html`, `app.js`, atau daftar karya.

## Tampilan studi kasus

Kartu karya membuka halaman proyek tersendiri: judul, ringkasan, lingkup, gambar berurutan sepanjang halaman, kredit, dan kontak. Klik gambar untuk memperbesar; gunakan panah kiri/kanan atau Escape. Tombol **Salin tautan proyek** membuat karya mudah dibagikan.

Kategori: `design` (Brand & Design), `event` (Event Visual), `digital`, `lab` (Creative Lab). Satu proyek bisa memiliki beberapa kategori. Karya konsep dan prototipe sebaiknya tetap diberi jenis dan catatan yang sesuai.

## Jika pembaruan belum muncul

- Pastikan perubahan sudah **disimpan ke GitHub**, bukan hanya dipilih di editor.
- Periksa [status publikasi](https://github.com/hdrgcreativepartner-del/porto/actions). Website berubah setelah status berhasil.
- Muat ulang halaman website setelah publikasi selesai.
- Jika panel melaporkan repo berubah: salin teks yang belum disimpan, klik **Muat ulang data**, lalu edit versi terbaru. Panel tidak memaksa menimpa pembaruan orang lain.
- Jika token ditolak: periksa masa berlaku, repository yang dipilih, Contents write, dan persetujuan organisasi bila diperlukan.
- Menghapus atau menyembunyikan proyek tidak menghapus riwayat GitHub. File pada repo publik tetap publik.
