'use strict';
/* Panel panitia: peringkat dari hasil yang dicatat. Tanpa innerHTML/eval/jaringan. */
(() => {
  const E = window.ArenaEngine; if (!E) return;
  const $ = id => document.getElementById(id);
  let rows = [];
  const cell = (tr, v, cls) => { const td = document.createElement('td'); td.textContent = String(v); if (cls) td.className = cls; tr.append(td); };
  const note = r => [r.tries > 1 ? r.tries + ' entri untuk nama ini (diambil terbaik)' : '', r.correct === E.TOTAL ? 'sempurna' : ''].filter(Boolean).join('; ');
  const csvCell = v => { let s = String(v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; }; // cegah CSV injection
  const process = () => {
    $('pErr').textContent = '';
    if (!$('pCodes').value.trim()) { $('pErr').textContent = 'Tempel atau ketik minimal satu baris hasil.'; return; }
    const r = E.rankLines($('pCodes').value); rows = r.rows;
    const body = $('pBody'); body.textContent = '';
    r.rows.forEach(x => { const tr = document.createElement('tr'); if (x.rank <= 3) tr.className = 'top' + x.rank; cell(tr, x.rank); cell(tr, x.name); cell(tr, x.score); cell(tr, x.correct + '/' + E.TOTAL); cell(tr, x.acc + '%'); cell(tr, x.secs); cell(tr, note(x), 'small'); body.append(tr); });
    const pod = $('podium'); pod.textContent = '';
    r.rows.filter(x => x.rank <= 3).forEach(x => { const d = document.createElement('div'); d.className = 'pd p' + x.rank; const m = document.createElement('span'); m.textContent = ['🥇', '🥈', '🥉'][x.rank - 1]; const k = document.createElement('b'); k.textContent = x.name; const s = document.createElement('small'); s.textContent = x.score + ' poin'; d.append(m, k, s); pod.append(d); });
    const inv = $('pInvL'); inv.textContent = ''; r.invalid.forEach(x => { const li = document.createElement('li'); li.textContent = x.line.slice(0, 60) + ' — ' + x.reason; inv.append(li); });
    $('pInv').hidden = !inv.children.length; $('pOut').hidden = false;
    if (!r.rows.length) $('pErr').textContent = 'Tidak ada baris yang valid. Periksa formatnya.';
  };
  const tableText = sep => ['Peringkat', 'Nama', 'Skor', 'Benar', 'Akurasi', 'Waktu'].join(sep) + '\n' + rows.map(x => [x.rank, x.name, x.score, x.correct, x.acc + '%', x.secs].join(sep)).join('\n');
  $('bRank').addEventListener('click', process);
  $('bClr').addEventListener('click', () => { $('pCodes').value = ''; $('pOut').hidden = true; $('pErr').textContent = ''; rows = []; });
  $('bCsv').addEventListener('click', () => {
    if (!rows.length) return;
    const csv = 'Peringkat,Nama,Skor,Benar,Akurasi,Waktu\n' + rows.map(x => [x.rank, x.name, x.score, x.correct, x.acc + '%', x.secs].map(csvCell).join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })); a.download = 'peringkat-lomba.csv'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  $('bTsv').addEventListener('click', async () => { try { await navigator.clipboard.writeText(tableText('\t')); $('pErr').textContent = 'Tabel disalin ✔'; } catch { $('pErr').textContent = 'Gagal menyalin otomatis — gunakan Unduh CSV.'; } });
})();
