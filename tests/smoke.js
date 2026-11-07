// Uji asap alur UI dengan DOM tiruan: latihan, lomba, ulang kode sama, pindah tab, panel panitia.
const fs = require('fs'), vm = require('vm'), assert = require('assert');
const E = require('../assets/js/engine.js');
class El { constructor(id) { this.id = id; this.hidden = false; this.textContent = ''; this.value = ''; this.className = ''; this.children = []; this.dataset = {}; this.L = {}; this.disabled = false; this.tagName = 'DIV';
  this.style = { setProperty() {} }; const set = new Set(); this.classList = { add: c => set.add(c), remove: c => set.delete(c), toggle: (c, f) => (f ? set.add(c) : set.delete(c)), has: c => set.has(c) }; this.attrs = {}; }
  addEventListener(e, f) { (this.L[e] = this.L[e] || []).push(f); } append(...n) { n.forEach(x => this.children.push(x)); } focus() {} setAttribute(k, v) { this.attrs[k] = v; } remove() {} select() {}
  click() { if (this.disabled) return; (this.L.click || []).forEach(f => f({ target: this })); } set textContent(v) { this._t = v; if (v === '') this.children = []; } get textContent() { return this._t; } }
const mk = (file, preset = {}) => { const els = {}, win = {}, docL = {}, winL = {};
  const doc = { getElementById: id => els[id] || (els[id] = Object.assign(new El(id), preset[id] || {})), createElement: () => new El('x'), body: new El('body'), addEventListener: (e, f) => { docL[e] = f; }, hidden: false };
  const raf = []; const sb = Object.assign(win, { window: win, document: doc, ArenaEngine: E, ARENA_CONFIG: { KODE_LOMBA: 'ARSKOM26' }, addEventListener: (e, f) => { winL[e] = f; }, scrollTo() {}, getSelection: () => ({ removeAllRanges() {}, addRange() {} }), navigator: { clipboard: { writeText: async () => {} } },
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
// B) Mode Lomba: validasi nama & kode tetap; timeout & pindah tab; hasil tampil; main ulang dengan nama sama → hasil lama
{ const A = mk('game.js', lomba); pump(A); A.els.bComp.click(); A.els.bStart.click(); assert(/nama/i.test(A.els.setupErr.textContent), 'validasi nama');
  A.doc.getElementById('inNama').value = 'Budi  Santoso'; A.els.inKey.value = 'salah1'; A.els.inKey.L.input[0]({ target: A.els.inKey }); assert(A.els.inKey.value === 'SALAH1'); A.els.bStart.click(); assert(/Kode Lomba salah/.test(A.els.setupErr.textContent) && !A.els.sSetup.hidden, 'kode lomba salah ditolak');
  A.els.inKey.value = 'arskom26'; A.els.bStart.click(); assert(!A.els.sIntro.hidden && A.els.sSetup.hidden, 'kode tetap diterima (tak peka huruf besar)'); A.els.bGo.click();
  A.doc.hidden = true; A.docL.visibilitychange(); A.doc.hidden = false; A.docL.visibilitychange(); assert(!A.els.fb.hidden && /dilewati/.test(A.els.fbT.textContent), 'pindah tab = soal dilewati');
  A.els.bNext.click(); let guard = 0; while (A.els.sRes.hidden) { assert(guard++ < 400); if (!A.els.sIntro.hidden) A.els.bGo.click(); else if (!A.els.fb.hidden) A.els.bNext.click(); else { for (let k = 0; k < 400 && A.els.fb.hidden; k++) pump(A, 1, 50); } }
  assert(!A.els.codeBox.hidden && A.els.rName.textContent === 'Budi Santoso' && /^Budi Santoso; 0; 0\/28; \d+$/.test(A.els.rCode.textContent) && E.parseLine(A.els.rCode.textContent).ok, 'hasil tampil: ' + A.els.rCode.textContent);
  const saved = A.win.localStorage.getItem('cil.ARSKOM26.budi santoso'); assert(saved && JSON.parse(saved).score === 0, 'hasil tersimpan per nama');
  const B = mk('game.js', lomba); B.win.localStorage.setItem('cil.ARSKOM26.budi santoso', saved); pump(B); B.els.bComp.click(); B.doc.getElementById('inNama').value = 'BUDI SANTOSO'; B.els.inKey.value = 'ARSKOM26'; B.els.bStart.click();
  assert(!B.els.sRes.hidden && /sudah bermain/.test(B.els.rT.textContent) && /Budi/i.test(B.els.rName.textContent), 'main ulang → tampilkan hasil lama');
  const C = mk('game.js', lomba); C.win.localStorage.setItem('cil.ARSKOM26.budi santoso', '{"score":99999,"correct":3,"secs":1}'); pump(C); C.els.bComp.click(); C.doc.getElementById('inNama').value = 'Budi Santoso'; C.els.inKey.value = 'ARSKOM26'; C.els.bStart.click(); assert(!C.els.sIntro.hidden, 'data tersimpan rusak diabaikan → bermain normal'); }
// C) Lomba dengan semua jawaban benar: skor tampil = skor di baris hasil
{ const A = mk('game.js', lomba); pump(A); A.els.bComp.click(); A.doc.getElementById('inNama').value = 'Citra'; A.els.inKey.value = 'ARSKOM26'; A.els.bStart.click();
  let guard = 0; while (A.els.sRes.hidden) { assert(guard++ < 500); if (!A.els.sIntro.hidden) { A.els.bGo.click(); continue; } if (!A.els.fb.hidden) { A.els.bNext.click(); continue; }
    const txt = A.els.qText.children[1].textContent, it = [...E.POOL1, ...E.POOL2].find(x => x.t === txt); let idx = 0;
    if (it) idx = it.c; else { const q = E.Q3.find(x => x[0] === txt); idx = [...A.els.opts.children].findIndex(b => b.children[1].textContent === q[1]); } A.els.opts.children[idx].click(); }
  const p = E.parseLine(A.els.rCode.textContent); assert(p.ok && p.name === 'Citra' && p.correct === 28 && String(p.score) === A.els.rS.textContent && p.score >= 28 * 100, 'skor tampil = baris hasil'); }
// D) Panel panitia (hasil dari baris teks)
{ const A = mk('panitia.js', { pOut: { hidden: true }, pInv: { hidden: true } }), $ = id => A.doc.getElementById(id);
  $('pCodes').value = ['Ani; 3000; 20/28; 200', 'Budi; 3900; 25/28; 210', 'rusak'].join('\n'); $('bRank').click();
  assert(!$('pOut').hidden && $('pBody').children.length === 2 && $('pBody').children[0].children[1].textContent === 'Budi' && !$('pInv').hidden && $('pErr').textContent === '', 'panel: peringkat & baris ditolak');
  $('pCodes').value = ''; $('bRank').click(); assert(/minimal satu/.test($('pErr').textContent)); $('bClr').click(); assert($('pOut').hidden); }
console.log('OK — uji asap UI: latihan, lomba (nama + kode tetap, timeout, pindah tab, main ulang), kecocokan skor, panel panitia');
