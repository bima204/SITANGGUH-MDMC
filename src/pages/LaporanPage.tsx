// ============================================================
// TIRTA — Laporan & Manifes Page
// ============================================================
import { useApp } from '../context/AppContext';
import { Printer, FileText, Calendar, Award, History } from 'lucide-react';

export default function LaporanPage() {
  const { jadwalList, desaList, armadaList, topsisResults } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const todayJadwal = jadwalList.filter(j => j.tanggal === today);
  const selesaiJadwal = jadwalList.filter(j => j.status === 'selesai');

  const totalAirAll   = selesaiJadwal.reduce((s, j) => s + j.jumlahAir, 0);
  const totalWargaAll = desaList.reduce((s, d) => s + d.jumlahWarga, 0);
  const kritisCount   = desaList.filter(d => d.cluster === 'kritis').length;

  function printManifes() {
    const win = window.open('', '_blank');
    if (!win) return;

    const rows = todayJadwal.map((j, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${j.desaNama}</td>
        <td>${armadaList.find(a => a.id === j.armadaId)?.supir || '-'}</td>
        <td>${j.armadaPolisi}</td>
        <td>${j.jumlahAir.toLocaleString('id-ID')} L</td>
        <td>${j.sumberAirNama}</td>
        <td>${j.catatan || '-'}</td>
        <td style="width:80px;border-bottom:1px solid #000">&nbsp;</td>
      </tr>
    `).join('');

    const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <title>Manifes Distribusi Air — ${today}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; margin: 20mm; color: #000; }
    h1 { text-align: center; font-size: 16px; margin: 0; }
    h2 { text-align: center; font-size: 13px; font-weight: normal; margin: 4px 0 16px; }
    .header-org { text-align: center; font-size: 11px; color: #555; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { background: #1e3a5f; color: #fff; padding: 8px 6px; font-size: 11px; border: 1px solid #000; }
    td { padding: 7px 6px; border: 1px solid #ccc; font-size: 11px; vertical-align: top; }
    tr:nth-child(even) td { background: #f8f9ff; }
    .footer { margin-top: 30px; display: flex; justify-content: space-between; }
    .sign-box { text-align: center; width: 180px; }
    .sign-line { border-top: 1px solid #000; margin-top: 60px; font-size: 11px; }
    @media print { body { margin: 10mm; } }
  </style>
</head>
<body>
  <div class="header-org">
    <h1>MANIFES DISTRIBUSI AIR BERSIH</h1>
    <h2>MDMC — Muhammadiyah Disaster Management Center Banjarnegara</h2>
    <div>Tanggal: ${new Date(today).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
    <div>Respon Kekeringan Kabupaten Banjarnegara</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Desa Tujuan</th>
        <th>Supir</th>
        <th>Armada</th>
        <th>Volume</th>
        <th>Sumber Air</th>
        <th>Catatan</th>
        <th>TTD Penerima</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="8" style="text-align:center">Tidak ada jadwal hari ini</td></tr>'}
    </tbody>
  </table>

  <div class="footer">
    <div class="sign-box">
      <div>Koordinator Operasional</div>
      <div class="sign-line">(_____________________)</div>
    </div>
    <div class="sign-box">
      <div>Mengetahui, Ketua MDMC</div>
      <div class="sign-line">(_____________________)</div>
    </div>
  </div>

  <script>window.print();<\/script>
</body>
</html>`;

    win.document.write(html);
    win.document.close();
  }

  function printRekap() {
    const win = window.open('', '_blank');
    if (!win) return;

    const desaRows = topsisResults.slice(0, 10).map(r => `
      <tr>
        <td>${r.rank}</td>
        <td>${r.desa.namaDesa}</td>
        <td>${r.desa.namaKecamatan}</td>
        <td>${r.desa.jumlahWarga.toLocaleString('id-ID')}</td>
        <td>${r.desa.defisitAir.toLocaleString('id-ID')}</td>
        <td>${r.score.toFixed(4)}</td>
        <td>PRIORITAS ${r.rank}</td>
      </tr>
    `).join('');

    const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8"/>
  <title>Laporan SPK Kekeringan MDMC Banjarnegara</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; margin: 20mm; color: #000; }
    h1 { text-align: center; font-size: 16px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #1e3a5f; color: #fff; padding: 8px; border: 1px solid #000; }
    td { padding: 6px 8px; border: 1px solid #ccc; }
    tr:nth-child(even) td { background: #f0f4ff; }
    .section { font-weight: bold; margin: 16px 0 6px; border-bottom: 1px solid #000; padding-bottom: 4px; }
    @media print { body { margin: 10mm; } }
  </style>
</head>
<body>
  <h1>LAPORAN SPK KEKERINGAN — MDMC BANJARNEGARA</h1>
  <div style="text-align:center;color:#555;margin-bottom:20px">
    Dicetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
  </div>

  <div class="section">A. RINGKASAN EKSEKUTIF</div>
  <table>
    <tr><td><b>Total Desa Terdampak</b></td><td>${desaList.length} desa</td></tr>
    <tr><td><b>Total Warga Terdampak</b></td><td>${totalWargaAll.toLocaleString('id-ID')} jiwa</td></tr>
    <tr><td><b>Zona Kritis</b></td><td>${kritisCount} desa</td></tr>
    <tr><td><b>Zona Waspada</b></td><td>${desaList.filter(d => d.cluster === 'waspada').length} desa</td></tr>
    <tr><td><b>Zona Siaga</b></td><td>${desaList.filter(d => d.cluster === 'siaga').length} desa</td></tr>
    <tr><td><b>Total Distribusi Selesai</b></td><td>${totalAirAll.toLocaleString('id-ID')} Liter</td></tr>
  </table>

  <div class="section">B. RANKING PRIORITAS TOPSIS — ZONA KRITIS</div>
  ${topsisResults.length > 0 ? `
  <table>
    <thead>
      <tr><th>Rank</th><th>Desa</th><th>Kecamatan</th><th>Warga</th><th>Defisit Air</th><th>Skor TOPSIS</th><th>Keterangan</th></tr>
    </thead>
    <tbody>${desaRows}</tbody>
  </table>` : '<p>Belum ada hasil TOPSIS. Jalankan analisis terlebih dahulu.</p>'}

  <script>window.print();<\/script>
</body>
</html>`;

    win.document.write(html);
    win.document.close();
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Laporan &amp; Manifes</h1>
          <p>Rekap harian distribusi air bersih dan cetak dokumen operasional MDMC</p>
        </div>
        <div className="page-actions" style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={printManifes} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Printer size={16} /> Cetak Manifes Hari Ini
          </button>
          <button className="btn btn-secondary" onClick={printRekap} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <FileText size={16} /> Cetak Laporan SPK
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="stat-grid">
        <div className="stat-card info">
          <div className="stat-label">Total Desa Terdampak</div>
          <div className="stat-value">{desaList.length}</div>
          <div className="stat-sub">{totalWargaAll.toLocaleString('id-ID')} jiwa</div>
        </div>
        <div className="stat-card critical">
          <div className="stat-label">Zona Kritis</div>
          <div className="stat-value">{kritisCount}</div>
          <div className="stat-sub">butuh dropping segera</div>
        </div>
        <div className="stat-card safe">
          <div className="stat-label">Total Air Didistribusi</div>
          <div className="stat-value">{(totalAirAll / 1000).toFixed(0)}K</div>
          <div className="stat-sub">liter dari {selesaiJadwal.length} dropping</div>
        </div>
        <div className="stat-card info">
          <div className="stat-label">Jadwal Hari Ini</div>
          <div className="stat-value">{todayJadwal.length}</div>
          <div className="stat-sub">dropping terjadwal</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Rekap Jadwal Hari Ini */}
        <div className="card">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
              <Calendar size={16} style={{ color: 'var(--blue-400)' }} />
              Jadwal Hari Ini &mdash; {today}
            </div>
            <button className="btn btn-sm btn-primary" onClick={printManifes} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Printer size={13} /> Cetak
            </button>
          </div>
          {todayJadwal.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Tidak ada jadwal hari ini</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Desa</th>
                    <th>Armada</th>
                    <th>Volume</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayJadwal.map(j => (
                    <tr key={j.id}>
                      <td><strong>{j.desaNama}</strong></td>
                      <td style={{ fontSize: '0.8rem' }}>{j.armadaPolisi}</td>
                      <td style={{ color: 'var(--cyan-400)' }}>{j.jumlahAir.toLocaleString('id-ID')} L</td>
                      <td>
                        {j.status === 'selesai'          && <span className="badge badge-safe">Selesai</span>}
                        {j.status === 'dalam_perjalanan' && <span className="badge badge-warning">Perjalanan</span>}
                        {j.status === 'terjadwal'        && <span className="badge badge-info">Terjadwal</span>}
                        {j.status === 'batal'            && <span className="badge badge-critical">Batal</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Ranking TOPSIS */}
        <div className="card">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
              <Award size={16} style={{ color: 'var(--blue-400)' }} />
              Top Prioritas TOPSIS
            </div>
            <button className="btn btn-sm btn-secondary" onClick={printRekap} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <FileText size={13} /> Laporan
            </button>
          </div>
          {topsisResults.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
              Belum ada hasil TOPSIS. Jalankan analisis terlebih dahulu.
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Rank</th><th>Desa</th><th>Warga</th><th>Skor Preferensi</th></tr>
                </thead>
                <tbody>
                  {topsisResults.slice(0, 8).map(r => (
                    <tr key={r.desa.id}>
                      <td><span className={`rank-num ${r.rank <= 3 ? `rank-${r.rank}` : 'rank-n'}`}>{r.rank}</span></td>
                      <td><strong>{r.desa.namaDesa}</strong></td>
                      <td style={{ fontSize: '0.8rem' }}>{r.desa.jumlahWarga.toLocaleString('id-ID')}</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--cyan-400)', fontWeight: 700 }}>{r.score.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Riwayat semua jadwal selesai */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-header" style={{ marginBottom: 14 }}>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
            <History size={16} style={{ color: 'var(--blue-400)' }} />
            Riwayat Dropping Selesai ({selesaiJadwal.length})
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Desa</th>
                <th>Armada</th>
                <th>Volume</th>
                <th>Sumber Air</th>
              </tr>
            </thead>
            <tbody>
              {selesaiJadwal.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Belum ada dropping yang selesai</td></tr>
              )}
              {selesaiJadwal.map(j => (
                <tr key={j.id}>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{j.tanggal}</td>
                  <td><strong>{j.desaNama}</strong></td>
                  <td style={{ fontSize: '0.875rem' }}>{j.armadaPolisi}</td>
                  <td><span style={{ color: 'var(--safe)', fontWeight: 600 }}>{j.jumlahAir.toLocaleString('id-ID')} L</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{j.sumberAirNama}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
