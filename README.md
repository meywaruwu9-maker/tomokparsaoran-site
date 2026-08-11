# Website Desa Tomok

**Ada 4 cara mengelola isi website ini, dari paling lengkap:**
1. 🔵 **kelola.html + Firebase** (login pengelola + simpan langsung + drag-drop foto, tanpa GitHub sama sekali setelah setup) — lihat `PANDUAN-FIREBASE.md`
2. 🟢 **Google Sheets** (paling mudah tanpa perlu setup akun baru, seperti edit Excel, tapi tanpa login) — lihat `PANDUAN-GOOGLE-SHEETS.md`
3. 🟡 **kelola.html mode offline** (form di browser, tanpa login, tapi tetap perlu upload manual ke GitHub)
4. 🔴 **Edit file `.js` langsung** (untuk yang familiar coding)

Keempatnya bisa dipakai kapan saja — tidak saling mengunci. Urutan prioritas kalau lebih dari satu aktif: **Firebase > Google Sheets > data lokal**.

Struktur project — **situs multi-halaman** (bukan 1 halaman panjang lagi):
```
desa-tomok/
├── index.html            → Beranda: Hero, Info Praktis, Komentar & Saran, Footer
├── profil.html            → Profil Desa: statistik, sejarah, demografi, batas wilayah, peta interaktif
├── wisata.html, umkm.html, homestay.html, pemandangan.html, berita.html, struktur.html, kegiatan-kkn.html, saran.html
├── kelola.html            → form edit + login (semua menu di atas, 1 pintu masuk)
├── PANDUAN-FIREBASE.md    → cara setup login + simpan langsung + drag-drop foto
├── PANDUAN-GOOGLE-SHEETS.md → cara setup edit lewat Google Sheets
├── css/style.css          → semua styling (dipakai bersama semua halaman)
├── js/
│   ├── lokasi-data.js      → data Wisata/UMKM/Homestay/Pemandangan CADANGAN/lokal
│   ├── struktur-data.js    → data Pemerintah/BPD/PKK/Pokja CADANGAN/lokal
│   ├── berita-data.js      → data Berita & Kegiatan CADANGAN/lokal
│   ├── kegiatan-data.js    → data Kegiatan Mahasiswa KKN CADANGAN/lokal
│   ├── profil-data.js      → data Profil Desa (statistik, sejarah, dst) CADANGAN/lokal
│   ├── tema-data.js        → preset & pilihan warna tampilan (berlaku di SEMUA halaman)
│   ├── tema.js             → penerap warna (dipanggil di <head> tiap halaman)
│   ├── kelola-tema.js      → logic tab "🎨 Tampilan" di kelola.html
│   ├── firebase-config.js  → kunci project Firebase, kosong = nonaktif
│   ├── firebase-sync.js    → baca data dari Firestore untuk semua halaman publik
│   ├── kelola-firebase.js  → login, simpan ke Firestore, & drag-drop foto (khusus kelola.html)
│   ├── sheets-sync.js      → penghubung ke Google Sheets, aman & otomatis fallback
│   ├── kelola.js           → mesin form edit (dipakai kelola.html)
│   └── script.js            → dipakai SEMUA halaman; tiap fungsi render otomatis dilewati kalau elemennya tidak ada di halaman itu
├── assets/images/
│   ├── wisata/ umkm/ homestay/ pemandangan/ pemerintahan/ berita/  → taruh foto asli di subfolder yang sesuai
│   └── logo-samosir.png    → logo resmi Kab. Samosir (dipakai sementara, desa belum punya lambang sendiri)
├── robots.txt & sitemap.xml → bantu Google mengindeks situs (lihat bagian SEO di bawah)
```

**Penting**: karena situsnya multi-halaman, SEMUA file `.html` (kecuali `kelola.html`) memuat set script yang SAMA PERSIS (`lokasi-data.js`, `struktur-data.js`, `berita-data.js`, `kegiatan-data.js`, `profil-data.js`, Firebase, `sheets-sync.js`, `firebase-sync.js`, `script.js`) — supaya data & tema selalu konsisten di halaman mana pun, dan supaya menambah 1 lokasi baru lewat kelola.html langsung muncul di SEMUA halaman terkait (kartu di halaman kategorinya, DAN titik di peta di `profil.html`) tanpa perlu edit apa pun secara manual. Kalau menambah halaman baru, salin susunan script ini dari halaman lain yang sudah ada.

## Halaman baru: Kegiatan Mahasiswa KKN
`kegiatan-kkn.html` — dokumentasi program/kegiatan yang dijalankan mahasiswa KKN selama di desa, tampil di nav sebelum "Saran". Kelola isinya lewat tab **"Kegiatan KKN"** di `kelola.html` — sama persis pola pakainya dengan tab Berita (judul, kategori bebas, tanggal, deskripsi, foto, status terbit/draf).

## Teks panjang otomatis terpotong ("Lihat Selengkapnya")
Deskripsi di kartu Wisata/UMKM/Homestay/Pemandangan/Berita/Kegiatan KKN yang lebih dari ±140 karakter otomatis terpotong 3 baris dengan tombol "Lihat Selengkapnya" — tidak perlu diatur manual, ini berlaku otomatis untuk deskripsi apa pun yang panjang. Teks pendek tampil apa adanya tanpa tombol. Kalau mau ubah batas 140 karakternya, cari `teksLihatSelengkapnya` di `js/script.js`.

## Cara membuka di VS Code
1. Ekstrak folder `desa-tomok` ini di komputer kamu.
2. Buka VS Code → **File > Open Folder** → pilih folder `desa-tomok`.
3. Install extension **Live Server** (by Ritwick Dey).
4. Klik kanan `index.html` → **Open with Live Server**.

## Tentang data yang sudah diisi
Supaya jujur soal apa yang sudah pasti dan apa yang masih perlu kalian lengkapi:

**Sudah terverifikasi (via Google Maps, Laporan Hasil Wawancara resmi, & papan struktur Kantor Desa):**
- Koordinat & rating Makam Raja Sidabutar, Museum Batak, Pasar Tomok, Pelabuhan Tomok
- 4 homestay/hotel di Tomok beserta koordinat, rating, dan kontak
- 1 contoh UMKM (Parna Jaya Souvenir Shop)
- Nama Kepala Desa Tomok Induk (Hotman Sidabutar) dan Pj. Kepala Desa Tomok Parsaoran (Eva Erika Hutagalung)
- Seluruh nama & jabatan di section **Struktur Organisasi** (Pemerintahan Desa, BPD, TP PKK) beserta data umum desa di section Profil (luas wilayah, jumlah dusun/penduduk/KK, batas wilayah, sejarah, sebaran agama) — dari Laporan Hasil Wawancara Website Desa Tomok Parsaoran
- Kontak WhatsApp resmi desa: 0821-6119-6150 (via Sekretaris Desa)
- Logo di footer memakai logo resmi Kabupaten Samosir — sesuai laporan, desa belum punya lambang sendiri

**Masih placeholder / butuh dilengkapi tim desa:**
- Email & domain resmi desa belum ada (laporan menyebutkan "-") — tombol WhatsApp dipakai sebagai kontak utama sementara ini
- Jam operasional & harga tiket di bagian "Info Praktis" bersifat indikatif dari blog wisata, bukan sumber resmi — sebaiknya dikonfirmasi ke pengelola sebelum dipakai
- Struktur organisasi yang tersedia baru untuk **Desa Tomok Parsaoran**. Kalau ada data struktur Desa Tomok Induk juga, kirim saja — bisa ditambahkan sebagai tab ke-4

## Menambah titik lokasi baru (Wisata / UMKM / Homestay / Pemandangan)
Cukup edit `js/lokasi-data.js` — **kartu di halaman dan penanda di peta otomatis mengikuti**, tidak perlu edit dua tempat.

1. Buka Google Maps, cari lokasinya, tekan lama titik yang tepat untuk mendapat koordinat (lat, lng).
2. Salin format berikut ke dalam kategori yang sesuai (`wisata`, `umkm`, `homestay`, atau `pemandangan`) di `lokasi-data.js`, tepat sebelum tanda `]` penutup:

```js
,{
  nama: "Nama Lokasi",
  lat: 2.000000,
  lng: 98.000000,
  alamat: "Alamat lengkap",
  deskripsi: "Deskripsi singkat, 1-2 kalimat",
  kontak: "08xx-xxxx-xxxx",   // boleh null kalau belum ada
  rating: 4.5,                  // boleh null kalau belum ada
  placeId: ""                   // opsional, lihat langkah 3
}
```
(kategori `wisata` dan `pemandangan` tidak memakai field `kontak`)

3. **placeId** (opsional tapi bikin tautan "Buka di Google Maps" lebih akurat): di Google Maps, cari tempatnya → klik **Bagikan** → salin link → tempel ke browser → placeId ada di bagian akhir URL setelah disingkat, atau gunakan situs seperti "Google Place ID Finder" untuk mengambilnya langsung dari nama tempat.

## Menambahkan foto (Wisata / UMKM / Homestay / Pemandangan / Background)
Foto belum wajib — kalau belum diisi, kartu otomatis tampil placeholder seperti sekarang. Untuk memasang foto asli:

1. Taruh file foto (JPG/WebP, lebar ±1200px, di bawah ±400KB) di subfolder yang sesuai: `assets/images/wisata/`, `assets/images/umkm/`, `assets/images/homestay/`, atau `assets/images/pemandangan/`.
2. Di `js/lokasi-data.js`, tambahkan satu baris `foto: "assets/images/wisata/namafile.jpg",` ke entri lokasi yang sesuai.
3. **Untuk foto latar belakang Beranda (hero)**: taruh 1 foto lanskap sebagai `assets/images/hero.jpg` — otomatis terpakai begitu file itu ada (kodenya sudah siap, tinggal taruh file-nya, tidak perlu edit CSS).

### ⚠️ Penting soal foto — hak cipta
Foto di website resmi pemerintah desa sebaiknya **milik sendiri** (hasil jepretan warga/staf desa) — paling aman dan paling otentik. Saya sengaja **tidak** memasukkan foto hasil pencarian internet ke dalam kode ini karena kebanyakan foto di internet berhak cipta dan tidak boleh dipakai ulang di situs resmi tanpa izin, sekalipun objeknya tempat umum seperti Danau Toba.

Kalau belum ada foto sendiri, opsi legal untuk sementara:
- **Wikimedia Commons** — beberapa foto Danau Toba/Samosir yang sudah saya cek lisensinya, berlisensi CC BY-SA 4.0 (boleh dipakai termasuk situs resmi, **wajib atribusi**):
  - commons.wikimedia.org/wiki/File:Danau_Toba,_Samosir.jpg
  - commons.wikimedia.org/wiki/File:Danau_Toba_dan_Pulau_Samosir.jpg
  - commons.wikimedia.org/wiki/File:A_piece_of_heaven_in_Samosir_Island.jpg
  - Cara pakai: buka link → klik gambar untuk ukuran penuh → klik kanan → Simpan Gambar. **Wajib cantumkan kredit**, contoh: *"Foto: [nama di bagian "Author" halaman file], Wikimedia Commons, CC BY-SA 4.0"*.
- **Unsplash.com / Pexels.com** — foto stok gratis, lisensi lebih longgar (boleh komersial, atribusi dianjurkan tapi tidak wajib), tapi kemungkinan besar bukan foto Tomok spesifik, hanya suasana danau/alam yang mirip.
- Saya sendiri tidak bisa mengunduh foto ini langsung ke project (keterbatasan alat), jadi memilih & menyimpan foto tetap manual — tapi kodenya sudah siap menampilkannya begitu file-nya ada.

## Mengelola konten TANPA coding (untuk perangkat desa)
Buka **`kelola.html`** (bukan `index.html`) — ini halaman khusus dengan form untuk edit **Profil Desa** (statistik, sejarah, demografi, batas wilayah), Wisata, UMKM, Homestay, Pemandangan, Berita &amp; Kegiatan, Pemerintahan Desa, BPD, TP PKK, dan POKJA — semua menu di website ini bisa diedit dari 1 halaman, tanpa perlu sentuh kode sama sekali. Ada juga link kecil "Kelola Konten" di footer website utama.

**Cara pakai:**
1. Buka `kelola.html` lewat Live Server (sama seperti buka `index.html`).
2. Pilih tab, edit langsung di kotak-kotak yang ada, atau klik "+ Tambah" untuk entri baru.
3. Kalau ada foto baru, catat dulu nama filenya — foto asli tetap perlu diunggah manual ke folder `assets/images/...` yang sesuai (halaman ini cuma mengatur teks/datanya, bukan menyimpan file foto).
4. Setelah selesai, klik **"Unduh lokasi-data.js"** dan/atau **"Unduh struktur-data.js"** di paling bawah.
5. Ganti file yang lama dengan file hasil unduhan — lewat GitHub (klik file di github.com → ikon pensil → tempel isi baru → **Commit changes**), tidak perlu VS Code atau command line sama sekali untuk langkah ini.

**Penting**: `kelola.html` hanya alat bantu bikin file yang benar — perubahan BELUM tampil di website sampai file hasil unduhan benar-benar diunggah menggantikan yang lama. Aman dicoba-coba sepuasnya sebelum diunggah, tidak akan merusak apa pun.

Halaman ini sengaja tidak dikunci password (supaya sederhana) — cukup aman selama linknya tidak disebarluaskan ke publik, karena mengedit di sini pun tidak otomatis mengubah situs tanpa langkah unggah manual di atas.

## Mengedit Struktur Organisasi & menambah foto pejabat (Pemerintahan Desa / BPD / TP PKK)
Sama seperti lokasi, bagan struktur sekarang juga otomatis dari data — edit `js/struktur-data.js`, tidak perlu sentuh HTML sama sekali.

**Menambah foto seorang pejabat:**
1. Taruh foto (JPG/WebP, potret/persegi, di bawah ±400KB) di `assets/images/pemerintahan/`.
2. Di `struktur-data.js`, cari orang itu, isi `foto: "assets/images/pemerintahan/namafile.jpg"`.
3. Simpan & refresh — foto langsung muncul di bagan. Kalau belum diisi, otomatis tetap tampil ikon polos seperti sekarang.

**Mengganti nama/jabatan**: langsung edit nilai `nama:` atau `jabatan:` orang yang sesuai.

**Menambah kotak baru** (misalnya Kadus IV): tambahkan satu baris objek baru ke array yang sesuai (`strukturPemerintah`, `strukturBPD`, atau `strukturPKK`), isi `parent` dengan `id` atasannya:
```js
{ id: 'kadus4', parent: 'kades', jabatan: 'Kepala Dusun IV', nama: 'Nama Baru', foto: '' }
```
Kotak otomatis muncul terhubung ke atasannya — tidak perlu mengatur garis atau posisi manual.

**Menambah anggota POKJA**: di array `pokjaData`, tambahkan objek `{ nama: '...', foto: '' }` ke daftar `anggota` POKJA yang sesuai.

Bagan otomatis bisa discroll ke samping di layar kecil (HP) kalau kolomnya kepanjangan — ini normal, bukan bug.

## Mengubah tampilan (warna) website & kelola.html
Tab **🎨 Tampilan** di `kelola.html` — mengubah warna di sini berlaku untuk **kedua** halaman sekaligus (index.html dan kelola.html), karena keduanya memakai variabel warna yang sama.

- **4 paket warna siap pakai**: Toba Klasik (default), Senja Samosir, Hijau Pertanian, Monokrom Elegan — tinggal klik salah satu, langsung berubah semua.
- **Warna kustom**: isi kelima kotak warna sendiri kalau mau paduan unik (harus isi kelima-limanya, kalau ada yang kosong otomatis balik ke paket preset).
- Ada pratinjau langsung di halaman supaya kelihatan hasilnya sebelum disimpan.
- **Simpan**: kalau mode live (Firebase) aktif, klik "Simpan Tampilan" langsung berlaku untuk semua pengunjung. Kalau mode offline, tombol yang sama akan mengunduh `tema-data.js` — unggah ke folder `js/` di GitHub seperti file lainnya.
- Belum ada opsi ubah font dari fitur ini (baru warna) — kalau butuh, bisa diedit manual di `css/style.css` bagian `--font-display`/`--font-body`, atau minta ditambahkan.

## Mengaktifkan formulir "Komentar & Saran"
Section ini ada di Beranda (`#saran`). Tombol WhatsApp sudah aktif & langsung bisa dipakai. Untuk kartu "Isi Formulir", masih perlu disambungkan ke Google Form milik desa sendiri:

1. Buka [forms.google.com](https://forms.google.com), buat form baru, beri nama "Komentar & Saran Desa Tomok Parsaoran", tambahkan pertanyaan sesuai kebutuhan (Nama, Asal, Komentar/Saran).
2. Klik **Kirim (Send)** → tab ikon **`<>`** (Sematkan/Embed) → salin kode `<iframe>` yang muncul, atau cukup salin link form-nya.
3. Buka `index.html`, cari `saran-card--form`, ganti isinya jadi link/iframe ke form tadi.
4. Bonus: di form itu, buka tab "Responses" → klik ikon Sheets hijau → semua masukan otomatis tercatat rapi di Google Sheets, bisa dibaca tim desa kapan saja.

## Peta batas wilayah Tomok Parsaoran & Tomok Induk
Section Profil sudah menampilkan **keterangan tertulis** batas wilayah (Utara/Selatan/Barat/Timur) sesuai Laporan Hasil Wawancara resmi. Saya **belum bisa membuatkan peta garis batas (polygon) yang presisi**, karena basis data batas desa resmi milik Badan Informasi Geospasial (BIG) sendiri menyatakan masih ada desa hasil pemekaran (seperti Tomok Parsaoran, mekar 2012) yang belum tercakup datanya, dan alat yang saya punya tidak bisa memastikan status data ini untuk kasus spesifik Tomok.

Menggambar garis batas berdasarkan tebakan berisiko salah untuk urusan administratif desa, jadi saya pilih tidak melakukannya. **Kalau tim desa punya SK Penetapan Batas Desa** (biasanya ada peta lampiran) atau bisa menunjukkan garis batasnya di Google Maps, saya bisa bantu gambarkan ke peta interaktif yang sudah ada.

## Supaya muncul saat wisatawan search di Google (penting!)
Kode di project ini sudah menyiapkan bagian teknisnya (meta description, data terstruktur schema.org, `sitemap.xml`, `robots.txt`) — tapi ini baru separuh jalan. Supaya benar-benar muncul saat ada yang mencari "Tomok" dari HP-nya, tim desa juga perlu:

1. **Beli domain & hosting**, lalu ganti semua `https://desatomok.id/` di `robots.txt`, `sitemap.xml`, dan meta tag `index.html` dengan domain asli.
2. **Daftarkan situs ke Google Search Console** (search.google.com/search-console) — ini yang membuat Google benar-benar meng-crawl & mengindeks halaman kalian.
3. **Buat Profil Bisnis Google** (Google Business Profile) untuk "Desa Wisata Tomok" — ini yang membuat kalian muncul di Google Maps & kotak info sebelah hasil pencarian, terpisah dari website ini.

Tanpa langkah 2 & 3, website akan tetap bagus tapi sulit ditemukan — jadi bukan cukup hanya taruh online.

## Palet warna & font
- Warna default: Navy `#14303D`, Teal `#2C6E7F`, Sand `#F2E9D8`, Merah ulos `#A13D3D`, Emas ulos `#C79A3E` — **bisa diganti tanpa coding** lewat tab 🎨 Tampilan di `kelola.html` (lihat section di atas)
- Font judul: **Fraunces** (serif) — Font isi: **Plus Jakarta Sans**, dari Google Fonts
- Peta interaktif memakai **Leaflet.js + OpenStreetMap** (gratis, tanpa perlu API key)
