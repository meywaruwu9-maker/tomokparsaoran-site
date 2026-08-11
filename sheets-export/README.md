Langkah impor CSV ke Google Sheets (ikuti PANDUAN-GOOGLE-SHEETS.md):

1. Buka Google Sheets kosong atau sheet yang sudah Anda buat untuk website.
2. Pastikan sheet dibagikan sebagai "Anyone with the link — Viewer".
3. Untuk setiap CSV di folder ini, buat tab baru di Google Sheets dengan NAMA TAB yang persis seperti di bawah:
   - Wisata
   - UMKM
   - Homestay
   - Pemandangan
   - Berita
   - KegiatanKKN
   - Profil
   - Pemerintah
   - BPD
   - PKK
   - Pokja

4. Untuk setiap tab: klik menu `File` → `Import` → `Upload` → pilih file CSV terkait.
   - Pilih opsi `Replace data at selected sheet` (atau jika tab baru, pilih `Create new sheet`).
   - Pastikan baris pertama CSV tetap ada (judul kolom) dan tidak terhapus.

5. Setelah semua tab terisi, buka `js/sheets-sync.js` dan pastikan `SHEETS_CONFIG.SPREADSHEET_ID` berisi ID dari URL Google Sheets Anda.
   Contoh URL: `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit`

6. Refresh website (CTRL+F5). Jika sukses, console browser akan menampilkan `[sheets-sync]` hasil muat. Jika sebagian tab gagal, website tetap pakai data lokal untuk tab yang gagal.

Catatan:
- Nama kolom harus sesuai dengan header CSV; jangan ubah nama kolom kecuali Anda juga menyesuaikan `js/sheets-sync.js`.
- Untuk upload cepat, Anda juga bisa `Import` dan memilih opsi `Replace current sheet` pada tab yang sesuai.
