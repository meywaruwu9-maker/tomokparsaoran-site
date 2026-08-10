/* =========================================================
   KELOLA-FIREBASE.JS — login, simpan langsung, & drag-drop foto
   =========================================================
   File ini BEKERJA BERSAMA kelola.js (tidak menggantikannya):
   - kelola.js: render form, tambah/hapus/edit di memori browser
   - kelola-firebase.js: gerbang login, muat data dari Firestore,
     tombol "Simpan ke Website", dan upload foto drag-and-drop

   Kalau Firebase belum disetel (FIREBASE_CONFIG.AKTIF = false),
   halaman ini otomatis jatuh ke "mode offline" — persis seperti
   kelola.html sebelum fitur ini ada (unduh file, upload manual).
   ========================================================= */

let fbAuth = null;
let fbDb = null;
let fbStorage = null;
let modeLive = false; // true kalau sudah login & Firestore siap dipakai baca-tulis

/* =========================================================
   1) INISIALISASI GERBANG
   ========================================================= */
function tampilkanGate(bagian) {
  document.getElementById('gateLoading').hidden = bagian !== 'loading';
  document.getElementById('gateBelumSetup').hidden = bagian !== 'belum-setup';
  document.getElementById('formLogin').hidden = bagian !== 'login';
}

function bukaAppContent() {
  document.getElementById('gateOverlay').hidden = true;
  document.getElementById('appContent').hidden = false;
}

async function mulaiGate() {
  if (!FIREBASE_CONFIG.AKTIF || !FIREBASE_CONFIG.config.apiKey) {
    tampilkanGate('belum-setup');
    return;
  }
  if (typeof firebase === 'undefined') {
    document.getElementById('gateBelumSetup').hidden = false;
    document.getElementById('gateBelumSetup').querySelector('p').textContent =
      'Gagal memuat SDK Firebase (cek koneksi internet). Coba refresh, atau lanjut mode offline.';
    tampilkanGate('belum-setup');
    return;
  }

  firebase.initializeApp(FIREBASE_CONFIG.config);
  fbAuth = firebase.auth();
  fbDb = firebase.firestore();
  fbStorage = firebase.storage();

  fbAuth.onAuthStateChanged(async (user) => {
    if (user) {
      modeLive = true;
      document.getElementById('blokSimpanLive').hidden = false;
      document.getElementById('blokUnduhOffline').querySelector('h2').textContent = 'Cadangan: unduh sebagai file';
      const introTeks = document.querySelector('.kelola-intro p');
      if (introTeks) introTeks.innerHTML = '✅ <strong>Mode live aktif</strong> — perubahan yang disimpan lewat tombol "☁️ Simpan Perubahan ke Website" langsung tampil di website begitu direfresh, tanpa unduh file atau GitHub.';
      perbaruiTombolLogout(user);
      await muatDataDariFirestore();
      bukaAppContent();
    } else {
      modeLive = false;
      tampilkanGate('login');
    }
  });
}

amanEvent('btnModeOffline', 'click', () => {
  modeLive = false;
  bukaAppContent();
});

amanEvent('formLogin', 'submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.hidden = true;
  try {
    await fbAuth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    errEl.textContent = terjemahErrorLogin(err.code);
    errEl.hidden = false;
  }
});

function terjemahErrorLogin(kode) {
  const pesan = {
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/user-not-found': 'Akun tidak ditemukan. Minta admin Firebase membuatkan akun dulu (lihat PANDUAN-FIREBASE.md).',
    'auth/wrong-password': 'Kata sandi salah.',
    'auth/invalid-credential': 'Email atau kata sandi salah.',
    'auth/too-many-requests': 'Terlalu banyak percobaan gagal. Coba lagi beberapa menit lagi.'
  };
  return pesan[kode] || `Gagal masuk (${kode || 'tidak diketahui'}).`;
}

function perbaruiTombolLogout(user) {
  const el = document.getElementById('statusLogin');
  if (!user) { el.innerHTML = ''; return; }
  el.innerHTML = `🟢 ${user.email} · <button type="button" data-action="logout" class="btn-tambah-kecil" style="color:var(--ulos-gold);">Keluar</button>`;
}
amanEvent('statusLogin', 'click', (e) => {
  if (e.target.dataset.action === 'logout') fbAuth.signOut();
});

/* =========================================================
   2) MUAT DATA DARI FIRESTORE (menimpa data lokal di kelola.js)
   ========================================================= */
async function ambilKoleksi(nama) {
  const snap = await fbDb.collection(nama).get();
  return snap.docs.map((d) => ({ _docId: d.id, ...d.data() }));
}

async function muatDataDariFirestore() {
  try {
    const [wisata, umkm, homestay, pemandangan, berita, kegiatan] = await Promise.all(
      ['wisata', 'umkm', 'homestay', 'pemandangan', 'berita', 'kegiatan_kkn'].map(ambilKoleksi)
    );
    if (wisata.length) dataLokasi.wisata = wisata;
    if (umkm.length) dataLokasi.umkm = umkm;
    if (homestay.length) dataLokasi.homestay = homestay;
    if (pemandangan.length) dataLokasi.pemandangan = pemandangan;
    if (berita.length) { dataBerita.length = 0; dataBerita.push(...berita); }
    if (kegiatan.length) { dataKegiatan.length = 0; dataKegiatan.push(...kegiatan); }

    const [pemerintah, bpd, pkk, pokjaFlat] = await Promise.all(
      ['struktur_pemerintah', 'struktur_bpd', 'struktur_pkk', 'pokja'].map(ambilKoleksi)
    );
    if (pemerintah.length) { dataPemerintah.length = 0; dataPemerintah.push(...pemerintah); }
    if (bpd.length) { dataBPD.length = 0; dataBPD.push(...bpd); }
    if (pkk.length) { dataPKK.length = 0; dataPKK.push(...pkk); }
    if (pokjaFlat.length) {
      const map = {};
      pokjaFlat.forEach((r) => {
        if (!r.kelompok) return;
        if (!map[r.kelompok]) map[r.kelompok] = { nama: r.kelompok, ketua: '', ketuaFoto: '', anggota: [] };
        if (String(r.peran || '').toLowerCase().startsWith('ketua')) {
          map[r.kelompok].ketua = r.nama || ''; map[r.kelompok].ketuaFoto = r.foto || '';
        } else {
          map[r.kelompok].anggota.push({ nama: r.nama || '', foto: r.foto || '' });
        }
      });
      dataPokja.length = 0;
      dataPokja.push(...Object.values(map));
    }

    renderSemuaLokasi();
    renderSemuaStruktur();
    renderPokjaTab();
    renderBeritaTab();
    renderKegiatanTab();

    try {
      const temaDoc = await fbDb.collection('pengaturan').doc('tema').get();
      if (temaDoc.exists && typeof renderPresetGrid === 'function') {
        Object.assign(temaData, temaDoc.data());
        temaAktifSekarang = temaData.aktif;
        temaCustomSekarang = { ...temaData.customAktif };
        renderPresetGrid();
        renderCustomGrid();
        terapkanTema(warnaSaatIni());
      }
    } catch (err) {
      console.warn('[kelola-firebase] Gagal memuat tema tersimpan:', err.message);
    }

    try {
      const profilDoc = await fbDb.collection('pengaturan').doc('profil').get();
      if (profilDoc.exists && typeof isiFormProfil === 'function') {
        Object.assign(profilData, profilDoc.data());
        isiFormProfil(profilData);
      }
    } catch (err) {
      console.warn('[kelola-firebase] Gagal memuat profil tersimpan:', err.message);
    }
  } catch (err) {
    console.error('[kelola-firebase] Gagal muat data:', err);
    alert('Gagal memuat data dari server. Coba refresh halaman. Detail: ' + err.message);
  }
}

/* =========================================================
   3) SIMPAN KE FIRESTORE
   ========================================================= */
function idAman(teks, dipakai) {
  let dasar = String(teks || 'item').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'item';
  let id = dasar, n = 1;
  while (dipakai.has(id)) id = `${dasar}-${++n}`;
  dipakai.add(id);
  return id;
}

async function simpanKoleksi(namaKoleksi, items) {
  const koleksiRef = fbDb.collection(namaKoleksi);
  const existing = await koleksiRef.get();
  const idLama = new Set(existing.docs.map((d) => d.id));
  const dipakai = new Set();
  const batch = fbDb.batch();

  items.forEach((item) => {
    const salinan = { ...item };
    let docId = salinan._docId || salinan.id;
    delete salinan._docId;
    if (!docId) docId = idAman(salinan.nama || salinan.judul, dipakai); else dipakai.add(docId);
    idLama.delete(docId);
    batch.set(koleksiRef.doc(docId), salinan);
  });
  idLama.forEach((id) => batch.delete(koleksiRef.doc(id))); // hapus dokumen yang sudah tidak ada di form lagi

  await batch.commit();
}

amanEvent('btnSimpanLokasiLive', 'click', async () => {
  const btn = document.getElementById('btnSimpanLokasiLive');
  const status = document.getElementById('statusSimpanLive');
  btn.disabled = true; status.textContent = 'Menyimpan…';
  try {
    await Promise.all([
      simpanKoleksi('wisata', dataLokasi.wisata),
      simpanKoleksi('umkm', dataLokasi.umkm),
      simpanKoleksi('homestay', dataLokasi.homestay),
      simpanKoleksi('pemandangan', dataLokasi.pemandangan)
    ]);
    status.textContent = '✅ Tersimpan — refresh website untuk lihat perubahan.';
  } catch (err) {
    status.textContent = '❌ Gagal menyimpan: ' + err.message;
  }
  btn.disabled = false;
});

amanEvent('btnSimpanBeritaLive', 'click', async () => {
  const btn = document.getElementById('btnSimpanBeritaLive');
  const status = document.getElementById('statusSimpanLive');
  btn.disabled = true; status.textContent = 'Menyimpan…';
  try {
    await simpanKoleksi('berita', dataBerita);
    status.textContent = '✅ Tersimpan — refresh website untuk lihat perubahan.';
  } catch (err) {
    status.textContent = '❌ Gagal menyimpan: ' + err.message;
  }
  btn.disabled = false;
});

amanEvent('btnSimpanKegiatanLive', 'click', async () => {
  const btn = document.getElementById('btnSimpanKegiatanLive');
  const status = document.getElementById('statusSimpanLive');
  btn.disabled = true; status.textContent = 'Menyimpan…';
  try {
    await simpanKoleksi('kegiatan_kkn', dataKegiatan);
    status.textContent = '✅ Tersimpan — refresh website untuk lihat perubahan.';
  } catch (err) {
    status.textContent = '❌ Gagal menyimpan: ' + err.message;
  }
  btn.disabled = false;
});

amanEvent('btnSimpanProfilLive', 'click', async () => {
  if (!modeLive) {
    alert('Simpan langsung cuma bisa dipakai kalau sudah login (mode Firebase). Pakai tombol "Unduh profil-data.js" di sebelahnya untuk mode offline.');
    return;
  }
  const btn = document.getElementById('btnSimpanProfilLive');
  const status = document.getElementById('statusProfil');
  btn.disabled = true; status.textContent = 'Menyimpan…';
  try {
    const data = bacaFormProfil();
    await fbDb.collection('pengaturan').doc('profil').set(data);
    Object.assign(profilData, data);
    status.textContent = '✅ Tersimpan — refresh halaman profil.html di website untuk lihat perubahan.';
  } catch (err) {
    status.textContent = '❌ Gagal menyimpan: ' + err.message;
  }
  btn.disabled = false;
});

amanEvent('btnSimpanStrukturLive', 'click', async () => {
  const btn = document.getElementById('btnSimpanStrukturLive');
  const status = document.getElementById('statusSimpanLive');
  btn.disabled = true; status.textContent = 'Menyimpan…';
  try {
    // Pasangan (Ketua+Wakil Ketua) disimpan sebagai 2 dokumen yang saling menunjuk lewat gabung_dengan
    function pecahPasangan(arr) {
      const hasil = [];
      arr.forEach((o) => {
        const { pasangan, ...utama } = o;
        if (pasangan) {
          const idPasangan = (utama._docId || utama.id || 'x') + '-pasangan';
          hasil.push({ ...utama, gabung_dengan: idPasangan });
          hasil.push({ _docId: idPasangan, id: idPasangan, parent: null, jabatan: pasangan.jabatan, nama: pasangan.nama, foto: pasangan.foto || '', gabung_dengan: '' });
        } else {
          hasil.push({ ...utama, gabung_dengan: utama.gabung_dengan || '' });
        }
      });
      return hasil;
    }
    await Promise.all([
      simpanKoleksi('struktur_pemerintah', pecahPasangan(dataPemerintah)),
      simpanKoleksi('struktur_bpd', pecahPasangan(dataBPD)),
      simpanKoleksi('struktur_pkk', pecahPasangan(dataPKK))
    ]);

    const pokjaFlat = [];
    dataPokja.forEach((p) => {
      pokjaFlat.push({ id: p.nama + '-ketua', kelompok: p.nama, peran: 'Ketua', nama: p.ketua, foto: p.ketuaFoto });
      p.anggota.forEach((a, i) => pokjaFlat.push({ id: `${p.nama}-anggota-${i}`, kelompok: p.nama, peran: '', nama: a.nama, foto: a.foto }));
    });
    await simpanKoleksi('pokja', pokjaFlat);

    status.textContent = '✅ Tersimpan — refresh website untuk lihat perubahan.';
  } catch (err) {
    status.textContent = '❌ Gagal menyimpan: ' + err.message;
  }
  btn.disabled = false;
});

/* =========================================================
   4) DRAG & DROP FOTO — upload ke Firebase Storage
   Berlaku untuk SEMUA input[data-field="foto"] yang sudah dibuat
   kelola.js, tanpa perlu ubah template kartu-nya (event delegation).
   ========================================================= */
function tandaiZonaFoto(input, aktif) {
  input.classList.toggle('drop-aktif', aktif);
}

document.addEventListener('dragover', (e) => {
  const target = e.target.closest('input[data-field="foto"]');
  if (!target) return;
  e.preventDefault();
  tandaiZonaFoto(target, true);
});
document.addEventListener('dragleave', (e) => {
  const target = e.target.closest('input[data-field="foto"]');
  if (target) tandaiZonaFoto(target, false);
});
document.addEventListener('drop', async (e) => {
  const target = e.target.closest('input[data-field="foto"]');
  if (!target) return;
  e.preventDefault();
  tandaiZonaFoto(target, false);
  const file = e.dataTransfer.files && e.dataTransfer.files[0];
  if (!file) return;
  await unggahFotoKeInput(file, target);
});

// Klik pada field foto (kalau modeLive) buka file-picker biasa, alternatif buat drag
document.addEventListener('click', (e) => {
  const target = e.target.closest('input[data-field="foto"]');
  if (!target || !modeLive) return;
  e.preventDefault();
  const picker = document.createElement('input');
  picker.type = 'file';
  picker.accept = 'image/*';
  picker.onchange = () => { if (picker.files[0]) unggahFotoKeInput(picker.files[0], target); };
  picker.click();
});

async function unggahFotoKeInput(file, inputEl) {
  if (!modeLive) {
    alert('Upload foto langsung cuma bisa dipakai kalau sudah login (mode Firebase). Di mode offline, isi field ini dengan path/link foto secara manual.');
    return;
  }
  if (!file.type.startsWith('image/')) { alert('File harus berupa gambar (JPG/PNG/WebP).'); return; }
  if (file.size > 5 * 1024 * 1024) { alert('Ukuran foto maksimal 5MB — kompres dulu fotonya.'); return; }

  const nilaiAsli = inputEl.value;
  inputEl.value = 'Mengunggah…';
  inputEl.disabled = true;
  try {
    const namaFile = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]+/g, '-')}`;
    const ref = fbStorage.ref().child(`foto-desa/${namaFile}`);
    await ref.put(file);
    const url = await ref.getDownloadURL();
    inputEl.value = url;
    inputEl.disabled = false;
    inputEl.dispatchEvent(new Event('input', { bubbles: true })); // supaya kelola.js ikut update data di memori
  } catch (err) {
    inputEl.value = nilaiAsli;
    inputEl.disabled = false;
    alert('Gagal unggah foto: ' + err.message);
  }
}

/* =========================================================
   INIT
   ========================================================= */
mulaiGate();
