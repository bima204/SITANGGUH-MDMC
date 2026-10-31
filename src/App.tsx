// ============================================================
// TIRTA — Root App Component
// ============================================================
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Dashboard from './pages/Dashboard';
import PetaWebGIS from './pages/PetaWebGIS';
import DataDesa from './pages/DataDesa';
import KMeansPage from './pages/KMeansPage';
import TopsisPage from './pages/TopsisPage';
import DistribusiPage from './pages/DistribusiPage';
import ArmadaPage from './pages/ArmadaPage';
import SumberAirPage from './pages/SumberAirPage';
import LaporanPage from './pages/LaporanPage';

function PageRouter() {
  const { activePage } = useApp();
  switch (activePage) {
    case 'dashboard':   return <Dashboard />;
    case 'peta':        return <PetaWebGIS />;
    case 'data-desa':   return <DataDesa />;
    case 'kmeans':      return <KMeansPage />;
    case 'topsis':      return <TopsisPage />;
    case 'distribusi':  return <DistribusiPage />;
    case 'armada':      return <ArmadaPage />;
    case 'sumber-air':  return <SumberAirPage />;
    case 'laporan':     return <LaporanPage />;
    default:            return <Dashboard />;
  }
}

function MainLayout() {
  const { sidebarOpen } = useApp();
  return (
    <div className={`app-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar />
      <div className={`main-content ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <TopHeader />
        <main className="page-body">
          <PageRouter />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
