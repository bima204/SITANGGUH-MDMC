// ============================================================
// TIRTA — Dasbor Komando & Rekomendasi Penerjunan MDMC Pusat
// Bersih, Elegan, Tanpa Emoji — Tipografi Berkontras Tinggi
// ============================================================
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle2, Droplets, Truck, Users, Compass, ShieldAlert, ArrowRight, Zap, RotateCcw, CloudRain, Waves, Navigation } from 'lucide-react';

const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

export default function Dashboard() {
  const { desaList, jadwalList, armadaList, topsisResults, setActivePage, isAnalyzed, runAutomatedAnalysis, resetAnalysis, musim, posDugaAirList } = useApp();

  const kritis  = desaList.filter(d => d.cluster === 'kritis').length;
  const waspada = desaList.filter(d => d.cluster === 'waspada').length;
  const siaga   = desaList.filter(d => d.cluster === 'siaga').length;
  const totalWarga = desaList.reduce((s, d) => s + d.jumlahWarga, 0);

  const todayJadwal = jadwalList.filter(j => j.status !== 'selesai');
  const armadaTersedia = armadaList.filter(a => a.statusToday === 'tersedia').length;
  const armadaBertugas = armadaList.filter(a => a.statusToday === 'bertugas').length;

  // Estimasi ritase tangki 5000L untuk desa kritis
  const defisitKritis = desaList.filter(d => d.cluster === 'kritis').reduce((s, d) => s + d.defisitAir, 0);
  const totalTangkiDibutuhkan = Math.ceil(defisitKritis / 5000);

  // Perhitungan Data Mode Musim Hujan
  const totalDebit = posDugaAirList.reduce((s, p) => s + p.debitAir, 0);
  const posWaspada = posDugaAirList.filter(p => p.status === 'waspada' || p.status === 'siaga').length;
  const maxCurahHujan = Math.max(...posDugaAirList.map(p => p.curahHujan24j));

  const pieData = [
    { name: 'Kritis',  value: kritis  || 0 },
    { name: 'Waspada', value: waspada || 0 },
    { name: 'Siaga',   value: siaga   || 0 },
  ];

  const barData = desaList
    .sort((a, b) => b.defisitAir - a.defisitAir)
    .slice(0, 8)
    .map(d => ({
      name: d.namaDesa.length > 11 ? d.namaDesa.slice(0, 11) + '…' : d.namaDesa,
      defisit: d.defisitAir,
      warga: d.jumlahWarga,
      fill: d.cluster === 'kritis' ? '#ef4444' : d.cluster === 'waspada' ? '#f59e0b' : '#10b981'
    }));

  const debitBarData = posDugaAirList.map(p => {
    let shortName = p.sungai || p.wilayahSungai.split('(')[0].trim();
    if (shortName.includes('Serayu Hilir')) shortName = 'DAS Serayu';
    else if (shortName.includes('Mrica')) shortName = 'Waduk Mrica';
    else if (shortName.includes('Merawu')) shortName = 'S. Merawu';
    else if (shortName.includes('Pekacangan')) shortName = 'S. Pekacangan';
    else if (shortName.includes('Dieng')) shortName = 'Hulu Dieng';
    else if (shortName.includes('Tengah')) shortName = 'Banjarcahyana';

    return {
      name: shortName,
      fullName: p.nama,
      debit: p.debitAir,
      tma: p.tma,
      fill: p.status === 'siaga' ? '#ef4444' : p.status === 'waspada' ? '#f59e0b' : '#10b981',
    };
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div className="page-header-text">
          <h1>
            {musim === 'hujan'
              ? 'Pos Komando Hidrometri & Debit Air MDMC Banjarnegara'
              : 'Pos Komando Rekomendasi Penerjunan MDMC Pusat'}
          </h1>
          <p>
            {musim === 'hujan'
              ? 'Sistem Monitoring Debit Sungai DAS Serayu, Merawu & Evaluasi Kapasitas Tampungan Waduk Mrica'
              : 'Sistem Pendukung Keputusan Alokasi Logistik Air Bersih Berbasis K-Means & TOPSIS'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={() => setActivePage('peta')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Compass size={16} />
            <span>{musim === 'hujan' ? 'Buka Peta Aliran Sungai & Stasiun 3D' : 'Buka Peta 3D WebGIS'}</span>
          </button>
        </div>
      </div>

      {musim === 'hujan' ? (
        /* ============================================================ */
        /* MODE MUSIM HUJAN: MONITORING HIDROMETRI & DEBIT AIR          */
        /* ============================================================ */
        <>
          {/* Executive Brief Musim Hujan */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(15, 23, 42, 0.95))',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            marginBottom: 22,
            padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="badge badge-info" style={{ fontWeight: 700, letterSpacing: '0.04em', background: 'rgba(6, 182, 212, 0.25)', color: '#38bdf8' }}>
                    MONITORING HIDROMETEOROLOGI
                  </span>
                  <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <AlertCircle size={13} />
                    <span>{posWaspada} Pos Berstatus Waspada / Siaga</span>
                  </span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: '8px 0 4px', letterSpacing: '-0.01em' }}>
                  Kabupaten Banjarnegara &bull; Pengawasan Debit DAS Serayu &amp; Waduk PB Soedirman
                </h2>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Intensitas hujan terpantau tinggi di hulu Pegunungan Dieng. Debit kumulatif <strong>{totalDebit.toFixed(1)} m³/s</strong> menuju Waduk Mrica.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setActivePage('peta')}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Waves size={15} />
                  <span>Lihat Aliran Sungai di Peta 3D</span>
                </button>
              </div>
            </div>

            {/* Top 3 Pos Duga Air Prioritas Pantau */}
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
              {posDugaAirList.slice(0, 3).map((p) => (
                <div key={p.id} style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: p.status === 'siaga' ? '4px solid var(--critical)' : p.status === 'waspada' ? '4px solid var(--warning)' : '4px solid var(--safe)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: p.status === 'siaga' ? 'var(--critical)' : p.status === 'waspada' ? 'var(--warning)' : 'var(--safe)',
                      letterSpacing: '0.05em'
                    }}>
                      STATUS {p.status.toUpperCase()} ({p.tren === 'naik' ? '↑ TREN NAIK' : p.tren === 'stabil' ? '→ STABIL' : '↓ TURUN'})
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--cyan-400)', fontFamily: 'monospace', fontWeight: 700 }}>
                      CH: {p.curahHujan24j} mm
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff', marginTop: 3 }}>
                    {p.nama}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Aliran {p.sungai || p.wilayahSungai} &bull; TMA: <strong style={{ color: '#fff' }}>{p.tma} m</strong> (Ambang: {p.tmaNormal} m)
                  </div>
                  <div style={{ marginTop: 8, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                    Debit Aliran: <strong style={{ color: 'var(--cyan-400)' }}>{p.debitAir} m³/s</strong>
                    {p.kapasitasWadukPersen ? ` • Kapasitas: ${p.kapasitasWadukPersen}%` : ''}
                  </div>
                  <div style={{ marginTop: 6, fontSize: '0.75rem', color: p.status === 'siaga' ? 'var(--critical)' : 'var(--warning)', fontWeight: 600 }}>
                    {p.keterangan}
                  </div>
                  <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--blue-400)',
                        textDecoration: 'none',
                      }}
                    >
                      <Navigation size={12} />
                      <span>Rute Google Maps ke Lokasi</span>
                      &rarr;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stat Cards Musim Hujan */}
          <div className="stat-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card info">
              <div className="stat-label">TOTAL DEBIT ALIRAN AIR</div>
              <div className="stat-value">{totalDebit.toFixed(1)} <span style={{ fontSize: '1rem' }}>m³/s</span></div>
              <div className="stat-sub">Akumulasi 6 stasiun hidrometri</div>
              <div className="stat-icon" style={{ opacity: 0.2 }}>
                <Waves size={36} color="var(--cyan-400)" />
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-label">ELEVASI WADUK MRICA</div>
              <div className="stat-value">230.45 <span style={{ fontSize: '1rem' }}>mdpl</span></div>
              <div className="stat-sub">88.5% kapasitas tampung &bull; Siaga Spillway</div>
              <div className="stat-icon" style={{ opacity: 0.2 }}>
                <AlertCircle size={36} color="var(--warning)" />
              </div>
            </div>

            <div className="stat-card critical">
              <div className="stat-label">POS SIAGA &amp; WASPADA</div>
              <div className="stat-value">{posWaspada} <span style={{ fontSize: '1.1rem' }}>pos</span></div>
              <div className="stat-sub">Dari total 6 stasiun pemantau</div>
              <div className="stat-icon" style={{ opacity: 0.2 }}>
                <ShieldAlert size={36} color="var(--critical)" />
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-label">CURAH HUJAN TERTINGGI (24J)</div>
              <div className="stat-value">{maxCurahHujan} <span style={{ fontSize: '1rem' }}>mm</span></div>
              <div className="stat-sub">Stasiun Hulu DAS Serayu Dieng Atas</div>
              <div className="stat-icon" style={{ opacity: 0.2 }}>
                <CloudRain size={36} color="var(--blue-400)" />
              </div>
            </div>

            <div className="stat-card safe">
              <div className="stat-label">CADANGAN AIR BAKU</div>
              <div className="stat-value">MELIMPAH</div>
              <div className="stat-sub">Kebutuhan logistik kemarau terhenti</div>
              <div className="stat-icon" style={{ opacity: 0.2 }}>
                <CheckCircle2 size={36} color="var(--safe)" />
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-label">RELIABILITAS DRAINASE</div>
              <div className="stat-value">NORMAL</div>
              <div className="stat-sub">Pintu air Banjarcahyana dibuka parsial</div>
              <div className="stat-icon" style={{ opacity: 0.2 }}>
                <Compass size={36} color="var(--blue-400)" />
              </div>
            </div>
          </div>

          {/* Charts Musim Hujan */}
          <div className="grid-2" style={{ marginBottom: 24 }}>
            {/* Bar Chart: Debit Air per Stasiun */}
            <div className="card">
              <div className="card-title">Debit Aliran Sungai per Stasiun Pemantau (m³/s)</div>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={debitBarData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                  <XAxis dataKey="name" interval={0} tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 600 }} />
                  <YAxis tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#09101d', border: '1px solid rgba(148,163,184,0.3)', borderRadius: 8, color: '#fff' }}
                    formatter={(val: any) => [`${val} m³/detik`, 'Debit Air']}
                  />
                  <Bar dataKey="debit" radius={[4, 4, 0, 0]}>
                    {debitBarData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 4 }}>
                {[
                  { label: 'Siaga Luapan (Debit Kritis)', color: '#ef4444' },
                  { label: 'Waspada (Debit Tinggi)', color: '#f59e0b' },
                  { label: 'Normal (Terkendali)', color: '#10b981' }
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, display: 'inline-block' }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Tinggi Muka Air (TMA) */}
            <div className="card">
              <div className="card-title">Tinggi Muka Air (TMA) Aktual vs Batas Normal (Meter)</div>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart 
                  data={posDugaAirList.map(p => {
                    let shortName = p.sungai || p.wilayahSungai.split('(')[0].trim();
                    if (shortName.includes('Serayu Hilir')) shortName = 'DAS Serayu';
                    else if (shortName.includes('Mrica')) shortName = 'Waduk Mrica';
                    else if (shortName.includes('Merawu')) shortName = 'S. Merawu';
                    else if (shortName.includes('Pekacangan')) shortName = 'S. Pekacangan';
                    else if (shortName.includes('Dieng')) shortName = 'Hulu Dieng';
                    else if (shortName.includes('Tengah')) shortName = 'Banjarcahyana';

                    return {
                      name: shortName,
                      tma: p.tma,
                      ambang: p.tmaNormal,
                      elevasi: p.elevasiWadukMdpl,
                    };
                  })} 
                  margin={{ top: 5, right: 10, bottom: 5, left: 10 }}
                >
                  <XAxis dataKey="name" interval={0} tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 600 }} />
                  <YAxis tick={{ fill: '#cbd5e1', fontSize: 11 }} domain={[0, 6]} unit="m" />
                  <Tooltip
                    contentStyle={{ background: '#09101d', border: '1px solid rgba(148,163,184,0.3)', borderRadius: 8, color: '#fff' }}
                    formatter={(val: any, name: any) => [
                      `${val} meter`, 
                      name === 'tma' ? 'TMA Aktual' : 'Batas Normal'
                    ]}
                  />
                  <Bar dataKey="tma" fill="#38bdf8" radius={[4, 4, 0, 0]} name="TMA Aktual" />
                  <Bar dataKey="ambang" fill="rgba(16, 185, 129, 0.45)" stroke="#10b981" strokeWidth={1} radius={[4, 4, 0, 0]} name="Batas Normal" />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 4, fontSize: '0.8rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: '#38bdf8', display: 'inline-block' }} />
                  <span>TMA Aktual (m)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(16, 185, 129, 0.45)', border: '1px solid #10b981', display: 'inline-block' }} />
                  <span>Batas Normal (m)</span>
                </div>
                <span style={{ color: '#94a3b8' }}>&bull; Ambang batas kritis rata-rata: &gt; 4.00 m</span>
              </div>
            </div>
          </div>

          {/* Tabel Hidrometri Stasiun */}
          <div className="card">
            <div className="section-header">
              <div className="section-title">Status Terkini 6 Stasiun Hidrometri &amp; Pemantau Aliran Sungai Banjarnegara</div>
              <button className="btn btn-primary btn-sm" onClick={() => setActivePage('peta')}>
                Buka Peta Sungai
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Stasiun Pemantau</th>
                    <th>Aliran Sungai</th>
                    <th>TMA (m)</th>
                    <th>Debit (m³/s)</th>
                    <th>Curah Hujan (24j)</th>
                    <th>Status</th>
                    <th>Keterangan Operasional</th>
                    <th>Navigasi</th>
                  </tr>
                </thead>
                <tbody>
                  {posDugaAirList.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.nama}</strong></td>
                      <td style={{ color: 'var(--cyan-400)', fontWeight: 600 }}>{p.sungai || p.wilayahSungai}</td>
                      <td>
                        <strong style={{ color: p.tma > p.tmaNormal ? 'var(--warning)' : '#ffffff' }}>
                          {p.tma} m
                        </strong>{' '}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(norm. {p.tmaNormal}m)</span>
                        {p.elevasiWadukMdpl && (
                          <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: 1 }}>
                            Elevasi: {p.elevasiWadukMdpl} mdpl ({p.kapasitasWadukPersen}%)
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{ color: 'var(--blue-400)', fontWeight: 700 }}>
                          {p.debitAir} m³/s
                        </span>
                      </td>
                      <td>{p.curahHujan24j} mm</td>
                      <td>
                        {p.status === 'siaga'   && <span className="badge badge-critical">Siaga</span>}
                        {p.status === 'waspada' && <span className="badge badge-warning">Waspada</span>}
                        {p.status === 'normal'  && <span className="badge badge-safe">Normal</span>}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {p.keterangan}
                      </td>
                      <td>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none', padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          <Navigation size={12} />
                          <span>Rute</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* ============================================================ */
        /* MODE KEMARAU: SISTEM SPK KEKERINGAN & LOGISTIK TANGKI        */
        /* ============================================================ */
        <>
          {/* Status Rekomendasi Penerjunan MDMC (Executive Brief) */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(13, 27, 46, 0.95))',
            border: '1px solid rgba(99, 149, 255, 0.35)',
            marginBottom: 22,
            padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="badge badge-info" style={{ fontWeight: 700, letterSpacing: '0.04em' }}>
                    STATUS PRA-PENERJUNAN
                  </span>
                  {topsisResults.length > 0 ? (
                    <span className="badge badge-safe" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <CheckCircle2 size={13} />
                      <span>Rekomendasi Terhitung</span>
                    </span>
                  ) : (
                    <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <AlertCircle size={13} />
                      <span>Perlu Perhitungan SPK</span>
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: '8px 0 4px', letterSpacing: '-0.01em' }}>
                  Kabupaten Banjarnegara &bull; Status Darurat Krisis Air Bersih
                </h2>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Data mencakup <strong>266 desa terdampak kekeringan</strong> di seluruh 20 kecamatan Kabupaten Banjarnegara.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  className={`btn ${!isAnalyzed ? 'pulse-glow-btn' : ''}`}
                  onClick={() => runAutomatedAnalysis()}
                  style={{
                    background: !isAnalyzed
                      ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)'
                      : 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    border: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: !isAnalyzed ? '0 0 16px rgba(56, 189, 248, 0.45)' : undefined
                  }}
                >
                  <Zap size={15} />
                  <span>{!isAnalyzed ? '⚡ Jalankan Analisa Otomatis' : 'Update Analisa SPK'}</span>
                </button>
                {isAnalyzed && (
                  <button className="btn btn-secondary btn-sm" onClick={resetAnalysis} title="Reset ke data mentah">
                    <RotateCcw size={14} />
                  </button>
                )}
                <button className="btn btn-secondary" onClick={() => setActivePage('kmeans')}>
                  Zonasi K-Means
                </button>
                <button className="btn btn-secondary" onClick={() => setActivePage('topsis')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>TOPSIS Prioritas</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Top 3 Prioritas Penerjunan */}
            {topsisResults.length > 0 && (
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                {topsisResults.slice(0, 3).map((r) => (
                  <div key={r.desa.id} style={{
                    background: 'rgba(0,0,0,0.3)',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--critical)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--critical)', letterSpacing: '0.05em' }}>
                        PRIORITAS #{r.rank}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--cyan-400)', fontFamily: 'monospace', fontWeight: 700 }}>
                        Skor: {r.score.toFixed(4)}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ffffff', marginTop: 3 }}>
                      Desa {r.desa.namaDesa}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Kecamatan {r.desa.namaKecamatan} &bull; {r.desa.jumlahWarga.toLocaleString('id-ID')} jiwa
                    </div>
                    <div style={{ marginTop: 8, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                      Alokasi: <strong style={{ color: '#ffffff' }}>{r.rekomendasiTangki} Tangki Air</strong> (±{(r.rekomendasiTangki * 5).toLocaleString('id-ID')}k Liter)
                    </div>
                    <div style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--safe)', fontWeight: 600 }}>
                      Tindakan: {r.rekomendasiUrgensi}
                    </div>
                    <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${r.desa.lat},${r.desa.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: 'var(--blue-400)',
                          textDecoration: 'none',
                        }}
                      >
                        <span>Rute Google Maps</span>
                        &rarr;
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stat Cards Grid (Sharp & High Contrast) */}
          <div className="stat-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card critical">
              <div className="stat-label">ZONA KRITIS (PRIORITAS 1)</div>
              <div className="stat-value">{kritis} <span style={{ fontSize: '1.1rem' }}>desa</span></div>
              <div className="stat-sub">Dropping air darurat &lt; 24 jam</div>
              <div className="stat-icon" style={{ opacity: 0.2 }}>
                <ShieldAlert size={36} color="var(--critical)" />
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-label">ZONA WASPADA (PRIORITAS 2)</div>
              <div className="stat-value">{waspada} <span style={{ fontSize: '1.1rem' }}>desa</span></div>
              <div className="stat-sub">Distribusi berkala &amp; tandon komunal</div>
              <div className="stat-icon" style={{ opacity: 0.2 }}>
                <AlertCircle size={36} color="var(--warning)" />
              </div>
            </div>

            <div className="stat-card safe">
              <div className="stat-label">ZONA SIAGA (TERKENDALI)</div>
              <div className="stat-value">{siaga} <span style={{ fontSize: '1.1rem' }}>desa</span></div>
              <div className="stat-sub">Cadangan air sumur relatif stabil</div>
              <div className="stat-icon" style={{ opacity: 0.2 }}>
                <CheckCircle2 size={36} color="var(--safe)" />
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-label">TOTAL WARGA TERDAMPAK</div>
              <div className="stat-value">{totalWarga.toLocaleString('id-ID')} <span style={{ fontSize: '1rem' }}>jiwa</span></div>
              <div className="stat-sub">30 titik lokasi rawan kekeringan</div>
              <div className="stat-icon" style={{ opacity: 0.2 }}>
                <Users size={36} color="var(--blue-400)" />
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-label">ESTIMASI KEBUTUHAN TANGKI</div>
              <div className="stat-value">{totalTangkiDibutuhkan} <span style={{ fontSize: '1rem' }}>ritase</span></div>
              <div className="stat-sub">Untuk {(defisitKritis / 1000).toFixed(0)}k liter defisit zona kritis</div>
              <div className="stat-icon" style={{ opacity: 0.2 }}>
                <Droplets size={36} color="var(--cyan-400)" />
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-label">ARMADA LOGISTIK SIAP</div>
              <div className="stat-value">{armadaTersedia}/{armadaList.length} <span style={{ fontSize: '1rem' }}>unit</span></div>
              <div className="stat-sub">{armadaBertugas} unit sedang beroperasi</div>
              <div className="stat-icon" style={{ opacity: 0.2 }}>
                <Truck size={36} color="var(--blue-400)" />
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid-2" style={{ marginBottom: 24 }}>
            {/* Pie Chart: Komposisi Zona */}
            <div className="card">
              <div className="card-title">Proporsi Zona Kerawanan (Hasil K-Means)</div>
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    dataKey="value"
                    label={({ name, value }) => value > 0 ? `${name}: ${value} Desa` : ''}
                    labelLine={false}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#09101d', border: '1px solid rgba(148,163,184,0.3)', borderRadius: 8, color: '#fff' }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 4 }}>
                {[
                  { label: 'Kritis (Perlu Dropping Segera)', color: '#ef4444' },
                  { label: 'Waspada (Monitoring & Tandon)', color: '#f59e0b' },
                  { label: 'Siaga (Terkendali)', color: '#10b981' }
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, display: 'inline-block' }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart: Top 8 Defisit Air */}
            <div className="card">
              <div className="card-title">Top 8 Wilayah dengan Defisit Air Tertinggi</div>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={barData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                  <XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: '#09101d', border: '1px solid rgba(148,163,184,0.3)', borderRadius: 8, color: '#fff' }}
                    formatter={(val: any) => [`${Number(val).toLocaleString('id-ID')} Liter/hari`, 'Defisit Air']}
                  />
                  <Bar dataKey="defisit" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Operasional Hari Ini */}
          <div className="card">
            <div className="section-header">
              <div className="section-title">Status Penugasan &amp; Jadwal Distribusi Air Aktif ({todayJadwal.length})</div>
              <button className="btn btn-primary btn-sm" onClick={() => setActivePage('distribusi')}>
                Kelola Jadwal Distribusi
              </button>
            </div>
            {todayJadwal.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                Belum ada jadwal distribusi aktif hari ini. Jalankan rekomendasi TOPSIS untuk menjadwalkan armada.
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Desa Sasaran</th>
                      <th>Armada / Nopol</th>
                      <th>Volume Air</th>
                      <th>Titik Pengisian</th>
                      <th>Status Operasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayJadwal.slice(0, 5).map(j => (
                      <tr key={j.id}>
                        <td><strong>{j.desaNama}</strong></td>
                        <td style={{ color: 'var(--text-secondary)' }}>{j.armadaPolisi}</td>
                        <td><span style={{ color: 'var(--cyan-400)', fontWeight: 700 }}>{j.jumlahAir.toLocaleString('id-ID')} L</span></td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{j.sumberAirNama}</td>
                        <td>
                          {j.status === 'dalam_perjalanan' && <span className="badge badge-warning">Dalam Perjalanan</span>}
                          {j.status === 'terjadwal'        && <span className="badge badge-info">Terjadwal</span>}
                          {j.status === 'selesai'          && <span className="badge badge-safe">Selesai</span>}
                          {j.status === 'batal'            && <span className="badge badge-critical">Batal</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
