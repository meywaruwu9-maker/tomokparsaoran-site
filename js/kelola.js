/* =========================================================
   KELOLA KONTEN — logic halaman admin non-teknis
   =========================================================
   Cara kerja singkat:
   1. Halaman ini memuat data yang SEDANG LIVE di website
      (dari lokasi-data.js & struktur-data.js).
   2. Semua perubahan di sini HANYA di memori browser kamu —
      belum mengubah apa pun di website asli.
   3. Tombol "Unduh" membungkus perubahan itu jadi file .js
      yang sudah benar formatnya, siap diunggah ke GitHub.
   ========================================================= */

// Salinan data yang boleh diubah-ubah (tidak menyentuh data asli sebelum diunduh)
let dataLokasi = JSON.parse(JSON.stringify(lokasiData));
let dataPemerintah = JSON.parse(JSON.stringify(strukturPemerintah));
let dataBPD = JSON.parse(JSON.stringify(strukturBPD));
let dataPKK = JSON.parse(JSON.stringify(strukturPKK));
let dataPokja = JSON.parse(JSON.stringify(pokjaData));
let dataBerita = JSON.parse(JSON.stringify(beritaData));
let dataKegiatan = JSON.parse(JSON.stringify(kegiatanData));

/* =========================================================
   HELPER — pasang event listener dengan aman.
   Kalau elemen dengan id tsb tidak ada di halaman ini, cukup
   dilewati (dicatat di console) — TIDAK membuat seluruh script
   berhenti/crash seperti kalau pakai addEventListener langsung.
   Dipakai bersama oleh kelola.js, kelola-tema.js, kelola-firebase.js.
   ========================================================= */
function amanEvent(id, event, handler) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener(event, handler);
  } else {
    console.warn(`[kelola] Elemen #${id} tidak ditemukan — tombol/form ini dilewati.`);
  }
}

let statusBelumDiunduh = false;
function tandaiBerubah() {
  statusBelumDiunduh = true;
  const el = document.getElementById('statusUnduh');
  if (el) el.hidden = false;
}

/* =========================================================
   HELPER — bikin string JS yang aman (anti typo/quote rusak)
   ========================================================= */
function jsStr(v) {
  if (v === null || v === undefined || v === '') return 'null';
  return JSON.stringify(String(v));
}
// Khusus field yang selalu ditampilkan langsung sebagai teks di halaman (nama/alamat/deskripsi) —
// kalau dikosongkan harus jadi string kosong "", BUKAN null, supaya website tidak menampilkan teks "null".
function jsStrTeks(v) {
  return JSON.stringify(String(v || ''));
}
function jsNum(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? String(n) : 'null';
}
function slugify(nama, dipakai) {
  let dasar = String(nama || 'orang').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'orang';
  let id = dasar, n = 1;
  while (dipakai.includes(id)) { id = `${dasar}-${++n}`; }
  return id;
}

/* =========================================================
   TAB SWITCHING
   ========================================================= */
document.querySelectorAll('.kelola-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.kelola-tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.kelola-panel').forEach((p) => (p.hidden = true));
    tab.classList.add('active');
    document.getElementById(tab.dataset.panel).hidden = false;
  });
});

/* =========================================================
   1) EDITOR LOKASI (Wisata / UMKM / Homestay) — form berulang
   ========================================================= */
const labelKategori = { wisata: 'Wisata', umkm: 'UMKM', homestay: 'Homestay', pemandangan: 'Pemandangan' };

function formLokasiCard(item, kategori, index) {
  const withKontak = kategori === 'umkm' || kategori === 'homestay';
  return `
    <div class="edit-card" data-kategori="${kategori}" data-index="${index}">
      <div class="edit-card-head">
        <strong>${item.nama || '(Belum diberi nama)'}</strong>
        <button type="button" class="btn-hapus" data-action="hapus-lokasi">🗑 Hapus</button>
      </div>
      <label>Nama tempat
        <input type="text" data-field="nama" value="${escHtml(item.nama)}" placeholder="Nama tempat">
      </label>
      <div class="edit-row-split">
        <label>Latitude
          <input type="number" step="any" data-field="lat" value="${item.lat ?? ''}" placeholder="2.6513151">
        </label>
        <label>Longitude
          <input type="number" step="any" data-field="lng" value="${item.lng ?? ''}" placeholder="98.8605820">
        </label>
      </div>
      <p class="field-help">Cara dapat koordinat: buka Google Maps → cari lokasinya → tekan lama titiknya sampai muncul pin → angkanya muncul di kotak pencarian.</p>
      <label>Alamat
        <input type="text" data-field="alamat" value="${escHtml(item.alamat)}" placeholder="Jl. ..., Tomok, Kec. Simanindo">
      </label>
      <label>Deskripsi singkat
        <textarea data-field="deskripsi" placeholder="1-2 kalimat">${escHtml(item.deskripsi)}</textarea>
      </label>
      ${withKontak ? `
      <label>Kontak (WA/Telepon)
        <input type="text" data-field="kontak" value="${escHtml(item.kontak)}" placeholder="0812-xxxx-xxxx">
      </label>` : ''}
      <div class="edit-row-split">
        <label>Rating (opsional)
          <input type="number" step="0.1" min="0" max="5" data-field="rating" value="${item.rating ?? ''}" placeholder="4.5">
        </label>
        <label>Foto (opsional)
          <input type="text" data-field="foto" value="${escHtml(item.foto)}" placeholder="assets/images/${kategori}/nama.jpg">
        </label>
      </div>
      <label>Google Maps Place ID (opsional, biar tautan makin akurat)
        <input type="text" data-field="placeId" value="${escHtml(item.placeId)}" placeholder="ChIJ...">
      </label>
    </div>
  `;
}

function escHtml(v) {
  if (v === null || v === undefined) return '';
  return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function renderLokasiTab(kategori) {
  const container = document.getElementById('grid-' + kategori);
  container.innerHTML = dataLokasi[kategori].map((item, i) => formLokasiCard(item, kategori, i)).join('');
}

function renderSemuaLokasi() {
  ['wisata', 'umkm', 'homestay', 'pemandangan'].forEach(renderLokasiTab);
}

// Event delegation: input & klik di dalam grid manapun (wisata/umkm/homestay)
document.querySelectorAll('.lokasi-grid').forEach((grid) => {
  grid.addEventListener('input', (e) => {
    const card = e.target.closest('.edit-card');
    if (!card) return;
    const { kategori, index } = card.dataset;
    const field = e.target.dataset.field;
    if (!field) return;
    let val = e.target.value;
    if (field === 'lat' || field === 'lng' || field === 'rating') val = val === '' ? null : parseFloat(val);
    dataLokasi[kategori][index][field] = val;
    tandaiBerubah();
    if (field === 'nama') card.querySelector('.edit-card-head strong').textContent = val || '(Belum diberi nama)';
  });

  grid.addEventListener('click', (e) => {
    if (e.target.dataset.action !== 'hapus-lokasi') return;
    const card = e.target.closest('.edit-card');
    const { kategori, index } = card.dataset;
    if (!confirm(`Hapus "${dataLokasi[kategori][index].nama || 'entri ini'}"?`)) return;
    dataLokasi[kategori].splice(index, 1);
    tandaiBerubah();
    renderLokasiTab(kategori);
  });
});

document.querySelectorAll('[data-action="tambah-lokasi"]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const kategori = btn.dataset.kategori;
    const kosong = { nama: '', lat: null, lng: null, alamat: '', deskripsi: '', rating: null, foto: '', placeId: '' };
    if (kategori === 'umkm' || kategori === 'homestay') kosong.kontak = '';
    dataLokasi[kategori].push(kosong);
    tandaiBerubah();
    renderLokasiTab(kategori);
    document.getElementById('grid-' + kategori).lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

/* =========================================================
   2) EDITOR STRUKTUR (Pemerintahan / BPD / TP PKK)
   ========================================================= */
function namaJabatanTampil(item) {
  return item.jabatan ? item.jabatan : '(anggota tanpa jabatan tersendiri)';
}

function formOrangRow(item, semuaId) {
  return `
    <div class="edit-row-struktur" data-id="${item.id}">
      <div class="struktur-row-fields">
        <input type="text" data-field="jabatan" value="${escHtml(item.jabatan)}" placeholder="Jabatan (boleh kosong)">
        <input type="text" data-field="nama" value="${escHtml(item.nama)}" placeholder="Nama">
        <input type="text" data-field="foto" value="${escHtml(item.foto)}" placeholder="assets/images/pemerintahan/nama.jpg">
      </div>
      <button type="button" class="btn-hapus" data-action="hapus-orang">🗑</button>
    </div>
    ${item.pasangan ? `
    <div class="edit-row-struktur edit-row-struktur--pasangan" data-id="${item.id}" data-pasangan="1">
      <div class="struktur-row-fields">
        <input type="text" data-field="jabatan" value="${escHtml(item.pasangan.jabatan)}" placeholder="Jabatan pasangan">
        <input type="text" data-field="nama" value="${escHtml(item.pasangan.nama)}" placeholder="Nama pasangan">
        <input type="text" data-field="foto" value="${escHtml(item.pasangan.foto)}" placeholder="Foto pasangan (opsional)">
      </div>
      <span class="struktur-pasangan-label">↳ pasangan sekotak</span>
    </div>` : ''}
  `;
}

function renderStrukturTab(namaArray, containerId) {
  const arr = { pemerintah: dataPemerintah, bpd: dataBPD, pkk: dataPKK }[namaArray];
  const container = document.getElementById(containerId);
  const semuaId = arr.map((o) => o.id);
  container.innerHTML = arr.map((item) => formOrangRow(item, semuaId)).join('');

  // isi dropdown "atasan" punya form tambah-orang di bawahnya
  const select = document.getElementById('atasan-' + namaArray);
  if (select) {
    select.innerHTML = arr.map((o) => `<option value="${o.id}">${o.jabatan || o.nama || o.id}${o.nama ? ' — ' + escHtml(o.nama) : ''}</option>`).join('');
  }
}

function renderSemuaStruktur() {
  renderStrukturTab('pemerintah', 'grid-pemerintah');
  renderStrukturTab('bpd', 'grid-bpd');
  renderStrukturTab('pkk', 'grid-pkk');
}

document.querySelectorAll('.struktur-grid').forEach((grid) => {
  grid.addEventListener('input', (e) => {
    const row = e.target.closest('.edit-row-struktur');
    if (!row) return;
    const namaArray = grid.dataset.struktur;
    const arr = { pemerintah: dataPemerintah, bpd: dataBPD, pkk: dataPKK }[namaArray];
    const item = arr.find((o) => o.id === row.dataset.id);
    const field = e.target.dataset.field;
    if (row.dataset.pasangan) {
      item.pasangan[field] = e.target.value;
    } else {
      item[field] = e.target.value;
    }
    tandaiBerubah();
  });

  grid.addEventListener('click', (e) => {
    if (e.target.dataset.action !== 'hapus-orang') return;
    const row = e.target.closest('.edit-row-struktur');
    const namaArray = grid.dataset.struktur;
    const arr = { pemerintah: dataPemerintah, bpd: dataBPD, pkk: dataPKK }[namaArray];
    const id = row.dataset.id;
    const anak = arr.filter((o) => o.parent === id);
    const pesan = anak.length
      ? `"${id}" punya ${anak.length} bawahan yang akan ikut terhapus. Lanjutkan hapus?`
      : `Hapus kotak ini?`;
    if (!confirm(pesan)) return;

    const hapusRekursif = (targetId) => {
      arr.filter((o) => o.parent === targetId).forEach((o) => hapusRekursif(o.id));
      const idx = arr.findIndex((o) => o.id === targetId);
      if (idx > -1) arr.splice(idx, 1);
    };
    hapusRekursif(id);
    tandaiBerubah();
    renderStrukturTab(namaArray, 'grid-' + namaArray);
  });
});

document.querySelectorAll('[data-action="tambah-orang"]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const namaArray = btn.dataset.struktur;
    const arr = { pemerintah: dataPemerintah, bpd: dataBPD, pkk: dataPKK }[namaArray];
    const select = document.getElementById('atasan-' + namaArray);
    const parentId = select.value;
    if (!parentId) { alert('Struktur ini masih kosong — hubungi yang bikin website untuk kotak pertama.'); return; }
    const id = slugify('baru', arr.map((o) => o.id));
    arr.push({ id, parent: parentId, jabatan: '', nama: '', foto: '' });
    tandaiBerubah();
    renderStrukturTab(namaArray, 'grid-' + namaArray);
  });
});

/* =========================================================
   3) EDITOR POKJA (kartu ketua + daftar anggota)
   ========================================================= */
function formPokjaCard(pokja, gIndex) {
  return `
    <div class="edit-card">
      <div class="edit-card-head"><strong>${escHtml(pokja.nama)}</strong></div>
      <label>Nama Kelompok
        <input type="text" data-field="nama" value="${escHtml(pokja.nama)}">
      </label>
      <div class="edit-row-split">
        <label>Ketua
          <input type="text" data-field="ketua" value="${escHtml(pokja.ketua)}">
        </label>
        <label>Foto Ketua (opsional)
          <input type="text" data-field="ketuaFoto" value="${escHtml(pokja.ketuaFoto)}">
        </label>
      </div>
      <p class="field-help">Anggota:</p>
      <div class="pokja-anggota-list">
        ${pokja.anggota.map((a, aIndex) => `
          <div class="pokja-anggota-row" data-a-index="${aIndex}">
            <input type="text" data-field="a-nama" value="${escHtml(a.nama)}" placeholder="Nama anggota">
            <input type="text" data-field="a-foto" value="${escHtml(a.foto)}" placeholder="Foto (opsional)">
            <button type="button" class="btn-hapus" data-action="hapus-anggota">🗑</button>
          </div>
        `).join('')}
      </div>
      <button type="button" class="btn-tambah-kecil" data-action="tambah-anggota">+ Tambah Anggota</button>
    </div>
  `;
}

function renderPokjaTab() {
  document.getElementById('grid-pokja').innerHTML = dataPokja.map(formPokjaCard).join('');
}

document.getElementById('grid-pokja').addEventListener('input', (e) => {
  const card = e.target.closest('.edit-card');
  const gIndex = [...card.parentElement.children].indexOf(card);
  const field = e.target.dataset.field;
  if (!field) return;
  if (field === 'a-nama' || field === 'a-foto') {
    const row = e.target.closest('.pokja-anggota-row');
    const aIndex = row.dataset.aIndex;
    dataPokja[gIndex].anggota[aIndex][field === 'a-nama' ? 'nama' : 'foto'] = e.target.value;
  } else {
    dataPokja[gIndex][field] = e.target.value;
  }
  tandaiBerubah();
});

document.getElementById('grid-pokja').addEventListener('click', (e) => {
  const card = e.target.closest('.edit-card');
  if (!card) return;
  const gIndex = [...card.parentElement.children].indexOf(card);

  if (e.target.dataset.action === 'tambah-anggota') {
    dataPokja[gIndex].anggota.push({ nama: '', foto: '' });
    tandaiBerubah();
    renderPokjaTab();
  }
  if (e.target.dataset.action === 'hapus-anggota') {
    const row = e.target.closest('.pokja-anggota-row');
    dataPokja[gIndex].anggota.splice(row.dataset.aIndex, 1);
    tandaiBerubah();
    renderPokjaTab();
  }
});

/* =========================================================
   3b) EDITOR BERITA & KEGIATAN DESA
   ========================================================= */
function formBeritaCard(b, index) {
  return `
    <div class="edit-card" data-index="${index}">
      <div class="edit-card-head">
        <strong>${escHtml(b.judul) || '(Belum diberi judul)'}</strong>
        <button type="button" class="btn-hapus" data-action="hapus-berita">🗑 Hapus</button>
      </div>
      <label>Judul
        <input type="text" data-field="judul" value="${escHtml(b.judul)}" placeholder="Judul berita/kegiatan">
      </label>
      <div class="edit-row-split">
        <label>Tanggal
          <input type="date" data-field="tanggal" value="${escHtml(b.tanggal)}">
        </label>
        <label>Status
          <select data-field="terbit">
            <option value="ya" ${b.terbit !== false ? 'selected' : ''}>Terbit (tampil di website)</option>
            <option value="tidak" ${b.terbit === false ? 'selected' : ''}>Draf (belum tampil)</option>
          </select>
        </label>
      </div>
      <label>Ringkasan (tampil di kartu Beranda)
        <textarea data-field="ringkasan" placeholder="1-2 kalimat">${escHtml(b.ringkasan)}</textarea>
      </label>
      <label>Isi lengkap (opsional, untuk pengembangan halaman detail nanti)
        <textarea data-field="isi" placeholder="Isi lengkap berita (opsional)">${escHtml(b.isi)}</textarea>
      </label>
      <label>Foto (opsional — bisa drag &amp; drop kalau mode live aktif)
        <input type="text" data-field="foto" value="${escHtml(b.foto)}" placeholder="assets/images/berita/nama.jpg">
      </label>
    </div>
  `;
}

function renderBeritaTab() {
  document.getElementById('grid-berita').innerHTML = dataBerita.map(formBeritaCard).join('');
}

amanEvent('grid-berita', 'input', (e) => {
  const card = e.target.closest('.edit-card');
  if (!card) return;
  const index = card.dataset.index;
  const field = e.target.dataset.field;
  if (!field) return;
  let val = e.target.value;
  if (field === 'terbit') val = val !== 'tidak';
  dataBerita[index][field] = val;
  tandaiBerubah();
  if (field === 'judul') card.querySelector('.edit-card-head strong').textContent = val || '(Belum diberi judul)';
});

amanEvent('grid-berita', 'click', (e) => {
  if (e.target.dataset.action !== 'hapus-berita') return;
  const card = e.target.closest('.edit-card');
  const index = card.dataset.index;
  if (!confirm(`Hapus berita "${dataBerita[index].judul || 'ini'}"?`)) return;
  dataBerita.splice(index, 1);
  tandaiBerubah();
  renderBeritaTab();
});

const btnTambahBerita = document.querySelector('[data-action="tambah-berita"]');
if (btnTambahBerita) btnTambahBerita.addEventListener('click', () => {
  dataBerita.unshift({ judul: '', tanggal: new Date().toISOString().slice(0, 10), ringkasan: '', isi: '', foto: '', terbit: true });
  tandaiBerubah();
  renderBeritaTab();
});

/* =========================================================
   3c) EDITOR KEGIATAN MAHASISWA KKN
   ========================================================= */
function formKegiatanCard(k, index) {
  return `
    <div class="edit-card" data-index="${index}">
      <div class="edit-card-head">
        <strong>${escHtml(k.judul) || '(Belum diberi judul)'}</strong>
        <button type="button" class="btn-hapus" data-action="hapus-kegiatan">🗑 Hapus</button>
      </div>
      <label>Judul Kegiatan
        <input type="text" data-field="judul" value="${escHtml(k.judul)}" placeholder="Contoh: Penyuluhan Kesehatan di Posyandu">
      </label>
      <div class="edit-row-split">
        <label>Kategori (opsional)
          <input type="text" data-field="kategori" value="${escHtml(k.kategori)}" placeholder="Kesehatan / Pendidikan / Lingkungan / dll">
        </label>
        <label>Tanggal
          <input type="date" data-field="tanggal" value="${escHtml(k.tanggal)}">
        </label>
      </div>
      <label>Status
        <select data-field="terbit">
          <option value="ya" ${k.terbit !== false ? 'selected' : ''}>Terbit (tampil di website)</option>
          <option value="tidak" ${k.terbit === false ? 'selected' : ''}>Draf (belum tampil)</option>
        </select>
      </label>
      <label>Deskripsi kegiatan
        <textarea data-field="deskripsi" placeholder="Ceritakan kegiatannya, boleh cukup panjang — otomatis dipotong dengan tombol 'Lihat Selengkapnya' di website">${escHtml(k.deskripsi)}</textarea>
      </label>
      <label>Foto (opsional — bisa drag &amp; drop kalau mode live aktif)
        <input type="text" data-field="foto" value="${escHtml(k.foto)}" placeholder="assets/images/kegiatan/nama.jpg">
      </label>
    </div>
  `;
}

function renderKegiatanTab() {
  const grid = document.getElementById('grid-kegiatan');
  if (grid) grid.innerHTML = dataKegiatan.map(formKegiatanCard).join('');
}

amanEvent('grid-kegiatan', 'input', (e) => {
  const card = e.target.closest('.edit-card');
  if (!card) return;
  const index = card.dataset.index;
  const field = e.target.dataset.field;
  if (!field) return;
  let val = e.target.value;
  if (field === 'terbit') val = val !== 'tidak';
  dataKegiatan[index][field] = val;
  tandaiBerubah();
  if (field === 'judul') card.querySelector('.edit-card-head strong').textContent = val || '(Belum diberi judul)';
});

amanEvent('grid-kegiatan', 'click', (e) => {
  if (e.target.dataset.action !== 'hapus-kegiatan') return;
  const card = e.target.closest('.edit-card');
  const index = card.dataset.index;
  if (!confirm(`Hapus kegiatan "${dataKegiatan[index].judul || 'ini'}"?`)) return;
  dataKegiatan.splice(index, 1);
  tandaiBerubah();
  renderKegiatanTab();
});

const btnTambahKegiatan = document.querySelector('[data-action="tambah-kegiatan"]');
if (btnTambahKegiatan) btnTambahKegiatan.addEventListener('click', () => {
  dataKegiatan.unshift({ judul: '', kategori: '', tanggal: new Date().toISOString().slice(0, 10), deskripsi: '', foto: '', terbit: true });
  tandaiBerubah();
  renderKegiatanTab();
});

/* =========================================================
   4) GENERATOR FILE — mengubah data di memori jadi teks .js
   ========================================================= */
function generateLokasiFile() {
  const renderItem = (item, withKontak) => {
    const f = [
      `      nama: ${jsStrTeks(item.nama)}`,
      `      lat: ${jsNum(item.lat)}`,
      `      lng: ${jsNum(item.lng)}`,
      `      alamat: ${jsStrTeks(item.alamat)}`,
      `      deskripsi: ${jsStrTeks(item.deskripsi)}`
    ];
    if (withKontak) f.push(`      kontak: ${jsStr(item.kontak)}`);
    f.push(`      rating: ${item.rating ? jsNum(item.rating) : 'null'}`);
    f.push(`      placeId: ${jsStr(item.placeId)}`);
    return `    {\n${f.join(',\n')}\n    }`;
  };
  const wisataStr = dataLokasi.wisata.map((i) => renderItem(i, false)).join(',\n');
  const umkmStr = dataLokasi.umkm.map((i) => renderItem(i, true)).join(',\n');
  const homestayStr = dataLokasi.homestay.map((i) => renderItem(i, true)).join(',\n');
  const pemandanganStr = dataLokasi.pemandangan.map((i) => renderItem(i, false)).join(',\n');

  return `/* =========================================================
   DATA LOKASI — DESA TOMOK
   =========================================================
   File ini terakhir dihasilkan lewat kelola.html.
   Titik-titik di bawah memakai koordinat asli dari Google Maps.
   Untuk mengedit lagi, buka kelola.html — JANGAN edit file ini
   langsung kalau kurang familiar dengan sintaks JavaScript.
   ========================================================= */

const lokasiData = {

  // ===== WISATA & DAYA TARIK =====
  wisata: [
${wisataStr}
  ],

  // ===== UMKM =====
  umkm: [
${umkmStr}
  ],

  // ===== PEMANDANGAN & SPOT FOTO =====
  pemandangan: [
${pemandanganStr}
  ],

  // ===== HOMESTAY & PENGINAPAN =====
  homestay: [
${homestayStr}
  ]
};
`;
}

function generateStrukturFile() {
  const renderOrang = (o) => {
    const dasar = `id: ${jsStr(o.id)}, parent: ${o.parent === null ? 'null' : jsStr(o.parent)}, jabatan: ${jsStr(o.jabatan)}, nama: ${jsStr(o.nama)}, foto: ${jsStr(o.foto)}`;
    if (o.pasangan) {
      return `  {\n    ${dasar},\n    pasangan: { jabatan: ${jsStr(o.pasangan.jabatan)}, nama: ${jsStr(o.pasangan.nama)}, foto: ${jsStr(o.pasangan.foto)} }\n  }`;
    }
    return `  { ${dasar} }`;
  };

  const pokjaStr = dataPokja.map((g) => {
    const anggotaStr = g.anggota.map((a) => `      { nama: ${jsStr(a.nama)}, foto: ${jsStr(a.foto)} }`).join(',\n');
    return `  {\n    nama: ${jsStr(g.nama)}, ketua: ${jsStr(g.ketua)}, ketuaFoto: ${jsStr(g.ketuaFoto)},\n    anggota: [\n${anggotaStr}\n    ]\n  }`;
  }).join(',\n');

  return `/* =========================================================
   DATA STRUKTUR ORGANISASI — Desa Tomok Parsaoran
   =========================================================
   File ini terakhir dihasilkan lewat kelola.html.
   Untuk mengedit lagi, buka kelola.html — JANGAN edit file ini
   langsung kalau kurang familiar dengan sintaks JavaScript.
   ========================================================= */

// ===== PEMERINTAHAN DESA =====
const strukturPemerintah = [
${dataPemerintah.map(renderOrang).join(',\n')}
];

// ===== BPD (Badan Permusyawaratan Desa) =====
const strukturBPD = [
${dataBPD.map(renderOrang).join(',\n')}
];

// ===== TP PKK =====
const strukturPKK = [
${dataPKK.map(renderOrang).join(',\n')}
];

// ===== POKJA (Kelompok Kerja TP PKK) =====
const pokjaData = [
${pokjaStr}
];
`;
}

function generateBeritaFile() {
  const itemStr = dataBerita.map((b) => {
    const f = [
      `    judul: ${jsStrTeks(b.judul)}`,
      `    tanggal: ${jsStrTeks(b.tanggal)}`,
      `    ringkasan: ${jsStrTeks(b.ringkasan)}`,
      `    isi: ${jsStrTeks(b.isi)}`,
      `    foto: ${jsStrTeks(b.foto)}`,
      `    terbit: ${b.terbit !== false}`
    ];
    return `  {\n${f.join(',\n')}\n  }`;
  }).join(',\n');

  return `/* =========================================================
   DATA BERITA & KEGIATAN DESA — Desa Tomok Parsaoran
   =========================================================
   File ini terakhir dihasilkan lewat kelola.html.
   Untuk mengedit lagi, buka kelola.html — JANGAN edit file ini
   langsung kalau kurang familiar dengan sintaks JavaScript.
   ========================================================= */

const beritaData = [
${itemStr || ''}
];
`;
}

function generateKegiatanFile() {
  const itemStr = dataKegiatan.map((k) => {
    const f = [
      `    judul: ${jsStrTeks(k.judul)}`,
      `    kategori: ${jsStrTeks(k.kategori)}`,
      `    tanggal: ${jsStrTeks(k.tanggal)}`,
      `    deskripsi: ${jsStrTeks(k.deskripsi)}`,
      `    foto: ${jsStrTeks(k.foto)}`,
      `    terbit: ${k.terbit !== false}`
    ];
    return `  {\n${f.join(',\n')}\n  }`;
  }).join(',\n');

  return `/* =========================================================
   DATA KEGIATAN MAHASISWA KKN — Desa Tomok Parsaoran
   =========================================================
   File ini terakhir dihasilkan lewat kelola.html.
   ========================================================= */

const kegiatanData = [
${itemStr || ''}
];
`;
}

function unduhFile(nama, isi) {
  const blob = new Blob([isi], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nama;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function cekNamaKosong() {
  const kosong = [];
  ['wisata', 'umkm', 'homestay', 'pemandangan'].forEach((k) => {
    dataLokasi[k].forEach((item, i) => { if (!item.nama) kosong.push(`${labelKategori[k]} #${i + 1}`); });
  });
  return kosong;
}

amanEvent('btnUnduhLokasi', 'click', () => {
  const kosong = cekNamaKosong();
  if (kosong.length && !confirm(`Ada entri tanpa nama: ${kosong.join(', ')}. Tetap unduh?`)) return;
  unduhFile('lokasi-data.js', generateLokasiFile());
});
amanEvent('btnUnduhStruktur', 'click', () => {
  unduhFile('struktur-data.js', generateStrukturFile());
});
amanEvent('btnUnduhBerita', 'click', () => {
  unduhFile('berita-data.js', generateBeritaFile());
});
amanEvent('btnUnduhKegiatan', 'click', () => {
  unduhFile('kegiatan-data.js', generateKegiatanFile());
});

/* =========================================================
   3c) EDITOR PROFIL DESA (data tunggal, bukan daftar berulang)
   ========================================================= */
const kolomProfil = ['luasWilayah', 'jumlahDusun', 'jumlahJiwa', 'jumlahKK', 'sejarahJudul', 'sejarahTeks', 'demografiJudul', 'demografiTeks', 'badge', 'batasUtara', 'batasSelatan', 'batasBarat', 'batasTimur', 'infrastrukturJudul', 'kepalaDesaNama', 'infrastrukturTeksTambahan'];

function isiFormProfil(data) {
  kolomProfil.forEach((k) => {
    const el = document.getElementById('pf-' + k);
    if (el) el.value = data[k] || '';
  });
}

function bacaFormProfil() {
  const hasil = {};
  kolomProfil.forEach((k) => {
    const el = document.getElementById('pf-' + k);
    if (el) hasil[k] = el.value;
  });
  return hasil;
}

function generateProfilFile(data) {
  const baris = kolomProfil.map((k) => `  ${k}: ${jsStrTeks(data[k])}`).join(',\n');
  return `/* =========================================================
   DATA PROFIL DESA — Desa Tomok Parsaoran
   =========================================================
   File ini terakhir dihasilkan lewat kelola.html.
   ========================================================= */

const profilData = {
${baris}
};
`;
}

amanEvent('btnUnduhProfil', 'click', () => {
  unduhFile('profil-data.js', generateProfilFile(bacaFormProfil()));
});

/* =========================================================
   INIT
   ========================================================= */
isiFormProfil(typeof profilData !== 'undefined' ? profilData : {});
renderSemuaLokasi();
renderSemuaStruktur();
renderPokjaTab();
renderBeritaTab();
renderKegiatanTab();
