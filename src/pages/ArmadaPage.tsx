// ============================================================
// TIRTA — Manajemen Armada Page (Tanpa Emoji - Elegan & Bersih)
// ============================================================
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Armada } from '../types';
import { Truck, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const KONDISI_BADGE = {
  baik:   { cls: 'badge-safe',     label: 'Baik' },
  sedang: { cls: 'badge-warning',  label: 'Sedang' },
  rusak:  { cls: 'badge-critical', label: 'Rusak' },
};

const STATUS_BADGE = {
  tersedia:  { cls: 'badge-safe',    label: 'Tersedia' },
  bertugas:  { cls: 'badge-warning', label: 'Bertugas' },
  istirahat: { cls: 'badge-info',    label: 'Istirahat' },
};

export default function ArmadaPage() {
  const { armadaList, setArmadaList } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Armada | null>(null);
  const [form, setForm] = useState<Omit<Armada, 'id'>>({
    nomorPolisi: '', kapasitas: 5000, kondisi: 'baik',
    supir: '', nomorHp: '', statusToday: 'tersedia',
  });

  function openAdd() {
    setEditTarget(null);
    setForm({ nomorPolisi: '', kapasitas: 5000, kondisi: 'baik', supir: '', nomorHp: '', statusToday: 'tersedia' });
    setShowModal(true);
  }

  function openEdit(a: Armada) {
    setEditTarget(a);
    const { id: _id, ...rest } = a;
    setForm(rest);
    setShowModal(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editTarget) {
      setArmadaList(prev => prev.map(a => a.id === editTarget.id ? { ...form, id: editTarget.id } : a));
    } else {
      setArmadaList(prev => [...prev, { ...form, id: `a${Date.now()}` }]);
    }
    setShowModal(false);
  }

  function handleDelete(id: string) {
    if (confirm('Hapus armada ini?')) setArmadaList(prev => prev.filter(a => a.id !== id));
  }

  const counts = {
    tersedia:  armadaList.filter(a => a.statusToday === 'tersedia').length,
    bertugas:  armadaList.filter(a => a.statusToday === 'bertugas').length,
    istirahat: armadaList.filter(a => a.statusToday === 'istirahat').length,
    totalKap:  armadaList.filter(a => a.kondisi !== 'rusak').reduce((s, a) => s + a.kapasitas, 0),
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Manajemen Armada</h1>
          <p>Data tandon dan kendaraan distribusi air bersih MDMC Banjarnegara</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={openAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Tambah Armada
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card safe"><div className="stat-label">Tersedia</div><div className="stat-value">{counts.tersedia}</div><div className="stat-sub">unit siap bertugas</div></div>
        <div className="stat-card warning"><div className="stat-label">Bertugas</div><div className="stat-value">{counts.bertugas}</div><div className="stat-sub">unit sedang beroperasi</div></div>
        <div className="stat-card info"><div className="stat-label">Istirahat</div><div className="stat-value">{counts.istirahat}</div><div className="stat-sub">unit tidak aktif</div></div>
        <div className="stat-card info"><div className="stat-label">Kapasitas Operasional</div><div className="stat-value">{(counts.totalKap / 1000).toFixed(0)}K</div><div className="stat-sub">liter total</div></div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No. Polisi</th>
              <th>Supir</th>
              <th>Kapasitas</th>
              <th>Kondisi</th>
              <th>Status Hari Ini</th>
              <th>Tujuan</th>
              <th>Kontak</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {armadaList.map(a => (
              <tr key={a.id}>
                <td><strong style={{ fontFamily: 'monospace', color: 'var(--blue-400)' }}>{a.nomorPolisi}</strong></td>
                <td>{a.supir}</td>
                <td><span style={{ color: 'var(--cyan-400)' }}>{a.kapasitas.toLocaleString('id-ID')} L</span></td>
                <td><span className={`badge ${KONDISI_BADGE[a.kondisi].cls}`}>{KONDISI_BADGE[a.kondisi].label}</span></td>
                <td><span className={`badge ${STATUS_BADGE[a.statusToday].cls}`}>{STATUS_BADGE[a.statusToday].label}</span></td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{a.desaTujuan || '—'}</td>
                <td style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{a.nomorHp}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => openEdit(a)} title="Edit Armada">
                      <Edit2 size={13} />
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id)} title="Hapus Armada">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Truck size={18} style={{ color: 'var(--blue-400)' }} />
                {editTarget ? 'Edit Armada' : 'Tambah Armada'}
              </div>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowModal(false)}><X size={14} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Nomor Polisi *</label>
                  <input required value={form.nomorPolisi} onChange={e => setForm(p => ({ ...p, nomorPolisi: e.target.value }))} placeholder="R 1234 AB" />
                </div>
                <div className="form-group">
                  <label>Kapasitas (Liter) *</label>
                  <input type="number" required min={500} value={form.kapasitas} onChange={e => setForm(p => ({ ...p, kapasitas: Number(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label>Nama Supir *</label>
                  <input required value={form.supir} onChange={e => setForm(p => ({ ...p, supir: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Nomor HP</label>
                  <input value={form.nomorHp} onChange={e => setForm(p => ({ ...p, nomorHp: e.target.value }))} placeholder="08xxx" />
                </div>
                <div className="form-group">
                  <label>Kondisi</label>
                  <select value={form.kondisi} onChange={e => setForm(p => ({ ...p, kondisi: e.target.value as Armada['kondisi'] }))}>
                    <option value="baik">Baik</option>
                    <option value="sedang">Sedang</option>
                    <option value="rusak">Rusak</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status Hari Ini</label>
                  <select value={form.statusToday} onChange={e => setForm(p => ({ ...p, statusToday: e.target.value as Armada['statusToday'] }))}>
                    <option value="tersedia">Tersedia</option>
                    <option value="bertugas">Bertugas</option>
                    <option value="istirahat">Istirahat</option>
                  </select>
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
