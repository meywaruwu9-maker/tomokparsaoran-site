# Panduan: Edit Website Lewat Google Sheets

Ini cara PALING mudah untuk perangkat desa mengubah isi website — cukup edit spreadsheet seperti Excel biasa, tanpa buka `kelola.html`, tanpa unduh file, tanpa GitHub sama sekali. Website otomatis baca perubahan setiap kali ada yang membuka halamannya.

**Kalau fitur ini belum diaktifkan, website tetap jalan normal seperti biasa** — jadi tidak ada risiko dicoba. Baca dulu semua langkah di bawah sebelum mulai.

---

## ⚠️ Baca dulu sebelum mulai

1. **Buat Google Sheets BARU KHUSUS untuk ini.** Jangan pakai spreadsheet yang juga berisi data lain milik desa (data warga, keuangan, notulen rapat, dll). Sheet ini nanti statusnya **bisa dilihat siapa saja yang punya link** — jadi apa pun yang ditulis di sini otomatis bisa dibaca publik, termasuk oleh mesin pencari.
2. Fitur ini memakai cara Google Sheets "membaca data" yang sudah dipakai luas selama bertahun-tahun dan stabil, tapi bukan fitur resmi yang didukung penuh oleh Google — kecil kemungkinan berubah, tapi bukan nol. Kalau suatu saat berhenti berfungsi, website **otomatis kembali pakai data lokal** (lihat bagian "Jaring pengaman" di bawah), jadi website tidak akan rusak/kosong.
3. Setelah ikut semua langkah di bawah, **coba dulu di komputer sendiri** sebelum bilang ke Kepala Desa ini sudah aktif — lihat bagian "Cara mengetes" di bawah.

---

## Langkah 1 — Buat Google Sheets

1. Buka [sheets.google.com](https://sheets.google.com), buat spreadsheet baru.
2. Beri nama, misalnya **"Data Website Desa Tomok Parsaoran"**.
3. Buat 9 tab (klik tanda **+** di kiri bawah) dengan nama PERSIS seperti ini (huruf besar/kecil berpengaruh):
   `Wisata`, `UMKM`, `Homestay`, `Pemandangan`, `Berita`, `Pemerintah`, `BPD`, `PKK`, `Pokja`

4. Di **baris pertama** tiap tab, ketik nama kolom PERSIS seperti tabel di bawah (urutan kolom bebas, yang penting namanya sama persis):

### Tab `Wisata` dan `Pemandangan` (kolomnya sama persis untuk keduanya)
| nama | lat | lng | alamat | deskripsi | rating | foto | placeId |
|---|---|---|---|---|---|---|---|
| Makam Raja Sidabutar | 2.6513151 | 98.8605820 | Tomok, Kec. Simanindo | Kompleks makam batu... | 4.4 | | ChIJ... |

### Tab `UMKM` dan `Homestay` (kolomnya sama persis untuk keduanya)
| nama | lat | lng | alamat | deskripsi | kontak | rating | foto | placeId |
|---|---|---|---|---|---|---|---|---|

### Tab `Pemerintah`, `BPD`, `PKK` (kolomnya sama persis untuk ketiganya)
| id | parent | jabatan | nama | foto | gabung_dengan |
|---|---|---|---|---|---|
| kades | | Pj. Kepala Desa | Eva Erika Hutagalung | | |
| sekdes | kades | Sekretaris Desa | Asima Rotua H. Silalahi | | |
| ketua_bpd | | Ketua | Hongli Hamonangan Sidabutar | | waket_bpd |
| waket_bpd | | Wakil Ketua | Rita Junely Sinurat | | |

Penjelasan kolom khusus di tab ini:
- **id**: kode unik bebas untuk baris itu (huruf kecil, tanpa spasi — pakai garis bawah `_`). Dipakai baris lain untuk menunjuk "atasannya siapa".
- **parent**: isi dengan **id** dari atasannya. Kosongkan HANYA untuk kotak paling atas (Kepala Desa / Ketua).
- **gabung_dengan**: isi dengan **id** baris lain KALAU dua kotak itu harus digabung jadi satu kotak (misalnya Ketua+Wakil Ketua). Lihat contoh `ketua_bpd` & `waket_bpd` di atas.

### Tab `Pokja`
| kelompok | peran | nama | foto |
|---|---|---|---|
| POKJA I | Ketua | Rumondang Sidabutar | |
| POKJA I | | Roslina Manurung | |
| POKJA I | | Erni Nainggolan | |
| POKJA II | Ketua | Rusinda Sigiro | |

Kolom **peran**: isi `Ketua` untuk 1 baris per kelompok, kosongkan untuk anggota biasa.

### Tab `Berita`
| judul | tanggal | ringkasan | isi | foto | terbit |
|---|---|---|---|---|---|
| Gotong Royong Bersih Pantai | 2026-06-01 | Warga & perangkat desa bersama membersihkan tepi danau. | | | ya |

Kolom **tanggal**: format `YYYY-MM-DD` (misal `2026-06-01`). Kolom **terbit**: isi `ya` supaya tampil di website, atau `tidak` untuk simpan sebagai draf dulu.

> 💡 Cara cepat isi data awal: buka file `js/lokasi-data.js` dan `js/struktur-data.js` di folder project ini, salin nilai-nilainya satu-satu ke Sheets. Agak manual di awal, tapi cuma sekali — setelahnya tinggal edit di Sheets terus.

---

## Langkah 2 — Bagikan sebagai publik (viewer-only)

1. Klik tombol **Bagikan / Share** di pojok kanan atas.
2. Bagian **Akses Umum**, ubah dari "Dibatasi" jadi **"Siapa saja yang memiliki link"**.
3. Pastikan perannya **"Pelihat" (Viewer)** — BUKAN Editor. Klik Selesai.

## Langkah 3 — Ambil ID Spreadsheet

Lihat URL di address bar, bentuknya:
```
https://docs.google.com/spreadsheets/d/ID_PANJANG_DI_SINI/edit
```
Salin bagian `ID_PANJANG_DI_SINI` (di antara `/d/` dan `/edit`).

## Langkah 4 — Aktifkan di kode website

Buka `js/sheets-sync.js`, cari bagian paling atas:
```js
const SHEETS_CONFIG = {
  AKTIF: false,
  SPREADSHEET_ID: ''
};
```
Ubah jadi:
```js
const SHEETS_CONFIG = {
  AKTIF: true,
  SPREADSHEET_ID: 'ID_PANJANG_YANG_TADI_DISALIN'
};
```
Simpan file. Unggah file ini ke GitHub (via github.com, edit file, Commit changes) — ini SATU-SATUNYA langkah yang masih butuh GitHub, dan cuma dilakukan SEKALI di awal. Setelah ini aktif, semua edit selanjutnya cukup lewat Google Sheets saja.

---

## Cara mengetes

1. Buka website-nya, cek data yang tampil sudah sesuai isi Sheets.
2. Coba ubah 1 nama di Sheets (misalnya nama Kepala Desa), tunggu beberapa detik, refresh halaman website. Nama harusnya langsung berubah.
3. Kalau TIDAK berubah: buka website, tekan F12 (buka "Developer Tools"), klik tab "Console", refresh halaman, lihat apa ada tulisan `[sheets-sync]` berwarna kuning — itu akan menyebutkan tab mana yang gagal dan kenapa (biasanya nama tab di Sheets tidak sama persis, atau sharing belum diubah ke publik).

## Jaring pengaman (kenapa ini aman dicoba)

- Kalau `AKTIF` masih `false` → website 100% pakai data lokal, sheets-sync.js tidak melakukan apa-apa.
- Kalau salah satu TAB gagal dibaca (nama sheet salah ketik, kosong, dll) → HANYA bagian itu yang pakai data lokal sebagai cadangan, bagian lain yang berhasil tetap pakai data Sheets.
- Kalau SEMUA gagal (salah ID, tidak ada internet, dll) → seluruh website pakai data lokal, seperti sebelum fitur ini ada.
- Website tidak pernah menampilkan halaman kosong/rusak hanya karena Google Sheets bermasalah.

## Soal foto

Kolom `foto` di Sheets diisi **link URL foto**, bukan file. Google Drive agak merepotkan untuk ini (link biasa dari "Bagikan" tidak langsung bisa dipakai sebagai gambar). Cara lebih gampang:
- Upload foto ke [postimages.org](https://postimages.org) atau [imgur.com](https://imgur.com) (gratis, tanpa akun), salin "direct link"-nya (biasanya berakhiran `.jpg`/`.png`), tempel ke kolom `foto`.
- Atau tetap pakai cara lama: upload foto ke folder `assets/images/...` lewat GitHub, isi kolom `foto` dengan path-nya (contoh: `assets/images/wisata/nama.jpg`) — dua-duanya bisa dipakai bersamaan.

---

## Catatan jujur dari saya (yang bikin fitur ini)

Kode di atas saya bangun mengikuti format resmi yang sudah dipakai luas dan stabil selama bertahun-tahun, dan sudah saya tes menyeluruh dengan data tiruan yang meniru persis format asli Google (termasuk kasus sebagian tab gagal, semua tab gagal, dan baris kosong) — semuanya berhasil fallback dengan benar tanpa membuat website rusak. Yang **belum** bisa saya tes langsung adalah menyambung ke Google Sheets yang benar-benar hidup (lingkungan kerja saya tidak bisa mengakses internet umum), jadi wajar kalau di percobaan pertama kalian ada penyesuaian kecil — kalau ada masalah, cek Console (F12) seperti dijelaskan di atas, pesannya dirancang untuk menunjukkan letak masalahnya.
