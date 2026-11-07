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
// 4) nama, kode lomba tetap, format hasil & parser
assert(E.normName('  Budi   Santoso ') === 'Budi Santoso' && E.normName('Siti Nur-Aini') === 'Siti Nur-Aini' && E.normName("D'Angelo Jr.") === "D'Angelo Jr." && E.normName('A') === null && E.normName('   ') === null && E.normName(null) === null);
assert(E.normName('<b>Eko</b>;=cmd') === 'bEkobcmd' && !/[<>;=]/.test(E.normName('x<script>;=1</script>y')) && E.normName('a'.repeat(80)).length === 30 && E.normName('Ünal Çelik') === 'Ünal Çelik', 'sanitasi nama');
assert(E.keyOk('arskom26', 'ARSKOM26') && E.keyOk(' ARS-KOM 26 ', 'ARSKOM26') && !E.keyOk('ARSKOM27', 'ARSKOM26') && !E.keyOk('', 'ARSKOM26') && !E.keyOk('x', '') && !E.keyOk(undefined, 'ARSKOM26'), 'kode lomba tetap');
{ const f = E.formatResult('Budi Santoso', { score: 3250, correct: 22, secs: 180 }); assert(f === 'Budi Santoso; 3250; 22/28; 180'); const p = E.parseLine(f); assert(p.ok && p.name === 'Budi Santoso' && p.score === 3250 && p.correct === 22 && p.secs === 180 && p.acc === 79, 'roundtrip hasil');
  assert(E.parseLine('Ani | 3000 | 20 | 150 dtk').ok && E.parseLine('Ani\t3000\t20/28\t150').ok, 'pemisah & satuan');
  ['Ani; 3000; 20', 'Ani; abc; 20; 100', 'A; 3000; 20; 100', 'Ani; 3000; 29; 100', 'Ani; 3000; 20; 9999', 'Ani; 9000; 20; 100', 'Ani; 100; 20; 100', 'Ani; 50; 0; 100', 'Ani; 3000; 20; -5', 'Ani; 3000; 20.5; 100', ''].forEach(l => assert(!E.parseLine(l).ok, 'harus ditolak: ' + l)); }
// hasil dari permainan nyata selalu lolos parser
for (let r = 0; r < 200; r++) { seed = r * 11 + 3; const g = run(E.createGame(rng), (g, it) => { if (rng() < 0.6) g.answer(it.ans); else g.tick(rng() * 9 + 0.5); for (let k = 0; k < 400 && g.phase === 'q'; k++) g.tick(0.1); });
  const res = g.result(), p = E.parseLine(E.formatResult('Peserta ' + r, res)); assert(p.ok && p.score === res.score && p.correct === res.correct && p.secs === res.secs, 'hasil game tidak lolos parser: ' + JSON.stringify(res)); }
// 5) peringkat: urutan, tie-break, entri ganda, baris rusak
{ const txt = ['Ani; 3000; 20/28; 200', 'Budi; 3000; 20/28; 150', 'Citra; 5000; 28/28; 300', 'Dedi; 1500; 10/28; 100', 'ani; 4000; 25/28; 250', 'Eko; 1500; 10/28; 100', 'rusak', 'Fani; 100; 20; 5'].join('\n');
  const r = E.rankLines(txt);
  assert(r.rows.map(x => x.name).join() === 'Citra,ani,Budi,Dedi,Eko', 'urutan: ' + r.rows.map(x => x.name)); assert(r.rows[1].tries === 2 && r.rows[1].score === 4000, 'nama sama (tanpa beda huruf besar) → ambil terbaik');
  assert(r.rows.map(x => x.rank).join() === '1,2,3,4,4' && r.invalid.length === 2, 'peringkat seri & baris ditolak: ' + JSON.stringify([r.rows.map(x => x.rank), r.invalid])); }
assert(E.rankLines('').rows.length === 0 && E.rankLines(null).rows.length === 0);
console.log('OK — komposisi soal, skor, timeout, fuzz, nama & kode lomba tetap, parser hasil, peringkat & tie-break');
