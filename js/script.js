/* =========================================================
   1) HEADER & NAV MOBILE
   ========================================================= */
const header = document.getElementById('siteHeader');
const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll);
onScroll();

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* =========================================================
   2) FORM SARAN LOKAL
   Simpan saran di localStorage dan tampilkan daftar terakhir.
*/
function loadSaranFromStorage() {
  const json = localStorage.getItem('desaTomokSaran');
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch (err) {
    console.warn('localStorage saran rusak:', err);
    return [];
  }
}

function saveSaranToStorage(saran) {
  const semua = loadSaranFromStorage();
  semua.unshift(saran);
  localStorage.setItem('desaTomokSaran', JSON.stringify(semua.slice(0, 10)));
}

function renderSaranList() {
  const listEl = document.getElementById('saranList');
  if (!listEl) return;
  const semua = loadSaranFromStorage();
  if (!semua.length) {
    listEl.innerHTML = '<p class="saran-empty">Belum ada saran yang tersimpan di perangkat ini.</p>';
    return;
  }
  listEl.innerHTML = semua.map((item) => `
    <article class="saran-entry">
      <h3>${item.judul}</h3>
      <p>${item.pesan}</p>
      <small>Oleh ${item.nama} · ${item.kontak} · ${item.tanggal}</small>
    </article>
  `).join('');
}

function initSaranForm() {
  const form = document.getElementById('saranForm');
  const status = document.getElementById('saranStatus');
  if (!form || !status) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const nama = data.get('nama')?.toString().trim();
    const kontak = data.get('kontak')?.toString().trim();
    const judul = data.get('judul')?.toString().trim();
    const pesan = data.get('pesan')?.toString().trim();

    if (!nama || !kontak || !judul || !pesan) {
      status.textContent = 'Semua field harus diisi.';
      status.className = 'form-status form-status--error';
      return;
    }

    saveSaranToStorage({
      nama,
      kontak,
      judul,
      pesan,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    });

    form.reset();
    status.textContent = 'Terima kasih, saran Anda tersimpan di perangkat ini.';
    status.className = 'form-status form-status--success';
    renderSaranList();
  });

  renderSaranList();
}

/* =========================================================
   2) HELPER — tautan Google Maps akurat
   Memakai placeId asli kalau ada (paling akurat), kalau tidak
   baru jatuh ke koordinat lat/lng.
   ========================================================= */
function tautanMaps(lokasi) {
  if (lokasi.placeId) {
    return `https://www.google.com/maps/place/?q=place_id:${lokasi.placeId}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${lokasi.lat},${lokasi.lng}`;
}

function badgeRating(rating) {
  return rating ? `<span class="wisata-rating">&#9733; ${rating}</span>` : '';
}

/* =========================================================
   HELPER — "Lihat Selengkapnya" untuk teks yang berpotensi panjang.
   Teks pendek (di bawah batas karakter) tampil apa adanya, tanpa
   tombol. Dipakai di kartu Wisata/UMKM/Homestay/Pemandangan/Berita/
   Kegiatan KKN supaya kartu tetap rapi walau deskripsinya panjang.
   ========================================================= */
let idLihatSemuaBerikutnya = 0;
function teksLihatSelengkapnya(teks, batasKarakter = 140) {
  if (!teks) return '';
  if (teks.length <= batasKarakter) return `<p>${teks}</p>`;
  const id = 'lls-' + (idLihatSemuaBerikutnya++);
  return `
    <p class="teks-terpotong" id="${id}">${teks}</p>
    <button type="button" class="btn-lihat-semua" data-target="${id}">Lihat Selengkapnya &#9662;</button>
  `;
}

// Satu listener untuk SEMUA tombol "Lihat Selengkapnya" di halaman manapun (event delegation)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-lihat-semua');
  if (!btn) return;
  const target = document.getElementById(btn.dataset.target);
  if (!target) return;
  const terbuka = target.classList.toggle('teks-terbuka');
  btn.innerHTML = terbuka ? 'Sembunyikan &#9652;' : 'Lihat Selengkapnya &#9662;';
});

function initialsNama(nama) {
  if (!nama) return '??';
  return nama
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((kata) => kata[0].toUpperCase())
    .join('');
}

/* =========================================================
   3) RENDER KARTU — Wisata, UMKM, Homestay
   Semua kartu dibuat otomatis dari js/lokasi-data.js supaya
   isi peta & isi kartu SELALU sinkron (tidak perlu edit dua kali).
   ========================================================= */
function renderWisata() {
  const grid = document.getElementById('wisataGrid');
  if (!grid) return;
  grid.innerHTML = lokasiData.wisata.map((w, index) => {
    const fotoUtama = Array.isArray(w.foto) ? w.foto[0] : w.foto;
    const lebihFoto = Array.isArray(w.foto) && w.foto.length > 1 ? w.foto.length - 1 : 0;
    return `
    <article class="wisata-card" data-wisata-index="${index}" tabindex="0" role="button" aria-label="Buka galeri ${w.nama}">
      <div class="wisata-img" aria-hidden="true">
        ${fotoUtama ? `<img src="${fotoUtama}" alt="${w.nama}">` : w.nama}
        ${lebihFoto ? `<span class="wisata-photo-count">+${lebihFoto} foto</span>` : ''}
      </div>
      <div class="wisata-body">
        <h3>${w.nama} ${badgeRating(w.rating)}</h3>
        ${teksLihatSelengkapnya(w.deskripsi)}
        <a href="${tautanMaps(w)}" target="_blank" rel="noopener" class="link-more">Buka di Google Maps &rarr;</a>
      </div>
    </article>
  `;
  }).join('');
}

function bukaGaleriWisata(index) {
  const item = lokasiData.wisata[index];
  const modal = document.getElementById('wisataGalleryModal');
  if (!item || !modal) return;

  const title = modal.querySelector('.gallery-title');
  const images = modal.querySelector('.gallery-images');
  title.textContent = item.nama;
  images.innerHTML = item.foto
    ? (Array.isArray(item.foto)
      ? item.foto.map((src, i) => `
          <div class="gallery-thumb">
            <img src="${src}" alt="${item.nama} ${i + 1}">
          </div>
        `).join('')
      : `<div class="gallery-thumb"><img src="${item.foto}" alt="${item.nama}"></div>`)
    : '<p class="gallery-empty">Foto tidak tersedia.</p>';

  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('gallery-open');
}

function tutupGaleriWisata() {
  const modal = document.getElementById('wisataGalleryModal');
  if (!modal) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('gallery-open');
  document.querySelectorAll('.wisata-card.wisata-card--active').forEach((card) => card.classList.remove('wisata-card--active'));
}

function bukaGaleriKegiatan(index) {
  const item = kegiatanData[index];
  const modal = document.getElementById('kegiatanGalleryModal');
  if (!item || !modal) return;

  const title = modal.querySelector('.gallery-title');
  const images = modal.querySelector('.gallery-images');
  title.textContent = item.judul;

  images.innerHTML = item.foto
    ? (Array.isArray(item.foto)
      ? item.foto.map((src, i) => `
          <div class="gallery-thumb">
            <img src="${src}" alt="${item.judul} ${i + 1}">
          </div>
        `).join('')
      : `<div class="gallery-thumb"><img src="${item.foto}" alt="${item.judul}"></div>`)
    : '<p class="gallery-empty">Foto tidak tersedia.</p>';

  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('gallery-open');
}

function tutupGaleriKegiatan() {
  const modal = document.getElementById('kegiatanGalleryModal');
  if (!modal) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('gallery-open');
}

document.addEventListener('click', (event) => {
  const wisataModal = document.getElementById('wisataGalleryModal');
  const kegiatanModal = document.getElementById('kegiatanGalleryModal');
  const targetClose = event.target.closest('[data-close="true"]');
  if (targetClose) {
    event.preventDefault();
    if (wisataModal && !wisataModal.hidden) tutupGaleriWisata();
    if (kegiatanModal && !kegiatanModal.hidden) tutupGaleriKegiatan();
    return;
  }

  const wisataCard = event.target.closest('.wisata-card');
  if (wisataCard && !event.target.closest('a, button, .btn-lihat-semua')) {
    const index = Number(wisataCard.dataset.wisataIndex);
    if (!Number.isNaN(index)) {
      wisataCard.classList.add('wisata-card--active');
      bukaGaleriWisata(index);
    }
    return;
  }

  const kegiatanCard = event.target.closest('#kegiatanGrid .berita-card');
  if (kegiatanCard && !event.target.closest('a, button, .btn-lihat-semua')) {
    const index = Number(kegiatanCard.dataset.kegiatanIndex);
    if (!Number.isNaN(index)) {
      bukaGaleriKegiatan(index);
    }
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    tutupGaleriWisata();
  }
});

function renderUmkm() {
  const grid = document.getElementById('umkmGrid');
  if (!grid) return;
  grid.innerHTML = lokasiData.umkm.map((u) => `
    <div class="umkm-card">
      ${u.foto ? `<img src="${u.foto}" alt="${u.nama}" class="card-photo-inset">` : ''}
      <h3>${u.nama}</h3>
      ${teksLihatSelengkapnya(u.deskripsi)}
      <div class="umkm-meta">
        <span>${u.kontak ? 'WA/Tel: ' + u.kontak : ''}</span>
        <a href="${tautanMaps(u)}" target="_blank" rel="noopener">Lihat lokasi &rarr;</a>
      </div>
    </div>
  `).join('');
}

function renderHomestay() {
  const grid = document.getElementById('homestayGrid');
  if (!grid) return;
  grid.innerHTML = lokasiData.homestay.map((h) => `
    <div class="homestay-card">
      <div class="homestay-icon" aria-hidden="true">
        ${h.foto ? `<img src="${h.foto}" alt="${h.nama}">` : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 11l9-7 9 7M5 10v10h14V10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
      </div>
      <div class="homestay-info">
        <h3>${h.nama}</h3>
        <p class="homestay-address">${h.alamat}</p>
        ${teksLihatSelengkapnya(h.deskripsi)}
        <div class="homestay-footer">
          <span class="homestay-rating">${h.rating ? '&#9733; ' + h.rating : 'Belum ada rating'}</span>
          <div class="homestay-links">
            ${h.kontak ? `<a href="tel:${h.kontak.replace(/-/g, '')}">Telepon</a>` : ''}
            <a href="${tautanMaps(h)}" target="_blank" rel="noopener">Google Maps</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderPemandangan() {
  const grid = document.getElementById('pemandanganGrid');
  if (!grid) return;
  grid.innerHTML = lokasiData.pemandangan.map((p) => `
    <article class="wisata-card">
      <div class="wisata-img" aria-hidden="true">${p.foto ? `<img src="${p.foto}" alt="${p.nama}">` : p.nama}</div>
      <div class="wisata-body">
        <h3>${p.nama} ${badgeRating(p.rating)}</h3>
        ${teksLihatSelengkapnya(p.deskripsi)}
        <a href="${tautanMaps(p)}" target="_blank" rel="noopener" class="link-more">Buka di Google Maps &rarr;</a>
      </div>
    </article>
  `).join('');
}

function renderBerita() {
  const grid = document.getElementById('beritaGrid');
  if (!grid) return;
  const terbit = beritaData.filter((b) => b.terbit !== false);
  if (!terbit.length) {
    grid.innerHTML = '<p class="berita-empty">Belum ada berita atau kegiatan yang dipublikasikan.</p>';
    return;
  }
  const urut = terbit.slice().sort((a, b) => new Date(b.tanggal || 0) - new Date(a.tanggal || 0));
  grid.innerHTML = urut.map((b) => `
    <article class="berita-card">
      ${b.foto ? `<img src="${b.foto}" alt="${b.judul}" class="berita-photo">` : ''}
      <div class="berita-body">
        ${b.tanggal ? `<p class="berita-date">${formatTanggalIndo(b.tanggal)}</p>` : ''}
        <h3>${b.judul}</h3>
        ${teksLihatSelengkapnya(b.ringkasan || '')}
      </div>
    </article>
  `).join('');
}

function renderKegiatan(filterKelompok = 'Kelompok 1') {
  const grid = document.getElementById('kegiatanGrid');
  const filterInfo = document.getElementById('kegiatanFilterInfo');
  if (!grid) return;
  const terbit = kegiatanData.filter((k) => k.terbit !== false);
  let daftar = terbit;
  if (filterKelompok) {
    daftar = terbit.filter((k) => k.kelompok === filterKelompok);
  }
  if (filterInfo) {
    filterInfo.textContent = filterKelompok ? `Menampilkan kegiatan ${filterKelompok}.` : 'Menampilkan semua kegiatan.';
  }
  if (!daftar.length) {
    grid.innerHTML = '<p class="berita-empty">Belum ada kegiatan yang dipublikasikan untuk kelompok ini.</p>';
    return;
  }
  const urut = daftar.slice().sort((a, b) => new Date(b.tanggal || 0) - new Date(a.tanggal || 0));
  grid.innerHTML = urut.map((k) => {
    const globalIndex = kegiatanData.indexOf(k);
    const fotoUtama = Array.isArray(k.foto) ? k.foto[0] : k.foto;
    const lebihFoto = Array.isArray(k.foto) && k.foto.length > 1 ? k.foto.length - 1 : 0;
    return `
    <article class="berita-card" data-kegiatan-index="${globalIndex}" tabindex="0" role="button" aria-label="Buka galeri ${k.judul}">
      ${fotoUtama ? `
        <div class="kegiatan-media">
          <img src="${fotoUtama}" alt="${k.judul}" class="berita-photo">
          ${lebihFoto ? `<span class="kegiatan-photo-count">+${lebihFoto} foto</span>` : ''}
        </div>
      ` : ''}
      <div class="berita-body">
        ${k.kelompok ? `<span class="kegiatan-badge">${k.kelompok}</span>` : ''}
        ${k.kategori ? `<span class="kegiatan-badge">${k.kategori}</span>` : ''}
        ${k.tanggal ? `<p class="berita-date">${formatTanggalIndo(k.tanggal)}</p>` : ''}
        <h3>${k.judul}</h3>
        ${teksLihatSelengkapnya(k.deskripsi || '')}
      </div>
    </article>
  `;
  }).join('');
}

function setKegiatanFilter(kelompok) {
  document.querySelectorAll('.kegiatan-filter-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === kelompok);
  });
  renderKegiatan(kelompok);
}

function initKegiatanFilterButtons() {
  const buttons = document.querySelectorAll('.kegiatan-filter-btn');
  if (!buttons.length) return;
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setKegiatanFilter(btn.dataset.filter);
    });
  });
}

function formatTanggalIndo(tanggalISO) {
  const d = new Date(tanggalISO);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* Catatan: renderWisata()/renderUmkm()/renderHomestay() dipanggil di
   initSemua() paling bawah file ini, setelah sheets-sync dicoba dulu. */

/* =========================================================
   3c) RENDER PROFIL DESA
   Mengisi statistik, teks sejarah/demografi, badge, dan batas
   wilayah di profil.html dari js/profil-data.js — supaya angka
   & teks bisa diubah lewat kelola.html, tanpa edit HTML.
   ========================================================= */
function renderProfil() {
  const target = document.getElementById('profilFacts');
  if (!target || typeof profilData === 'undefined') return;

  document.getElementById('profilFacts').innerHTML = `
    <div><strong>${profilData.luasWilayah}</strong><span>Luas Wilayah</span></div>
    <div><strong>${profilData.jumlahDusun}</strong><span>Dusun</span></div>
    <div><strong>${profilData.jumlahJiwa}</strong><span>Jiwa</span></div>
    <div><strong>${profilData.jumlahKK}</strong><span>KK</span></div>
  `;

  const sejarahEl = document.getElementById('sejarah');
  if (sejarahEl) sejarahEl.innerHTML = `<h2>${profilData.sejarahJudul}</h2><p>${profilData.sejarahTeks}</p>`;

  const demografiEl = document.getElementById('demografi');
  if (demografiEl) demografiEl.innerHTML = `<h2>${profilData.demografiJudul}</h2><p>${profilData.demografiTeks}</p>`;

  const badgeEl = document.getElementById('profilBadge');
  if (badgeEl) badgeEl.innerHTML = profilData.badge;

  const batasEl = document.getElementById('profilBatas');
  if (batasEl) {
    batasEl.innerHTML = `
      <div><span>Utara</span>${profilData.batasUtara}</div>
      <div><span>Selatan</span>${profilData.batasSelatan}</div>
      <div><span>Barat</span>${profilData.batasBarat}</div>
      <div><span>Timur</span>${profilData.batasTimur}</div>
    `;
  }

  const infraEl = document.getElementById('infrastruktur');
  if (infraEl) {
    infraEl.innerHTML = `<h2>${profilData.infrastrukturJudul}</h2><p>Pj. Kepala Desa Tomok Parsaoran saat ini: <strong>${profilData.kepalaDesaNama}</strong>. Struktur lengkap Pemerintah Desa, BPD, dan TP PKK ada di <a href="struktur.html">halaman Struktur Desa</a>. ${profilData.infrastrukturTeksTambahan || ''}</p>`;
  }
}

/* =========================================================
   3b) RENDER STRUKTUR ORGANISASI (Pemerintahan Desa / BPD / TP PKK)
   Dibuat otomatis dari js/struktur-data.js — supaya menambah foto
   pejabat cukup isi field "foto" di data, tidak perlu sentuh HTML.
   ========================================================= */
function svgOrangDefault(nama) {
  return `<span class="org-avatar org-avatar--initials">${initialsNama(nama)}</span>`;
}

function orgPairHtml(jabatan, nama, foto) {
  return `
    <div class="org-pair">
      ${foto ? `<span class="org-avatar"><img src="${foto}" alt="${nama}"></span>` : ''}
      ${jabatan ? `<span class="org-role">${jabatan}</span>` : ''}
      ${nama ? `<span class="org-name">${nama}</span>` : ''}
    </div>
  `;
}

function buatNodeOrg(item, semuaData) {
  const anak = semuaData.filter((d) => d.parent === item.id);
  const isTop = item.parent === null;
  const boxClass = 'org-box' + (isTop ? ' org-box--top' : '') + (!item.jabatan && !isTop ? ' org-box--sm' : '');

  let isiKotak;
  if (item.pasangan) {
    isiKotak = orgPairHtml(item.jabatan, item.nama, item.foto) + orgPairHtml(item.pasangan.jabatan, item.pasangan.nama, item.pasangan.foto);
  } else {
    const avatar = isTop
      ? `<span class="org-avatar" ${item.foto ? '' : 'aria-hidden="true"'}>${item.foto ? `<img src="${item.foto}" alt="${item.nama}">` : svgOrangDefault(item.nama)}</span>`
      : (item.foto ? `<span class="org-avatar"><img src="${item.foto}" alt="${item.nama}"></span>` : `<span class="org-avatar org-avatar--initials">${initialsNama(item.nama)}</span>`);
    isiKotak = `
      ${avatar}
      ${item.jabatan ? `<span class="org-role">${item.jabatan}</span>` : ''}
      ${item.nama ? `<span class="org-name">${item.nama}</span>` : ''}
    `;
  }

  return `
    <li>
      <div class="${boxClass}">${isiKotak}</div>
      ${anak.length ? `<ul>${anak.map((a) => buatNodeOrg(a, semuaData)).join('')}</ul>` : ''}
    </li>
  `;
}

function renderOrgTree(containerId, data) {
  const container = document.getElementById(containerId);
  const root = data.find((d) => d.parent === null);
  if (!container || !root) return;
  container.innerHTML = `<ul class="org-chart">${buatNodeOrg(root, data)}</ul>`;
}

function renderPokja() {
  const grid = document.getElementById('pokjaGrid');
  if (!grid) return;
  grid.innerHTML = pokjaData.map((p) => `
    <div class="pokja-card">
      <h4>${p.nama}</h4>
      <p class="pokja-ketua">${p.ketuaFoto ? `<img src="${p.ketuaFoto}" alt="${p.ketua}" class="pokja-foto">` : ''}Ketua: ${p.ketua}</p>
      <ul>
        ${p.anggota.map((a) => `<li>${a.foto ? `<img src="${a.foto}" alt="${a.nama}" class="pokja-foto">` : ''}${a.nama}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

/* Catatan: renderOrgTree()/renderPokja() dipanggil di initSemua() di
   bawah, setelah sheets-sync dicoba dulu. */

/* =========================================================
   4) PETA INTERAKTIF (Leaflet + OpenStreetMap — gratis, tanpa API key)
   Dibungkus pengecekan supaya kalau Leaflet gagal dimuat (mis. CDN
   diblokir jaringan), fitur lain di halaman (kartu, tab struktur) tetap jalan.
   ========================================================= */
function initPeta() {
  const petaElement = document.getElementById('petaWilayah');
  if (!petaElement) return;
  if (typeof L === 'undefined') {
    console.warn('Leaflet tidak termuat — peta dilewati, fitur lain tetap berjalan.');
  } else {
    const peta = L.map('petaWilayah', { scrollWheelZoom: false }).setView([2.6495, 98.8615], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(peta);

  // Ikon bulat berwarna per kategori (tanpa file gambar tambahan)
  function buatIkon(warna) {
    return L.divIcon({
      className: '',
      html: `<span class="marker-pin" style="background:${warna}"></span>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -12]
    });
  }
  const warnaKategori = {
    wisata: '#C79A3E',
    umkm: '#A13D3D',
    homestay: '#2C6E7F',
    pemandangan: '#4C8C4A'
  };

  // Kelompokkan marker per kategori supaya bisa difilter
  const layerKategori = { wisata: L.layerGroup(), umkm: L.layerGroup(), homestay: L.layerGroup(), pemandangan: L.layerGroup() };

  Object.keys(lokasiData).forEach((kategori) => {
    lokasiData[kategori].forEach((lokasi) => {
      const marker = L.marker([lokasi.lat, lokasi.lng], { icon: buatIkon(warnaKategori[kategori]) });
      marker.bindPopup(`
        <span class="popup-kategori ${kategori}">${kategori}</span>
        <h4 class="popup-title">${lokasi.nama}</h4>
        <p class="popup-desc">${lokasi.deskripsi}</p>
        <a class="popup-link" href="${tautanMaps(lokasi)}" target="_blank" rel="noopener">Buka di Google Maps &rarr;</a>
      `);
      marker.addTo(layerKategori[kategori]);
    });
  });

  // Tampilkan semua kategori di awal
  Object.values(layerKategori).forEach((layer) => layer.addTo(peta));

  // Filter kategori
  const filterButtons = document.querySelectorAll('#mapFilter .filter-btn');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const pilihan = btn.dataset.kategori;

      Object.entries(layerKategori).forEach(([kategori, layer]) => {
        peta.removeLayer(layer);
        if (pilihan === 'semua' || pilihan === kategori) {
          layer.addTo(peta);
        }
      });
    });
  });
} // akhir blok "else" (Leaflet berhasil dimuat)
} // akhir function initPeta()

/* =========================================================
   5) TAB STRUKTUR ORGANISASI (Pemerintahan Desa / BPD / TP PKK)
   ========================================================= */
const strukturTabs = document.querySelectorAll('#strukturTabs .filter-btn');
const strukturPanels = document.querySelectorAll('[data-panel]');
strukturTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    strukturTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    strukturPanels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== target;
    });
  });
});

/* =========================================================
   6) INISIALISASI — coba tarik data terbaru dari Firebase dulu,
   lalu Google Sheets (kalau Firebase tidak aktif), baru render semua
   tampilan. Kalau semuanya tidak ada/gagal, otomatis lanjut pakai
   data lokal (lokasi-data.js / struktur-data.js) — website tetap
   tampil normal apa pun yang terjadi.
   ========================================================= */
(async function initSemua() {
  if (typeof firebaseSyncMuatSemua === 'function') {
    try {
      const r = await firebaseSyncMuatSemua();
      if (r.aktif) console.info('[init] Sumber data: Firebase', r.gagal?.length ? `(sebagian fallback: ${r.gagal.join('; ')})` : '(semua berhasil)');
    } catch (err) {
      console.warn('firebase-sync gagal total:', err);
    }
  }
  if (typeof sheetsSyncMuatSemua === 'function' && !(typeof FIREBASE_CONFIG !== 'undefined' && FIREBASE_CONFIG.AKTIF)) {
    try {
      await sheetsSyncMuatSemua();
    } catch (err) {
      console.warn('sheets-sync gagal total, pakai data lokal:', err);
    }
  }

  // Setiap panggilan dibungkus try/catch sendiri-sendiri — supaya halaman yang
  // tidak memuat salah satu file data (mis. wisata.html tanpa struktur-data.js)
  // tidak membuat bagian LAIN yang justru relevan di halaman itu ikut gagal.
  const amankan = (fn) => { try { fn(); } catch (err) { console.warn('[init] Lewati satu bagian:', err.message); } };

  amankan(renderProfil);
  amankan(renderWisata);
  amankan(renderUmkm);
  amankan(renderHomestay);
  amankan(renderPemandangan);
  amankan(renderBerita);
  amankan(() => renderKegiatan('Kelompok 1'));
  amankan(initKegiatanFilterButtons);
  amankan(() => renderOrgTree('orgPemerintah', strukturPemerintah));
  amankan(() => renderOrgTree('orgBPD', strukturBPD));
  amankan(() => renderOrgTree('orgPKK', strukturPKK));
  amankan(renderPokja);
  amankan(initPeta);
  amankan(initSaranForm);
})();
