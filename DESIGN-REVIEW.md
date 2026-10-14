# Review desain dan keputusan UX

Tanggal: 15 Oktober 2026. Sumber visual: Google Search untuk Vuyama hijab, Instagram https://www.instagram.com/vuyama.id/ (profil dan grid terbaru terbuka), dan tautan bio https://vuyama-linktree.vercel.app/ . Referensi alur: source `porto_vuyama_labs_1/dist/app.js` dan `commerce.js`.

## Temuan brand

Feed Instagram menggunakan terracotta merah bata, bidang krem, judul serif berkontras tinggi, foto hijab/mukena, serta pesan personal dan edukasi reseller. Wordmark aslinya tipis dan geometris. Desain website menerjemahkan karakter tersebut ke ruang putih lebih lega dan navigasi yang konsisten. Tidak mengklaim palet ini sebagai brand guideline resmi.

## Koreksi yang dikembangkan

1. Hero mobile lebih ringkas; satu CTA utama jelas. Foto tetap asli dan warna produk tidak diubah.
2. Navigasi sticky, pencarian inline, chip kategori, panel filter mobile, sort dan empty-state yang bisa dipulihkan.
3. Kartu dengan rasio foto konsisten, hirarki material/nama/harga, favorite, pilihan varian dan tombol tambah langsung.
4. Pilihan detail menggunakan thumbnail foto/nama terverifikasi, bukan swatch warna yang ditebak. Foto referensi diberi konteks ketika warna belum terpetakan.
5. Tahapan checkout dan ringkasan pesanan; harga yang belum diketahui tidak diperlakukan sebagai nol.
6. Jalur khusus usaha dengan seluruh paket, harga per unit, minimum order dan ketentuan layanan. Paket masuk ke alur keranjang yang sama.
7. Status arsip SOLD/COMING SOON jelas dan dicegah pada UI maupun sanitasi keranjang.
8. Sistem spacing, typography, kontras, target sentuh, fokus keyboard, dialog dan reduced-motion diwarisi lalu disesuaikan.

## Alur yang dipertahankan

Beranda → katalog/filter → produk/varian/jumlah → keranjang drawer atau halaman → data penerima/pengiriman → pesan WhatsApp. Pencarian, favorit, zoom foto, hapus barang, edit jumlah, dan penyimpanan keranjang tetap tersedia.
