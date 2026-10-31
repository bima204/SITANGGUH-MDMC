// ============================================================
// TIRTA — K-Means Clustering & Zonasi Rekomendasi (Dual-Mode)
// Bersih, Elegan, Tanpa Emoji — Tipografi Berkontras Tinggi
// ============================================================
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { runKMeans } from '../algorithms/kmeans';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CLUSTER_COLORS = {
  kritis: '#ef4444',
  waspada: '#f59e0b',
  siaga: '#10b981',
};

export default function KMeansPage() {
  const { desaList, setDesaList, kmeansResult, setKmeansResult, setActivePage, musim } = useApp();
  const [k, setK] = useState(3);
  const [maxIter, setMaxIter] = useState(100);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<'config' | 'result' | 'perhitungan' | 'detail'>('config');

  const isHujan = musim === 'hujan';

  function handleRun() {
    setRunning(true);
    setTimeout(() => {
      try {
        const result = runKMeans(desaList, k, maxIter, musim);
        setKmeansResult(result);
        setDesaList(result.desaWithCluster);
        setTab('result');
      } catch (err) {
        alert('Error: ' + (err as Error).message);
      } finally {
        setRunning(false);
      }
    }, 600);
  }

  const scatterData = desaList.map(d => ({
    x: isHujan ? (d.kemiringanLereng || 0) : d.jumlahWarga,
    y: isHujan ? (d.curahHujan || 0) : d.defisitAir,
    cluster: d.cluster || 'siaga',
    name: d.namaDesa,
    kecamatan: d.namaKecamatan,
    bencana: d.jenisBencanaDominan,
    wargaTerancam: d.wargaTerancam,
  }));

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>
            {isHujan
              ? 'K-Means Clustering & Zonasi Bahaya Tanah Longsor & Banjir'
              : 'K-Means Clustering & Zonasi Kerawanan Kekeringan'}
          </h1>
          <p>
            {isHujan
              ? 'Segmentasi multikriteria 266 desa Banjarnegara: Curah Hujan, Kemiringan Lereng, Gerakan Tanah PVMBG & Jarak Sungai'
              : 'Segmentasi data kekeringan Kabupaten Banjarnegara ke dalam Zona Kritis, Waspada, dan Siaga'}
          </p>
        </div>
        {kmeansResult && (
          <div className="page-actions">
            <button className="btn btn-primary" onClick={() => setActivePage('topsis')}>
              {isHujan ? 'Lanjut ke Prioritas Bencana TOPSIS &rarr;' : 'Lanjut ke Rekomendasi TOPSIS &rarr;'}
            </button>
          </div>
        )}
      </div>

      {/* Method Info */}
      <div className="alert alert-info" style={{ marginBottom: 18 }}>
        <strong>Prinsip Kerja K-Means ({isHujan ? 'Mode Musim Hujan' : 'Mode Kemarau'}):</strong> Mengelompokkan 266 desa berdasarkan
        kesamaan 6 dimensi kriteria{' '}
        {isHujan ? (
          <span>(Curah Hujan 24J, Kemiringan Lereng, Indeks Longsor PVMBG, Warga Terancam, Jarak Sempadan DAS, Hambatan Drainase)</span>
        ) : (
          <span>(Jumlah Warga, Defisit Air, Durasi, Rasio Rentan, Jarak Sumber, Hambatan Medan)</span>
        )}{' '}
        menggunakan <strong>Jarak Euclidean</strong> pada data yang dinormalisasi Min-Max.
      </div>

      {/* Tabs */}
      <div className="tab-list">
        <button className={`tab-btn ${tab === 'config' ? 'active' : ''}`} onClick={() => setTab('config')}>Konfigurasi Parameter</button>
        <button className={`tab-btn ${tab === 'result' ? 'active' : ''}`} onClick={() => setTab('result')}>Hasil &amp; Rekomendasi Zonasi</button>
        <button className={`tab-btn ${tab === 'perhitungan' ? 'active' : ''}`} onClick={() => setTab('perhitungan')}>Rincian Perhitungan Matematis</button>
        <button className={`tab-btn ${tab === 'detail' ? 'active' : ''}`} onClick={() => setTab('detail')}>Tabel Semua Desa ({desaList.length})</button>
      </div>

      {/* Config Tab */}
      {tab === 'config' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
          <div className="card">
            <div className="card-title">Parameter K-Means</div>
            <div className="form-group">
              <label>Jumlah Klaster (K)</label>
              <select value={k} onChange={e => setK(Number(e.target.value))}>
                <option value={2}>K = 2 (Bahaya Tinggi &amp; Relatif Aman)</option>
                <option value={3}>K = 3 (Kritis/Merah, Waspada/Kuning, Siaga/Hijau) &mdash; Standar MDMC</option>
                <option value={4}>K = 4 Klaster</option>
              </select>
            </div>
            <div className="form-group">
              <label>Maksimum Iterasi Konvergensi</label>
              <input type="number" min={10} max={500} value={maxIter} onChange={e => setMaxIter(Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Total Dataset Desa</label>
              <input value={`${desaList.length} desa (Kabupaten Banjarnegara)`} disabled />
            </div>

            <div className="divider" />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
              <strong>Kriteria Fitur Masukan (6 Dimensi {isHujan ? 'Bencana Hujan' : 'Kekeringan'}):</strong>
              {isHujan ? (
                <ul style={{ marginTop: 8, paddingLeft: 16, lineHeight: 1.8 }}>
                  <li><strong>H1</strong> &mdash; Curah Hujan 24 Jam (mm/hari)</li>
                  <li><strong>H2</strong> &mdash; Kemiringan Lereng Topografi (%)</li>
                  <li><strong>H3</strong> &mdash; Indeks Gerakan Tanah PVMBG (1-5)</li>
                  <li><strong>H4</strong> &mdash; Warga Terancam di Titik Rawan (jiwa)</li>
                  <li><strong>H5</strong> &mdash; Jarak ke Sempadan DAS Serayu/Merawu (km)</li>
                  <li><strong>H6</strong> &mdash; Hambatan Drainase &amp; Kejenuhan Tanah (1-5)</li>
                </ul>
              ) : (
                <ul style={{ marginTop: 8, paddingLeft: 16, lineHeight: 1.8 }}>
                  <li><strong>C1</strong> &mdash; Jumlah Warga Terdampak (jiwa)</li>
                  <li><strong>C2</strong> &mdash; Defisit Air Bersih (L/hari)</li>
                  <li><strong>C3</strong> &mdash; Durasi Kekeringan (hari)</li>
                  <li><strong>C4</strong> &mdash; Rasio Rentan &amp; Fasum (%)</li>
                  <li><strong>C5</strong> &mdash; Jarak dari Sumber Air (km)</li>
                  <li><strong>C6</strong> &mdash; Indeks Hambatan Jalan (1-5)</li>
                </ul>
              )}
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleRun} disabled={running}>
              {running ? (
                <><span className="spinner" style={{ width: 16, height: 16 }} /> Menghitung Jarak &amp; Centroid...</>
              ) : (isHujan ? 'Jalankan Zonasi Bencana K-Means' : 'Jalankan Kalkulasi K-Means')}
            </button>
          </div>

          <div className="card">
            <div className="card-title">
              {isHujan
                ? 'Sebaran Data (Scatter Plot): Kemiringan Lereng (%) vs Curah Hujan (mm)'
                : 'Sebaran Data (Scatter Plot): Warga vs Defisit Air'}
            </div>
            {desaList.some(d => d.cluster) ? (
              <ResponsiveContainer width="100%" height={340}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis
                    dataKey="x"
                    name={isHujan ? 'Kemiringan Lereng' : 'Jumlah Warga'}
                    tick={{ fill: '#cbd5e1', fontSize: 11 }}
                    label={{
                      value: isHujan ? 'Kemiringan Lereng (%)' : 'Jumlah Warga (jiwa)',
                      position: 'insideBottom',
                      offset: -10,
                      fill: '#94a3b8',
                      fontSize: 11
                    }}
                  />
                  <YAxis
                    dataKey="y"
                    name={isHujan ? 'Curah Hujan' : 'Defisit Air'}
                    tick={{ fill: '#cbd5e1', fontSize: 11 }}
                    label={{
                      value: isHujan ? 'Curah Hujan 24J (mm)' : 'Defisit Air (L/hari)',
                      angle: -90,
                      position: 'insideLeft',
                      fill: '#94a3b8',
                      fontSize: 11
                    }}
                  />
                  <Tooltip
                    contentStyle={{ background: '#09101d', border: '1px solid rgba(148,163,184,0.3)', borderRadius: 8 }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div style={{ background: '#09101d', border: '1px solid rgba(148,163,184,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
                          <div style={{ fontWeight: 700, marginBottom: 4, color: '#ffffff' }}>
                            Desa {d.name} ({d.kecamatan})
                          </div>
                          {isHujan ? (
                            <>
                              <div style={{ color: '#cbd5e1' }}>Kemiringan Lereng: {d.x}%</div>
                              <div style={{ color: '#cbd5e1' }}>Curah Hujan 24J: {d.y} mm/hari</div>
                              <div style={{ color: 'var(--cyan-400)' }}>Warga Terancam: {d.wargaTerancam?.toLocaleString('id-ID')} jiwa</div>
                            </>
                          ) : (
                            <>
                              <div style={{ color: '#cbd5e1' }}>Warga: {d.x.toLocaleString('id-ID')} jiwa</div>
                              <div style={{ color: '#cbd5e1' }}>Defisit: {d.y.toLocaleString('id-ID')} L/hari</div>
                            </>
                          )}
                          <div style={{ color: CLUSTER_COLORS[d.cluster as keyof typeof CLUSTER_COLORS] || '#60a5fa', fontWeight: 700, marginTop: 4 }}>
                            {isHujan
                              ? (d.cluster === 'kritis' ? 'ZONA BAHAYA MERAH (SIAGA EVAKUASI)' : d.cluster === 'waspada' ? 'ZONA WASPADA KUNING' : 'ZONA AMAN HIJAU')
                              : `ZONA ${d.cluster?.toUpperCase()}`}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={scatterData} fill="#60a5fa">
                    {scatterData.map((entry, i) => (
                      <Cell key={i} fill={CLUSTER_COLORS[entry.cluster as keyof typeof CLUSTER_COLORS] || '#60a5fa'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            ) : (
              <div className="loading-center">
                <div style={{ color: 'var(--text-secondary)' }}>
                  Klik tombol <strong>{isHujan ? 'Jalankan Zonasi Bencana K-Means' : 'Jalankan Kalkulasi K-Means'}</strong> untuk mengelompokkan data.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Result Tab */}
      {tab === 'result' && kmeansResult && (
        <div>
          {/* Cluster Summary Cards */}
          <div className="grid-3" style={{ marginBottom: 20 }}>
            {(['kritis', 'waspada', 'siaga'] as const).map(c => {
              const count = kmeansResult.clusterCounts[c];
              const desas = desaList.filter(d => d.cluster === c);
              const totalWarga = desas.reduce((s, d) => s + (isHujan ? (d.wargaTerancam || 0) : d.jumlahWarga), 0);
              const avgScore = isHujan
                ? (desas.reduce((s, d) => s + (d.curahHujan || 0), 0) / (desas.length || 1)).toFixed(1)
                : (desas.reduce((s, d) => s + d.defisitAir, 0) / 1000).toFixed(0);

              const titleLabel = isHujan
                ? (c === 'kritis' ? 'ZONA MERAH (BAHAYA TINGGI)' : c === 'waspada' ? 'ZONA KUNING (WASPADA LONGSOR)' : 'ZONA HIJAU (AMAN/TERKENDALI)')
                : (c === 'kritis' ? 'ZONA KRITIS (PRIORITAS 1)' : c === 'waspada' ? 'ZONA WASPADA (PRIORITAS 2)' : 'ZONA SIAGA (TERKENDALI)');

              return (
                <div key={c} className="card" style={{
                  borderLeft: `4px solid ${CLUSTER_COLORS[c]}`,
                  background: `linear-gradient(135deg, ${CLUSTER_COLORS[c]}15, var(--bg-card))`,
                  borderTop: `1px solid ${CLUSTER_COLORS[c]}44`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: CLUSTER_COLORS[c] }}>
                        {titleLabel}
                      </div>
                      <div style={{ fontFamily: 'Outfit', fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginTop: 2 }}>
                        {count} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>desa</span>
                      </div>
                    </div>
                    <span className={`badge badge-${c === 'kritis' ? 'critical' : c === 'waspada' ? 'warning' : 'safe'}`} style={{ fontSize: '11px', fontWeight: 700 }}>
                      {c.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: '0.825rem', lineHeight: '1.6' }}>
                    <div>{isHujan ? 'Warga Terancam di Lereng/DAS:' : 'Warga Terdampak:'} <strong style={{ color: '#ffffff' }}>{totalWarga.toLocaleString('id-ID')} jiwa</strong></div>
                    <div>{isHujan ? 'Rata-rata Curah Hujan:' : 'Total Defisit Air:'} <strong style={{ color: CLUSTER_COLORS[c] }}>{avgScore} {isHujan ? 'mm/24j' : 'k L/hari'}</strong></div>
                    <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: '#ffffff' }}>Rekomendasi Kebijakan MDMC:</strong><br/>
                      {isHujan ? (
                        c === 'kritis' ? 'Lanjut ke tahap TOPSIS untuk penetapan urutan penerjunan Tim SAR, tenda pengungsi & EWS sirine longsor.' :
                        c === 'waspada' ? 'Patroli lereng retakan tanah, pantau debit anak sungai Merawu/Serayu & siapkan posko desa.' :
                        'Monitoring pos duga air secara telemetri, wilayah relatif aman dari ancaman longsor masif.'
                      ) : (
                        c === 'kritis' ? 'Lanjut ke tahap TOPSIS untuk penetapan urutan dropping air darurat < 24 jam.' :
                        c === 'waspada' ? 'Dropping air terjadwal 2-3 hari sekali & pemasangan tandon air komunal darurat.' :
                        'Pemantauan berkala debit sumur warga, belum memerlukan dropping tangki air.'
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action to TOPSIS */}
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>
                Langkah Selanjutnya: Perankingan TOPSIS untuk {kmeansResult.clusterCounts.kritis} Desa di {isHujan ? 'Zona Bahaya Merah' : 'Zona Kritis'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {isHujan
                  ? 'Sistem akan menghitung jarak solusi ideal untuk menentukan prioritas desa mana yang harus dievakuasi atau dipasangi tenda/EWS pertama kali.'
                  : 'Sistem akan menghitung solusi ideal dan kedekatan relatif untuk menentukan desa mana yang wajib dikirim air pertama kali.'}
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setActivePage('topsis')}>
              Lanjut ke Kalkulasi TOPSIS &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Perhitungan Matematis Tab */}
      {tab === 'perhitungan' && kmeansResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Rumus Penjelasan */}
          <div className="card">
            <div className="card-title">Formula &amp; Metodologi Matematis K-Means ({isHujan ? 'Mode Bencana Hujan' : 'Mode Kemarau'})</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <p>
                <strong>1. Normalisasi Min-Max Fitur:</strong> Menyeimbangkan skala variabel (Curah hujan puluhan mm vs Indeks longsor 1-5).
              </p>
              <div style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '8px 14px', borderRadius: '6px', color: 'var(--cyan-400)', margin: '8px 0' }}>
                x&apos; = (x - x_min) / (x_max - x_min)
              </div>
              <p style={{ marginTop: 10 }}>
                <strong>2. Jarak Euclidean (Euclidean Distance):</strong> Mengukur jarak titik koordinat fitur desa ke 3 centroid kerawanan.
              </p>
              <div style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '8px 14px', borderRadius: '6px', color: 'var(--cyan-400)', margin: '8px 0' }}>
                d(X_i, C_k) = &radic; &sum; [ (x_ij&apos; - c_kj)^2 ] untuk j = 1..6 kriteria
              </div>
              <p style={{ marginTop: 10 }}>
                <strong>3. Konvergensi:</strong> Iterasi berhenti ketika penugasan klaster tidak lagi berubah (Konvergen pada <strong>iterasi ke-{kmeansResult.iterations}</strong>).
              </p>
            </div>
          </div>

          {/* Tabel Titik Centroid Akhir */}
          <div className="card">
            <div className="card-title">Koordinat Titik Pusat Centroid Akhir (Nilai Rata-Rata Skala Asli)</div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Klaster</th>
                    <th>Status Zona</th>
                    {isHujan ? (
                      <>
                        <th>H1: Curah Hujan (mm)</th>
                        <th>H2: Kemiringan Lereng (%)</th>
                        <th>H3: Indeks Longsor (1-5)</th>
                        <th>H4: Warga Terancam (jiwa)</th>
                        <th>H5: Jarak Sungai (km)</th>
                        <th>H6: Drainase/Jenuh (1-5)</th>
                      </>
                    ) : (
                      <>
                        <th>C1: Warga (jiwa)</th>
                        <th>C2: Defisit (L)</th>
                        <th>C3: Durasi (hari)</th>
                        <th>C4: Rentan (%)</th>
                        <th>C5: Jarak (km)</th>
                        <th>C6: Medan (1-5)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {kmeansResult.rawCentroids.map((c, idx) => {
                    const label = idx === 0 ? 'kritis' : idx === 1 ? 'waspada' : 'siaga';
                    return (
                      <tr key={idx}>
                        <td><strong>Centroid {idx + 1}</strong></td>
                        <td>
                          <span className={`badge badge-${label === 'kritis' ? 'critical' : label === 'waspada' ? 'warning' : 'safe'}`}>
                            {label.toUpperCase()}
                          </span>
                        </td>
                        {isHujan ? (
                          <>
                            <td>{c[0].toFixed(1)} mm</td>
                            <td>{Math.round(c[1])}%</td>
                            <td>{c[2].toFixed(1)} / 5</td>
                            <td>{Math.round(c[3]).toLocaleString('id-ID')} jiwa</td>
                            <td>{c[4].toFixed(1)} km</td>
                            <td>{c[5].toFixed(1)} / 5</td>
                          </>
                        ) : (
                          <>
                            <td>{Math.round(c[0]).toLocaleString('id-ID')}</td>
                            <td>{Math.round(c[1]).toLocaleString('id-ID')} L</td>
                            <td>{c[2].toFixed(1)} hr</td>
                            <td>{c[3].toFixed(1)}%</td>
                            <td>{c[4].toFixed(1)} km</td>
                            <td>{c[5].toFixed(1)}</td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabel Jarak Euclidean Tiap Desa ke Tiap Centroid */}
          <div className="card">
            <div className="card-title">Matriks Jarak Euclidean Tiap Desa ke 3 Centroid (Data Ternormalisasi)</div>
            <div className="table-container" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Desa</th>
                    <th>Kecamatan</th>
                    <th>d(X, C_Kritis)</th>
                    <th>d(X, C_Waspada)</th>
                    <th>d(X, C_Siaga)</th>
                    <th>Jarak Terdekat</th>
                    <th>Klaster Terpilih</th>
                  </tr>
                </thead>
                <tbody>
                  {desaList.map((d, i) => {
                    const dists = kmeansResult.distancesToCentroids[i] || [0, 0, 0];
                    const minDist = Math.min(...dists);
                    return (
                      <tr key={d.id}>
                        <td>{i + 1}</td>
                        <td><strong>{d.namaDesa}</strong></td>
                        <td style={{ color: 'var(--text-secondary)' }}>{d.namaKecamatan}</td>
                        <td style={{ fontFamily: 'monospace', color: dists[0] === minDist ? 'var(--critical)' : 'var(--text-muted)' }}>
                          {dists[0]?.toFixed(4)}
                        </td>
                        <td style={{ fontFamily: 'monospace', color: dists[1] === minDist ? 'var(--warning)' : 'var(--text-muted)' }}>
                          {dists[1]?.toFixed(4)}
                        </td>
                        <td style={{ fontFamily: 'monospace', color: dists[2] === minDist ? 'var(--safe)' : 'var(--text-muted)' }}>
                          {dists[2]?.toFixed(4)}
                        </td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--cyan-400)' }}>
                          {minDist.toFixed(4)}
                        </td>
                        <td>
                          <span className={`badge badge-${d.cluster === 'kritis' ? 'critical' : d.cluster === 'waspada' ? 'warning' : 'safe'}`}>
                            {d.cluster?.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Detail Tab */}
      {tab === 'detail' && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Desa</th>
                <th>Kecamatan</th>
                {isHujan ? (
                  <>
                    <th>Curah Hujan (H1)</th>
                    <th>Kemiringan Lereng (H2)</th>
                    <th>Indeks Longsor (H3)</th>
                    <th>Warga Terancam (H4)</th>
                    <th>Jarak DAS (H5)</th>
                    <th>Jenis Bahaya</th>
                  </>
                ) : (
                  <>
                    <th>Warga (C1)</th>
                    <th>Defisit Air (C2)</th>
                    <th>Durasi (C3)</th>
                    <th>Rasio Rentan (C4)</th>
                    <th>Jarak Sumber (C5)</th>
                    <th>Hambatan (C6)</th>
                  </>
                )}
                <th>Zona Klaster</th>
              </tr>
            </thead>
            <tbody>
              {[...desaList].sort((a, b) => {
                const order = { kritis: 0, waspada: 1, siaga: 2 };
                return (order[a.cluster || 'siaga'] || 0) - (order[b.cluster || 'siaga'] || 0);
              }).map((d, i) => (
                <tr key={d.id}>
                  <td>{i + 1}</td>
                  <td><strong>{d.namaDesa}</strong></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{d.namaKecamatan}</td>
                  {isHujan ? (
                    <>
                      <td>{d.curahHujan} mm</td>
                      <td>{d.kemiringanLereng}%</td>
                      <td>{d.indeksLongsor}/5</td>
                      <td>{d.wargaTerancam?.toLocaleString('id-ID')} jiwa</td>
                      <td>{d.jarakSungai} km</td>
                      <td>
                        <span className={`badge ${
                          d.jenisBencanaDominan === 'tanah_longsor'
                            ? 'badge-critical'
                            : d.jenisBencanaDominan === 'gerakan_tanah'
                            ? 'badge-warning'
                            : d.jenisBencanaDominan === 'banjir_luapan'
                            ? 'badge-info'
                            : 'badge-safe'
                        }`} style={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                          {d.jenisBencanaDominan === 'tanah_longsor' ? 'Tanah Longsor' : (d.jenisBencanaDominan === 'gerakan_tanah' ? 'Gerakan Tanah' : (d.jenisBencanaDominan === 'banjir_luapan' ? 'Banjir Luapan' : 'Aman Stabil'))}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{d.jumlahWarga.toLocaleString('id-ID')} jiwa</td>
                      <td><span style={{ color: 'var(--cyan-400)' }}>{d.defisitAir.toLocaleString('id-ID')} L</span></td>
                      <td>{d.durasiKekeringan} hari</td>
                      <td>{d.rasioRentan}%</td>
                      <td>{d.jarakSumber} km</td>
                      <td>{d.indeksHambatan}/5</td>
                    </>
                  )}
                  <td>
                    {d.cluster ? (
                      <span className={`badge badge-${d.cluster === 'kritis' ? 'critical' : d.cluster === 'waspada' ? 'warning' : 'safe'}`}>
                        {d.cluster.toUpperCase()}
                      </span>
                    ) : (
                      <span className="badge badge-info">Belum Diklaster</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
