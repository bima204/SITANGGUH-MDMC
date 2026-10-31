// ============================================================
// TIRTA — Sidebar Component (Clean & Elegant with Lucide Icons)
// ============================================================
import React from 'react';
import type { PageType } from '../types';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  MapPin,
  Network,
  Sliders,
  Truck,
  Shield,
  Droplets,
  FileText,
  PanelLeftClose,
} from 'lucide-react';
import mdmcLogo from '../assets/image.png';

interface NavItem {
  id: PageType;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  section: string;
}


const SECTIONS = ['Utama', 'Data Wilayah', 'Kalkulasi Rekomendasi', 'Operasional Lapangan', 'Dokumen'];

export default function Sidebar() {
  const { activePage, setActivePage, musim, sidebarOpen, toggleSidebar } = useApp();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: musim === 'hujan' ? 'Pos Komando Hidrometri' : 'Pos Komando',
      icon: LayoutDashboard,
      section: 'Utama'
    },
    {
      id: 'peta',
      label: musim === 'hujan' ? 'Peta DAS & Lereng 3D' : 'Peta WebGIS 3D',
      icon: Compass,
      section: 'Utama'
    },
    {
      id: 'data-desa',
      label: musim === 'hujan' ? 'Data Desa & Kerawanan' : 'Data Desa Terdampak',
      icon: MapPin,
      section: 'Data Wilayah'
    },
    {
      id: 'kmeans',
      label: musim === 'hujan' ? '1. Zonasi Longsor & Banjir' : '1. Zonasi K-Means',
      icon: Network,
      section: 'Kalkulasi Rekomendasi'
    },
    {
      id: 'topsis',
      label: musim === 'hujan' ? '2. Prioritas Bencana TOPSIS' : '2. Rekomendasi TOPSIS',
      icon: Sliders,
      section: 'Kalkulasi Rekomendasi'
    },
    {
      id: 'distribusi',
      label: musim === 'hujan' ? 'Disposisi Tim Evakuasi' : 'Distribusi Logistik',
      icon: Truck,
      section: 'Operasional Lapangan'
    },
    {
      id: 'armada',
      label: musim === 'hujan' ? 'Armada & Tim SAR' : 'Armada Truk Tangki',
      icon: Shield,
      section: 'Operasional Lapangan'
    },
    {
      id: 'sumber-air',
      label: musim === 'hujan' ? 'Stasiun Hidrometri' : 'Titik Pasokan Air',
      icon: Droplets,
      section: 'Operasional Lapangan'
    },
    {
      id: 'laporan',
      label: 'Laporan & Disposisi',
      icon: FileText,
      section: 'Dokumen'
    },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-brand">
          <div 
            className="brand-icon" 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 'var(--radius-md)', 
              background: '#ffffff', 
              overflow: 'hidden', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: 3,
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.45)',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              flexShrink: 0
            }}
          >
            <img 
              src={mdmcLogo} 
              alt="Logo MDMC" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="brand-name">TIRTA-MDMC</div>
            <div className="brand-sub">
              {musim === 'hujan' ? 'Mitigasi Banjir & Longsor' : 'Rekomendasi Penerjunan'}
            </div>
          </div>
          <button
            className="sidebar-brand-btn"
            onClick={toggleSidebar}
            title="Tutup Sidebar (Ctrl + B)"
            aria-label="Tutup Sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {SECTIONS.map(section => {
          const items = navItems.filter(n => n.section === section);
          return (
            <div key={section}>
              <div className="nav-section-label">{section}</div>
              {items.map(item => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActivePage(item.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: '50%', 
            background: '#ffffff', 
            overflow: 'hidden', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: 2,
            border: '1.5px solid #10b981',
            boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
            flexShrink: 0 
          }}>
            <img src={mdmcLogo} alt="MDMC" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>MDMC Banjarnegara</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Posko Tanggap Darurat</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
