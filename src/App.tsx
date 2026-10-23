import { AppProvider, useApp } from './store/AppContext';
import Layout from './components/Layout';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import StockPage from './pages/Stock';
import RegisterPage from './pages/Register';
import CountPage from './pages/Count';
import NeedsPage from './pages/Needs';
import PurchasesPage from './pages/Purchases';
import ReceivePage from './pages/Receive';
import CatalogPage from './pages/Catalog';
import HistoryPage from './pages/History';
import AlertsPage from './pages/Alerts';

const pageTitles: Record<string, string> = {
  login: 'Mi Inventario',
  dashboard: 'Inicio',
  stock: 'Stock',
  register: 'Registrar',
  count: 'Conteo',
  needs: 'Necesidades',
  purchases: 'Compras',
  receive: 'Recepción',
  catalog: 'Catálogo',
  history: 'Historial',
  alerts: 'Alertas',
};

function AppContent() {
  const { state } = useApp();

  if (state.currentPage === 'login' || !state.currentUser) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (state.currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'stock': return <StockPage />;
      case 'register': return <RegisterPage />;
      case 'count': return <CountPage />;
      case 'needs': return <NeedsPage />;
      case 'purchases': return <PurchasesPage />;
      case 'receive': return <ReceivePage />;
      case 'catalog': return <CatalogPage />;
      case 'history': return <HistoryPage />;
      case 'alerts': return <AlertsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <Layout title={pageTitles[state.currentPage] || 'Mi Inventario'}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
