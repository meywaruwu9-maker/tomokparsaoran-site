/* =========================================================
   DATA LOKASI — DESA TOMOK
   =========================================================
   Ini semacam "database" sederhana untuk peta interaktif.
   Titik-titik di bawah SUDAH memakai koordinat asli (hasil
   verifikasi dari Google Maps) untuk lokasi yang sudah pasti.

   CARA MENAMBAH LOKASI BARU (tanpa perlu bisa coding):
   1. Buka Google Maps di HP/laptop, cari lokasinya.
   2. Tekan lama titik yang tepat di peta sampai muncul pin merah.
   3. Ketuk pin itu — koordinat (contoh: 2.6513151, 98.8605820)
      akan muncul di kotak pencarian, tinggal disalin.
   4. Salin salah satu blok { ... } di kategori yang sesuai di
      bawah ini, tempel tepat di atas tanda "]" penutup array,
      lalu ganti nama, lat, lng, deskripsi sesuai lokasi baru.
   5. Untuk "placeId": klik nama tempat di Google Maps → klik
      "Share/Bagikan" → salin link → placeId ada di dalam link
      itu (opsional, boleh dikosongkan jika belum tahu).
   ========================================================= */

const lokasiData = {

  // ===== WISATA & DAYA TARIK =====
  wisata: [
    {
      nama: "Makam Raja Sidabutar",
      lat: 2.6513151,
      lng: 98.8605820,
      alamat: "Tomok, Kec. Simanindo, Kab. Samosir",
      deskripsi: `Terletak di Desa Tomok Parsaoran, Pulau Samosir, kompleks Makam Raja Sidabutar merupakan salah satu situs budaya berusia sekitar 500 tahun yang menjadi simbol sejarah masyarakat Batak Toba. Kompleks ini dipercaya sebagai tempat peristirahatan Raja Sidabutar, tokoh yang diyakini sebagai pemimpin pertama yang menetap dan membangun wilayah Tomok bersama keturunannya. Keunikan situs ini terletak pada sarkofagus, yaitu peti makam yang dipahat dari satu batu utuh tanpa menggunakan semen atau bahan perekat. Kemampuan masyarakat Batak pada masa lampau dalam membentuk batu menjadi makam yang kokoh menunjukkan tingginya nilai seni, teknologi, dan kearifan lokal yang dimiliki. Berbagai ukiran gorga yang menghiasi makam juga memiliki makna filosofis, seperti keberanian (merah), kesucian (putih), dan kewibawaan (hitam), yang dikenal sebagai Tiga Bolon dalam budaya Batak.

Di balik nilai sejarahnya, kompleks makam ini juga mengimpan legenda yang diwariskan secara turun-temurun. Salah satunya adalah kisah Raja Sidabutar dan Antani Boru Pandiangan, cinta sejatinya yang konon tidak dapat bersatu hingga akhir hayat karena perbedaan adat atau tidak mendapat restu. Sebagai penghormatan terhadap kisah tersebut, terdapat pahatan kepala seorang perempuan di bagian belakang makam Raja Sidabutar yang dipercaya menggambarkan sosok Antani.

Hingga kini, kompleks Makam Raja Sidabutar tidak hanya menjadi tujuan wisata sejarah, tetapi juga menjadi pengingat akan kekayaan budaya, kepercayaan, dan nilai-nilai luhur masyarakat Batak Toba yang terus diwariskan dari generasi ke generasi. Informasi penting: Situs sejarah ini tidak memberlakukan tiket masuk (Gratis). Wisatawan dibebaskan mengeksplorasi area makam secara sopan. Pihak pengelola menyediakan jasa pemandu wisata lokal (local guide) yang siap membagikan kisah detail sejarah makam. Tidak ada tarif kaku untuk jasa pemandu ini; pengunjung dapat memberikan donasi sukarela. Seluruh hasil donasi tersebut langsung disalurkan untuk biaya kebersihan harian, perawatan berkala batu makam, dan pelestarian area situs budaya.`,
      rating: 4.4,
      placeId: "ChIJdfiog5TpMTARipaytZUBLsQ",
      foto: [
        "assets/images/wisata/Makam/WhatsApp Image 2026-08-02 at 04.30.12.jpeg",
        "assets/images/wisata/Makam/WhatsApp Image 2026-08-02 at 04.30.13.jpeg",
        "assets/images/wisata/Makam/WhatsApp Image 2026-08-02 at 04.30.14.jpeg",
        "assets/images/wisata/Makam/WhatsApp Image 2026-08-02 at 04.30.15.jpeg"
      ]
    },
    {
      nama: "Museum Batak Tomok",
      lat: 2.6506312,
      lng: 98.8601052,
      alamat: "Tomok, Kec. Simanindo, Kab. Samosir",
      deskripsi: `Museum Batak di Pasar Tomok Parsaoran merupakan tempat yang menyimpan berbagai peninggalan sejarah dan budaya masyarakat Batak Toba. Bangunannya dirancang menyerupai Rumah Bolon (rumah adat Batak) dengan ukiran khas gorga yang menghiasi dinding dan bagian bangunan. Arsitektur tradisional ini mencerminkan filosofi, nilai budaya, dan identitas masyarakat Batak yang diwariskan secara turun-temurun.
Memasuki museum ini, pengunjung seolah diajak kembali ke masa lalu. Berbagai koleksi yang dipamerkan menggambarkan kehidupan masyarakat Batak Toba, mulai dari sistem pemerintahan kerajaan, adat istiadat, hingga aktivitas sehari-hari.
Melalui koleksi-koleksi tersebut, Museum Batak tidak hanya menjadi tempat penyimpanan benda bersejarah, tetapi juga menjadi ruang pembelajaran yang membantu pengunjung memahami perjalanan sejarah, kebudayaan, dan kearifan lokal masyarakat Batak Toba dari generasi ke generasi.
Berikut adalah beberapa koleksi yang dapat dijumpai di Museum Batak. Masing-masing artefak menjadi bukti perjalanan sejarah, budaya, dan kehidupan masyarakat Batak Toba pada masa lampau:`,
      rating: 4.3,
      placeId: "ChIJ__0XkZTpMTARSHs4bOtQ86c",
      foto: [
        "assets/images/wisata/Museum/WhatsApp Image 2026-08-02 at 04.28.54.jpeg",
        "assets/images/wisata/Museum/WhatsApp Image 2026-08-02 at 04.28.542.jpeg",
        "assets/images/wisata/Museum/WhatsApp Image 2026-08-02 at 04.28.552.jpeg",
        "assets/images/wisata/Museum/WhatsApp Image 2026-08-02 at 04.28.554.jpeg"
      ]
    },
    {
      nama: "Pasar Tomok",
      lat: 2.6535511,
      lng: 98.8608324,
      alamat: "Tomok, Kec. Simanindo, Kab. Samosir",
      deskripsi: `Pasar Tomok merupakan salah satu kawasan wisata yang menjadi pusat aktivitas ekonomi dan budaya masyarakat Desa Tomok Parsaoran, Pulau Samosir. Kawasan ini berkembang mengikuti jalur perjalanan wisatawan dari pelabuhan menuju Desa Wisata Tomok dan kompleks Makam Raja Sidabutar, sehingga menjadi tempat berkumpulnya para pedagang yang menawarkan berbagai produk khas Batak Toba.
Di sepanjang koridor Pasar Tomok, wisatawan dapat menemukan beragam oleh-oleh dan kerajinan lokal, seperti kain ulos, ukiran kayu, miniatur Rumah Bolon, aksesori khas Batak, produk berbahan gorga, hingga pakaian bertema Panau Toba. Selain berbelanja, pengunjung juga dapat merasakan suasana khas masyarakat Batak melalui interaksi langsung dengan para pedagang yang ramah dan terbuka terhadap wisatawan.
Pasar Tomok juga memiliki hubungan erat dengan kebudayaan Batak, salah satunya melalui pertunjukan Si Gale-Gale yang menjadi daya tarik utama kawasan ini. Pertunjukan tersebut menghadirkan pengalaman budaya yang memungkinkan wisatawan mengenal lebih dekat kesenian tradisional Batak Toba.
Tidak hanya sebagai tempat berbelanja, Pasar Tomok menjadi ruang pertemuan antara masyarakat lokal dan wisatawan, sekaligus menjadi bagian penting dalam menjaga keberlangsungan ekonomi kreatif dan budaya Desa Tomok Parsaoran.`,
      rating: 4.4,
      placeId: "ChIJcT998pPpMTAR-DMR2FYpvxQ",
      foto: [
        "assets/images/wisata/Pasar Tomok/WhatsApp Image 2026-08-02 at 04.31.35.jpeg",
        "assets/images/wisata/Pasar Tomok/WhatsApp Image 2026-08-02 at 04.31.36.jpeg",
        "assets/images/wisata/Pasar Tomok/WhatsApp Image 2026-08-02 at 04.31.37.jpeg",
        "assets/images/wisata/Pasar Tomok/WhatsApp Image 2026-08-02 at 04.31.372.jpeg"
      ]
    },
    {
      nama: "Sigale-gale",
      lat: 2.6551659,
      lng: 98.8579729,
      alamat: "Jl. Pelabuhan Tomok, Kec. Simanindo, Kab. Samosir",
      deskripsi: "Sigale-gale : Dari Ritual Spiritual ke Panggung Budaya — pertunjukan boneka tradisional Batak yang hidupkan warisan adat di dermaga Tomok. Wisatawan feri Ajibata/Parapat disambut dengan atraksi gondang, gerakan boneka yang menyerupai manusia, dan suasana adat yang sakral. Destinasi ini menjadi gerbang budaya Pulau Samosir, cocok untuk foto, belajar tradisi, dan merasakan kekayaan budaya Batak yang memikat.",
      rating: 4.2,
      placeId: "ChIJh_UN-fDpMTARD6HfNTv8lXI",
      foto: [
        "assets/images/wisata/Sigale gale/WhatsApp Image 2026-08-02 at 04.24.27.jpeg",
        "assets/images/wisata/Sigale gale/WhatsApp Image 2026-08-02 at 04.24.28.jpeg",
        "assets/images/wisata/Sigale gale/WhatsApp Image 2026-08-02 at 04.24.280.jpeg",
        "assets/images/wisata/Sigale gale/WhatsApp Image 2026-08-02 at 04.24.28p.jpeg"
      ]
    }
  ],

  // ===== UMKM =====
  // Baru berisi 1 contoh nyata yang sudah terverifikasi. Tambahkan
  // UMKM lain (kios ulos, ukiran, kuliner, dst) dengan pola yang sama.
  umkm: [
    {
      nama: "Volcano coffee",
      lat: 2.6530804,
      lng: 98.8612812,
      alamat: "MV36+5GX, Jl. Horas, Tomok, Simanindo, Kabupaten Samosir, Sumatera Utara 22395",
      deskripsi: "Tempat ngopi asik di Tomok. Kami memesan menu samosir latte dan kopi susu gula aren.",
      kontak: "null",
      rating: 4.9,
      placeId: "ChIJPbmCTwDpMTARScfeGyAhZHM",
      foto :"C:\\Users\\LENOVO\\OneDrive\\Pictures\\Screenshots\\Screenshot 2026-08-02 145956.png"
       },
    // Tambah UMKM baru di sini. Contoh format lengkap ada di README.md.
  ],

  // ===== PEMANDANGAN & SPOT FOTO =====
  // Catatan: 2 titik di bawah berjarak ±3-4 km di selatan pusat Tomok
  // (arah jalan ke Tuktuk) — sudah pasti dekat & relevan buat wisatawan
  // di kawasan Tomok, tapi belum tentu persis di dalam garis batas
  // administratif Desa Tomok Parsaoran (lihat catatan batas wilayah
  // di README perihal keterbatasan data batas desa).
  pemandangan: [
    {
      nama: "Pertunjukan Tari Sigalegale",
      lat: 2.6517728,
      lng: 98.8607769,
      alamat: "Jalur Tomok parsaoran, Kec. Simanindo, Kab. Samosir",
      deskripsi: "Spot foto Dengan patung sigale-gale.",
      rating: 4.5,
      placeId: "ChIJZXlZeZPpMTARVXsbUHFqV0I",
      foto: "D:\\KKN PDD\\unnamed.jpg"
    },
    {
      nama: "Sigale-Gale Pertama Di Tomok",
      lat: 2.6473673,
      lng: 98.8596516,
      alamat: "Jalur Tomok Parsaoran, Kec. Simanindo, Kab. Samosir",
      deskripsi: "SIgale gale pertama di desa tomok parsaoran.",
      rating: 4.6,
      foto: "assets/images/wisata/Sigale gale/Patung-Sigale-Gale-Patung-Bersejarah-Di-Tomok-Danau-Toba.jpeg",
      getGoogleMapsLink: function(lat, lng) {
        return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }
    }
  ],

  // ===== HOMESTAY & PENGINAPAN =====
  homestay: [
    {
      nama: "UNIQDO INN Tomok",
      lat: 2.6454491,
      lng: 98.8544130,
      alamat: "Parsaoran, Jl. Sigambal, Tomok",
      deskripsi: "Homestay dengan suasana tenang, dekat pelabuhan dan pasar suvenir, cocok untuk keluarga/rombongan.",
      kontak: "0821-6601-8014",
      rating: 4.9,
      placeId: "ChIJ0a74fkrpMTAR-L36FisdbSU"
    },
    {
      nama: "Royal Toba Inn",
      lat: 2.6570057,
      lng: 98.8533554,
      alamat: "Jl. Horas Tomok Tomok",
      deskripsi: "Letaknya yang dekat dengan Pelabuhan Sumber Sari menjadi salah satu kenapa memilih penginapan ini.",
      kontak: "0813-7528-7629",
      rating: 4.5,
      placeId: "ChIJxddqn5PpMTAR04k9nwppslk"
    },
    {
      nama: "Marina cottage",
      lat: 2.6530244,
      lng: 98.8489669,
      alamat: "Tomok, Simanindo, Kabupaten Samosir, Sumatera Utara 22395",
      deskripsi: "Homestay ini sudah di renovasi menjadi bagus kali. Pelayanan nya disini juga luar biasa, mulai dari welcoming sampe dengan last day.",
      kontak: "08211-322-7082",
      rating: 4.8,
      placeId: " ChIJBVfA5qvpMTARUNKZNm9jWxA"
    },
    {
      nama: "Penginapan Poda Nauli",
      lat: 2.6577132,
      lng: 98.8532357,
      alamat: "Jl. Horas No.11B, Kelurahan Tomok Parsaoran, Simanindo, Kabupaten Samosir, Sumatera Utara 22395",
      deskripsi: "Poda homestay benar-benar tempat menginap yang nyaman.",
      kontak: "0813-6199-1081",
      rating: 5.0,
      placeId: "ChIJ9fIfyjLpMTARMvygCg-BA_E"
    },
    { 
    nama: "Unedo penginapan dan homestay",
      lat: 2.6528711,
      lng: 98.8532835,
      alamat: "Jln sosor galung parsaoran, Garoga, Simanindo, Kabupaten Samosir, Sumatera Utara 22395",
      deskripsi: "Poda homestay benar-benar tempat menginap yang nyaman.",
      kontak: "0823-7253-7375",
      rating: 5.0,
      placeId: " ChIJp_a0AYvpMTARw_N7r6sXroA"
    },
  ]
};
