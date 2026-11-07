// Jalankan: node tests/test.js
const E = require('../assets/js/engine.js'); const assert = require('assert');
let seed = 1; const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
// 1) komposisi kuis
for (let r = 0; r < 200; r++) { seed = r + 1; const q = E.buildQuiz(rng);
  assert(q.length === 28 && q.filter(x => x.r === 1).length === 8 && q.filter(x => x.r === 2).length === 10 && q.filter(x => x.r === 3).length === 10, 'jumlah soal');
  for (let c = 0; c < 4; c++) assert(q.filter(x => x.r === 1 && x.ans === c).length === 2, 'ronde 1: 2 komponen per kelompok');
  assert(q.filter(x => x.r === 2 && x.ans === 0).length === 5, 'ronde 2: 5 arsitektur / 5 organisasi');
  q.forEach(x => { assert(x.ans >= 0 && x.ans < x.opts.length && x.why && x.text && x.limit > 0); assert(new Set(x.opts).size === x.opts.length, 'opsi dobel'); });
  assert(new Set(q.filter(x => x.r === 3).map(x => x.text)).size === 10 && q.slice(0, 8).map(x => x.opts[x.ans]).every(Boolean)); }
// kunci jawaban R3 benar-benar teks jawaban yang benar
E.Q3.forEach(q => assert(!q[2].includes(q[1]) && q[2].length === 3, 'distraktor mengandung jawaban benar'));
// 2) permainan sempurna, semua salah, timeout, forfeit
const run = (g, f) => { while (!g.over) { const it = g.cur(); f(g, it); if (g.phase === 'fb') g.next(); } return g; };
{ seed = 7; const g = run(E.createGame(rng), (g, it) => g.answer(it.ans)); const r = g.result(); assert(r.correct === 28 && r.score >= 28 * 100 + 28 * 0 && r.score <= 28 * 200 && g.streak === 28, 'sempurna'); 
  assert(r.score === 28 * 100 + 28 * 50 + (0 + 10 + 20 + 30 + 40) + 50 * 23 - 0 || r.score <= 28 * 150 + 1250, 'skor maksimum'); assert(r.score >= 28 * 100 + 1250 - 0, 'bonus streak'); }
{ const g = run(E.createGame(rng), (g, it) => g.answer((it.ans + 1) % it.opts.length)); assert(g.result().score === 0 && g.result().correct === 0 && g.streak === 0); }
{ const g = E.createGame(rng); const it = g.cur(); for (let i = 0; i < 400; i++) g.tick(0.1); assert(g.phase === 'fb' && g.answers[0].choice === -1 && !g.answers[0].ok && Math.abs(g.secs - it.limit) < 0.2, 'timeout dianggap salah & waktu penuh');
  assert(!g.answer(0), 'tak boleh menjawab saat feedback'); g.next(); assert(g.forfeit() && g.answers[1].choice === -2 && !g.forfeit()); }
{ const g = E.createGame(rng); g.answer(g.cur().ans); const s = g.score; assert(s >= 100 && s <= 150, 'skor 1 soal'); assert(g.answer(0) === false && g.score === s, 'jawaban ganda ditolak'); }
// 3) fuzz input liar
for (let r = 0; r < 100; r++) { seed = r * 7 + 1; const g = E.createGame(rng); let n = 0;
  while (!g.over && n++ < 5000) { const a = rng(); if (a < 0.4) g.answer([NaN, -1, 99, 1.5, '2', null, undefined, rng() * 4 | 0][rng() * 8 | 0]); else if (a < 0.6) g.tick([NaN, -1, 0, 0.05, 9][rng() * 5 | 0]); else if (a < 0.8) g.next(); else if (a < 0.85) g.forfeit();
    assert(g.score >= 0 && g.timeLeft >= 0 && g.timeLeft <= 15 && g.i <= 28 && g.correct <= g.i + 1 && g.secs <= E.MAXSECS + 1e-6, 'invarian'); }
  if (g.over) assert(g.result().correct <= 28); }
// 4) kode hasil: bolak-balik, manipulasi, kunci salah
let tampered = 0, trials = 0;
for (let r = 0; r < 300; r++) { seed = r * 31 + 5; const g = run(E.createGame(rng), (g, it) => { if (rng() < 0.6) g.answer(it.ans); else g.tick(rng() * 9 + 0.5); for (let k = 0; k < 400 && g.phase === 'q'; k++) g.tick(0.1); });
  const res = g.result(), kode = ['A01', '07', 'Z9', 'AB12CD', '0A1', 'X9'][r % 6], code = E.makeCode('LOMBA7', kode, res); assert(/^[0-9A-Z]{6}-[0-9A-Z]{6}-[0-9A-Z]{6}$/.test(code), 'format');
  const p = E.parseCode('lomba7', code.toLowerCase()); assert(p.ok && p.kode === kode && p.score === res.score && p.correct === res.correct && p.secs === res.secs, 'roundtrip ' + JSON.stringify(p));
  assert(!E.parseCode('LOMBA8', code).ok, 'kunci lomba salah harus ditolak');
  for (let t = 0; t < 12; t++) { const i = [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19][rng() * 18 | 0], ch = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'[rng() * 36 | 0]; if (code[i] === ch) continue; trials++; if (E.parseCode('LOMBA7', code.slice(0, i) + ch + code.slice(i + 1)).ok) tampered++; } }
assert(tampered <= 3, 'manipulasi 1 karakter lolos terlalu sering: ' + tampered + '/' + trials);
assert(E.makeCode('LOMBA7', 'A', { correct: 1, secs: 1, score: 100 }) === null && E.makeCode('AB', 'A01', { correct: 1, secs: 1, score: 100 }) === null && E.makeCode('LOMBA7', 'A01', { correct: 29, secs: 1, score: 100 }) === null, 'validasi input makeCode');
// skor palsu (tinggi, tak masuk akal) walau checksum benar karena kunci diketahui → ditolak oleh cek kewajaran
assert(!E.parseCode('K123', E.makeCode('K123', 'A01', { correct: 3, secs: 20, score: 900 })).ok, 'skor > 200/soal harus ditolak');
assert(!E.parseCode('K123', E.makeCode('K123', 'A01', { correct: 0, secs: 20, score: 50 })).ok && !E.parseCode('K123', E.makeCode('K123', 'A01', { correct: 5, secs: 500, score: 600 })).ok, 'cek kewajaran');
// 5) peringkat: urutan, tie-break, duplikat, kode rusak
{ const mk = (k, c, s, t) => E.makeCode('KUNCI1', k, { correct: c, score: s, secs: t });
  const codes = [mk('A01', 20, 3000, 200), mk('A02', 20, 3000, 150), mk('A03', 28, 5000, 300), mk('A04', 10, 1500, 100), mk('A01', 25, 4000, 250), mk('A05', 10, 1500, 100)];
  const txt = codes.join('\n') + '\n' + codes[0] + '\nXXXX-YYYY-ZZZZ\n' + E.makeCode('LAIN99', 'A09', { correct: 1, score: 100, secs: 5 });
  const r = E.rankCodes('KUNCI1', txt); assert(r.rows.map(x => x.kode).join() === 'A03,A01,A02,A04,A05', 'urutan: ' + r.rows.map(x => x.kode)); assert(r.rows[1].tries === 2 && r.rows[1].score === 4000, 'ambil terbaik & hitung percobaan');
  assert(r.rows.map(x => x.rank).join() === '1,2,3,4,4' && r.invalid.length === 2 && r.duplicates === 1, 'peringkat seri, kode invalid, duplikat: ' + JSON.stringify([r.rows.map(x => x.rank), r.invalid.length, r.duplicates])); }
assert(E.randomKey().length === 6 && E.normKey(E.randomKey()));
console.log('OK — komposisi soal, skor, timeout, fuzz, kode hasil (' + tampered + '/' + trials + ' manipulasi lolos), peringkat & tie-break');
