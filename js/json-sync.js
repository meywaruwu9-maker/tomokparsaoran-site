/* =========================================================
   JSON-SYNC.JS — fallback data source untuk Decap CMS / JSON
   =========================================================
   Jika file data/*.json ada, website akan memuatnya sebelum render.
   Ini tidak menggantikan data lokal .js yang masih dipakai sebagai
   fallback ketika JSON tidak tersedia.
   ========================================================= */

function gantiIsiArrayJSON(arr, isiBaru) {
  if (!Array.isArray(isiBaru)) return;
  arr.length = 0;
  isiBaru.forEach((item) => arr.push(item));
}

function gantiPropertyJSON(target, sumber) {
  if (!sumber || typeof sumber !== 'object') return;
  Object.keys(sumber).forEach((key) => {
    target[key] = sumber[key];
  });
}

function normalizeLokasiItem(item) {
  if (!item || typeof item !== 'object') return item;
  item.placeId = String(item.placeId || '').trim();
  if (item.foto && typeof item.foto === 'string') {
    const fotoList = item.foto
      .split(/[\n,;|]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    item.foto = fotoList.length > 1 ? fotoList : fotoList[0] || '';
  }
  return item;
}

async function jsonSyncMuatSemua() {
  if (typeof fetch !== 'function') return { aktif: false };
  const sumber = [
    {
      url: 'data/lokasi.json',
      handler: (data) => {
        if (!data || typeof data !== 'object') return;
        if (Array.isArray(data.wisata)) gantiIsiArrayJSON(lokasiData.wisata, data.wisata.map(normalizeLokasiItem));
        if (Array.isArray(data.umkm)) gantiIsiArrayJSON(lokasiData.umkm, data.umkm.map(normalizeLokasiItem));
        if (Array.isArray(data.pemandangan)) gantiIsiArrayJSON(lokasiData.pemandangan, data.pemandangan.map(normalizeLokasiItem));
        if (Array.isArray(data.homestay)) gantiIsiArrayJSON(lokasiData.homestay, data.homestay.map(normalizeLokasiItem));
      }
    },
    {
      url: 'data/struktur.json',
      handler: (data) => {
        if (!data || typeof data !== 'object') return;
        if (Array.isArray(data.strukturPemerintah)) gantiIsiArrayJSON(strukturPemerintah, data.strukturPemerintah);
        if (Array.isArray(data.strukturBPD)) gantiIsiArrayJSON(strukturBPD, data.strukturBPD);
        if (Array.isArray(data.strukturPKK)) gantiIsiArrayJSON(strukturPKK, data.strukturPKK);
        if (Array.isArray(data.pokjaData)) gantiIsiArrayJSON(pokjaData, data.pokjaData);
      }
    },
    {
      url: 'data/berita.json',
      handler: (data) => {
        if (!data || typeof data !== 'object') return;
        if (Array.isArray(data.beritaData)) gantiIsiArrayJSON(beritaData, data.beritaData);
      }
    },
    {
      url: 'data/kegiatan.json',
      handler: (data) => {
        if (!data || typeof data !== 'object') return;
        if (Array.isArray(data.kegiatanData)) gantiIsiArrayJSON(kegiatanData, data.kegiatanData);
      }
    },
    {
      url: 'data/profil.json',
      handler: (data) => {
        if (!data || typeof data !== 'object') return;
        gantiPropertyJSON(profilData, data);
      }
    },
    {
      url: 'data/tema.json',
      handler: (data) => {
        if (!data || typeof data !== 'object') return;
        gantiPropertyJSON(temaData, data);
      }
    }
  ];

  const hasil = { aktif: true, gagal: [] };
  await Promise.all(sumber.map(async (item) => {
    try {
      const res = await fetch(item.url, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      item.handler(data);
    } catch (err) {
      hasil.gagal.push(`${item.url}: ${err.message}`);
    }
  }));

  if (hasil.gagal.length) {
    console.info('[json-sync] Sebagian JSON tidak tersedia atau gagal dimuat:', hasil.gagal.join('; '));
  }

  return hasil;
}
