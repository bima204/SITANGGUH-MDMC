// ============================================================
// TIRTA — Sumber Air Page (Tanpa Emoji - Elegan & Bersih)
// ============================================================
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { SumberAir } from '../types';
import { Droplets, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const JENIS_LABEL: Record<string, string> = {
  sumur_bor: 'Sumur Bor',
  mata_air: 'Mata Air',
  irigasi: 'Irigasi',
  pdam: 'PDAM',
};

export default function SumberAirPage() {
  const { sumberAirList, setSumberAirList } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<SumberAir | null>(null);
  const [form, setForm] = useState<Omit<SumberAir, 'id'>>({
    nama: '', jenis: 'sumur_bor', lat: -7.43, lng: 109.69,
    kapasitas: 30000, stokSaat: 30000, kondisi: 'aktif',
  });

  function openAdd() {
    setEditTarget(null);
    setForm({ nama: '', jenis: 'sumur_bor', lat: -7.43, lng: 109.69, kapasitas: 30000, stokSaat: 30000, kondisi: 'aktif' });
    setShowModal(true);
  }

  function openEdit(s: SumberAir) {
    setEditTarget(s);
    const { id: _id, ...rest } = s;
    setForm(rest);
    setShowModal(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editTarget) {
      setSumberAirList(prev => prev.map(s => s.id === editTarget.id ? { ...form, id: editTarget.id } : s));
    } else {
      setSumberAirList(prev => [...prev, { ...form, id: `s${Date.now()}` }]);
    }
    setShowModal(false);
  }

  const totalKap  = sumberAirList.reduce((s, a) => s + a.kapasitas, 0);
  const totalStok = sumberAirList.reduce((s, a) => s + a.stokSaat, 0);
  const avgFill   = totalKap > 0 ? (totalStok / totalKap) * 100 : 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Sumber Air Bersih</h1>
          <p>Monitoring titik pengisian dan stok ketersediaan air bersih</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Tambah Sumber
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card info">
          <div className="stat-label">Total Sumber Aktif</div>
          <div className="stat-value">{sumberAirList.filter(s => s.kondisi === 'aktif').length}</div>
          <div className="stat-sub">dari {sumberAirList.length} titik</div>
        </div>
        <div className="stat-card info">
          <div className="stat-label">Total Kapasitas</div>
          <div className="stat-value">{(totalKap / 1000).toFixed(0)}K</div>
          <div className="stat-sub">liter per hari</div>
        </div>
        <div className="stat-card safe">
          <div className="stat-label">Stok Tersedia</div>
          <div className="stat-value">{(totalStok / 1000).toFixed(0)}K</div>
          <div className="stat-sub">liter saat ini</div>
        </div>
        <div className="stat-card info">
          <div className="stat-label">Tingkat Pengisian</div>
          <div className="stat-value">{avgFill.toFixed(0)}%</div>
          <div className="stat-sub">rata-rata semua sumber</div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid-auto">
        {sumberAirList.map(s => {
          const fillPct = s.kapasitas > 0 ? (s.stokSaat / s.kapasitas) * 100 : 0;
          const fillColor = fillPct > 60 ? 'var(--safe)' : fillPct > 30 ? 'var(--warning)' : 'var(--critical)';
          return (
            <div key={s.id} className="card" style={{ borderLeft: `3px solid ${fillColor}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{s.nama}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{JENIS_LABEL[s.jenis]}</div>
                </div>
                <span className={`badge ${s.kondisi === 'aktif' ? 'badge-safe' : 'badge-critical'}`}>
                  {s.kondisi === 'aktif' ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16, fontSize: '0.875rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Kapasitas</div>
                  <div style={{ fontWeight: 600 }}>{s.kapasitas.toLocaleString('id-ID')} L/hari</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Stok Saat Ini</div>
                  <div style={{ fontWeight: 600, color: fillColor }}>{s.stokSaat.toLocaleString('id-ID')} L</div>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  <span>Tingkat Pengisian</span>
                  <span style={{ color: fillColor, fontWeight: 700 }}>{fillPct.toFixed(0)}%</span>
                </div>
                <div className="progress-bar-outer">
                  <div className="progress-bar-inner" style={{ width: `${fillPct}%`, background: `linear-gradient(90deg, ${fillColor}, ${fillColor}88)` }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="btn btn-sm btn-secondary" onClick={() => openEdit(s)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Edit2 size={13} /> Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => setSumberAirList(prev => prev.filter(x => x.id !== s.id))} title="Hapus Sumber Air">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Droplets size={18} style={{ color: 'var(--blue-400)' }} />
                {editTarget ? 'Edit Sumber Air' : 'Tambah Sumber Air'}
              </div>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowModal(false)}><X size={14} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Sumber *</label>
                <input required value={form.nama} onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Jenis</label>
                  <select value={form.jenis} onChange={e => setForm(p => ({ ...p, jenis: e.target.value as SumberAir['jenis'] }))}>
                    <option value="sumur_bor">Sumur Bor</option>
                    <option value="mata_air">Mata Air</option>
                    <option value="irigasi">Irigasi</option>
                    <option value="pdam">PDAM</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Kondisi</label>
                  <select value={form.kondisi} onChange={e => setForm(p => ({ ...p, kondisi: e.target.value as SumberAir['kondisi'] }))}>
                    <option value="aktif">Aktif</option>
                    <option value="tidak_aktif">Tidak Aktif</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Kapasitas (L/hari)</label>
                  <input type="number" min={0} required value={form.kapasitas} onChange={e => setForm(p => ({ ...p, kapasitas: Number(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label>Stok Saat Ini (Liter)</label>
                  <input type="number" min={0} required value={form.stokSaat} onChange={e => setForm(p => ({ ...p, stokSaat: Number(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label>Latitude</label>
                  <input type="number" step="0.0001" value={form.lat} onChange={e => setForm(p => ({ ...p, lat: Number(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label>Longitude</label>
                  <input type="number" step="0.0001" value={form.lng} onChange={e => setForm(p => ({ ...p, lng: Number(e.target.value) }))} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Save size={16} /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
