/* =========================================================
   KELOLA-TEMA.JS — logic tab "🎨 Tampilan" di kelola.html
   =========================================================
   Berlaku untuk index.html DAN kelola.html sekaligus (keduanya
   pakai variabel CSS yang sama, lihat js/tema.js).
   ========================================================= */

let temaAktifSekarang = temaData.aktif;
let temaCustomSekarang = { ...temaData.customAktif };

const labelWarna = { navy: 'Latar Gelap (navy)', teal: 'Aksen Kedua (teal)', sand: 'Latar Terang (sand)', ulosRed: 'Aksen Merah', ulosGold: 'Aksen Emas' };

function renderPresetGrid() {
  const grid = document.getElementById('temaPresetGrid');
  grid.innerHTML = Object.entries(temaPreset).map(([key, p]) => `
    <button type="button" class="tema-preset-card ${temaAktifSekarang === key ? 'aktif' : ''}" data-preset="${key}">
      <span class="tema-preset-dots">
        <span style="background:${p.navy}"></span><span style="background:${p.teal}"></span><span style="background:${p.sand}"></span><span style="background:${p.ulosRed}"></span><span style="background:${p.ulosGold}"></span>
      </span>
      <strong>${p.nama}</strong>
      <small>${p.deskripsi}</small>
    </button>
  `).join('');
}

function renderCustomGrid() {
  const grid = document.getElementById('temaCustomGrid');
  grid.innerHTML = Object.keys(labelWarna).map((k) => `
    <label class="tema-custom-item">
      ${labelWarna[k]}
      <input type="color" data-warna="${k}" value="${temaCustomSekarang[k] || temaPreset[temaAktifSekarang]?.[k] || temaPreset['toba-klasik'][k]}">
    </label>
  `).join('');
}

function warnaSaatIni() {
  const semuaCustomTerisi = Object.keys(labelWarna).every((k) => temaCustomSekarang[k]);
  if (semuaCustomTerisi) return temaCustomSekarang;
  return temaPreset[temaAktifSekarang] || temaPreset['toba-klasik'];
}

function segarkanTampilan() {
  terapkanTema(warnaSaatIni());
  renderPresetGrid();
  document.getElementById('statusTema').textContent = '';
}

amanEvent('temaPresetGrid', 'click', (e) => {
  const btn = e.target.closest('.tema-preset-card');
  if (!btn) return;
  temaAktifSekarang = btn.dataset.preset;
  temaCustomSekarang = { navy: '', teal: '', sand: '', ulosRed: '', ulosGold: '' }; // pilih preset membatalkan custom
  renderCustomGrid();
  segarkanTampilan();
});

amanEvent('temaCustomGrid', 'input', (e) => {
  const warna = e.target.dataset.warna;
  if (!warna) return;
  temaCustomSekarang[warna] = e.target.value;
  segarkanTampilan();
});

amanEvent('btnResetTema', 'click', () => {
  temaAktifSekarang = 'toba-klasik';
  temaCustomSekarang = { navy: '', teal: '', sand: '', ulosRed: '', ulosGold: '' };
  renderCustomGrid();
  segarkanTampilan();
});

async function simpanTema() {
  const status = document.getElementById('statusTema');
  const dataTersimpan = { aktif: Object.keys(labelWarna).every((k) => temaCustomSekarang[k]) ? 'custom' : temaAktifSekarang, customAktif: temaCustomSekarang };

  if (typeof modeLive !== 'undefined' && modeLive && typeof fbDb !== 'undefined' && fbDb) {
    status.textContent = 'Menyimpan…';
    try {
      await fbDb.collection('pengaturan').doc('tema').set(dataTersimpan);
      status.textContent = '✅ Tersimpan — tampilan langsung berubah untuk semua pengunjung begitu direfresh.';
    } catch (err) {
      status.textContent = '❌ Gagal menyimpan: ' + err.message;
    }
  } else {
    const isi = `/* =========================================================
   DATA TEMA — dihasilkan lewat kelola.html
   ========================================================= */

const temaPreset = ${JSON.stringify(temaPreset, null, 2)};

const temaData = ${JSON.stringify(dataTersimpan, null, 2)};
`;
    unduhFile('tema-data.js', isi);
    status.textContent = 'File tema-data.js diunduh — unggah ke folder js/ di GitHub untuk menerapkannya (lihat README).';
  }
}
amanEvent('btnSimpanTema', 'click', simpanTema);

/* =========================================================
   INIT
   ========================================================= */
renderPresetGrid();
renderCustomGrid();
