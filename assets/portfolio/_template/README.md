# Template proyek

Salin `project.json` ke folder proyek baru, misalnya `assets/portfolio/nama-proyek/`. Jangan unggah gambar final ke `_template` karena folder ini diabaikan website.

Tambahkan `cover.webp`, `01.webp`, `02.webp`, dan seterusnya. File JPG, PNG, AVIF, atau SVG juga didukung. Kolom `images` boleh tetap kosong; gambar akan dibaca otomatis.

Kategori yang tersedia: `design`, `event`, `digital`, `lab`. Boleh pilih beberapa. `order` lebih kecil muncul lebih awal. `published: false` menyembunyikan proyek dari website; tidak menjadikan file repo privat.

Untuk mengatur urutan dan menambahkan caption atau deskripsi aksesibilitas, isi `images`:

```json
"images": [
  {"file": "01.webp", "alt": "Deskripsi isi gambar", "caption": "Caption opsional"},
  {"file": "02.webp", "alt": "Deskripsi isi gambar berikutnya"}
]
```

Gambar lain yang diunggah setelahnya ditambahkan di bagian akhir secara otomatis. Gunakan panel admin agar tidak perlu mengedit JSON.
