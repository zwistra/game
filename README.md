# Rakit Komputer Arena — Pengenalan Arsitektur Komputer (Topik 1)
Media pembelajaran interaktif berbentuk lomba kuis 3 ronde (28 soal) untuk siswa SMA/SMK. Berjalan di browser HP/laptop, tanpa instalasi, tanpa internet saat dimainkan.

## Isi materi (sesuai fokus Topik 1)
- **Ronde 1 — Rakit Sistem (8):** mengelompokkan komponen → Input / Proses / Memori & Penyimpanan / Output.
- **Ronde 2 — Arsitektur atau Organisasi? (10):** membedakan atribut yang terlihat programmer vs realisasi perangkat keras.
- **Ronde 3 — Kilat Konsep (10):** definisi komputer, CPU, ALU, RAM vs SSD, bus, stored-program, hardware vs software.
Setiap jawaban disertai penjelasan singkat; akhir permainan menampilkan daftar soal yang salah untuk dipelajari ulang.

## Cara menjalankan lomba (untuk panitia/guru)
1. Hosting (lihat panduan GitHub Pages) lalu bagikan link `index.html` ke siswa.
2. **Kode Lomba tetap: `ARSKOM26`** (ubah di `assets/js/config.js` bila perlu, 3–12 huruf/angka). Umumkan ke peserta saat lomba dimulai.
3. Peserta: Mode Lomba → isi **Nama** + Kode Lomba → bermain → layar hasil menampilkan nama, skor, jumlah benar, dan waktu.
4. Panitia mencatat hasil dari layar peserta (atau peserta menekan **Salin Hasil** dan mengirimkannya ke panitia).
5. Buka `panitia.html`, tempel/ketik satu baris per peserta dengan format `Nama; skor; benar; waktu`
   (contoh: `Budi Santoso; 3250; 22/28; 180`) → **Proses Peringkat** → unduh CSV / salin tabel.
Skor: 100/benar + bonus cepat (maks 50) + bonus beruntun (maks 50). Seri: jumlah benar → total waktu menjawab tercepat.

## Batasan yang jujur
- Tanpa server, sehingga tidak ada leaderboard otomatis dan hasil **tidak memiliki tanda keamanan**: peserta bisa mengubah angka saat menyalin/mengetik, dan Kode Lomba tetap dapat dibaca dari source code. Karena itu cocokkan dengan layar peserta di tempat dan awasi lomba langsung. Panel panitia hanya menolak baris yang formatnya salah atau skornya tidak sesuai jumlah benar.
- "Satu kesempatan per nama" hanya berlaku per perangkat (localStorage); peserta yang berganti perangkat/menghapus data bisa mencoba lagi. Meninggalkan halaman saat lomba membuat soal yang sedang berjalan dianggap salah.
- Media ini adalah **aktivitas/simulasi** dalam pembelajaran. Pre-test dan post-test sesuai panduan tugas dibuat terpisah (kisi-kisi indikator setara).
- Etika: nama siswa hanya ada di layar/perangkat peserta dan panel panitia. Untuk laporan tugas gunakan kode/inisial, bukan nama lengkap; minta izin sekolah sebelum mengumumkan atau memublikasikan hasil individual.
- Periksa ulang format sitasi sumber (Stallings, *Computer Organization and Architecture*, edisi yang kalian pakai) di Daftar Pustaka laporan.

## Teknis
HTML/CSS/JS murni; CSP ketat, tanpa `innerHTML`/`eval`/jaringan. Uji otomatis: `node tests/test.js` (soal, skor, fuzz, nama, parser hasil, peringkat) dan `node tests/smoke.js` (alur UI).
Fitur HP: layar penuh (⛶), layar tetap menyala, getar saat salah, tombol besar. Layar penuh tidak tersedia di iPhone Safari.
