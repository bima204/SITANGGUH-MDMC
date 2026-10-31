// ============================================================
// TIRTA — Data Desa Page (CRUD - 266 Desa & 20 Kecamatan)
// Tanpa Emoji - Filter Kecamatan & Klaster - Paginasi Cepat
// ============================================================
import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { Desa } from '../types';
import { 
  Building2, Search, Plus, Edit2, Trash2, Save, 
  AlertTriangle, Sliders, ChevronLeft, ChevronRight,
  Filter, MapPin, Droplets, Users, X, Navigation
} from 'lucide-react';

const EMPTY_DESA: Omit<Desa, 'id'> = {
  namaDesa: '', namaKecamatan: '',
  lat: -7.43, lng: 109.69,
  jumlahWarga: 0, defisitAir: 0, durasiKekeringan: 0,
  rasioRentan: 0, jarakSumber: 0, indeksHambatan: 1,
};

export default function DataDesa() {
  const { desaList, addDesa, updateDesa, deleteDesa, musim } = useApp();
  const isHujan = musim === 'hujan';
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Desa | null>(null);
  const [form, setForm] = useState<Omit<Desa, 'id'>>(EMPTY_DESA);
  const [search, setSearch] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('semua');
  const [selectedCluster, setSelectedCluster] = useState<string>('semua');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Distinct list of kecamatan
  const kecamatanList = useMemo(() => {
    return Array.from(new Set(desaList.map(d => d.namaKecamatan))).sort();
  }, [desaList]);

  // Filtered desa
  const filtered = useMemo(() => {
    return desaList.filter(d => {
      const matchSearch = d.namaDesa.toLowerCase().includes(search.toLowerCase()) ||
        d.namaKecamatan.toLowerCase().includes(search.toLowerCase());
      const matchKec = selectedKecamatan === 'semua' || d.namaKecamatan === selectedKecamatan;
      const matchCluster = selectedCluster === 'semua' || d.cluster === selectedCluster;
      return matchSearch && matchKec && matchCluster;
    });
  }, [desaList, search, selectedKecamatan, selectedCluster]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pagedList = filtered.slice(startIndex, startIndex + pageSize);

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_DESA);
    setShowModal(true);
  }

  function openEdit(d: Desa) {
    setEditTarget(d);
    const { id: _id, cluster: _cl, topsisScore: _ts, rank: _r, ...rest } = d;
    setForm(rest);
    setShowModal(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editTarget) {
      updateDesa({ ...form, id: editTarget.id, cluster: editTarget.cluster, topsisScore: editTarget.topsisScore, rank: editTarget.rank });
    } else {
      addDesa({ ...form, id: `d${Date.now()}` });
    }
    setShowModal(false);
  }

  function f(key: keyof typeof form, value: string | number) {
    setForm(prev => ({ ...prev, [key]: typeof prev[key] === 'number' ? Number(value) : value }));
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Database Wilayah Kekeringan Kabupaten Banjarnegara</h1>
          <p>Dataset komprehensif 266 desa di 20 kecamatan beserta 6 kriteria analitik SPK</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Tambah Desa
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue-400)' }}>
            <Building2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total Wilayah</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {desaList.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Desa / {kecamatanList.length} Kec.</span>
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 'var(--radius-md)', padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--critical)' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--critical)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Zona Kritis</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--critical)' }}>
              {desaList.filter(d => d.cluster === 'kritis').length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Desa Prioritas</span>
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 'var(--radius-md)', padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
            <Droplets size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Zona Waspada</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--warning)' }}>
              {desaList.filter(d => d.cluster === 'waspada').length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Desa Siaga 2</span>
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.25)',
          borderRadius: 'var(--radius-md)', padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--safe)' }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--safe)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Zona Siaga</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--safe)' }}>
              {desaList.filter(d => d.cluster === 'siaga').length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Desa Terkendali</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', padding: '12px 16px',
        marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
          {/* Search */}
          <div style={{ position: 'relative', minWidth: 240 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              placeholder="Cari desa atau kecamatan..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{ width: '100%', paddingLeft: 32 }}
            />
          </div>

          {/* Kecamatan Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              value={selectedKecamatan}
              onChange={e => { setSelectedKecamatan(e.target.value); setPage(1); }}
              style={{ padding: '7px 12px', fontSize: '0.85rem' }}
            >
              <option value="semua">Semua Kecamatan (20)</option>
              {kecamatanList.map(kec => (
                <option key={kec} value={kec}>Kec. {kec}</option>
              ))}
            </select>
          </div>

          {/* Cluster Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              value={selectedCluster}
              onChange={e => { setSelectedCluster(e.target.value); setPage(1); }}
              style={{ padding: '7px 12px', fontSize: '0.85rem' }}
            >
              <option value="semua">Semua Klaster Zonasi</option>
              <option value="kritis">Zona Kritis</option>
              <option value="waspada">Zona Waspada</option>
              <option value="siaga">Zona Siaga</option>
            </select>
          </div>
        </div>

        {/* Total info & Page Size */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span>Menampilkan <strong>{filtered.length}</strong> dari {desaList.length} desa</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Baris:</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              style={{ padding: '4px 8px', fontSize: '0.8rem' }}
            >
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={300}>Semua (266)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: 44, textAlign: 'center' }}>#</th>
              <th>Desa / Kecamatan</th>
              {isHujan ? (
                <>
                  <th>H1: Curah Hujan</th>
                  <th>H2: Kemiringan Lereng</th>
                  <th>H3: Indeks Longsor</th>
                  <th>H4: Warga Rawan</th>
                  <th>H5: Jarak DAS</th>
                  <th>Jenis Bencana</th>
                </>
              ) : (
                <>
                  <th>C1: Warga</th>
                  <th>C2: Defisit Air</th>
                  <th>C3: Durasi</th>
                  <th>C4: Rentan</th>
                  <th>C5: Jarak</th>
                  <th>C6: Hambatan</th>
                </>
              )}
              <th>{isHujan ? 'Zona Bahaya' : 'Zona Klaster'}</th>
              <th>Skor TOPSIS</th>
              <th style={{ textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pagedList.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  Tidak ada desa yang cocok dengan kriteria pencarian / filter.
                </td>
              </tr>
            ) : (
              pagedList.map((d, idx) => (
                <tr key={d.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
                    {startIndex + idx + 1}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{d.namaDesa}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kecamatan {d.namaKecamatan}</div>
                  </td>
                  {isHujan ? (
                    <>
                      <td>
                        <strong style={{ color: '#38bdf8' }}>{d.curahHujan} mm</strong>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: (d.kemiringanLereng || 0) > 30 ? 'var(--critical)' : 'var(--warning)' }}>
                          {d.kemiringanLereng}%
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${d.indeksLongsor && d.indeksLongsor >= 4 ? 'badge-critical' : 'badge-warning'}`}>
                          Skala {d.indeksLongsor}/5
                        </span>
                      </td>
                      <td>
                        <strong>{d.wargaTerancam?.toLocaleString('id-ID')} jiwa</strong>
                      </td>
                      <td>
                        {d.jarakSungai} km
                      </td>
                      <td>
                        <span className={`badge ${
                          d.statusKerawananHujan === 'rawan_tinggi'
                            ? 'badge-critical'
                            : d.statusKerawananHujan === 'waspada'
                            ? 'badge-warning'
                            : 'badge-safe'
                        }`} style={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                          {d.jenisBencanaDominan === 'tanah_longsor' ? 'Tanah Longsor' : (d.jenisBencanaDominan === 'gerakan_tanah' ? 'Gerakan Tanah' : (d.jenisBencanaDominan === 'banjir_luapan' ? 'Banjir Luapan' : 'Aman Stabil'))}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {d.statusKerawananHujan === 'rawan_tinggi' ? 'Rawan Tinggi' : (d.statusKerawananHujan === 'waspada' ? 'Waspada' : 'Aman')}
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {d.jumlahWarga.toLocaleString('id-ID')} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>jiwa</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', marginLeft: 4 }}>
                            ({d.persenTerdampak || ((d.jumlahWarga / (d.totalWargaDesa || 3000)) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {d.kkTerdampak || Math.round(d.jumlahWarga / 3.8)} KK / {d.totalKK || Math.round((d.totalWargaDesa || 3000) / 3.8)} KK
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--blue-400)' }}>{d.defisitAir.toLocaleString('id-ID')} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>L</span></td>
                      <td>{d.durasiKekeringan} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>hari</span></td>
                      <td>{d.rasioRentan}%</td>
                      <td>{d.jarakSumber} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>km</span></td>
                      <td>
                        <span style={{
                          fontWeight: 700,
                          color: d.indeksHambatan >= 4 ? 'var(--critical)' : d.indeksHambatan === 3 ? 'var(--warning)' : 'var(--safe)'
                        }}>
                          {d.indeksHambatan}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> / 5</span>
                      </td>
                    </>
                  )}
                  <td>
                    {d.cluster ? (
                      <span className={`badge badge-${d.cluster === 'kritis' ? 'critical' : d.cluster === 'waspada' ? 'warning' : 'safe'}`}>
                        {isHujan
                          ? (d.cluster === 'kritis' ? 'BAHAYA MERAH' : d.cluster === 'waspada' ? 'WASPADA KUNING' : 'AMAN HIJAU')
                          : d.cluster.toUpperCase()}
                      </span>
                    ) : (
                      <span className="badge badge-info">—</span>
                    )}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--cyan-400)' }}>
                    {d.topsisScore !== undefined ? d.topsisScore.toFixed(4) : '—'}
                    {d.rank ? (
                      <span style={{
                        display: 'inline-block',
                        marginLeft: 6,
                        padding: '1px 6px',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: d.rank <= 3 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)',
                        color: d.rank <= 3 ? '#fca5a5' : 'var(--text-muted)'
                      }}>
                        #{d.rank}
                      </span>
                    ) : null}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary"
                        style={{ padding: '6px 8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        title={`Buka Rute Google Maps ke ${d.namaDesa}`}
                      >
                        <Navigation size={13} />
                      </a>
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(d)} title="Edit Desa">
                        <Edit2 size={13} />
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => setConfirmDelete(d.id)} title="Hapus Desa">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 16, padding: '12px 16px', background: 'var(--bg-card)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Halaman <strong>{safePage}</strong> dari <strong>{totalPages}</strong> (Data ke {startIndex + 1}–{Math.min(startIndex + pageSize, filtered.length)})
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className="btn btn-sm btn-secondary"
              disabled={safePage <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <ChevronLeft size={14} /> Sebelumnya
            </button>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (totalPages > 7) {
                  if (safePage <= 4) pageNum = i + 1;
                  else if (safePage >= totalPages - 3) pageNum = totalPages - 6 + i;
                  else pageNum = safePage - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    className={`btn btn-sm ${pageNum === safePage ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setPage(pageNum)}
                    style={{ minWidth: 32, padding: '4px 8px' }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              className="btn btn-sm btn-secondary"
              disabled={safePage >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              Berikutnya <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building2 size={18} style={{ color: 'var(--blue-400)' }} />
                {editTarget ? 'Edit Data Desa' : 'Tambah Desa Baru'}
              </div>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowModal(false)}><X size={14} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Nama Desa *</label>
                  <input required value={form.namaDesa} onChange={e => f('namaDesa', e.target.value)} placeholder="cth: Karanganyar" />
                </div>
                <div className="form-group">
                  <label>Kecamatan *</label>
                  <input required value={form.namaKecamatan} onChange={e => f('namaKecamatan', e.target.value)} placeholder="cth: Purwanegara" />
                </div>
                <div className="form-group">
                  <label>Latitude</label>
                  <input type="number" step="0.0001" value={form.lat} onChange={e => f('lat', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Longitude</label>
                  <input type="number" step="0.0001" value={form.lng} onChange={e => f('lng', e.target.value)} />
                </div>
              </div>

              <div className="divider" />
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sliders size={14} style={{ color: 'var(--blue-400)' }} />
                Kriteria SPK
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>C1 — Jumlah Warga Terdampak (jiwa)</label>
                  <input type="number" min="0" required value={form.jumlahWarga} onChange={e => f('jumlahWarga', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>C2 — Defisit Air Bersih (L/hari)</label>
                  <input type="number" min="0" required value={form.defisitAir} onChange={e => f('defisitAir', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>C3 — Durasi Kekeringan (hari)</label>
                  <input type="number" min="0" required value={form.durasiKekeringan} onChange={e => f('durasiKekeringan', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>C4 — Rasio Rentan &amp; Fasum (%)</label>
                  <input type="number" min="0" max="100" step="0.1" required value={form.rasioRentan} onChange={e => f('rasioRentan', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>C5 — Jarak dari Sumber Air (km) — Cost</label>
                  <input type="number" min="0" step="0.1" required value={form.jarakSumber} onChange={e => f('jarakSumber', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>C6 — Indeks Hambatan Medan (1–5) — Cost</label>
                  <input type="number" min="1" max="5" required value={form.indeksHambatan} onChange={e => f('indeksHambatan', e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Save size={16} />
                  {editTarget ? 'Simpan Perubahan' : 'Tambah Desa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} style={{ color: 'var(--critical)' }} />
              Konfirmasi Hapus
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
              Yakin ingin menghapus desa <strong>{desaList.find(d => d.id === confirmDelete)?.namaDesa}</strong>? Aksi ini tidak bisa dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Batal</button>
              <button className="btn btn-danger" onClick={() => { deleteDesa(confirmDelete!); setConfirmDelete(null); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Trash2 size={16} /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
