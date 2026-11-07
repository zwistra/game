'use strict';
/* Mesin kuis + kode hasil lomba (murni, tanpa DOM) — bisa diuji di Node. Topik: Pengenalan Arsitektur Komputer. */
(function (root) {
  const CATS1 = ['Input', 'Proses', 'Memori & Penyimpanan', 'Output'], CATS2 = ['Arsitektur', 'Organisasi'];
  const POOL1 = [
    { t: '⌨️ Keyboard', c: 0, w: 'Keyboard memasukkan data ke komputer, jadi ia perangkat Input.' },
    { t: '🖱️ Mouse', c: 0, w: 'Mouse mengirim gerakan dan klik ke komputer: perangkat Input.' },
    { t: '🎤 Mikrofon', c: 0, w: 'Mikrofon memasukkan suara ke komputer: perangkat Input.' },
    { t: '📷 Webcam', c: 0, w: 'Webcam menangkap gambar/video sebagai masukan: perangkat Input.' },
    { t: '🧠 CPU', c: 1, w: 'CPU mengambil, mengartikan, dan menjalankan instruksi: bagian Proses.' },
    { t: '🔢 ALU', c: 1, w: 'ALU (bagian dari CPU) mengerjakan operasi hitung dan logika: bagian Proses.' },
    { t: '🧩 RAM', c: 2, w: 'RAM adalah memori utama tempat kerja sementara CPU: Memori & Penyimpanan.' },
    { t: '💽 SSD', c: 2, w: 'SSD menyimpan data secara tetap: Memori & Penyimpanan.' },
    { t: '🗄️ Hard disk (HDD)', c: 2, w: 'Hard disk menyimpan data dalam jumlah besar secara tetap: Penyimpanan.' },
    { t: '💾 Flashdisk', c: 2, w: 'Flashdisk menyimpan dan memindahkan file: Penyimpanan.' },
    { t: '🖥️ Monitor', c: 3, w: 'Monitor menampilkan hasil pemrosesan: perangkat Output.' },
    { t: '🖨️ Printer', c: 3, w: 'Printer mencetak hasil ke kertas: perangkat Output.' },
    { t: '🔊 Speaker', c: 3, w: 'Speaker mengeluarkan suara hasil pemrosesan: perangkat Output.' },
    { t: '🎧 Headphone', c: 3, w: 'Headphone mengeluarkan suara kepada pengguna: perangkat Output.' }
  ];
  const POOL2 = [
    { t: 'Daftar instruksi (instruction set) yang dapat dijalankan prosesor.', c: 0, w: 'Instruction set terlihat oleh programmer, jadi termasuk Arsitektur.' },
    { t: 'Jumlah bit yang dipakai untuk menyimpan sebuah bilangan bulat.', c: 0, w: 'Representasi tipe data terlihat oleh programmer: Arsitektur.' },
    { t: 'Teknik pengalamatan memori yang tersedia bagi programmer.', c: 0, w: 'Teknik pengalamatan adalah atribut yang terlihat programmer: Arsitektur.' },
    { t: 'Mekanisme input/output yang dapat dipakai oleh program.', c: 0, w: 'Mekanisme I/O dari sudut pandang program adalah bagian Arsitektur.' },
    { t: 'Apakah komputer menyediakan instruksi perkalian (multiply).', c: 0, w: 'Ada tidaknya sebuah instruksi adalah keputusan Arsitektur.' },
    { t: 'Perkalian dikerjakan oleh unit khusus atau dengan penjumlahan berulang.', c: 1, w: 'Cara mewujudkan instruksi di perangkat keras adalah Organisasi.' },
    { t: 'Sinyal kontrol yang mengatur kerja bagian-bagian di dalam prosesor.', c: 1, w: 'Sinyal kontrol adalah detail realisasi hardware: Organisasi.' },
    { t: 'Teknologi chip memori yang dipakai pada komputer.', c: 1, w: 'Teknologi memori adalah detail implementasi: Organisasi.' },
    { t: 'Antarmuka (interface) perangkat keras antara komputer dan periferal.', c: 1, w: 'Antarmuka hardware ke periferal termasuk Organisasi.' },
    { t: 'Cara unit-unit di dalam CPU dihubungkan satu sama lain.', c: 1, w: 'Interkoneksi antarunit adalah inti dari Organisasi komputer.' }
  ];
  const Q3 = [
    ['Apa yang paling tepat menggambarkan komputer?', 'Mesin yang menerima input, memproses data, menyimpan, dan menghasilkan output', ['Alat yang hanya dipakai untuk bermain game', 'Perangkat yang hanya menyimpan data tanpa memprosesnya', 'Layar yang menampilkan gambar dan video'], 'Komputer menerima data (input), mengolahnya (proses), menyimpannya (storage), lalu menampilkan hasil (output).'],
    ['Bagian mana yang menjalankan instruksi program dan sering disebut "otak" komputer?', 'CPU', ['Monitor', 'Speaker', 'Flashdisk'], 'CPU (Central Processing Unit) mengambil, mengartikan, dan menjalankan instruksi.'],
    ['Apa yang terjadi pada isi RAM saat komputer dimatikan?', 'Isinya hilang (bersifat sementara)', ['Tetap tersimpan selamanya seperti SSD', 'Otomatis dipindahkan ke CPU', 'Berubah menjadi file di desktop'], 'RAM bersifat volatile: data hilang saat daya mati. Data permanen disimpan di SSD/HDD.'],
    ['Perangkat mana yang cocok menyimpan file secara tetap walau komputer dimatikan?', 'SSD atau hard disk', ['RAM', 'Speaker', 'Webcam'], 'SSD/HDD adalah penyimpanan (storage) yang datanya tidak hilang saat listrik padam.'],
    ['Apa fungsi bus pada sistem komputer?', 'Jalur komunikasi untuk memindahkan data dan sinyal antarkomponen', ['Mendinginkan prosesor', 'Mengubah listrik AC menjadi DC', 'Menyimpan program secara permanen'], 'Bus menghubungkan CPU, memori, dan perangkat I/O agar dapat bertukar data.'],
    ['Pada konsep stored-program (von Neumann), apa yang disimpan di memori?', 'Instruksi program sekaligus datanya', ['Hanya data; instruksi ada di monitor', 'Hanya instruksi; data ada di printer', 'Hanya hasil akhir perhitungan'], 'Program dan data sama-sama disimpan di memori; CPU mengambil instruksi dari sana untuk dijalankan.'],
    ['Manakah yang BUKAN perangkat output?', 'Mikrofon', ['Printer', 'Monitor', 'Speaker'], 'Mikrofon memasukkan suara ke komputer, jadi ia perangkat input.'],
    ['ALU di dalam CPU bertugas…', 'Melakukan operasi aritmetika dan logika', ['Menyimpan data secara permanen', 'Menampilkan gambar ke layar', 'Menghubungkan komputer ke internet'], 'ALU (Arithmetic Logic Unit) mengerjakan penjumlahan, pengurangan, dan operasi logika.'],
    ['Dibanding SSD, RAM umumnya…', 'Lebih cepat, tetapi kapasitasnya lebih kecil dan datanya sementara', ['Lebih lambat tetapi datanya permanen', 'Sama cepat dan sama-sama permanen', 'Tidak dipakai saat program berjalan'], 'RAM dipakai sebagai ruang kerja sementara CPU; SSD dipakai untuk penyimpanan jangka panjang.'],
    ['Apa perbedaan hardware dan software?', 'Hardware adalah komponen fisik; software adalah program/instruksi', ['Hardware adalah program; software adalah komponen fisik', 'Keduanya sama-sama benda fisik', 'Software hanya ada pada keyboard'], 'Hardware dapat disentuh (CPU, RAM, monitor); software berupa program yang dijalankan hardware.']
  ];
  const LIMITS = { 1: 15, 2: 12, 3: 15 };
  const INTRO = {
    1: { title: 'Ronde 1 — Rakit Sistem', text: 'Sistem komputer bekerja dengan alur Input → Proses → Output. Memori & Penyimpanan menyimpan data dan program. Tugasmu: masukkan tiap komponen ke kelompok yang tepat.' },
    2: { title: 'Ronde 2 — Arsitektur atau Organisasi?', text: 'Arsitektur = atribut yang terlihat oleh programmer (instruction set, jumlah bit data, pengalamatan, mekanisme I/O). Organisasi = bagaimana perangkat keras mewujudkannya (sinyal kontrol, antarmuka, teknologi memori, interkoneksi). Analogi: pedal dan setir mobil ↔ Arsitektur; cara mesin bekerja di dalamnya ↔ Organisasi.' },
    3: { title: 'Ronde 3 — Kilat Konsep', text: 'Jawab pertanyaan konsep dasar secepat dan setepat mungkin. Urutan pilihan jawaban diacak untuk setiap peserta.' }
  };
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const shuffle = (a, rng) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)) % (i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };

  function buildQuiz(rng) {
    const r1 = []; for (let c = 0; c < 4; c++) r1.push(...shuffle(POOL1.filter(p => p.c === c), rng).slice(0, 2));
    const items = [];
    shuffle(r1, rng).forEach(p => items.push({ r: 1, text: p.t, opts: CATS1, ans: p.c, why: p.w, limit: LIMITS[1] }));
    shuffle(POOL2, rng).forEach(p => items.push({ r: 2, text: p.t, opts: CATS2, ans: p.c, why: p.w, limit: LIMITS[2] }));
    shuffle(Q3, rng).forEach(q => { const o = shuffle([q[1]].concat(q[2]), rng); items.push({ r: 3, text: q[0], opts: o, ans: o.indexOf(q[1]), why: q[3], limit: LIMITS[3] }); });
    return items;
  }

  function createGame(rngFn) {
    const rng = typeof rngFn === 'function' ? rngFn : Math.random;
    const items = buildQuiz(rng);
    const g = { items, i: 0, score: 0, streak: 0, correct: 0, secs: 0, phase: 'q', timeLeft: items[0].limit, answers: [], over: false, events: [] };
    const ev = (type, o) => { if (g.events.length < 100) g.events.push(Object.assign({ type }, o)); };
    ev('round', { r: 1 });
    g.cur = () => g.items[g.i];
    const settle = choice => {
      const it = g.cur(), spent = clamp(it.limit - g.timeLeft, 0, it.limit), ok = choice === it.ans; let pts = 0;
      g.secs += spent;
      if (ok) { g.streak++; g.correct++; pts = 100 + Math.floor(50 * (g.timeLeft / it.limit)) + Math.min(5, g.streak - 1) * 10; } else g.streak = 0;
      g.score += pts; g.answers.push({ i: g.i, choice, ok, pts, spent }); g.phase = 'fb'; ev('answer', { ok, pts, timeout: choice === -1 });
    };
    g.answer = c => { if (g.phase !== 'q' || !Number.isInteger(c) || c < 0 || c >= g.cur().opts.length) return false; settle(c); return true; };
    g.forfeit = () => { if (g.phase === 'q') { settle(-2); return true; } return false; };
    g.tick = dt => { if (g.phase !== 'q' || !(dt > 0)) return; g.timeLeft -= Math.min(dt, 0.1); if (g.timeLeft <= 0) { g.timeLeft = 0; settle(-1); } };
    g.next = () => {
      if (g.phase !== 'fb') return false;
      const prev = g.cur().r; g.i++;
      if (g.i >= g.items.length) { g.phase = 'done'; g.over = true; ev('done'); return true; }
      g.phase = 'q'; g.timeLeft = g.cur().limit; if (g.cur().r !== prev) ev('round', { r: g.cur().r }); return true;
    };
    g.result = () => ({ score: g.score, correct: g.correct, total: g.items.length, secs: Math.min(511, Math.round(g.secs)) });
    return g;
  }

  /* ---------- nama peserta, hasil, dan peringkat ---------- */
  const normName = s => { const n = String(s || '').normalize('NFKC').replace(/[^\p{L}\p{N} .'\-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 30); return n.length >= 2 ? n : null; };
  const normKey = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const keyOk = (input, expected) => { const b = normKey(expected); return !!b && normKey(input) === b; };
  const TOTAL = 28, MAXSECS = 8 * LIMITS[1] + 10 * LIMITS[2] + 10 * LIMITS[3];
  const formatResult = (name, res) => [name, res.score, res.correct + '/' + TOTAL, res.secs].join('; ');
  function parseLine(line) {
    const parts = String(line || '').split(/[;|\t]/).map(x => x.trim());
    if (parts.length !== 4) return { ok: false, reason: 'Format harus: Nama; skor; benar; waktu' };
    const name = normName(parts[0]); if (!name) return { ok: false, reason: 'Nama tidak valid' };
    const m = /^(\d{1,2})(?:\s*\/\s*28)?$/.exec(parts[2]), score = /^\d{1,5}$/.test(parts[1]) ? Number(parts[1]) : NaN, secs = /^\d{1,3}$/.test(parts[3].replace(/\s*(dtk|detik|s)$/i, '')) ? Number(parts[3].replace(/\s*(dtk|detik|s)$/i, '')) : NaN;
    const correct = m ? Number(m[1]) : NaN;
    if (!Number.isInteger(score) || score > 8191) return { ok: false, reason: 'Skor tidak valid' };
    if (!Number.isInteger(correct) || correct > TOTAL) return { ok: false, reason: 'Jumlah benar harus 0–28' };
    if (!Number.isInteger(secs) || secs > MAXSECS) return { ok: false, reason: 'Waktu harus 0–' + MAXSECS + ' detik' };
    if (score < correct * 100 || score > correct * 200 || (correct === 0 && score !== 0)) return { ok: false, reason: 'Skor tidak sesuai jumlah benar (periksa salah ketik)' };
    return { ok: true, name, score, correct, secs, acc: Math.round(correct / TOTAL * 100) };
  }
  const better = (a, b) => b.score - a.score || b.correct - a.correct || a.secs - b.secs || a.name.localeCompare(b.name, 'id');
  function rankLines(text) {
    const best = new Map(), invalid = [];
    String(text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean).forEach(l => {
      const r = parseLine(l); if (!r.ok) { invalid.push({ line: l, reason: r.reason }); return; }
      const id = r.name.toLowerCase(), cur = best.get(id);
      if (!cur) { r.tries = 1; best.set(id, r); } else { const n = cur.tries + 1; if (better(cur, r) > 0) { r.tries = n; best.set(id, r); } else cur.tries = n; }
    });
    const rows = [...best.values()].sort(better); let rank = 0;
    rows.forEach((r, i) => { const q = rows[i - 1]; if (!i || q.score !== r.score || q.correct !== r.correct || q.secs !== r.secs) rank = i + 1; r.rank = rank; });
    return { rows, invalid };
  }

  const api = { createGame, buildQuiz, normName, normKey, keyOk, formatResult, parseLine, rankLines, INTRO, TOTAL, MAXSECS, LIMITS, CATS1, CATS2, POOL1, POOL2, Q3 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ArenaEngine = api;
})(typeof self !== 'undefined' ? self : this);
