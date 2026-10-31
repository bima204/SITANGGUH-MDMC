// ============================================================
// TIRTA — Global App Context (State Management)
// ============================================================
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Desa, Armada, SumberAir, JadwalDistribusi, TopsisBobot, PageType, TopsisResult, MusimType, PosDugaAir, RumahSakit } from '../types';
import type { KMeansOutput } from '../algorithms/kmeans';
import { SAMPLE_DESA, SAMPLE_ARMADA, SAMPLE_SUMBER_AIR, SAMPLE_JADWAL, DEFAULT_BOBOT, SAMPLE_POS_DUGA_AIR, SAMPLE_RUMAH_SAKIT } from '../data/sampleData';

import { runKMeans } from '../algorithms/kmeans';
import { runTopsis, applyTopsisRankToDesa } from '../algorithms/topsis';

interface AppState {
  // Navigation & Musim
  activePage: PageType;
  setActivePage: (p: PageType) => void;
  musim: MusimType;
  setMusim: (newMusim: MusimType) => void;
  // Sidebar state & shortcut Ctrl+B
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  // Data
  desaList: Desa[];
  setDesaList: React.Dispatch<React.SetStateAction<Desa[]>>;
  posDugaAirList: PosDugaAir[];
  setPosDugaAirList: React.Dispatch<React.SetStateAction<PosDugaAir[]>>;
  armadaList: Armada[];
  setArmadaList: React.Dispatch<React.SetStateAction<Armada[]>>;
  sumberAirList: SumberAir[];
  setSumberAirList: React.Dispatch<React.SetStateAction<SumberAir[]>>;
  rumahSakitList: RumahSakit[];
  setRumahSakitList: React.Dispatch<React.SetStateAction<RumahSakit[]>>;
  jadwalList: JadwalDistribusi[];
  setJadwalList: React.Dispatch<React.SetStateAction<JadwalDistribusi[]>>;
  // Algorithm state
  kmeansResult: KMeansOutput | null;
  setKmeansResult: React.Dispatch<React.SetStateAction<KMeansOutput | null>>;
  topsisResults: TopsisResult[];
  setTopsisResults: React.Dispatch<React.SetStateAction<TopsisResult[]>>;
  bobot: TopsisBobot;
  setBobot: React.Dispatch<React.SetStateAction<TopsisBobot>>;
  isAnalyzed: boolean;
  isAnalyzing: boolean;
  lastAnalyzedAt: Date | null;
  runAutomatedAnalysis: (
    customBobot?: TopsisBobot,
    customK?: number,
    customMaxIter?: number
  ) => { kmeans: KMeansOutput; topsis: TopsisResult[]; desa: Desa[] };
  resetAnalysis: () => void;
  // Helpers
  addDesa: (d: Desa) => void;
  updateDesa: (d: Desa) => void;
  deleteDesa: (id: string) => void;
  addJadwal: (j: JadwalDistribusi) => void;
  updateJadwal: (j: JadwalDistribusi) => void;
  deleteJadwal: (id: string) => void;
  updateJadwalStatus: (id: string, status: JadwalDistribusi['status']) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Masuk sistem langsung menampilkan peta WebGIS
  const [activePage, setActivePage] = useState<PageType>('peta');
  // Sidebar open/close state (Toggleable with Ctrl + B)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  // Mode Musim: Kemarau (Kekeringan) vs Hujan (Debit Air & TMA)
  const [musim, setMusim] = useState<MusimType>('kemarau');
  // Data awal mentah 266 desa Banjarnegara tanpa klaster/skor
  const [desaList, setDesaList] = useState<Desa[]>(SAMPLE_DESA);
  const [posDugaAirList, setPosDugaAirList] = useState<PosDugaAir[]>(SAMPLE_POS_DUGA_AIR);
  const [armadaList, setArmadaList] = useState<Armada[]>(SAMPLE_ARMADA);
  const [sumberAirList, setSumberAirList] = useState<SumberAir[]>(SAMPLE_SUMBER_AIR);
  const [rumahSakitList, setRumahSakitList] = useState<RumahSakit[]>(SAMPLE_RUMAH_SAKIT);
  const [jadwalList, setJadwalList] = useState<JadwalDistribusi[]>(SAMPLE_JADWAL);
  const [kmeansResult, setKmeansResult] = useState<KMeansOutput | null>(null);
  const [topsisResults, setTopsisResults] = useState<TopsisResult[]>([]);
  const [bobot, setBobot] = useState<TopsisBobot>(DEFAULT_BOBOT);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<Date | null>(null);

  const isAnalyzed = Boolean(kmeansResult && topsisResults.length > 0);

  // Otomatisasi Mesin SPK: K-Means Clustering + TOPSIS Ranking (Dual-Mode: Kemarau & Hujan)
  const runAutomatedAnalysis = useCallback((
    customBobot?: TopsisBobot,
    customK = 3,
    customMaxIter = 100,
    targetMusim?: MusimType
  ) => {
    setIsAnalyzing(true);
    const activeMusim = targetMusim || musim;
    const targetBobot = customBobot || bobot;

    // Bersihkan data klaster sebelumnya jika ada, agar kalkulasi selalu segar dari data terkini
    const cleanDesa: Desa[] = desaList.map(d => {
      const { cluster, topsisScore, rank, ...rest } = d;
      return rest as Desa;
    });

    // Fase 1: Jalankan K-Means Clustering K=3 sesuai mode musim
    const kmResult = runKMeans(cleanDesa, customK, customMaxIter, activeMusim);

    // Fase 2: Jalankan TOPSIS pada seluruh desa hasil klaster kritis sesuai mode musim
    const topsisResult = runTopsis(kmResult.desaWithCluster, targetBobot, activeMusim);

    // Fase 3: Terapkan ranking dan skor preferensi TOPSIS ke objek desa
    const finalDesa = applyTopsisRankToDesa(kmResult.desaWithCluster, topsisResult);

    setKmeansResult(kmResult);
    setTopsisResults(topsisResult);
    setDesaList(finalDesa);
    const now = new Date();
    setLastAnalyzedAt(now);
    setIsAnalyzing(false);

    return { kmeans: kmResult, topsis: topsisResult, desa: finalDesa };
  }, [bobot, desaList, musim]);

  // Handler pengalihan musim terintegrasi
  const handleSetMusim = useCallback((newMusim: MusimType) => {
    setMusim(newMusim);
    // Jika data sudah dianalisa sebelumnya, lakukan analisa ulang otomatis untuk mode musim baru
    if (isAnalyzed) {
      setTimeout(() => {
        runAutomatedAnalysis(undefined, 3, 100, newMusim);
      }, 50);
    }
  }, [isAnalyzed, runAutomatedAnalysis]);

  // Reset kembali ke status belum dianalisis
  const resetAnalysis = useCallback(() => {
    setDesaList(SAMPLE_DESA);
    setKmeansResult(null);
    setTopsisResults([]);
    setLastAnalyzedAt(null);
  }, []);

  const addDesa = useCallback((d: Desa) => setDesaList(prev => [...prev, d]), []);
  const updateDesa = useCallback((d: Desa) =>
    setDesaList(prev => prev.map(x => x.id === d.id ? d : x)), []);
  const deleteDesa = useCallback((id: string) =>
    setDesaList(prev => prev.filter(d => d.id !== id)), []);
  const addJadwal = useCallback((j: JadwalDistribusi) =>
    setJadwalList(prev => [...prev, j]), []);
  const updateJadwal = useCallback((j: JadwalDistribusi) =>
    setJadwalList(prev => prev.map(x => x.id === j.id ? j : x)), []);
  const deleteJadwal = useCallback((id: string) =>
    setJadwalList(prev => prev.filter(j => j.id !== id)), []);
  const updateJadwalStatus = useCallback((id: string, status: JadwalDistribusi['status']) =>
    setJadwalList(prev => prev.map(j => j.id === id ? { ...j, status } : j)), []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
    // Trigger window resize event after animation finishes so MapLibre & Recharts adapt instantly
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 280);
  }, []);

  // Global Keyboard Shortcut: Ctrl + B / Cmd + B untuk Buka/Tutup Sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  return (
    <AppContext.Provider value={{
      activePage, setActivePage,
      musim, setMusim: handleSetMusim,
      sidebarOpen, setSidebarOpen, toggleSidebar,
      desaList, setDesaList,
      posDugaAirList, setPosDugaAirList,
      armadaList, setArmadaList,
      sumberAirList, setSumberAirList,
      rumahSakitList, setRumahSakitList,
      jadwalList, setJadwalList,
      kmeansResult, setKmeansResult,
      topsisResults, setTopsisResults,
      bobot, setBobot,
      isAnalyzed, isAnalyzing, lastAnalyzedAt,
      runAutomatedAnalysis, resetAnalysis,
      addDesa, updateDesa, deleteDesa,
      addJadwal, updateJadwal, deleteJadwal, updateJadwalStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
