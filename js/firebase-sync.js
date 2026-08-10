/* =========================================================
   FIREBASE-SYNC.JS — baca data dari Firestore untuk website publik
   =========================================================
   Ini kebalikan dari kelola-firebase.js (yang menulis data).
   File ini hanya MEMBACA — dipanggil dari script.js sebelum render,
   sama seperti sheets-sync.js. Kalau Firebase tidak aktif/gagal,
   otomatis fallback ke data lokal — website tidak pernah rusak
   karena masalah di Firebase.

   Urutan prioritas sumber data (diatur di script.js):
   Firebase (kalau aktif & berhasil) > Google Sheets (kalau aktif
   & berhasil) > data lokal (lokasi-data.js / struktur-data.js).
   ========================================================= */

let firebaseApp = null;
let firebaseDb = null;

function firebaseInit() {
  if (!FIREBASE_CONFIG.AKTIF || !FIREBASE_CONFIG.config.apiKey) return false;
  if (typeof firebase === 'undefined') {
    console.warn('[firebase-sync] SDK Firebase tidak termuat (cek koneksi internet / tag <script> CDN-nya).');
    return false;
  }
  try {
    if (!firebaseApp) firebaseApp = firebase.initializeApp(FIREBASE_CONFIG.config);
    if (!firebaseDb) firebaseDb = firebase.firestore();
    return true;
  } catch (err) {
    console.warn('[firebase-sync] Gagal inisialisasi:', err.message);
    return false;
  }
}

async function firebaseAmbilKoleksi(namaKoleksi) {
  const snap = await firebaseDb.collection(namaKoleksi).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

function urutkanBerdasarkanUrutanField(arr) {
  // Dokumen boleh punya field "urutan" (angka) opsional buat atur posisi tampil.
  return arr.slice().sort((a, b) => (a.urutan ?? 999) - (b.urutan ?? 999));
}

/* =========================================================
   FUNGSI UTAMA — dipanggil dari script.js sebelum render.
   Sama seperti sheets-sync: TIDAK PERNAH melempar error ke pemanggil.
   ========================================================= */
async function firebaseSyncMuatSemua() {
  if (!firebaseInit()) return { aktif: false };

  const hasil = { aktif: true, berhasil: [], gagal: [] };

  async function coba(namaKoleksi, onBerhasil) {
    try {
      const dokumen = await firebaseAmbilKoleksi(namaKoleksi);
      if (!dokumen.length) throw new Error('Koleksi kosong');
      onBerhasil(urutkanBerdasarkanUrutanField(dokumen));
      hasil.berhasil.push(namaKoleksi);
    } catch (err) {
      hasil.gagal.push(`${namaKoleksi}: ${err.message}`);
    }
  }

  function bersihkanLokasi(dok) {
    // Hapus field internal Firestore (id, urutan) yang tidak dipakai script.js
    return dok.map(({ id, urutan, ...rest }) => rest);
  }

  await Promise.all([
    coba('wisata', (d) => { lokasiData.wisata = bersihkanLokasi(d); }),
    coba('umkm', (d) => { lokasiData.umkm = bersihkanLokasi(d); }),
    coba('homestay', (d) => { lokasiData.homestay = bersihkanLokasi(d); }),
    coba('pemandangan', (d) => { lokasiData.pemandangan = bersihkanLokasi(d); }),
    coba('berita', (d) => { gantiIsiArrayFB(beritaData, bersihkanLokasi(d)); }),
    coba('kegiatan_kkn', (d) => { gantiIsiArrayFB(kegiatanData, bersihkanLokasi(d)); }),
    coba('struktur_pemerintah', (d) => gantiIsiArrayFB(strukturPemerintah, transformStruktur(d))),
    coba('struktur_bpd', (d) => gantiIsiArrayFB(strukturBPD, transformStruktur(d))),
    coba('struktur_pkk', (d) => gantiIsiArrayFB(strukturPKK, transformStruktur(d))),
    coba('pokja', (d) => { window.pokjaDataFromFirebase = d; }),
    (async () => {
      try {
        const doc = await firebaseDb.collection('pengaturan').doc('tema').get();
        if (doc.exists) {
          Object.assign(temaData, doc.data());
          if (typeof terapkanTema === 'function') {
            const semuaCustomTerisi = temaData.aktif === 'custom' && temaData.customAktif &&
              ['navy', 'teal', 'sand', 'ulosRed', 'ulosGold'].every((k) => temaData.customAktif[k]);
            terapkanTema(semuaCustomTerisi ? temaData.customAktif : (temaPreset[temaData.aktif] || temaPreset['toba-klasik']));
          }
          hasil.berhasil.push('tema');
        }
      } catch (err) {
        hasil.gagal.push('tema: ' + err.message);
      }
    })(),
    (async () => {
      try {
        const doc = await firebaseDb.collection('pengaturan').doc('profil').get();
        if (doc.exists && typeof profilData !== 'undefined') {
          Object.assign(profilData, doc.data());
          hasil.berhasil.push('profil');
        }
      } catch (err) {
        hasil.gagal.push('profil: ' + err.message);
      }
    })()
  ]);

  // Susun ulang pokjaData dari dokumen flat (kelompok/peran/nama/foto) -> bentuk kartu
  if (window.pokjaDataFromFirebase) {
    const map = {};
    window.pokjaDataFromFirebase.forEach((r) => {
      if (!r.kelompok) return;
      if (!map[r.kelompok]) map[r.kelompok] = { nama: r.kelompok, ketua: '', ketuaFoto: '', anggota: [] };
      if (String(r.peran || '').toLowerCase().startsWith('ketua')) {
        map[r.kelompok].ketua = r.nama || '';
        map[r.kelompok].ketuaFoto = r.foto || '';
      } else {
        map[r.kelompok].anggota.push({ nama: r.nama || '', foto: r.foto || '' });
      }
    });
    gantiIsiArrayFB(pokjaData, Object.values(map));
  }

  if (hasil.gagal.length) {
    console.warn('[firebase-sync] Sebagian koleksi gagal dimuat, pakai data lokal/Sheets untuk itu:', hasil.gagal);
  }
  return hasil;
}

function gantiIsiArrayFB(arr, isiBaru) {
  arr.length = 0;
  isiBaru.forEach((x) => arr.push(x));
}
