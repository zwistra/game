// Uji asap alur UI dengan DOM tiruan: latihan, lomba, ulang kode sama, pindah tab, panel panitia.
const fs = require('fs'), vm = require('vm'), assert = require('assert');
const E = require('../assets/js/engine.js');
class El { constructor(id) { this.id = id; this.hidden = false; this.textContent = ''; this.value = ''; this.className = ''; this.children = []; this.dataset = {}; this.L = {}; this.disabled = false; this.tagName = 'DIV';
  this.style = { setProperty() {} }; const set = new Set(); this.classList = { add: c => set.add(c), remove: c => set.delete(c), toggle: (c, f) => (f ? set.add(c) : set.delete(c)), has: c => set.has(c) }; this.attrs = {}; }
  addEventListener(e, f) { (this.L[e] = this.L[e] || []).push(f); } append(...n) { n.forEach(x => this.children.push(x)); } focus() {} setAttribute(k, v) { this.attrs[k] = v; } remove() {} select() {}
  click() { if (this.disabled) return; (this.L.click || []).forEach(f => f({ target: this })); } set textContent(v) { this._t = v; if (v === '') this.children = []; } get textContent() { return this._t; } }
const mk = (file, preset = {}) => { const els = {}, win = {}, docL = {}, winL = {};
  const doc = { getElementById: id => els[id] || (els[id] = Object.assign(new El(id), preset[id] || {})), createElement: () => new El('x'), body: new El('body'), addEventListener: (e, f) => { docL[e] = f; }, hidden: false };
  const raf = []; const sb = Object.assign(win, { window: win, document: doc, ArenaEngine: E, addEventListener: (e, f) => { winL[e] = f; }, scrollTo() {}, getSelection: () => ({ removeAllRanges() {}, addRange() {} }), navigator: { clipboard: { writeText: async () => {} } },
    localStorage: (() => { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = v; } }; })(), performance: { now: () => 0 }, requestAnimationFrame: f => raf.push(f), setTimeout, clearTimeout, URL: { createObjectURL: () => 'blob:x', revokeObjectURL() {} }, Blob: class {}, Math, Number, String, Array, Object, Promise, Set, Map, BigInt, console });
  vm.createContext(sb); vm.runInContext(fs.readFileSync(__dirname + '/../assets/js/' + file, 'utf8'), sb); return { els, docL, winL, raf, doc, win }; };
const visible = (els, ids) => ids.filter(i => els[i] && !els[i].hidden);
const pump = (A, n = 1, dt = 16) => { for (let i = 0; i < n; i++) { const f = A.raf.shift(); if (f) f((A.t = (A.t || 0) + dt)); } };
const playAll = (A, correct) => { let guard = 0; const g = () => A.els; // jawab semua soal lewat klik tombol
  while (!g().sRes || g().sRes.hidden) { assert(guard++ < 400, 'alur macet'); if (!g().sIntro.hidden) { g().bGo.click(); continue; }
    const opts = g().opts.children; assert(opts.length >= 2, 'opsi kosong'); if (!g().fb.hidden === false) { opts[correct ? 0 : 1].click(); }
    if (!g().fb.hidden) g().bNext.click(); else { opts[0].click(); } } };
const lomba = { sHome: {}, sInfo: { hidden: true }, sSetup: { hidden: true }, sIntro: { hidden: true }, sQuiz: { hidden: true }, sRes: { hidden: true }, fb: { hidden: true }, codeBox: { hidden: true } };
// A) Mode Latihan: jawab semua dengan opsi pertama → selesai tanpa kode
{ const A = mk('game.js', lomba); pump(A); A.els.bPrac.click(); assert(!A.els.sIntro.hidden, 'harus tampil intro ronde 1'); playAll(A, true);
  assert(!A.els.sRes.hidden && A.els.codeBox.hidden && /Latihan/.test(A.els.rNote.textContent), 'latihan: tanpa kode'); }
// B) Mode Lomba: kode siswa/lomba, selesai → kode valid; main lagi dengan kode sama → ditolak & menampilkan kode lama
{ const A = mk('game.js', lomba); pump(A); A.els.bComp.click(); A.els.bStart.click(); assert(/Kode Siswa/.test(A.els.setupErr.textContent), 'validasi kode siswa');
  A.els.inKode.value = 'a07'; A.els.inKode.L.input[0]({ target: A.els.inKode }); A.els.inKey.value = 'k7m2qx'; A.els.inKey.L.input[0]({ target: A.els.inKey }); assert(A.els.inKode.value === 'A07');
  A.els.bStart.click(); assert(!A.els.sIntro.hidden && A.els.sSetup.hidden); A.els.bGo.click();
  // pindah tab di tengah soal → dianggap salah, tanpa crash
  A.doc.hidden = true; A.docL.visibilitychange(); A.doc.hidden = false; A.docL.visibilitychange(); assert(!A.els.fb.hidden && /dilewati/.test(A.els.fbT.textContent), 'pindah tab = soal dilewati');
  A.els.bNext.click(); let guard = 0; while (A.els.sRes.hidden) { assert(guard++ < 400); if (!A.els.sIntro.hidden) A.els.bGo.click(); else if (!A.els.fb.hidden) A.els.bNext.click(); else { for (let k = 0; k < 400 && A.els.fb.hidden; k++) pump(A, 1, 50); } } // biarkan timer habis → semua salah (uji timeout)
  const code = A.els.rCode.textContent; const p = E.parseCode('K7M2QX', code); assert(p.ok && p.kode === 'A07' && p.correct === 0 && p.score === 0, 'kode lomba valid: ' + code);
  const B = mk('game.js', lomba); B.win.localStorage.setItem('cil.K7M2QX.A07', code); pump(B); B.els.bComp.click(); B.els.inKode.value = 'A07'; B.els.inKey.value = 'K7M2QX'; B.els.bStart.click();
  assert(!B.els.sRes.hidden && /sudah bermain/.test(B.els.rT.textContent) && B.els.rCode.textContent === code, 'main ulang harus menampilkan kode lama'); }
// C) Lomba dengan jawaban benar semua lewat engine data: kode memuat skor sama dengan tampilan
{ const A = mk('game.js', lomba); pump(A); A.els.bComp.click(); A.els.inKode.value = 'B12'; A.els.inKey.value = 'LOMBA9'; A.els.bStart.click();
  let guard = 0; while (A.els.sRes.hidden) { assert(guard++ < 500); if (!A.els.sIntro.hidden) { A.els.bGo.click(); continue; } if (!A.els.fb.hidden) { A.els.bNext.click(); continue; }
    const txt = A.els.qText.children[1].textContent, it = [...E.POOL1, ...E.POOL2].find(x => x.t === txt); let idx = 0;
    if (it) idx = it.c; else { const q = E.Q3.find(x => x[0] === txt); idx = [...A.els.opts.children].findIndex(b => b.children[1].textContent === q[1]); } A.els.opts.children[idx].click(); }
  const p = E.parseCode('LOMBA9', A.els.rCode.textContent); assert(p.ok && p.correct === 28 && String(p.score) === A.els.rS.textContent && p.score >= 28 * 100, 'skor tampil = skor kode; semua benar'); }
// D) Panel panitia
{ const codes = [E.makeCode('PANIT1', 'A01', { correct: 20, score: 3000, secs: 200 }), E.makeCode('PANIT1', 'A02', { correct: 25, score: 3900, secs: 210 }), 'RUSAK-RUSAK-RUSAK'].join('\n');
  const A = mk('panitia.js', { pOut: { hidden: true }, pInv: { hidden: true } }), $ = id => A.doc.getElementById(id);
  $('pKey').value = 'PANIT1'; $('pCodes').value = codes; $('bRank').click();
  assert(!$('pOut').hidden && $('pBody').children.length === 2 && $('pBody').children[0].children[1].textContent === 'A02' && !$('pInv').hidden && $('pErr').textContent === '', 'panel: peringkat & kode ditolak');
  $('pKey').value = ''; $('bRank').click(); assert(/Kode Lomba/.test($('pErr').textContent)); $('bGen').click(); assert($('pKey').value.length === 6); }
console.log('OK — uji asap UI: latihan, lomba (+timeout, pindah tab, main ulang), kecocokan skor-kode, panel panitia');
