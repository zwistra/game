# Rakit Komputer Arena — Pengenalan Arsitektur Komputer (Topik 1)
Media pembelajaran interaktif berbentuk lomba kuis 3 ronde (28 soal) untuk siswa SMA/SMK. Berjalan di browser HP/laptop, tanpa instalasi, tanpa internet saat dimainkan.

## Isi materi (sesuai fokus Topik 1)
- **Ronde 1 — Rakit Sistem (8):** mengelompokkan komponen → Input / Proses / Memori & Penyimpanan / Output.
- **Ronde 2 — Arsitektur atau Organisasi? (10):** membedakan atribut yang terlihat programmer vs realisasi perangkat keras.
- **Ronde 3 — Kilat Konsep (10):** definisi komputer, CPU, ALU, RAM vs SSD, bus, stored-program, hardware vs software.
Setiap jawaban disertai penjelasan singkat; akhir permainan menampilkan daftar soal yang salah untuk dipelajari ulang.

## Cara menjalankan lomba (untuk panitia/guru)
1. Hosting (lihat panduan GitHub Pages) atau buka lewat server lokal; bagikan link `index.html` ke siswa.
2. Buka `panitia.html` → klik **Acak** → umumkan **Kode Lomba** itu ke peserta tepat saat lomba dimulai (jangan jauh-jauh hari).
3. Bagikan **Kode Siswa** unik (mis. A01–A30), bukan nama lengkap.
4. Peserta: Mode Lomba → isi Kode Siswa + Kode Lomba → bermain → menyerahkan **Kode Hasil** (18 karakter) ke panitia.
5. Panitia tempel semua Kode Hasil di `panitia.html` → **Proses Peringkat** → unduh CSV / salin tabel.
Skor: 100/benar + bonus cepat (maks 50) + bonus beruntun (maks 50). Seri: jumlah benar → total waktu menjawab tercepat.

## Batasan yang jujur
- Tanpa server, sehingga tidak ada leaderboard otomatis. Kode Hasil memakai checksum yang terikat Kode Lomba: menolak salah ketik, kode dari lomba lain, dan skor yang diedit sembarangan. Namun siswa yang membaca source code *bisa* memalsukannya — awasi lomba secara langsung (layar dilihat, satu kesempatan per kode, pindah halaman = soal dianggap salah).
- "Satu kesempatan" ditegakkan per perangkat (localStorage); siswa yang berganti perangkat/menghapus data bisa mencoba lagi. Panel panitia menandai siswa dengan >1 kode.
- Media ini adalah **aktivitas/simulasi** dalam pembelajaran. Pre-test dan post-test sesuai panduan tugas tetap dibuat terpisah (kisi-kisi indikator setara).
- Etika: umumkan pemenang dengan Kode Siswa; minta izin sekolah sebelum mempublikasikan hasil/foto siswa.
- Periksa ulang format sitasi sumber (Stallings, *Computer Organization and Architecture*, edisi yang kalian pakai) di Daftar Pustaka laporan.

## Teknis
HTML/CSS/JS murni; CSP ketat, tanpa `innerHTML`/`eval`/jaringan. Uji otomatis: `node tests/test.js` (soal, skor, fuzz, kode, peringkat) dan `node tests/smoke.js` (alur UI).
Fitur HP: layar penuh (⛶), layar tetap menyala, getar saat salah, tombol besar. Layar penuh tidak tersedia di iPhone Safari.
