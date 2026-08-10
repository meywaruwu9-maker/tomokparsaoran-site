/* =========================================================
   SHEETS-SYNC.JS — opsional: tarik data langsung dari Google Sheets
   =========================================================
   TUJUAN: supaya perangkat desa cukup edit Google Sheets (seperti
   edit Excel biasa), TANPA perlu buka kelola.html, unduh file,
   atau upload apa pun ke GitHub. Website otomatis baca perubahan
   setiap kali halaman dibuka/refresh.

   CARA MENGAKTIFKAN — lihat PANDUAN-GOOGLE-SHEETS.md untuk lengkapnya:
   1. Siapkan 1 Google Sheets KHUSUS untuk website ini (JANGAN sheet
      yang juga berisi data internal/sensitif desa lainnya), dengan
      tab-tab: Wisata, UMKM, Homestay, Pemerintah, BPD, PKK, Pokja.
   2. Share sheet itu: "Siapa saja yang memiliki link" → "Pelihat" (Viewer).
   3. Salin ID spreadsheet dari URL-nya, isi di SPREADSHEET_ID di bawah.
   4. Ganti AKTIF jadi true.

   Kalau AKTIF masih false, atau fetch ke Sheets gagal/kosong/error
   apa pun, website otomatis PAKAI DATA LOKAL (lokasi-data.js /
   struktur-data.js) seperti biasa — jadi tidak mungkin membuat
   website rusak/kosong hanya gara-gara Sheets bermasalah.
   ========================================================= */

const SHEETS_CONFIG = {
  AKTIF: true,
  SPREADSHEET_ID: '1eQIJaPdaiNtX3a0Oem0WIEm0-2nExcJDqCL-2KoBpfI' // diisi dari URL Google Sheets Anda
};

/* =========================================================
   HELPER — ambil 1 tab sheet, kembalikan array of object
   (nama kolom di baris pertama sheet jadi nama field object)
   ========================================================= */
async function sheetsAmbilTab(namaTab) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEETS_CONFIG.SPREADSHEET_ID}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(namaTab)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheet "${namaTab}" tidak bisa diakses (status ${res.status})`);
  const teks = await res.text();

  // Respons Google dibungkus "google.visualization.Query.setResponse(...)" —
  // ambil isi di antara tanda kurung pertama & terakhir, apa pun pembungkusnya persis.
  const mulai = teks.indexOf('(');
  const akhir = teks.lastIndexOf(')');
  if (mulai === -1 || akhir === -1) throw new Error(`Format respons sheet "${namaTab}" tidak dikenali`);
  const json = JSON.parse(teks.substring(mulai + 1, akhir));

  const kolom = (json.table.cols || []).map((c) => (c.label || '').trim());
  const baris = json.table.rows || [];

  return baris.map((row) => {
    const obj = {};
    kolom.forEach((namaKolom, i) => {
      if (!namaKolom) return; // kolom tanpa judul diabaikan
      const sel = row.c && row.c[i];
      obj[namaKolom] = sel && sel.v !== null && sel.v !== undefined ? sel.v : '';
    });
    return obj;
  }).filter((obj) => Object.values(obj).some((v) => String(v).trim() !== '')); // buang baris yang benar-benar kosong
}

function angkaAtauNull(v) {
  if (v === '' || v === null || v === undefined) return null;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}
function teksAtauNull(v) {
  const s = String(v ?? '').trim();
  return s === '' ? null : s;
}
function parseFotoField(v) {
  if (v === '' || v === null || v === undefined) return '';
  if (Array.isArray(v)) {
    return v.map((item) => String(item || '').trim()).filter(Boolean);
  }
  const nilai = String(v).trim();
  if (!nilai) return '';
  const parts = nilai
    .split(/[\r\n;|,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return parts.length > 1 ? parts : parts[0];
}
function gantiIsiArray(arr, isiBaru) {
  arr.length = 0;
  isiBaru.forEach((x) => arr.push(x));
}

/* =========================================================
   TRANSFORM — bentuk hasil sheet ke bentuk yang dipakai script.js
   ========================================================= */
function transformLokasi(baris, withKontak) {
  return baris.map((r) => {
    const item = {
      nama: teksAtauNull(r.nama) || '',
      lat: angkaAtauNull(r.lat),
      lng: angkaAtauNull(r.lng),
      alamat: teksAtauNull(r.alamat) || '',
      deskripsi: teksAtauNull(r.deskripsi) || '',
      rating: angkaAtauNull(r.rating),
      foto: parseFotoField(r.foto),
      placeId: teksAtauNull(r.placeId ?? r.placeid ?? r.place_id) || ''
    };
    if (withKontak) item.kontak = teksAtauNull(r.kontak);
    return item;
  }).filter((it) => it.nama && angkaAtauNull(it.lat) !== null && angkaAtauNull(it.lng) !== null);
  // baris tanpa nama/koordinat valid dibuang, bukan bikin peta error
}

function transformStruktur(baris) {
  // Kolom yang diharapkan: id | parent | jabatan | nama | foto | gabung_dengan
  const item = baris.map((r) => ({
    id: teksAtauNull(r.id),
    parent: teksAtauNull(r.parent), // kosong/blank -> null -> jadi kotak paling atas
    jabatan: teksAtauNull(r.jabatan) || '',
    nama: teksAtauNull(r.nama) || '',
    foto: teksAtauNull(r.foto) || '',
    gabungDengan: teksAtauNull(r.gabung_dengan)
  })).filter((o) => o.id);

  // Satukan baris yang saling menunjuk lewat "gabung_dengan" jadi 1 kotak (pola Ketua+Wakil Ketua)
  const idKeGabung = new Set(item.filter((o) => o.gabungDengan).map((o) => o.gabungDengan));
  const hasil = [];
  item.forEach((o) => {
    if (idKeGabung.has(o.id)) return; // sudah jadi "pasangan" milik item lain, jangan dobel
    if (o.gabungDengan) {
      const pasangan = item.find((x) => x.id === o.gabungDengan);
      if (pasangan) {
        hasil.push({ ...o, pasangan: { jabatan: pasangan.jabatan, nama: pasangan.nama, foto: pasangan.foto } });
        return;
      }
    }
    hasil.push(o);
  });
  return hasil;
}

function transformPokja(baris) {
  const kelompokMap = {};
  baris.forEach((r) => {
    const kelompok = teksAtauNull(r.kelompok);
    if (!kelompok) return;
    if (!kelompokMap[kelompok]) kelompokMap[kelompok] = { nama: kelompok, ketua: '', ketuaFoto: '', anggota: [] };
    const isKetua = String(r.peran || '').toLowerCase().startsWith('ketua');
    if (isKetua) {
      kelompokMap[kelompok].ketua = teksAtauNull(r.nama) || '';
      kelompokMap[kelompok].ketuaFoto = teksAtauNull(r.foto) || '';
    } else {
      kelompokMap[kelompok].anggota.push({ nama: teksAtauNull(r.nama) || '', foto: teksAtauNull(r.foto) || '' });
    }
  });
  return Object.values(kelompokMap);
}

function transformBerita(baris) {
  return baris.map((r) => ({
    judul: teksAtauNull(r.judul) || '',
    ringkasan: teksAtauNull(r.ringkasan) || '',
    isi: teksAtauNull(r.isi) || '',
    foto: teksAtauNull(r.foto) || '',
    tanggal: teksAtauNull(r.tanggal) || '',
    terbit: String(r.terbit ?? 'ya').toLowerCase() !== 'tidak'
  })).filter((b) => b.judul);
}

function transformKegiatan(baris) {
  return baris.map((r) => ({
    judul: teksAtauNull(r.judul) || '',
    kategori: teksAtauNull(r.kategori) || '',
    deskripsi: teksAtauNull(r.deskripsi) || '',
    foto: parseFotoField(r.foto),
    tanggal: teksAtauNull(r.tanggal) || '',
    terbit: String(r.terbit ?? 'ya').toLowerCase() !== 'tidak'
  })).filter((k) => k.judul);
}

/* =========================================================
   FUNGSI UTAMA — dipanggil dari script.js sebelum render
   Selalu "resolve" (tidak pernah melempar error ke pemanggil),
   supaya website tetap jalan pakai data lokal apa pun yang terjadi.
   ========================================================= */
async function sheetsSyncMuatSemua() {
  if (!SHEETS_CONFIG.AKTIF || !SHEETS_CONFIG.SPREADSHEET_ID) {
    return { aktif: false };
  }

  const hasil = { aktif: true, berhasil: [], gagal: [] };

  async function coba(namaTab, onBerhasil) {
    try {
      const baris = await sheetsAmbilTab(namaTab);
      if (!baris.length) throw new Error('Sheet kosong');
      onBerhasil(baris);
      hasil.berhasil.push(namaTab);
    } catch (err) {
      hasil.gagal.push(`${namaTab}: ${err.message}`);
    }
  }

  await Promise.all([
    coba('Wisata', (baris) => { lokasiData.wisata = transformLokasi(baris, false); }),
    coba('UMKM', (baris) => { lokasiData.umkm = transformLokasi(baris, true); }),
    coba('Homestay', (baris) => { lokasiData.homestay = transformLokasi(baris, true); }),
    coba('Pemandangan', (baris) => { lokasiData.pemandangan = transformLokasi(baris, false); }),
    coba('Berita', (baris) => { gantiIsiArray(beritaData, transformBerita(baris)); }),
    coba('KegiatanKKN', (baris) => { gantiIsiArray(kegiatanData, transformKegiatan(baris)); }),
    coba('Profil', (baris) => {
      if (baris[0] && typeof profilData !== 'undefined') Object.assign(profilData, baris[0]);
    }),
    coba('Pemerintah', (baris) => gantiIsiArray(strukturPemerintah, transformStruktur(baris))),
    coba('BPD', (baris) => gantiIsiArray(strukturBPD, transformStruktur(baris))),
    coba('PKK', (baris) => gantiIsiArray(strukturPKK, transformStruktur(baris))),
    coba('Pokja', (baris) => gantiIsiArray(pokjaData, transformPokja(baris)))
  ]);

  if (hasil.gagal.length) {
    console.warn('[sheets-sync] Sebagian tab gagal dimuat, pakai data lokal untuk itu:', hasil.gagal);
  }
  return hasil;
}
