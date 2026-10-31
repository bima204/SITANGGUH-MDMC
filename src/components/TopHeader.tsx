// ============================================================
// TIRTA — Top Header Component (Clean & Elegant)
// ============================================================
import { useApp } from '../context/AppContext';
import { Sun, CloudRain, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const PAGE_META: Record<string, { title: string; sub: string }> = {
  dashboard:   { title: 'Pos Komando Rekomendasi Penerjunan', sub: 'Pusat Pengambilan Keputusan Alokasi Logistik MDMC Pusat' },
  peta:        { title: 'Peta WebGIS 3D Spasial', sub: 'Pemantauan spasial 3D elevasi topografi Kabupaten Banjarnegara' },
  'data-desa': { title: 'Database 266 Desa Kabupaten Banjarnegara', sub: 'Data komprehensif 266 desa di 20 kecamatan berbasis BPS & BPBD Banjarnegara' },
  kmeans:      { title: '1. Zonasi Kerawanan K-Means', sub: 'Perhitungan matematis Jarak Euclidean & pembagian zona kerawanan' },
  topsis:      { title: '2. Sistem Rekomendasi Prioritas TOPSIS', sub: 'Kalkulasi solusi ideal & penetapan urutan penerjunan armada tangki' },
  distribusi:  { title: 'Jadwal Distribusi & Operasional', sub: 'Disposisi penugasan armada truk tangki ke desa prioritas' },
  armada:      { title: 'Manajemen Armada Truk Tangki', sub: 'Kesiapan armada tangki MDMC, BPBD, dan PMI Banjarnegara' },
  'sumber-air':{ title: 'Titik Pasokan & Sumber Air Bersih', sub: 'Monitoring kapasitas dan ketersediaan sumur bor, PDAM, dan mata air' },
  laporan:     { title: 'Laporan Disposisi & Manifes Penerjunan', sub: 'Cetak surat perintah tugas & berita acara serah terima air' },
};

export default function TopHeader() {
  const { activePage, musim, setMusim, sidebarOpen, toggleSidebar } = useApp();
  const meta = PAGE_META[activePage] || { title: 'TIRTA', sub: '' };
  const now = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          id="btn-toggle-sidebar"
          onClick={toggleSidebar}
          title={sidebarOpen ? "Sembunyikan Sidebar (Ctrl + B)" : "Tampilkan Sidebar (Ctrl + B)"}
          className="sidebar-toggle-btn"
          aria-label={sidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
        >
          {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          <span className="kbd-shortcut-hint">Ctrl+B</span>
        </button>
        <div className="header-titles">
          <div className="header-title">{meta.title}</div>
          <div className="header-breadcrumb">{meta.sub}</div>
        </div>
      </div>
      <div className="header-right">
        {/* Season Mode Switcher (Kemarau vs Musim Hujan) */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: 8, border: '1px solid var(--border)' }}>
          <button
            id="btn-musim-kemarau"
            className={`btn btn-xs ${musim === 'kemarau' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMusim('kemarau')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 6,
              ...(musim === 'kemarau' ? { background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: '#ffffff', borderColor: '#fbbf24' } : {})
            }}
            title="Mode Kemarau: Analisis Kekeringan & Defisit Air Bersih"
          >
            <Sun size={13} color={musim === 'kemarau' ? '#ffffff' : '#fbbf24'} />
            <span>Kemarau</span>
          </button>

          <button
            id="btn-musim-hujan"
            className={`btn btn-xs ${musim === 'hujan' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setMusim('hujan')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 6,
              ...(musim === 'hujan' ? { background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: '#ffffff', borderColor: '#38bdf8', boxShadow: '0 0 10px rgba(14,165,233,0.5)' } : {})
            }}
            title="Mode Hujan: Monitoring Debit Air & Tinggi Muka Air (TMA) Sungai Banjarnegara"
          >
            <CloudRain size={13} color={musim === 'hujan' ? '#ffffff' : '#38bdf8'} />
            <span>Musim Hujan (Debit Air)</span>
          </button>
        </div>

        <div className="header-status">
          <div className="status-dot" style={{ background: musim === 'hujan' ? '#38bdf8' : 'var(--safe)', boxShadow: musim === 'hujan' ? '0 0 8px #38bdf8' : '0 0 8px var(--safe)' }} />
          {musim === 'hujan' ? 'Monitoring Debit Air DAS' : 'Sistem Rekomendasi Aktif'}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
          <span>{now}</span>
        </div>
      </div>
    </header>
  );
}
