'use strict';
/* Tampilan peserta. Tanpa innerHTML/eval/jaringan; data lokal hanya kode hasil (localStorage). */
(() => {
  const E = window.ArenaEngine; if (!E) return;
  const $ = id => document.getElementById(id), stage = $('stage');
  const SCR = ['sHome', 'sInfo', 'sSetup', 'sIntro', 'sQuiz', 'sRes'];
  const ICONS = { 1: ['📥', '⚙️', '🗃️', '📤'], 2: ['🏛️', '🔧'] };
  let g = null, mode = 'prac', pname = '', screen = 'sHome', muted = false, ac = null, wake = null, toastTO = 0, last = 0, tickSec = -1;

  const show = id => { screen = id; SCR.forEach(s => { $(s).hidden = s !== id; }); window.scrollTo(0, 0); };
  const toast = m => { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastTO); toastTO = setTimeout(() => t.classList.remove('show'), 2600); };
  const beep = (f, d = 0.12, type = 'sine', v = 0.05, to) => {
    if (muted) return;
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), gn = ac.createGain(), t = ac.currentTime;
      o.type = type; o.frequency.setValueAtTime(f, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + d); gn.gain.setValueAtTime(v, t); gn.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(gn); gn.connect(ac.destination); o.start(t); o.stop(t + d); } catch { /* audio tidak tersedia */ }
  };
  const buzz = ms => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch { /* abaikan */ } };
  const getWake = async () => { try { if (navigator.wakeLock && !wake) { wake = await navigator.wakeLock.request('screen'); wake.addEventListener('release', () => { wake = null; }); } } catch { /* abaikan */ } };
  const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* abaikan */ } } };

  /* layar penuh & suara */
  const reqFS = stage.requestFullscreen || stage.webkitRequestFullscreen;
  const isFS = () => (document.fullscreenElement || document.webkitFullscreenElement) === stage;
  const toggleFS = async () => { try { if (isFS()) await (document.exitFullscreen || document.webkitExitFullscreen).call(document); else await reqFS.call(stage); } catch { toast('Layar penuh ditolak browser'); } };
  const syncFS = () => { $('bFs').textContent = isFS() ? '🗗' : '⛶'; $('bFs').setAttribute('aria-label', isFS() ? 'Keluar layar penuh' : 'Layar penuh'); };
  if (!reqFS) { $('bFs').disabled = true; $('bFs').title = 'Browser ini tidak mendukung layar penuh'; }
  $('bFs').addEventListener('click', toggleFS); document.addEventListener('fullscreenchange', syncFS); document.addEventListener('webkitfullscreenchange', syncFS);
  $('bMute').addEventListener('click', () => { muted = !muted; $('bMute').textContent = muted ? '🔇' : '🔊'; });

  /* navigasi */
  $('bComp').addEventListener('click', () => { $('setupErr').textContent = ''; show('sSetup'); $('inKode').focus({ preventScroll: true }); });
  $('bPrac').addEventListener('click', () => begin('prac'));
  $('bInfo').addEventListener('click', () => show('sInfo')); $('bBack1').addEventListener('click', () => show('sHome')); $('bBack2').addEventListener('click', () => show('sHome')); $('bHome').addEventListener('click', () => show('sHome'));
  $('inKey').addEventListener('input', e => { e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); });
  const CFG = window.ARENA_CONFIG || {}, SK = n => 'cil.' + E.normKey(CFG.KODE_LOMBA) + '.' + n.toLowerCase();
  const loadSaved = n => { try { const o = JSON.parse(store.get(SK(n)) || 'null'); return o && [o.score, o.correct, o.secs].every(Number.isInteger) && o.score >= 0 && o.score <= 8191 && o.correct >= 0 && o.correct <= E.TOTAL && o.secs >= 0 && o.secs <= E.MAXSECS ? o : null; } catch { return null; } };
  $('bStart').addEventListener('click', () => {
    const n = E.normName($('inNama').value), err = $('setupErr');
    if (!n) { err.textContent = 'Isi nama (minimal 2 huruf).'; return; }
    if (!E.keyOk($('inKey').value, CFG.KODE_LOMBA)) { err.textContent = 'Kode Lomba salah. Tanyakan ke panitia.'; return; }
    pname = n; err.textContent = '';
    const old = loadSaved(n); if (old) { showResult({ score: old.score, correct: old.correct, total: E.TOTAL, secs: old.secs }, n, null, true); return; }
    begin('comp');
  });
  $('bAgain').addEventListener('click', () => begin('prac'));

  /* alur permainan */
  const begin = m => { mode = m; g = E.createGame(); tickSec = -1; getWake(); handle(); };
  const showIntro = r => { const x = E.INTRO[r]; $('inT').textContent = x.title; $('inP').textContent = x.text; show('sIntro'); beep(440, 0.15); };
  $('bGo').addEventListener('click', () => { show('sQuiz'); renderQ(); last = performance.now(); });
  const renderQ = () => {
    const it = g.cur(); $('fb').hidden = true;
    $('qR').textContent = 'Ronde ' + it.r; $('qN').textContent = (g.i + 1) + '/' + E.TOTAL; $('qS').textContent = String(g.score); $('qK').textContent = g.streak > 1 ? '🔥 ×' + g.streak : '';
    const card = $('qText'); card.textContent = ''; card.className = 'card' + (it.r === 1 ? ' big1' : '');
    const sm = document.createElement('small'), p = document.createElement('p'); sm.textContent = it.r === 1 ? 'Masuk kelompok mana?' : it.r === 2 ? 'Arsitektur atau Organisasi?' : 'Pilih jawaban terbaik'; p.textContent = it.text; card.append(sm, p);
    const box = $('opts'); box.textContent = ''; box.className = 'opts' + (it.r === 1 ? ' g2' : '');
    it.opts.forEach((o, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.dataset.i = String(i); const ic = document.createElement('i'); ic.textContent = it.r === 3 ? 'ABCD'[i] + '.' : ICONS[it.r][i]; const t = document.createElement('span'); t.textContent = o; b.append(ic, t); b.addEventListener('click', () => answer(i)); box.append(b); });
    $('tbar').style.setProperty('--v', '100'); tickSec = -1;
  };
  const answer = i => { if (screen === 'sQuiz' && g && g.answer(i)) handle(i); };
  const feedback = (e, picked) => {
    const it = g.cur(), btns = [...$('opts').children];
    btns.forEach((b, i) => { b.disabled = true; if (i === it.ans) b.classList.add('ok'); else if (i === picked) b.classList.add('bad'); else b.classList.add('dim'); });
    $('fbT').textContent = e.ok ? '✅ Benar!' : e.timeout ? '⏰ Waktu habis' : picked === undefined ? '🚫 Soal dilewati' : '❌ Kurang tepat';
    $('fbP').textContent = e.ok ? '+' + e.pts : ''; $('fbW').textContent = it.why; $('fb').hidden = false; $('qS').textContent = String(g.score); $('qK').textContent = g.streak > 1 ? '🔥 ×' + g.streak : '';
    if (e.ok) beep(660, 0.18, 'sine', 0.06, 990); else { beep(150, 0.25, 'sawtooth', 0.05); buzz(70); }
    $('bNext').focus({ preventScroll: true });
  };
  const handle = picked => {
    for (const e of g.events) {
      if (e.type === 'round') showIntro(e.r);
      else if (e.type === 'answer') feedback(e, picked);
      else if (e.type === 'done') finish();
    }
    g.events.length = 0;
  };
  $('bNext').addEventListener('click', () => { if (g && g.next()) { handle(); if (!g.over && screen === 'sQuiz') renderQ(); } });

  const finish = () => {
    const res = g.result();
    if (mode === 'comp') store.set(SK(pname), JSON.stringify({ score: res.score, correct: res.correct, secs: res.secs }));
    showResult(res, mode === 'comp' ? pname : null, g.answers.filter(a => !a.ok).map(a => g.items[a.i]), false); beep(784, 0.4, 'sine', 0.06, 1175);
  };
  const showResult = (res, name, wrong, again) => {
    const acc = Math.round(res.correct / res.total * 100);
    $('rT').textContent = again ? 'Kamu sudah bermain 🔒' : res.correct === res.total ? '🏆 Sempurna!' : acc >= 70 ? '🎉 Bagus sekali!' : '💪 Terus berlatih!';
    $('rS').textContent = String(res.score); $('rC').textContent = res.correct + '/' + res.total; $('rA').textContent = acc + '%'; $('rTm').textContent = String(res.secs);
    $('codeBox').hidden = !name; $('rName').textContent = name || ''; $('rCode').textContent = name ? E.formatResult(name, res) : '';
    $('rNote').textContent = name ? (again ? 'Satu nama hanya satu kesempatan lomba di perangkat ini. Ini hasilmu — tunjukkan ke panitia.' : 'Tunjukkan layar ini kepada panitia dan jangan tutup halaman sebelum hasilmu dicatat.') : 'Mode Latihan tidak dicatat sebagai hasil lomba. Coba Mode Lomba saat panitia siap!';
    const rv = $('rv'); rv.textContent = ''; (wrong || []).forEach(it => { const d = document.createElement('div'); const q = document.createElement('div'); q.textContent = it.text; const a = document.createElement('b'); a.textContent = 'Jawaban: ' + it.opts[it.ans]; const w = document.createElement('div'); w.className = 'muted small'; w.textContent = it.why; d.append(q, a, w); rv.append(d); });
    $('rvT').hidden = !rv.children.length; show('sRes');
  };
  $('bCopy').addEventListener('click', async () => {
    const c = $('rCode').textContent;
    try { await navigator.clipboard.writeText(c); toast('Hasil disalin ✔'); }
    catch { try { const r = document.createRange(); r.selectNodeContents($('rCode')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('Hasil terpilih — salin manual'); } catch { toast('Catat hasil secara manual'); } }
  });

  /* keyboard & aturan lomba */
  addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const k = e.key.toLowerCase();
    if (screen === 'sQuiz' && /^[1-4]$/.test(k) && !e.repeat) answer(Number(k) - 1);
    else if ((k === 'enter' || k === ' ') && screen === 'sQuiz' && !$('fb').hidden && e.target.tagName !== 'BUTTON') { e.preventDefault(); $('bNext').click(); }
    else if (k === 'f') toggleFS(); else if (k === 'm') $('bMute').click();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (mode === 'comp' && g && screen === 'sQuiz' && g.phase === 'q' && g.forfeit()) { handle(); toast('Kamu meninggalkan halaman — soal dianggap salah'); } }
    else if (g && screen === 'sQuiz') getWake();
  });
  const frame = ts => {
    requestAnimationFrame(frame); const dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts;
    if (g && screen === 'sQuiz' && g.phase === 'q' && !document.hidden) {
      g.tick(dt); $('tbar').style.setProperty('--v', (g.timeLeft / g.cur().limit * 100).toFixed(1));
      const s = Math.ceil(g.timeLeft); if (s <= 3 && s !== tickSec && s > 0) { tickSec = s; beep(880, 0.06, 'square', 0.03); }
      if (g.events.length) handle();
    }
  };
  requestAnimationFrame(frame);
})();
