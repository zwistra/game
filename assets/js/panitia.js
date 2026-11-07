'use strict';
/* Panel panitia: verifikasi kode hasil & peringkat. Tanpa innerHTML/eval/jaringan. */
(() => {
  const E = window.ArenaEngine; if (!E) return;
  const $ = id => document.getElementById(id);
  let rows = [];
  const cell = (tr, v, cls) => { const td = document.createElement('td'); td.textContent = String(v); if (cls) td.className = cls; tr.append(td); };
  const note = (r) => [r.tries > 1 ? r.tries + ' kode untuk siswa ini (diambil terbaik, periksa aturan)' : '', r.correct === E.TOTAL ? 'sempurna' : ''].filter(Boolean).join('; ');
  const csvCell = v => { let s = String(v); if (/^[=+\-@]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; }; // cegah CSV injection
  const process = () => {
    const key = E.normKey($('pKey').value); $('pErr').textContent = '';
    if (!key) { $('pErr').textContent = 'Isi Kode Lomba (3–12 huruf/angka).'; return; }
    if (!$('pCodes').value.trim()) { $('pErr').textContent = 'Tempel minimal satu Kode Hasil.'; return; }
    const r = E.rankCodes(key, $('pCodes').value); rows = r.rows;
    const body = $('pBody'); body.textContent = '';
    r.rows.forEach(x => { const tr = document.createElement('tr'); if (x.rank <= 3) tr.className = 'top' + x.rank; cell(tr, x.rank); cell(tr, x.kode, 'mono'); cell(tr, x.score); cell(tr, x.correct + '/' + E.TOTAL); cell(tr, x.acc + '%'); cell(tr, x.secs); cell(tr, note(x), 'small'); body.append(tr); });
    const pod = $('podium'); pod.textContent = '';
    r.rows.filter(x => x.rank <= 3).forEach(x => { const d = document.createElement('div'); d.className = 'pd p' + x.rank; const m = document.createElement('span'); m.textContent = ['🥇', '🥈', '🥉'][x.rank - 1]; const k = document.createElement('b'); k.textContent = x.kode; const s = document.createElement('small'); s.textContent = x.score + ' poin'; d.append(m, k, s); pod.append(d); });
    const inv = $('pInvL'); inv.textContent = ''; r.invalid.forEach(x => { const li = document.createElement('li'); li.textContent = x.code.slice(0, 24) + ' — ' + x.reason; inv.append(li); });
    if (r.duplicates) { const li = document.createElement('li'); li.textContent = r.duplicates + ' kode ganda (persis sama) diabaikan'; inv.append(li); }
    $('pInv').hidden = !inv.children.length; $('pOut').hidden = false;
    if (!r.rows.length) $('pErr').textContent = 'Tidak ada kode yang valid. Periksa Kode Lomba dan kodenya.';
  };
  const tableText = sep => ['Peringkat', 'Kode Siswa', 'Skor', 'Benar', 'Akurasi', 'Waktu'].join(sep) + '\n' + rows.map(x => [x.rank, x.kode, x.score, x.correct, x.acc + '%', x.secs].join(sep)).join('\n');
  $('bRank').addEventListener('click', process);
  $('bGen').addEventListener('click', () => { $('pKey').value = E.randomKey(); });
  $('bClr').addEventListener('click', () => { $('pCodes').value = ''; $('pOut').hidden = true; $('pErr').textContent = ''; rows = []; });
  $('bCsv').addEventListener('click', () => {
    if (!rows.length) return;
    const csv = 'Peringkat,Kode Siswa,Skor,Benar,Akurasi,Waktu\n' + rows.map(x => [x.rank, x.kode, x.score, x.correct, x.acc + '%', x.secs].map(csvCell).join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })); a.download = 'peringkat-lomba.csv'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  $('bTsv').addEventListener('click', async () => { try { await navigator.clipboard.writeText(tableText('\t')); $('pErr').textContent = 'Tabel disalin ✔'; } catch { $('pErr').textContent = 'Gagal menyalin otomatis — gunakan Unduh CSV.'; } });
})();
