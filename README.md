# VUYAMA Catalog

Website katalog lokal Vuyama, mengikuti alur `porto_vuyama_labs_1`: beranda → koleksi/filter/pencarian → detail dan varian → keranjang → checkout → WhatsApp.

## Menjalankan

Dari folder ini jalankan `npm run dev`, lalu buka http://127.0.0.1:4320/ . Tidak memerlukan pemasangan dependency. Server hanya menyajikan `dist`; audit, PDF, dan sumber mentah berada di luar direktori publik.

- `npm test`: pemeriksaan cakupan data, aset, keranjang, arsip sold out, harga belum tersedia, dan pesan pesanan.
- `npm run check`: pemeriksaan sintaks JavaScript.
- `node scripts/import-catalogue.mjs`: membangun data website dari hasil audit dan manifest foto lokal.

## Tampilan dan perilaku

Palet terracotta, ivory, dan warm neutral; judul serif dan teks DM Sans mengikuti arah kampanye Instagram resmi Vuyama yang diperiksa 15 Oktober 2026. Foto berasal dari Drive milik Vuyama. Website memakai wordmark teks; bukan berkas logo vektor resmi.

Header tetap mudah dijangkau, hero mobile lebih singkat, pencarian inline, kategori horizontal, filter dan sort, favorit, galeri/zoom, varian bergambar, keranjang drawer, serta checkout dengan tahapan. Paket usaha dapat masuk keranjang. Layanan custom menuju konsultasi admin.

## Data dan batas kepastian

- 20 folder produk, seluruh 120 folder turunan diinventarisasi.
- 24 entri produk termasuk empat penawaran yang ditemukan di PDF, 317 pilihan warna/seri/konsultasi, 14 paket usaha, dan 22 layanan.
- Katalog memakai pricelist September 2026, termasuk harga ecer, minimum pembelian dan tier reseller/agen/partai.
- Keranjang memakai harga ecer; tier wholesale tidak diterapkan otomatis karena ketentuan mix dan keanggotaan harus dikonfirmasi admin.
- Arsip bertanda SOLD dan penawaran COMING SOON tidak bisa dimasukkan ke keranjang.
- Beberapa koleksi tidak memiliki harga pada pricelist. Subtotal dengan produk tersebut dinyatakan sementara dan mencantumkan jumlah yang belum termasuk.
- Stok tidak terhubung secara langsung. Nama dari file/folder tidak menjamin ketersediaan saat ini. Sejumlah kartu warna bernomor masih berupa galeri referensi dan pilihan konsultasi.
- Produk PDF tanpa foto yang dapat dipastikan menggunakan placeholder berlabel; tidak memakai foto dari produk lain.
- Harga paket promo September tetap memerlukan konfirmasi masa berlaku.

## Kontak

Checkout menuju CS Putri `6285882450652`, diverifikasi dari https://vuyama-linktree.vercel.app/ yang ditautkan bio https://www.instagram.com/vuyama.id/ . Browser menyusun pesan; pengguna sendiri yang mengirim di WhatsApp. Tidak ada server pembayaran atau pengiriman pesan otomatis.

Data pelanggan hanya berada di memori formulir. Keranjang dan favorit disimpan di localStorage perangkat. Preview belum dipublikasikan ke domain produksi.

## Berkas utama

- `dist/app.js`: tampilan dan navigasi.
- `dist/vuyama.css`: desain Vuyama dan penyempurnaan responsif.
- `dist/commerce.js`: validasi keranjang dan pesan pesanan.
- `dist/config.js`: identitas dan kontak.
- `dist/products.js`: data hasil impor, jangan edit manual untuk perubahan permanen.
- `research/catalogue-data.json`: data audit utama beserta sumber.
- `research/catalogue-audit.md`: cakupan, koreksi, dan ketidakpastian sumber.
- `research/asset-downloads.json`: provenance foto baru.
- `research/verified-existing-variants.json`: pemetaan foto Gradasi/Printed yang sudah diverifikasi pada proyek referensi.

Script `brand.mjs`, `enhance.mjs`, `refine.mjs`, dan patch satu kali lainnya adalah riwayat migrasi implementasi, bukan langkah build yang perlu dijalankan ulang.
