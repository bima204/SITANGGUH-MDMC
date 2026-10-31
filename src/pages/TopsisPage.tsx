// ============================================================
// TIRTA — TOPSIS Ranking & Rekomendasi Penerjunan MDMC (Dual-Mode)
// Perhitungan Lengkap: Matriks X, R, Y, A+, A-, D+, D-, Vi
// ============================================================
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { runTopsis, applyTopsisRankToDesa, getTopsisDivisors } from '../algorithms/topsis';
import type { TopsisBobot } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  Sliders, Award, Calculator, BarChart2, Printer, Truck, 
  AlertTriangle, Play, BookOpen, ShieldAlert, Users, Droplets, 
  Target, Zap, FileSpreadsheet, LifeBuoy, Mountain, Navigation 
} from 'lucide-react';

export default function TopsisPage() {
  const { desaList, setDesaList, bobot, setBobot, topsisResults, setTopsisResults, kmeansResult, setActivePage, sumberAirList, musim } = useApp();
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<'config' | 'rekomendasi' | 'perhitungan' | 'ranking'>('config');

  const isHujan = musim === 'hujan';

  const criteriaInfo = isHujan ? [
    { key: 'c1', label: 'H1 — Curah Hujan 24J', type: 'Benefit', desc: 'Akumulasi presipitasi harian (mm/24 jam). Memicu penjenuhan air tanah.', color: '#38bdf8' },
    { key: 'c2', label: 'H2 — Kemiringan Lereng', type: 'Benefit', desc: 'Kemiringan lereng tebing pegunungan (%). Makin curam makin rawan luncuran.', color: '#38bdf8' },
    { key: 'c3', label: 'H3 — Indeks Gerakan Tanah PVMBG', type: 'Benefit', desc: 'Peta kerentanan geologi batuan lapuk (Skala 1-5).', color: '#38bdf8' },
    { key: 'c4', label: 'H4 — Populasi Warga Terancam', type: 'Benefit', desc: 'Jumlah jiwa di pemukiman zona merah rawan longsor/bantaran sungai.', color: '#38bdf8' },
    { key: 'c5', label: 'H5 — Jarak ke Sempadan Sungai/DAS', type: 'Cost', desc: 'Jarak ke bibir Sungai Serayu/Merawu (km). Semakin dekat semakin rawan luapan.', color: '#f59e0b' },
    { key: 'c6', label: 'H6 — Hambatan Drainase & Resapan', type: 'Benefit', desc: 'Kejenuhan pori tanah & drainase tersumbat (Skala 1-5).', color: '#38bdf8' },
  ] as const : [
    { key: 'c1', label: 'C1 — Jumlah Warga', type: 'Benefit', desc: 'Semakin banyak warga terdampak, semakin tinggi prioritas', color: '#60a5fa' },
    { key: 'c2', label: 'C2 — Defisit Air Harian', type: 'Benefit', desc: 'Kebutuhan volume air per hari (liter)', color: '#60a5fa' },
    { key: 'c3', label: 'C3 — Durasi Kekeringan', type: 'Benefit', desc: 'Lama hari tanpa akses air bersih mandiri', color: '#60a5fa' },
    { key: 'c4', label: 'C4 — Rasio Kelompok Rentan', type: 'Benefit', desc: 'Lansia, balita, disabilitas & fasum kesehatan/sekolah', color: '#60a5fa' },
    { key: 'c5', label: 'C5 — Jarak dari Sumber Air', type: 'Cost', desc: 'Jarak tempuh armada truk ke titik pengisian (km)', color: '#f59e0b' },
    { key: 'c6', label: 'C6 — Hambatan Medan Jalan', type: 'Cost', desc: 'Tingkat kesulitan jalan pegunungan/tanjakan curam (1-5)', color: '#f59e0b' },
  ] as const;

  const totalBobot = Object.values(bobot).reduce((s, v) => s + v, 0);
  const bobotValid = Math.abs(totalBobot - 1) < 0.001;

  function handleRun() {
    if (!bobotValid) { alert('Total bobot kriteria harus pas = 1.00 (100%)!'); return; }
    const kritisCount = desaList.filter(d => d.cluster === 'kritis').length;
    if (kritisCount === 0) {
      alert(isHujan 
        ? 'Belum ada desa di zona Bahaya Merah. Jalankan K-Means Clustering terlebih dahulu!'
        : 'Belum ada desa di zona Kritis. Jalankan K-Means Clustering terlebih dahulu!');
      return;
    }
    setRunning(true);
    setTimeout(() => {
      const results = runTopsis(desaList, bobot, musim);
      setTopsisResults(results);
      const updated = applyTopsisRankToDesa(desaList, results);
      setDesaList(updated);
      setTab('rekomendasi');
      setRunning(false);
    }, 600);
  }

  function updateBobot(key: keyof TopsisBobot, val: number) {
    setBobot({ ...bobot, [key]: val });
  }

  // Presets
  function applyPreset(type: 'standar' | 'kemanusiaan' | 'akses') {
    if (isHujan) {
      if (type === 'standar') {
        setBobot({ c1: 0.25, c2: 0.25, c3: 0.20, c4: 0.15, c5: 0.10, c6: 0.05 });
      } else if (type === 'kemanusiaan') {
        // Fokus Longsor Lereng Tebing
        setBobot({ c1: 0.20, c2: 0.35, c3: 0.25, c4: 0.10, c5: 0.05, c6: 0.05 });
      } else if (type === 'akses') {
        // Fokus Banjir Luapan Sungai / DAS
        setBobot({ c1: 0.30, c2: 0.10, c3: 0.10, c4: 0.20, c5: 0.20, c6: 0.10 });
      }
    } else {
      if (type === 'standar') {
        setBobot({ c1: 0.25, c2: 0.25, c3: 0.15, c4: 0.15, c5: 0.10, c6: 0.10 });
      } else if (type === 'kemanusiaan') {
        setBobot({ c1: 0.30, c2: 0.25, c3: 0.10, c4: 0.25, c5: 0.05, c6: 0.05 });
      } else if (type === 'akses') {
        setBobot({ c1: 0.20, c2: 0.20, c3: 0.15, c4: 0.15, c5: 0.15, c6: 0.15 });
      }
    }
  }

  // Print recommendation slip
  function printRekomendasi() {
    const win = window.open('', '_blank');
    if (!win) return;
    const now = new Date().toLocaleDateString('id-ID', { dateStyle: 'full' });

    const rows = topsisResults.map((r) => `
      <tr>
        <td style="text-align:center;font-weight:bold;">#${r.rank}</td>
        <td><strong>${r.desa.namaDesa}</strong> (Kec. ${r.desa.namaKecamatan})</td>
        <td style="text-align:right;">${(isHujan ? r.desa.wargaTerancam : r.desa.jumlahWarga)?.toLocaleString('id-ID')} jiwa</td>
        <td style="text-align:right;">${isHujan ? `${r.desa.curahHujan} mm / Lereng ${r.desa.kemiringanLereng}%` : `${r.desa.defisitAir.toLocaleString('id-ID')} L`}</td>
        <td style="text-align:center;font-weight:bold;">${r.score.toFixed(4)}</td>
        <td style="text-align:center;font-weight:bold;color:${isHujan ? '#0284c7' : '#b91c1c'};">${isHujan ? `${r.rekomendasiTimSar} Personil Tim SAR` : `${r.rekomendasiTangki} Tangki (±${(r.rekomendasiTangki * 5).toLocaleString('id-ID')}k L)`}</td>
        <td>${r.rekomendasiUrgensi}</td>
        <td>${isHujan ? `${r.kebutuhanLogistikHujan} — ${r.rekomendasiAksi}` : r.rekomendasiAksi}</td>
      </tr>
    `).join('');

    const judulSurat = isHujan
      ? 'LEMBAR DISPOSISI PENERJUNAN TIM SAR & LOGISTIK SIAGA BENCANA BANJIR/LONGSOR'
      : 'LEMBAR REKOMENDASI PENERJUNAN LOGISTIK AIR BERSIH MDMC BANJARNEGARA';

    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${judulSurat}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 24px; color: #1e293b; line-height: 1.5; font-size: 11pt; }
          .header { border-bottom: 3px double #0284c7; padding-bottom: 12px; margin-bottom: 18px; }
          .title { font-size: 14pt; font-weight: bold; color: #0f172a; margin-bottom: 2px; }
          .sub { font-size: 10pt; color: #64748b; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 10pt; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 8px; }
          th { background: #f8fafc; font-weight: bold; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 9.5pt; }
          .footer { margin-top: 30px; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">MUHAMMADIYAH DISASTER MANAGEMENT CENTER (MDMC)</div>
          <div class="sub">LEMBAGA RESILIENT BENCANA — KABUPATEN BANJARNEGARA, JAWA TENGAH</div>
          <div style="font-size: 12pt; font-weight: bold; margin-top: 6px; color: #0284c7;">${judulSurat}</div>
        </div>
        <div class="meta">
          <div>Tanggal Disposisi: <strong>${now}</strong></div>
          <div>Metode: <strong>K-Means Clustering + TOPSIS Multi-Criteria</strong></div>
          <div>Mode Operasional: <strong>${isHujan ? 'MUSIM HUJAN (HIDROMETEOROLOGI)' : 'MUSIM KEMARAU (KEKERINGAN)'}</strong></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Desa / Kecamatan</th>
              <th>Populasi</th>
              <th>${isHujan ? 'Parameter Cuaca/Lereng' : 'Defisit Air Harian'}</th>
              <th>Skor TOPSIS</th>
              <th>${isHujan ? 'Disposisi SAR' : 'Alokasi Tangki'}</th>
              <th>Urgensi</th>
              <th>Rekomendasi Paket Tindakan</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <div class="footer">
          <div>Mengetahui,<br><strong>Komandan Tanggap Darurat MDMC</strong><br><br><br><br>___________________________</div>
          <div>Ditetapkan di Banjarnegara,<br><strong>Koordinator Operasi Lapangan</strong><br><br><br><br>___________________________</div>
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.print();
  }

  // Chart data
  const chartData = topsisResults.slice(0, 10).map(r => ({
    name: r.desa.namaDesa,
    score: Number(r.score.toFixed(4)),
    rank: r.rank,
  }));

  const divisors = getTopsisDivisors(desaList, musim);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            {isHujan
              ? 'Sistem Rekomendasi Prioritas Bencana TOPSIS'
              : 'Sistem Rekomendasi Prioritas TOPSIS'}
          </h1>
          <p>
            {isHujan
              ? 'Penetapan urutan evakuasi, disposisi personil Tim SAR & logistik darurat bencana banjir luapan dan tanah longsor'
              : 'Kalkulasi presisi urutan penerjunan dropping air bersih pada zona Kritis untuk Posko Komando MDMC'}
          </p>
        </div>
        {topsisResults.length > 0 && (
          <div className="page-actions" style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={printRekomendasi}>
              <Printer size={16} /> {isHujan ? 'Cetak Disposisi Bencana' : 'Cetak Disposisi Penerjunan'}
            </button>
            <button className="btn btn-primary" onClick={() => setActivePage(isHujan ? 'peta' : 'distribusi')}>
              {isHujan ? <Navigation size={16} /> : <Truck size={16} />}
              <span>{isHujan ? 'Buka Rute Evakuasi di Peta 3D' : 'Masukkan ke Jadwal Armada'}</span>
            </button>
          </div>
        )}
      </div>

      {!kmeansResult && (
        <div className="alert alert-warning" style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={18} style={{ color: 'var(--warning)', flexShrink: 0 }} />
          <div>
            <strong>K-Means belum dijalankan:</strong> Jalankan K-Means Clustering terlebih dahulu agar desa di{' '}
            {isHujan ? 'zona Bahaya Merah' : 'zona Kritis'} teridentifikasi untuk dihitung oleh TOPSIS.
          </div>
          <button className="btn btn-sm btn-primary" style={{ marginLeft: 'auto' }} onClick={() => setActivePage('kmeans')}>
            Jalankan K-Means Dulu
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="tab-list">
        <button className={`tab-btn ${tab === 'config' ? 'active' : ''}`} onClick={() => setTab('config')}>
          <Sliders size={16} /> Bobot Kriteria
        </button>
        <button className={`tab-btn ${tab === 'rekomendasi' ? 'active' : ''}`} onClick={() => setTab('rekomendasi')}>
          <Award size={16} /> {isHujan ? 'Paket Disposisi SAR & Logistik' : 'Paket Rekomendasi Penerjunan'}
        </button>
        <button className={`tab-btn ${tab === 'perhitungan' ? 'active' : ''}`} onClick={() => setTab('perhitungan')}>
          <Calculator size={16} /> Rincian Perhitungan Matematis
        </button>
        <button className={`tab-btn ${tab === 'ranking' ? 'active' : ''}`} onClick={() => setTab('ranking')}>
          <BarChart2 size={16} /> Grafik Skor Preferensi
        </button>
      </div>

      {/* Config Tab */}
      {tab === 'config' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sliders size={18} style={{ color: 'var(--blue-400)' }} />
                Pembobotan Kriteria SPK ({isHujan ? 'Mode Musim Hujan' : 'Mode Kemarau'})
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-xs btn-secondary" onClick={() => applyPreset('standar')}>
                  {isHujan ? 'Standar Siaga PVMBG' : 'Preset Standar MDMC'}
                </button>
                <button className="btn btn-xs btn-secondary" onClick={() => applyPreset('kemanusiaan')}>
                  {isHujan ? 'Fokus Longsor Tebing' : 'Prioritas Warga & Rentan'}
                </button>
                <button className="btn btn-xs btn-secondary" onClick={() => applyPreset('akses')}>
                  {isHujan ? 'Fokus Luapan DAS' : 'Prioritas Akses Jalan'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {criteriaInfo.map(c => {
                const currentVal = bobot[c.key as keyof TopsisBobot];
                return (
                  <div key={c.key} style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div>
                        <strong>{c.label}</strong>
                        <span className={`badge ${c.type === 'Benefit' ? 'badge-info' : 'badge-warning'}`} style={{ marginLeft: 8 }}>
                          {c.type}
                        </span>
                      </div>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.1rem', color: 'var(--cyan-400)' }}>
                        {(currentVal * 100).toFixed(0)}%
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 4 }}>({currentVal.toFixed(2)})</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{c.desc}</div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.50"
                      step="0.05"
                      value={currentVal}
                      onChange={e => updateBobot(c.key as keyof TopsisBobot, parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--blue-500)' }}
                    />
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.9rem' }}>
                Total Bobot: <strong style={{ color: bobotValid ? 'var(--safe)' : 'var(--critical)' }}>{totalBobot.toFixed(2)}</strong>
                {!bobotValid && <span style={{ color: 'var(--critical)', marginLeft: 8 }}>(Harus tepat 1.00)</span>}
              </div>
              <button className="btn btn-primary" onClick={handleRun} disabled={running || !bobotValid} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Play size={16} />
                {running ? 'Menghitung TOPSIS...' : (isHujan ? 'Jalankan Ranking Prioritas Bencana' : 'Jalankan Kalkulasi TOPSIS')}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={18} style={{ color: 'var(--blue-400)' }} />
              Landasan Keputusan TOPSIS
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong>TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)</strong> memilih alternatif prioritas
              tertinggi yang memiliki jarak terdekat dari <em>Solusi Ideal Positif (A+)</em> dan jarak terjauh dari <em>Solusi Ideal Negatif (A-)</em>.
            </p>
            <div className="divider" />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <strong>Kategori Kriteria ({isHujan ? 'Musim Hujan' : 'Kemarau'}):</strong>
              <div style={{ marginTop: 6 }}>
                {isHujan ? (
                  <>
                    • <strong>Benefit (H1, H2, H3, H4, H6):</strong> Semakin tinggi curah hujan, kemiringan lereng, dan warga terancam, semakin mendesak evakuasi.<br/>
                    • <strong>Cost (H5):</strong> Semakin dekat ke sempadan aliran sungai (jarak kecil), semakin tinggi risiko bahaya luapan.
                  </>
                ) : (
                  <>
                    • <strong>Benefit (C1, C2, C3, C4):</strong> Nilai semakin tinggi semakin mendesak untuk dibantu.<br/>
                    • <strong>Cost (C5, C6):</strong> Nilai semakin tinggi memperberat hambatan logistik &amp; jarak.
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rekomendasi Tab */}
      {tab === 'rekomendasi' && topsisResults.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Executive Summary Card for Commander */}
          <div className="card" style={{
            background: isHujan
              ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(13, 27, 46, 0.95))'
              : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(13, 27, 46, 0.9))',
            border: isHujan ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span className={`badge ${isHujan ? 'badge-info' : 'badge-critical'}`} style={{ fontSize: '11px', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <ShieldAlert size={14} />
                  <span>{isHujan ? 'DISPOSISI PENERJUNAN SAR & EVAKUASI MDMC' : 'REKOMENDASI PENERJUNAN RESMI MDMC'}</span>
                </span>
                <h3 style={{ margin: '8px 0 4px', fontSize: '1.25rem', color: '#fff' }}>
                  {isHujan
                    ? `Prioritas Siaga Bencana: ${topsisResults.length} Desa Zona Bahaya Merah`
                    : `Prioritas Alokasi Dropping Air: ${topsisResults.length} Desa Zona Kritis`}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {isHujan
                    ? 'Hasil ranking kalkulasi matematis TOPSIS terhadap ancaman pergerakan tanah tebing & luapan DAS Serayu.'
                    : 'Berdasarkan perhitungan matematis TOPSIS multi-kriteria pada seluruh desa terdampak di Kabupaten Banjarnegara.'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {isHujan ? 'Total Personil Tim SAR' : 'Total Armada Diperlukan'}
                  </div>
                  <div style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: 'var(--cyan-400)' }}>
                    {isHujan
                      ? topsisResults.reduce((s, r) => s + (r.rekomendasiTimSar || 8), 0)
                      : topsisResults.reduce((s, r) => s + r.rekomendasiTangki, 0)}{' '}
                    <span style={{ fontSize: '0.9rem' }}>{isHujan ? 'Personil' : 'Rit'}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {isHujan ? 'Warga Terancam di Titik Rawan' : 'Volume Air Darurat'}
                  </div>
                  <div style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: isHujan ? 'var(--blue-400)' : 'var(--critical)' }}>
                    {isHujan
                      ? (topsisResults.reduce((s, r) => s + (r.desa.wargaTerancam || 0), 0) / 1000).toFixed(1) + 'k'
                      : (topsisResults.reduce((s, r) => s + r.desa.defisitAir, 0) / 1000).toFixed(0) + 'k'}{' '}
                    <span style={{ fontSize: '0.9rem' }}>{isHujan ? 'Jiwa' : 'Liter'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 3 Podium */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'flex-end', flexWrap: 'wrap', margin: '10px 0' }}>
            {[1, 0, 2].map(posIdx => {
              const r = topsisResults[posIdx];
              if (!r) return null;
              const isFirst = r.rank === 1;
              const isSecond = r.rank === 2;
              const badgeBg = isFirst 
                ? 'linear-gradient(135deg, #ef4444, #b91c1c)' 
                : isSecond 
                ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
              return (
                <div key={r.desa.id} style={{
                  background: isFirst ? 'linear-gradient(180deg, rgba(239,68,68,0.2), var(--bg-card))' : 'var(--bg-card)',
                  border: isFirst ? '2px solid var(--critical)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  width: '280px',
                  textAlign: 'center',
                  boxShadow: isFirst ? '0 0 24px rgba(239,68,68,0.35)' : 'none',
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: badgeBg,
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '1.15rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    margin: '0 auto 10px',
                    letterSpacing: '0.02em'
                  }}>
                    0{r.rank}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isFirst ? 'var(--critical)' : 'var(--cyan-400)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    PRIORITAS UTAMA #{r.rank}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', marginTop: 4, color: '#fff' }}>{r.desa.namaDesa}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>Kec. {r.desa.namaKecamatan}</div>

                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '10px 12px', borderRadius: '6px', fontSize: '0.8rem', textAlign: 'left', lineHeight: '1.6' }}>
                    {isHujan ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Mountain size={14} style={{ color: 'var(--warning)' }} />
                          <span>Lereng: <strong>{r.desa.kemiringanLereng}%</strong> &bull; Hujan: <strong>{r.desa.curahHujan} mm</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Users size={14} style={{ color: 'var(--blue-400)' }} />
                          <span>Warga Rawan: <strong style={{ color: 'var(--critical)' }}>{r.desa.wargaTerancam?.toLocaleString('id-ID')} jiwa</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Target size={14} style={{ color: 'var(--cyan-400)' }} />
                          <span>Skor TOPSIS: <strong style={{ color: 'var(--cyan-400)' }}>{r.score.toFixed(4)}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <LifeBuoy size={14} style={{ color: '#fff' }} />
                          <span>Tim SAR: <strong style={{ color: '#fff' }}>{r.rekomendasiTimSar} Personil</strong></span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Users size={14} style={{ color: 'var(--blue-400)' }} />
                          <span>Warga: <strong>{r.desa.jumlahWarga.toLocaleString('id-ID')} jiwa</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Droplets size={14} style={{ color: 'var(--critical)' }} />
                          <span>Defisit: <strong style={{ color: 'var(--critical)' }}>{r.desa.defisitAir.toLocaleString('id-ID')} L</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Target size={14} style={{ color: 'var(--cyan-400)' }} />
                          <span>Skor TOPSIS: <strong style={{ color: 'var(--cyan-400)' }}>{r.score.toFixed(4)}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Truck size={14} style={{ color: '#fff' }} />
                          <span>Alokasi: <strong style={{ color: '#fff' }}>{r.rekomendasiTangki} Tangki Air</strong></span>
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ marginTop: 10, fontSize: '0.75rem', color: isFirst ? 'var(--critical)' : 'var(--safe)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Zap size={14} /> {r.rekomendasiUrgensi}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Recommendation Table */}
          <div className="card">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileSpreadsheet size={18} style={{ color: 'var(--blue-400)' }} />
              {isHujan
                ? 'Tabel Rekomendasi Disposisi Tim SAR & Logistik Bencana per Desa Zona Bahaya'
                : 'Tabel Rekomendasi Alokasi Lengkap per Desa Zona Kritis'}
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Prioritas</th>
                    <th>Desa &amp; Kecamatan</th>
                    <th>{isHujan ? 'Warga Terancam' : 'Warga'}</th>
                    <th>{isHujan ? 'Parameter Cuaca/Lereng' : 'Defisit Air'}</th>
                    <th>Skor TOPSIS (V)</th>
                    <th>{isHujan ? 'Disposisi Tim SAR' : 'Alokasi Tangki'}</th>
                    <th>{isHujan ? 'Paket Logistik Darurat' : 'Sumber Air Terdekat'}</th>
                    <th>Status Urgensi</th>
                    <th>Rekomendasi Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {topsisResults.map(r => {
                    const nearestSource = sumberAirList[0]?.nama || 'PDAM Purwanegara';
                    return (
                      <tr key={r.desa.id}>
                        <td>
                          <span className={`rank-num ${r.rank <= 3 ? `rank-${r.rank}` : 'rank-n'}`}>
                            #{r.rank}
                          </span>
                        </td>
                        <td>
                          <strong>{r.desa.namaDesa}</strong><br/>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kec. {r.desa.namaKecamatan}</span><br/>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${r.desa.lat},${r.desa.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: '0.72rem', color: 'var(--blue-400)', textDecoration: 'none', fontWeight: 600 }}
                          >
                            Rute Google Maps &rarr;
                          </a>
                        </td>
                        <td>{(isHujan ? r.desa.wargaTerancam : r.desa.jumlahWarga)?.toLocaleString('id-ID')} jiwa</td>
                        <td>
                          {isHujan ? (
                            <span>
                              <strong>{r.desa.curahHujan} mm</strong><br/>
                              <span style={{ fontSize: '0.75rem', color: 'var(--warning)' }}>Lereng {r.desa.kemiringanLereng}%</span>
                            </span>
                          ) : (
                            <strong style={{ color: 'var(--critical)' }}>{r.desa.defisitAir.toLocaleString('id-ID')} L</strong>
                          )}
                        </td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--cyan-400)' }}>{r.score.toFixed(4)}</td>
                        <td>
                          <span className="badge badge-info" style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            {isHujan ? <LifeBuoy size={13} /> : <Truck size={13} />}
                            {isHujan ? `${r.rekomendasiTimSar} Personil` : `${r.rekomendasiTangki} Tangki (5k L)`}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {isHujan ? (
                            <span>{r.kebutuhanLogistikHujan}</span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <Droplets size={13} style={{ color: '#06b6d4' }} /> {nearestSource} ({r.desa.jarakSumber} km)
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${r.rank <= 3 ? 'badge-critical' : r.rank <= 6 ? 'badge-warning' : 'badge-info'}`}>
                            {r.rekomendasiUrgensi}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem' }}>{r.rekomendasiAksi}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Rincian Perhitungan Matematis Tab */}
      {tab === 'perhitungan' && topsisResults.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Rumus TOPSIS */}
          <div className="card">
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calculator size={18} style={{ color: 'var(--blue-400)' }} />
              Formula Matematis TOPSIS ({isHujan ? 'Mode Musim Hujan' : 'Mode Kemarau'})
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <p>
                <strong>1. Matriks Ternormalisasi Vektor (R):</strong> Mengubah setiap elemen kriteria menjadi skala komparatif [0..1].
              </p>
              <div style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '4px', color: 'var(--cyan-400)', margin: '6px 0' }}>
                r_ij = x_ij / &radic;(&sum; x_kj^2)
              </div>
              <p style={{ marginTop: 8 }}>
                <strong>2. Matriks Ternormalisasi Terbobot (Y):</strong> Mengalikan dengan bobot kriteria w_j.
              </p>
              <div style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '4px', color: 'var(--cyan-400)', margin: '6px 0' }}>
                y_ij = w_j &times; r_ij
              </div>
              <p style={{ marginTop: 8 }}>
                <strong>3. Solusi Ideal Positif (A+) &amp; Negatif (A-):</strong> Nilai terbaik dan terburuk per kriteria (membedakan tipe Benefit dan Cost).
              </p>
              <p style={{ marginTop: 8 }}>
                <strong>4. Jarak Euclidean (D+ &amp; D-) dan Nilai Preferensi Kedekatan Relatif (V):</strong>
              </p>
              <div style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '4px', color: 'var(--cyan-400)', margin: '6px 0' }}>
                V_i = D_i^- / (D_i^+ + D_i^-)
              </div>
            </div>
          </div>

          {/* Tabel 1: Matriks Keputusan Asli (X) */}
          <div className="card">
            <div className="card-title">
              Tabel 1: Matriks Keputusan Asli (X) &mdash; {isHujan ? 'Data Desa Bahaya Merah' : 'Data Desa Kritis'}
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Desa</th>
                    {isHujan ? (
                      <>
                        <th>H1: Curah Hujan (mm)</th>
                        <th>H2: Lereng (%)</th>
                        <th>H3: Indeks Longsor (1-5)</th>
                        <th>H4: Warga Rawan (jiwa)</th>
                        <th>H5: Jarak DAS (km)</th>
                        <th>H6: Drainase/Jenuh (1-5)</th>
                      </>
                    ) : (
                      <>
                        <th>C1: Warga (jiwa)</th>
                        <th>C2: Defisit (L/hari)</th>
                        <th>C3: Durasi (hari)</th>
                        <th>C4: Rentan (%)</th>
                        <th>C5: Jarak (km)</th>
                        <th>C6: Medan (1-5)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {topsisResults.map((r, i) => (
                    <tr key={r.desa.id}>
                      <td>{i + 1}</td>
                      <td><strong>{r.desa.namaDesa}</strong></td>
                      <td>{r.rawCriteria[0].toLocaleString('id-ID')}</td>
                      <td>{r.rawCriteria[1].toLocaleString('id-ID')}</td>
                      <td>{r.rawCriteria[2]}</td>
                      <td>{r.rawCriteria[3]}</td>
                      <td>{r.rawCriteria[4]}</td>
                      <td>{r.rawCriteria[5]}</td>
                    </tr>
                  ))}
                  <tr style={{ background: 'rgba(34,211,238,0.1)', fontWeight: 'bold' }}>
                    <td colSpan={2}>Pembagi Normalisasi Vektor &radic;(&sum; x^2)</td>
                    {divisors.map((d, j) => (
                      <td key={j} style={{ fontFamily: 'monospace', color: 'var(--cyan-400)' }}>
                        {d.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Ranking Tab */}
      {tab === 'ranking' && topsisResults.length > 0 && (
        <div className="card">
          <div className="card-title">Grafik Top 10 Nilai Preferensi Relatif (V) TOPSIS</div>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 25, left: 10 }}>
              <XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
              <YAxis tick={{ fill: '#cbd5e1', fontSize: 11 }} domain={[0, 1]} />
              <Tooltip
                contentStyle={{ background: '#09101d', border: '1px solid rgba(148,163,184,0.3)', borderRadius: 8, color: '#fff' }}
                formatter={(val: number) => [`${val}`, 'Nilai Preferensi TOPSIS (V)']}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : i === 2 ? '#3b82f6' : '#0ea5e9'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
