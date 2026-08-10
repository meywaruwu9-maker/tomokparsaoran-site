/* =========================================================
   FIREBASE-CONFIG.JS
   =========================================================
   Supaya kelola.html bisa login + simpan perubahan LANGSUNG live
   (tanpa unduh file / tanpa ke GitHub), website ini perlu "otak"
   penyimpanan online — dipakai Firebase (gratis, milik Google).

   CARA ISI — lihat PANDUAN-FIREBASE.md untuk langkah lengkapnya:
   1. Buat project Firebase gratis di console.firebase.google.com
   2. Aktifkan Authentication (Email/Password) & Firestore Database
      & Storage
   3. Salin "Firebase config" dari Project Settings, tempel di bawah
   4. Ganti AKTIF jadi true

   Kalau AKTIF masih false, website & kelola.html tetap berfungsi
   penuh pakai cara lama (data lokal / Google Sheets / unduh file).
   ========================================================= */

const FIREBASE_CONFIG = {
  AKTIF: false,
  config: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  }
};
