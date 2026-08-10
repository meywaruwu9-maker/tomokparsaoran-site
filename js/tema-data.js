/* =========================================================
   DATA TEMA — pilihan warna tampilan (website + kelola.html)
   =========================================================
   Mengubah warna di sini otomatis berlaku untuk KEDUA halaman
   (index.html dan kelola.html), karena keduanya memakai variabel
   CSS yang sama. Tidak perlu edit css/style.css sama sekali.

   "aktif": nama preset yang sedang dipakai. Isi "custom" kalau
   mau pakai warna bebas dari "customAktif" di bawah.
   ========================================================= */

const temaPreset = {
  'toba-klasik': {
    nama: 'Toba Klasik',
    deskripsi: 'Senja di Danau Toba — biru gelap & emas ulos (default)',
    navy: '#14303D', teal: '#2C6E7F', sand: '#F2E9D8', ulosRed: '#A13D3D', ulosGold: '#C79A3E'
  },
  'senja-samosir': {
    nama: 'Senja Samosir',
    deskripsi: 'Hangat seperti senja & terracotta atap rumah Bolon',
    navy: '#2E1912', teal: '#B85C38', sand: '#F5E8D3', ulosRed: '#8B2635', ulosGold: '#D4A344'
  },
  'hijau-pertanian': {
    nama: 'Hijau Pertanian',
    deskripsi: 'Hijau sawah & perbukitan Samosir',
    navy: '#16302B', teal: '#4F7A5C', sand: '#F3EEDF', ulosRed: '#A13D3D', ulosGold: '#C29A3D'
  },
  'monokrom-elegan': {
    nama: 'Monokrom Elegan',
    deskripsi: 'Minimalis & formal, satu warna aksen saja',
    navy: '#1C1C1C', teal: '#5C6670', sand: '#F0EEE9', ulosRed: '#A13D3D', ulosGold: '#8A8272'
  }
};

const temaData = {
  aktif: 'toba-klasik', // ganti ke salah satu key di atas, atau 'custom'
  customAktif: { navy: '', teal: '', sand: '', ulosRed: '', ulosGold: '' } // dipakai kalau aktif = 'custom'
};
