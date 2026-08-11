# Panduan: Login & Simpan Langsung (Firebase)

Ini upgrade dari `kelola.html` supaya: (1) ada login username/password khusus pengelola, (2) perubahan langsung tampil di website tanpa unduh file/GitHub, (3) foto tinggal drag-and-drop. Semua gratis (Firebase tier gratis Google, cukup besar untuk website desa).

**Kalau belum sempat setup ini, `kelola.html` tetap bisa dipakai seperti biasa** (mode offline, unduh file) — fitur ini murni tambahan opsional.

---

## Yang perlu dipahami dulu

1. **Ini butuh 1 akun Google** (boleh akun kantor desa, disarankan bukan akun pribadi mahasiswa — supaya kendali penuh ada di desa setelah KKN/proyek selesai).
2. **Saya (yang bikin kode ini) tidak bisa membuatkan project Firebase-nya untuk kalian** — itu perlu akun Google kalian sendiri. Tapi semua kodenya sudah saya siapkan, kalian tinggal ikuti langkah di bawah (±20-30 menit, sekali saja).
3. **Kejujuran soal testing**: kode ini saya buat mengikuti dokumentasi resmi Firebase yang sudah stabil bertahun-tahun, tapi lingkungan kerja saya tidak bisa mengakses internet umum, jadi saya tidak bisa mencoba langsung ke Firebase yang benar-benar hidup. Kemungkinan besar jalan lancar, tapi wajar kalau di percobaan pertama ada pesan error kecil — pesan errornya sudah dirancang untuk cukup jelas menunjukkan letak masalahnya.

---

## Langkah 1 — Buat project Firebase

1. Buka [console.firebase.google.com](https://console.firebase.google.com), klik **"Add project" / "Tambah project"**.
2. Beri nama, misalnya "desa-tomok-parsaoran". Boleh matikan Google Analytics (tidak perlu untuk ini).
3. Tunggu sampai project selesai dibuat.

## Langkah 2 — Aktifkan Authentication (buat akun pengelola)

1. Di sidebar kiri, klik **Build → Authentication → Get Started**.
2. Tab **Sign-in method** → klik **Email/Password** → aktifkan (toggle) → Save.
3. Tab **Users** → klik **Add user**. Ini akun untuk pengelola pertama, contoh:
   - Email: `sekdes@tomokparsaoran.id` (boleh email asli staf, atau email "buatan" asal formatnya email — tidak harus bisa menerima surel beneran)
   - Password: bikin sendiri, minimal 6 karakter, kasih tau ke yang bersangkutan lewat jalur aman (jangan taruh di chat grup terbuka)
4. Ulangi klik **Add user** untuk tiap pengelola lain yang butuh akses (misal: Kepala Desa, Sekretaris, dst). Tidak ada batas jumlah akun di tier gratis.

> Untuk menambah/menghapus pengelola di kemudian hari, kembali ke halaman **Authentication → Users** ini kapan saja.

## Langkah 3 — Aktifkan Firestore Database (tempat data disimpan)

1. Sidebar kiri → **Build → Firestore Database → Create database**.
2. Pilih **"Start in production mode"** → pilih lokasi server (misal `asia-southeast2 (Jakarta)` biar cepat) → Enable.
3. Setelah aktif, buka tab **Rules**, hapus semua isinya, ganti dengan:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Artinya: **siapa saja boleh membaca** (supaya website publik tetap bisa tampil tanpa login) tapi **hanya yang sudah login yang boleh mengubah data**. Klik **Publish**.

## Langkah 4 — Aktifkan Storage (tempat foto disimpan)

1. Sidebar kiri → **Build → Storage → Get started** → pilih lokasi sama seperti Firestore → Done.
2. Tab **Rules**, ganti jadi:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

Sama seperti Firestore: semua orang boleh LIHAT foto, tapi hanya yang login yang boleh UPLOAD (maksimal 5MB per foto). Klik **Publish**.

## Langkah 5 — Ambil kunci konfigurasi

1. Klik ikon ⚙️ (Project Settings) di sidebar kiri atas → scroll ke bawah ke **"Your apps"** → klik ikon **`</>`** (Web).
2. Kasih nama app, misal "Website Desa" → Register app (tidak perlu centang hosting).
3. Akan muncul kode seperti ini — **salin bagian objeknya saja**:
```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "desa-tomok-parsaoran.firebaseapp.com",
  projectId: "desa-tomok-parsaoran",
  storageBucket: "desa-tomok-parsaoran.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Langkah 6 — Isi ke kode website

Buka `js/firebase-config.js`, ganti isinya:
```js
const FIREBASE_CONFIG = {
  AKTIF: true,
  config: {
    apiKey: "AIzaSy...",              // <- tempel dari langkah 5
    authDomain: "desa-tomok-parsaoran.firebaseapp.com",
    projectId: "desa-tomok-parsaoran",
    storageBucket: "desa-tomok-parsaoran.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
  }
};
```
Simpan, unggah file ini ke GitHub (satu-satunya langkah GitHub yang tersisa, dan cuma sekali di awal — setelah ini semua pengelolaan lewat `kelola.html` langsung, tanpa GitHub lagi).

## Langkah 7 — Pindahkan data awal ke Firestore

Firestore mulai KOSONG — website akan otomatis fallback ke data lokal (`lokasi-data.js`/`struktur-data.js`) sampai kalian isi Firestore-nya. Cara paling gampang mengisi pertama kali:

1. Buka `kelola.html`, login pakai akun yang dibuat di Langkah 2.
2. Karena Firestore masih kosong, form akan kosong juga — **klik "Keluar" sebentar, lalu masuk mode offline** untuk lihat data yang sudah ada (dari `lokasi-data.js`), atau buka dua tab browser (satu offline buat contekan, satu login).
3. Cara tercepat: salin manual isi tiap kartu dari mode offline ke form saat sudah login, atau ketik ulang dari `js/lokasi-data.js` / `js/struktur-data.js`. Agak manual sekali di awal, tapi setelah ini tersimpan permanen di Firestore.
4. Klik **"☁️ Simpan Perubahan ke Website"** setelah selesai isi tiap bagian.

---

## Cara pakai sehari-hari (setelah setup selesai)

1. Buka `kelola.html`.
2. Masuk pakai email + password yang sudah dibuatkan (Langkah 2).
3. Edit, atau **seret foto langsung ke kotak "Foto"** (atau klik kotaknya untuk pilih file) — otomatis terunggah & terisi.
4. Klik **"☁️ Simpan Perubahan ke Website"**.
5. Buka website utama, refresh — perubahan sudah tampil. Selesai, tanpa GitHub sama sekali.

## Kalau ada masalah

- **"Akun tidak ditemukan"**: akun belum dibuat di Firebase Console → Authentication → Users (Langkah 2).
- **Foto gagal upload**: cek ukuran file (maks 5MB) dan format (harus gambar).
- **Data tidak berubah di website setelah simpan**: pastikan benar-benar klik "Simpan", tunggu tulisan "✅ Tersimpan" muncul, baru refresh website (bukan refresh kelola.html).
- **Buka Console browser (F12 → tab Console)** kalau ada masalah lain — pesan error di sana biasanya menunjukkan letak masalahnya (misalnya aturan Firestore/Storage belum di-Publish dengan benar).
