// ============================================================
// TIRTA — Distribusi Air Page (Full CRUD: Create, Read, Update, Delete)
// Manajemen Dropping Air Bersih MDMC Banjarnegara
// Tanpa Emoji — Teks Berkontras Tinggi & Elemen Vektor Presisi
// ============================================================
import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { JadwalDistribusi } from '../types';
import { 
  Truck, Plus, Edit2, Trash2, Eye, X, Search, Calendar, 
  Navigation, AlertTriangle, 
  Sparkles, CheckCircle2, RotateCcw
} from 'lucide-react';

const STATUS_CONFIG: Record<JadwalDistribusi['status'], { label: string; cls: string; color: string; bg: string }> = {
  terjadwal: { 
    label: 'Terjadwal', 
    cls: 'badge-info', 
    color: '#38bdf8', 
    bg: 'rgba(56, 189, 248, 0.15)' 
  },
  dalam_perjalanan: { 
    label: 'Perjalanan', 
    cls: 'badge-warning', 
    color: '#fbbf24', 
    bg: 'rgba(245, 158, 11, 0.15)' 
  },
  selesai: { 
    label: 'Selesai', 
    cls: 'badge-safe', 
    color: '#34d399', 
    bg: 'rgba(16, 185, 129, 0.15)' 
  },
  batal: { 
    label: 'Batal', 
    cls: 'badge-critical', 
    color: '#f87171', 
    bg: 'rgba(239, 68, 68, 0.15)' 
  },
};

interface FormState {
  tanggal: string;
  desaId: string;
  armadaId: string;
  jumlahAir: number;
  sumberAirId: string;
  status: JadwalDistribusi['status'];
  catatan: string;
}

const DEFAULT_FORM: FormState = {
  tanggal: new Date().toISOString().split('T')[0],
  desaId: '',
  armadaId: '',
  jumlahAir: 5000,
  sumberAirId: '',
  status: 'terjadwal',
  catatan: '',
};

export default function DistribusiPage() {
  const { 
    jadwalList, 
    addJadwal, 
    updateJadwal, 
    deleteJadwal, 
    updateJadwalStatus, 
    desaList, 
    armadaList, 
    sumberAirList 
  } = useApp();

  // State Modals
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [detailTarget, setDetailTarget] = useState<JadwalDistribusi | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JadwalDistribusi | null>(null);

  // Form State
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [filterTgl, setFilterTgl] = useState('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  // Filtered Jadwal
  const filtered = useMemo(() => {
    return jadwalList.filter(j => {
      if (filterStatus !== 'semua' && j.status !== filterStatus) return false;
      if (filterTgl && j.tanggal !== filterTgl) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchDesa = j.desaNama.toLowerCase().includes(q);
        const matchArmada = j.armadaPolisi.toLowerCase().includes(q);
        const matchSumber = j.sumberAirNama.toLowerCase().includes(q);
        const matchCatatan = (j.catatan || '').toLowerCase().includes(q);
        const armada = armadaList.find(a => a.id === j.armadaId);
        const matchSupir = armada ? armada.supir.toLowerCase().includes(q) : false;
        if (!matchDesa && !matchArmada && !matchSumber && !matchCatatan && !matchSupir) return false;
      }
      return true;
    });
  }, [jadwalList, filterStatus, filterTgl, search, armadaList]);

  // Statistik Ringkasan
  const todayStr = new Date().toISOString().split('T')[0];
  const totalAirHariIni = useMemo(() => {
    return jadwalList
      .filter(j => j.tanggal === todayStr && j.status === 'selesai')
      .reduce((s, j) => s + j.jumlahAir, 0);
  }, [jadwalList, todayStr]);

  const totalVolumeTerjadwal = useMemo(() => {
    return jadwalList.reduce((s, j) => s + j.jumlahAir, 0);
  }, [jadwalList]);

  // Open Create Modal
  function handleOpenCreate() {
    setModalMode('create');
    setEditTargetId(null);
    setForm({
      ...DEFAULT_FORM,
      tanggal: new Date().toISOString().split('T')[0],
      desaId: desaList.find(d => d.cluster === 'kritis')?.id || (desaList[0]?.id ?? ''),
      armadaId: armadaList.find(a => a.statusToday === 'tersedia')?.id || (armadaList[0]?.id ?? ''),
      sumberAirId: sumberAirList.find(s => s.kondisi === 'aktif')?.id || (sumberAirList[0]?.id ?? ''),
    });
    setShowModal(true);
  }

  // Open Edit Modal
  function handleOpenEdit(j: JadwalDistribusi) {
    setModalMode('edit');
    setEditTargetId(j.id);
    setForm({
      tanggal: j.tanggal,
      desaId: j.desaId,
      armadaId: j.armadaId,
      jumlahAir: j.jumlahAir,
      sumberAirId: j.sumberAirId,
      status: j.status,
      catatan: j.catatan || '',
    });
    setShowModal(true);
  }

  // Auto-fill form from TOPSIS Priority #1
  function handleAutoFillTopsis() {
    const topDesa = [...desaList]
      .filter(d => d.cluster === 'kritis')
      .sort((a, b) => (a.rank || 999) - (b.rank || 999))[0] || desaList[0];

    if (!topDesa) return;

    const availableArmada = armadaList.find(a => a.statusToday === 'tersedia' && a.kondisi === 'baik') || armadaList[0];
    const activeSumber = sumberAirList.find(s => s.kondisi === 'aktif') || sumberAirList[0];
    const recVolume = availableArmada ? availableArmada.kapasitas : 5000;

    setForm(prev => ({
      ...prev,
      desaId: topDesa.id,
      armadaId: availableArmada ? availableArmada.id : prev.armadaId,
      sumberAirId: activeSumber ? activeSumber.id : prev.sumberAirId,
      jumlahAir: recVolume,
      catatan: `Prioritas SPK TOPSIS Rank #${topDesa.rank || 1} — Defisit: ${topDesa.defisitAir.toLocaleString('id-ID')} L/hr`,
    }));
  }

  // Submit Form (Create or Update)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const desa = desaList.find(d => d.id === form.desaId);
    const armada = armadaList.find(a => a.id === form.armadaId);
    const sumber = sumberAirList.find(s => s.id === form.sumberAirId);

    if (!desa || !armada || !sumber) {
      alert('Mohon lengkapi pilihan desa, armada, dan sumber air.');
      return;
    }

    if (modalMode === 'create') {
      const newJadwal: JadwalDistribusi = {
        id: `j${Date.now()}`,
        tanggal: form.tanggal,
        desaId: desa.id,
        desaNama: desa.namaDesa,
        armadaId: armada.id,
        armadaPolisi: armada.nomorPolisi,
        jumlahAir: form.jumlahAir,
        sumberAirId: sumber.id,
        sumberAirNama: sumber.nama,
        status: form.status,
        catatan: form.catatan.trim() || undefined,
      };
      addJadwal(newJadwal);
      showToast(`Jadwal dropping ke Desa ${desa.namaDesa} berhasil dibuat!`);
    } else if (modalMode === 'edit' && editTargetId) {
      const updatedJadwal: JadwalDistribusi = {
        id: editTargetId,
        tanggal: form.tanggal,
        desaId: desa.id,
        desaNama: desa.namaDesa,
        armadaId: armada.id,
        armadaPolisi: armada.nomorPolisi,
        jumlahAir: form.jumlahAir,
        sumberAirId: sumber.id,
        sumberAirNama: sumber.nama,
        status: form.status,
        catatan: form.catatan.trim() || undefined,
      };
      updateJadwal(updatedJadwal);
      showToast(`Jadwal dropping ke Desa ${desa.namaDesa} berhasil diperbarui!`);
    }

    setShowModal(false);
  }

  // Confirm and Delete
  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteJadwal(deleteTarget.id);
    showToast(`Jadwal distribusi ke Desa ${deleteTarget.desaNama} telah dihapus.`);
    setDeleteTarget(null);
  }

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 3000,
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1.5px solid #0284c7',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.45)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.88rem',
          fontWeight: 600,
          animation: 'fadeIn 0.25s ease',
        }}>
          <CheckCircle2 size={18} style={{ color: '#38bdf8' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div className="page-header-text">
          <h1>Jadwal Distribusi Air</h1>
          <p>Manajemen dropping logistik air bersih harian &amp; penugasan armada tangki ke desa prioritas</p>
        </div>
        <div className="page-actions" style={{ display: 'flex', gap: 10 }}>
          <button 
            className="btn btn-primary" 
            onClick={handleOpenCreate} 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 7, 
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
              fontWeight: 700 
            }}
          >
            <Plus size={16} /> Buat Jadwal Baru
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 20 }}>
        {[
          { label: 'Total Jadwal', val: jadwalList.length, unit: 'misi', color: 'info' },
          { label: 'Aktif Hari Ini', val: jadwalList.filter(j => j.status === 'dalam_perjalanan').length, unit: 'armada', color: 'warning' },
          { label: 'Selesai', val: jadwalList.filter(j => j.status === 'selesai').length, unit: 'titik', color: 'safe' },
          { label: 'Air Terkirim Hari Ini', val: `${totalAirHariIni.toLocaleString('id-ID')} L`, unit: 'hari ini', color: 'info' },
          { label: 'Total Volume Rencana', val: `${totalVolumeTerjadwal.toLocaleString('id-ID')} L`, unit: 'total', color: 'info' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: typeof s.val === 'string' && s.val.length > 8 ? '1.25rem' : '1.8rem' }}>
              {s.val}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.unit}</div>
          </div>
        ))}
      </div>

      {/* Filter, Search & Status Bar */}
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        marginBottom: 16, 
        flexWrap: 'wrap', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: 'var(--bg-card)',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)'
      }}>
        {/* Status filter chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            ['semua', 'Semua'], 
            ['terjadwal', 'Terjadwal'], 
            ['dalam_perjalanan', 'Perjalanan'], 
            ['selesai', 'Selesai'], 
            ['batal', 'Batal']
          ].map(([val, label]) => {
            const count = val === 'semua' ? jadwalList.length : jadwalList.filter(j => j.status === val).length;
            return (
              <button 
                key={val} 
                className={`btn btn-sm ${filterStatus === val ? 'btn-primary' : 'btn-secondary'}`} 
                onClick={() => setFilterStatus(val)}
                style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}
              >
                <span>{label}</span>
                <span style={{ 
                  fontSize: '0.7rem', 
                  padding: '1px 5px', 
                  borderRadius: 999, 
                  background: filterStatus === val ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)' 
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Date Filter */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 220 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Cari desa, armada, supir..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: 30, fontSize: '0.82rem', height: 34 }} 
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
            <input 
              type="date" 
              value={filterTgl} 
              onChange={e => setFilterTgl(e.target.value)} 
              style={{ width: 145, fontSize: '0.82rem', height: 34 }} 
              title="Filter menurut tanggal pengiriman"
            />
          </div>

          {(filterTgl || search) && (
            <button 
              className="btn btn-sm btn-secondary" 
              onClick={() => { setFilterTgl(''); setSearch(''); }} 
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 34 }}
              title="Reset pencarian dan filter tanggal"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ width: 100 }}>Tanggal</th>
              <th>Desa Tujuan</th>
              <th>Armada Tangki</th>
              <th>Volume Air</th>
              <th>Sumber Air</th>
              <th>Status</th>
              <th>Catatan Lapangan</th>
              <th style={{ textAlign: 'center', width: 190 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                  <AlertTriangle size={28} style={{ margin: '0 auto 8px', color: 'var(--text-muted)' }} />
                  <div>Tidak ada jadwal distribusi air yang sesuai filter.</div>
                  <button 
                    className="btn btn-sm btn-secondary" 
                    onClick={() => { setFilterStatus('semua'); setFilterTgl(''); setSearch(''); }} 
                    style={{ marginTop: 10 }}
                  >
                    Tampilkan Semua Jadwal
                  </button>
                </td>
              </tr>
            )}

            {filtered.map(j => {
              const desa = desaList.find(d => d.id === j.desaId);
              const armada = armadaList.find(a => a.id === j.armadaId);
              const statusCfg = STATUS_CONFIG[j.status];

              return (
                <tr key={j.id}>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>{j.tanggal}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <strong style={{ fontSize: '0.92rem' }}>{j.desaNama}</strong>
                      {desa?.namaKecamatan && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          (Kec. {desa.namaKecamatan})
                        </span>
                      )}
                      {desa?.cluster === 'kritis' && (
                        <span className="badge badge-critical" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                          KRITIS #{desa.rank || 1}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>{j.armadaPolisi}</div>
                    {armada && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Supir: {armada.supir}
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ color: 'var(--cyan-400)', fontWeight: 700, fontSize: '0.92rem' }}>
                      {j.jumlahAir.toLocaleString('id-ID')} L
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{j.sumberAirNama}</div>
                  </td>
                  <td>
                    <span 
                      className={`badge ${statusCfg.cls}`} 
                      style={{ 
                        background: statusCfg.bg, 
                        color: statusCfg.color, 
                        border: `1px solid ${statusCfg.color}40`,
                        fontWeight: 700 
                      }}
                    >
                      {statusCfg.label}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: 180, whiteSpace: 'normal' }}>
                    {j.catatan || '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      {/* Quick Status Select */}
                      <select
                        value={j.status}
                        onChange={e => {
                          const newStatus = e.target.value as JadwalDistribusi['status'];
                          updateJadwalStatus(j.id, newStatus);
                          showToast(`Status Desa ${j.desaNama} diubah ke "${STATUS_CONFIG[newStatus].label}"`);
                        }}
                        style={{ 
                          fontSize: '0.76rem', 
                          padding: '3px 6px', 
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-card)',
                          color: statusCfg.color,
                          borderColor: 'var(--border)',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                        title="Ubah status cepat"
                      >
                        <option value="terjadwal">Terjadwal</option>
                        <option value="dalam_perjalanan">Perjalanan</option>
                        <option value="selesai">Selesai</option>
                        <option value="batal">Batal</option>
                      </select>

                      {/* Detail View Button */}
                      <button 
                        className="btn btn-xs btn-secondary" 
                        onClick={() => setDetailTarget(j)} 
                        title="Lihat Detail Misi Distribusi"
                        style={{ padding: '4px 6px' }}
                      >
                        <Eye size={13} style={{ color: '#38bdf8' }} />
                      </button>

                      {/* Edit Button */}
                      <button 
                        className="btn btn-xs btn-secondary" 
                        onClick={() => handleOpenEdit(j)} 
                        title="Ubah / Edit Jadwal"
                        style={{ padding: '4px 6px' }}
                      >
                        <Edit2 size={13} style={{ color: '#fbbf24' }} />
                      </button>

                      {/* Delete Button */}
                      <button 
                        className="btn btn-xs btn-danger" 
                        onClick={() => setDeleteTarget(j)} 
                        title="Hapus Jadwal Ini"
                        style={{ padding: '4px 6px' }}
                      >
                        <Trash2 size={13} style={{ color: '#f87171' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ============================================================ */}
      {/* MODAL: CREATE / EDIT JADWAL DISTRIBUSI                      */}
      {/* ============================================================ */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 580 }}>
            <div className="modal-header">
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Truck size={18} style={{ color: 'var(--blue-400)' }} />
                <span>{modalMode === 'create' ? 'Buat Jadwal Distribusi Air Baru' : 'Ubah / Edit Jadwal Distribusi'}</span>
              </div>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowModal(false)}><X size={14} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Tombol Rekomendasi Otomatis SPK (Hanya saat create) */}
              {modalMode === 'create' && (
                <div style={{ marginBottom: 16 }}>
                  <button
                    type="button"
                    onClick={handleAutoFillTopsis}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px dashed #0284c7',
                      borderRadius: 'var(--radius-md)',
                      color: '#38bdf8',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    title="Otomatis pilih desa kritis prioritas tertinggi dari hasil perhitungan TOPSIS"
                  >
                    <Sparkles size={14} />
                    <span>Auto-Fill Rekomendasi SPK (TOPSIS Rank #1)</span>
                  </button>
                </div>
              )}

              <div className="grid-2">
                <div className="form-group">
                  <label>Tanggal Dropping *</label>
                  <input 
                    type="date" 
                    required 
                    value={form.tanggal} 
                    onChange={e => setForm(p => ({ ...p, tanggal: e.target.value }))} 
                  />
                </div>

                <div className="form-group">
                  <label>Status Distribusi *</label>
                  <select 
                    value={form.status} 
                    onChange={e => setForm(p => ({ ...p, status: e.target.value as JadwalDistribusi['status'] }))}
                  >
                    <option value="terjadwal">Terjadwal</option>
                    <option value="dalam_perjalanan">Dalam Perjalanan</option>
                    <option value="selesai">Selesai</option>
                    <option value="batal">Batal</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Desa Tujuan *</span>
                  {desaList.filter(d => d.cluster === 'kritis').length > 0 && (
                    <span className="badge badge-critical" style={{ fontSize: '0.62rem' }}>
                      Prioritaskan Zona Kritis
                    </span>
                  )}
                </label>
                <select 
                  required 
                  value={form.desaId} 
                  onChange={e => setForm(p => ({ ...p, desaId: e.target.value }))}
                >
                  <option value="">— Pilih Desa Sasaran —</option>
                  <optgroup label="Zona Kritis (Prioritas Tinggi)">
                    {desaList.filter(d => d.cluster === 'kritis').sort((a, b) => (a.rank || 999) - (b.rank || 999)).map(d => (
                      <option key={d.id} value={d.id}>
                        {d.namaDesa} – Kec. {d.namaKecamatan}{d.rank ? ` [TOPSIS #${d.rank}]` : ''} ({d.defisitAir.toLocaleString('id-ID')} L/hr)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Zona Waspada">
                    {desaList.filter(d => d.cluster === 'waspada').map(d => (
                      <option key={d.id} value={d.id}>
                        {d.namaDesa} – Kec. {d.namaKecamatan} ({d.defisitAir.toLocaleString('id-ID')} L/hr)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Zona Siaga">
                    {desaList.filter(d => d.cluster === 'siaga').map(d => (
                      <option key={d.id} value={d.id}>
                        {d.namaDesa} – Kec. {d.namaKecamatan}
                      </option>
                    ))}
                  </optgroup>
                  {desaList.filter(d => !d.cluster).length > 0 && (
                    <optgroup label="— Belum Dianalisis —">
                      {desaList.filter(d => !d.cluster).slice(0, 50).map(d => (
                        <option key={d.id} value={d.id}>
                          {d.namaDesa} – Kec. {d.namaKecamatan}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Armada Truk Tangki MDMC *</label>
                <select 
                  required 
                  value={form.armadaId} 
                  onChange={e => {
                    const selArmada = armadaList.find(a => a.id === e.target.value);
                    setForm(p => ({ 
                      ...p, 
                      armadaId: e.target.value,
                      jumlahAir: selArmada ? selArmada.kapasitas : p.jumlahAir 
                    }));
                  }}
                >
                  <option value="">— Pilih Armada Tangki —</option>
                  {armadaList.map(a => (
                    <option key={a.id} value={a.id} disabled={a.kondisi === 'rusak'}>
                      {a.nomorPolisi} — {a.kapasitas.toLocaleString('id-ID')} L — Supir: {a.supir} 
                      {a.statusToday === 'bertugas' ? ' [Sedang Bertugas]' : ''}
                      {a.kondisi === 'rusak' ? ' [Kondisi Rusak]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label>Volume Pasokan Air (Liter) *</label>
                  <input 
                    type="number" 
                    min="1000" 
                    max="30000" 
                    step="500" 
                    required 
                    value={form.jumlahAir} 
                    onChange={e => setForm(p => ({ ...p, jumlahAir: Number(e.target.value) }))} 
                  />
                </div>
                <div className="form-group">
                  <label>Sumber / Posko Pengambilan Air *</label>
                  <select 
                    required 
                    value={form.sumberAirId} 
                    onChange={e => setForm(p => ({ ...p, sumberAirId: e.target.value }))}
                  >
                    <option value="">— Pilih Titik Sumber —</option>
                    {sumberAirList.map(s => (
                      <option key={s.id} value={s.id} disabled={s.kondisi !== 'aktif'}>
                        {s.nama} ({s.jenis.replace('_', ' ')}) — {(s.stokSaat / 1000).toFixed(0)}K L stok
                        {s.kondisi !== 'aktif' ? ' [Non-aktif]' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Catatan Operasional / Instruksi Relawan</label>
                <textarea 
                  rows={2} 
                  value={form.catatan} 
                  onChange={e => setForm(p => ({ ...p, catatan: e.target.value }))} 
                  placeholder="Contoh: Titik kumpul di balai desa RT 02, utamakan faskes & lansia..." 
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
                >
                  <Truck size={16} /> 
                  <span>{modalMode === 'create' ? 'Simpan & Buat Jadwal' : 'Perbarui Jadwal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: DETAIL MISI DISTRIBUSI                               */}
      {/* ============================================================ */}
      {detailTarget && (() => {
        const desa = desaList.find(d => d.id === detailTarget.desaId);
        const armada = armadaList.find(a => a.id === detailTarget.armadaId);
        const sumber = sumberAirList.find(s => s.id === detailTarget.sumberAirId);
        const statusCfg = STATUS_CONFIG[detailTarget.status];

        return (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetailTarget(null)}>
            <div className="modal" style={{ maxWidth: 540 }}>
              <div className="modal-header">
                <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Eye size={18} style={{ color: '#38bdf8' }} />
                  Lembar Misi Distribusi Air
                </div>
                <button className="btn btn-sm btn-secondary" onClick={() => setDetailTarget(null)}><X size={14} /></button>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{detailTarget.desaNama}</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      Kecamatan {desa?.namaKecamatan || '—'}
                    </div>
                  </div>
                  <span 
                    className={`badge ${statusCfg.cls}`} 
                    style={{ 
                      background: statusCfg.bg, 
                      color: statusCfg.color, 
                      border: `1px solid ${statusCfg.color}40`,
                      fontWeight: 700,
                      fontSize: '0.8rem' 
                    }}
                  >
                    {statusCfg.label}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tanggal Operasi</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginTop: 2 }}>{detailTarget.tanggal}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Volume Air Bersih</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--cyan-400)', marginTop: 2 }}>
                      {detailTarget.jumlahAir.toLocaleString('id-ID')} Liter
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Armada &amp; Supir</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginTop: 2 }}>{detailTarget.armadaPolisi}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {armada?.supir} ({armada?.nomorHp || '—'})
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sumber Air Pasokan</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginTop: 2 }}>{detailTarget.sumberAirNama}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {sumber?.jenis.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {detailTarget.catatan && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: 14 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Catatan Operasional</div>
                    <div style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.4 }}>{detailTarget.catatan}</div>
                  </div>
                )}

                {desa && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${desa.lat},${desa.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                      style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      <Navigation size={14} />
                      <span>Navigasi Rute Google Maps</span>
                    </a>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => {
                        const target = detailTarget;
                        setDetailTarget(null);
                        handleOpenEdit(target);
                      }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      <Edit2 size={14} />
                      <span>Edit Jadwal</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ============================================================ */}
      {/* MODAL: DELETE CONFIRMATION                                  */}
      {/* ============================================================ */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div className="modal" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#f87171' }}>
                <AlertTriangle size={18} />
                Konfirmasi Hapus Jadwal
              </div>
              <button className="btn btn-sm btn-secondary" onClick={() => setDeleteTarget(null)}><X size={14} /></button>
            </div>
            <div style={{ padding: '8px 0 16px', fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              Apakah Anda yakin ingin menghapus jadwal dropping air berikut?
              <div style={{ 
                margin: '12px 0 0', 
                padding: '10px 14px', 
                background: 'rgba(239,68,68,0.08)', 
                border: '1px solid rgba(239,68,68,0.25)', 
                borderRadius: 'var(--radius-sm)' 
              }}>
                <div style={{ fontWeight: 700, color: '#ffffff' }}>Desa {deleteTarget.desaNama}</div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>
                  Tanggal: {deleteTarget.tanggal} &bull; Armada: {deleteTarget.armadaPolisi} &bull; Volume: {deleteTarget.jumlahAir.toLocaleString('id-ID')} L
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
                Batal
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleConfirmDelete}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
              >
                <Trash2 size={14} />
                <span>Ya, Hapus Jadwal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
