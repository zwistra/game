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

  /* ---------- kode hasil lomba ---------- */
  const SALT = 'CIL26';
  const h32 = s => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; };
  const normKode = s => { const k = String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); return k.length >= 2 && k.length <= 6 ? k : null; };
  const normKey = s => { const k = String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); return k.length >= 3 && k.length <= 12 ? k : null; };
  const TOTAL = 28, MAXSECS = 8 * LIMITS[1] + 10 * LIMITS[2] + 10 * LIMITS[3];
  const chk = (key, payload) => h32(SALT + key + '|' + payload.toString()) & 0xFFFFF;
  function makeCode(key, kode, res) {
    key = normKey(key); kode = normKode(kode);
    if (!key || !kode || !res) return null;
    const { correct, secs, score } = res;
    if (![correct, secs, score].every(Number.isInteger) || correct < 0 || correct > TOTAL || secs < 0 || secs > 511 || score < 0 || score > 8191) return null;
    let p = 1n; p = (p << 3n) | BigInt(kode.length); p = (p << 31n) | BigInt(parseInt(kode, 36)); p = (p << 5n) | BigInt(correct); p = (p << 9n) | BigInt(secs); p = (p << 13n) | BigInt(score);
    const s = ((p << 20n) | BigInt(chk(key, p))).toString(36).toUpperCase().padStart(18, '0');
    return s.slice(0, 6) + '-' + s.slice(6, 12) + '-' + s.slice(12);
  }
  function parseCode(key, text) {
    key = normKey(key); if (!key) return { ok: false, reason: 'Kode lomba tidak valid' };
    const s = String(text || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
    if (s.length !== 18) return { ok: false, reason: 'Panjang kode salah' };
    let v = 0n; for (const ch of s) v = v * 36n + BigInt(parseInt(ch, 36));
    if (v >> 83n) return { ok: false, reason: 'Kode tidak valid' };
    const c = Number(v & 0xFFFFFn), p = v >> 20n;
    if (c !== chk(key, p)) return { ok: false, reason: 'Checksum salah (kode lomba berbeda / kode salah ketik / dimanipulasi)' };
    const score = Number(p & 0x1FFFn), secs = Number((p >> 13n) & 0x1FFn), correct = Number((p >> 22n) & 0x1Fn), kv = Number((p >> 27n) & 0x7FFFFFFFn), len = Number((p >> 58n) & 7n), ver = Number(p >> 61n);
    if (ver !== 1 || len < 2 || len > 6) return { ok: false, reason: 'Versi/format tidak dikenal' };
    const kode = kv.toString(36).toUpperCase().padStart(len, '0');
    if (correct > TOTAL || secs > MAXSECS || score < correct * 100 || score > correct * 200 || (correct === 0 && score !== 0)) return { ok: false, reason: 'Data tidak masuk akal (indikasi manipulasi)' };
    return { ok: true, kode, correct, secs, score, acc: Math.round(correct / TOTAL * 100) };
  }
  const better = (a, b) => b.score - a.score || b.correct - a.correct || a.secs - b.secs || (a.kode < b.kode ? -1 : 1);
  function rankCodes(key, text) {
    const parts = String(text || '').split(/[\s,;]+/).filter(Boolean), best = new Map(), invalid = [], seen = new Set(); let dup = 0;
    parts.forEach(p => {
      const r = parseCode(key, p); if (!r.ok) { invalid.push({ code: p, reason: r.reason }); return; }
      const id = p.toUpperCase().replace(/[^0-9A-Z]/g, ''); if (seen.has(id)) { dup++; return; } seen.add(id);
      const cur = best.get(r.kode); if (!cur) { r.tries = 1; best.set(r.kode, r); } else { const n = cur.tries + 1; if (better(cur, r) > 0) { r.tries = n; best.set(r.kode, r); } else cur.tries = n; }
    });
    const rows = [...best.values()].sort(better); let rank = 0;
    rows.forEach((r, i) => { const q = rows[i - 1]; if (!i || q.score !== r.score || q.correct !== r.correct || q.secs !== r.secs) rank = i + 1; r.rank = rank; });
    return { rows, invalid, duplicates: dup };
  }
  const randomKey = () => { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = ''; const c = (typeof crypto !== 'undefined' && crypto.getRandomValues) ? crypto.getRandomValues(new Uint8Array(6)) : Array.from({ length: 6 }, () => Math.floor(Math.random() * 256)); for (const b of c) s += A[b % A.length]; return s; };

  const api = { createGame, buildQuiz, makeCode, parseCode, rankCodes, normKode, normKey, randomKey, INTRO, TOTAL, MAXSECS, LIMITS, CATS1, CATS2, POOL1, POOL2, Q3 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.ArenaEngine = api;
})(typeof self !== 'undefined' ? self : this);
