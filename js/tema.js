/* =========================================================
   TEMA.JS — menerapkan warna terpilih ke seluruh halaman
   =========================================================
   Dipakai bareng oleh index.html DAN kelola.html. Taruh script
   ini di <head>, tepat setelah css/style.css, supaya warna
   langsung benar sejak awal (tidak ada kedipan warna default).
   ========================================================= */

function ambilWarnaAktif() {
  if (temaData.aktif === 'custom') {
    // custom hanya dipakai kalau semua 5 warna terisi; kalau ada yang kosong, jatuh ke preset default
    const c = temaData.customAktif;
    if (c && c.navy && c.teal && c.sand && c.ulosRed && c.ulosGold) return c;
  }
  return temaPreset[temaData.aktif] || temaPreset['toba-klasik'];
}

function terapkanTema(warna) {
  const root = document.documentElement.style;
  root.setProperty('--navy', warna.navy);
  root.setProperty('--teal', warna.teal);
  root.setProperty('--sand', warna.sand);
  root.setProperty('--ulos-red', warna.ulosRed);
  root.setProperty('--ulos-gold', warna.ulosGold);
}

terapkanTema(ambilWarnaAktif());
