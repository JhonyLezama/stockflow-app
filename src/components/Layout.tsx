import { ReactNode } from 'react';
import { useApp } from '../store/AppContext';
import { Page, Role } from '../types/domain';
import {
  LayoutDashboard, Package, AlertTriangle, ClipboardList,
  ShoppingCart, Truck, BookOpen, History, Bell, LogOut,
  PlusCircle, ClipboardCheck, Flame
} from 'lucide-react';

interface NavItem {
  page: Page;
  label: string;
  icon: ReactNode;
}

const navByRole: Record<Role, NavItem[]> = {
  owner: [
    { page: 'dashboard', label: 'Inicio', icon: <LayoutDashboard size={22} /> },
    { page: 'stock', label: 'Stock', icon: <Package size={22} /> },
    { page: 'alerts', label: 'Alertas', icon: <Bell size={22} /> },
    { page: 'purchases', label: 'Compras', icon: <ShoppingCart size={22} /> },
    { page: 'receive', label: 'Recepción', icon: <Truck size={22} /> },
    { page: 'catalog', label: 'Catálogo', icon: <BookOpen size={22} /> },
    { page: 'history', label: 'Historial', icon: <History size={22} /> },
    { page: 'count', label: 'Conteo', icon: <ClipboardCheck size={22} /> },
  ],
  kitchen: [
    { page: 'dashboard', label: 'Inicio', icon: <LayoutDashboard size={22} /> },
    { page: 'register', label: 'Registrar', icon: <Flame size={22} /> },
    { page: 'needs', label: 'Necesidades', icon: <PlusCircle size={22} /> },
    { page: 'count', label: 'Conteo cierre', icon: <ClipboardCheck size={22} /> },
    { page: 'stock', label: 'Stock', icon: <Package size={22} /> },
  ],
  warehouse: [
    { page: 'dashboard', label: 'Inicio', icon: <LayoutDashboard size={22} /> },
    { page: 'receive', label: 'Recepción', icon: <Truck size={22} /> },
    { page: 'stock', label: 'Stock', icon: <Package size={22} /> },
    { page: 'purchases', label: 'Compras', icon: <ShoppingCart size={22} /> },
    { page: 'catalog', label: 'Catálogo', icon: <BookOpen size={22} /> },
    { page: 'history', label: 'Historial', icon: <History size={22} /> },
  ],
  service: [
    { page: 'dashboard', label: 'Inicio', icon: <LayoutDashboard size={22} /> },
    { page: 'stock', label: 'Stock', icon: <Package size={22} /> },
    { page: 'needs', label: 'Avisar', icon: <AlertTriangle size={22} /> },
  ],
};

export default function Layout({ children, title }: { children: ReactNode; title: string }) {
  const { state, dispatch } = useApp();
  const nav = state.currentUser ? navByRole[state.currentUser.role] : [];
  const unreadAlerts = state.alerts.filter(a => !a.read).length;

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col">
      {/* Demo banner */}
      <div className="bg-brand-100 text-brand-800 text-xs text-center py-1 font-medium">
        Demo con datos de ejemplo
      </div>

      {/* Header */}
      <header className="bg-white border-b border-warm-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <Flame size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-warm-800 leading-tight">{title}</h1>
            <p className="text-[10px] text-warm-500">Pollería Don Tito - Trujillo</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {state.currentUser && (
            <>
              <button
                onClick={() => dispatch({ type: 'SET_PAGE', payload: 'alerts' })}
                className="relative p-2 rounded-lg hover:bg-warm-100"
                aria-label="Alertas"
              >
                <Bell size={20} className="text-warm-600" />
                {unreadAlerts > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {unreadAlerts}
                  </span>
                )}
              </button>
              <button
                onClick={() => dispatch({ type: 'LOGOUT' })}
                className="p-2 rounded-lg hover:bg-warm-100"
                aria-label="Salir"
              >
                <LogOut size={18} className="text-warm-500" />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20 lg:pb-4 lg:pl-56">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {children}
        </div>
      </main>

      {/* Bottom navigation (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-warm-200 z-40 lg:hidden">
        <div className="flex justify-around items-center py-1">
          {nav.slice(0, 5).map(item => (
            <button
              key={item.page}
              onClick={() => dispatch({ type: 'SET_PAGE', payload: item.page })}
              className={`flex flex-col items-center py-2 px-2 rounded-lg min-w-[56px] transition-colors ${
                state.currentPage === item.page
                  ? 'text-brand-600'
                  : 'text-warm-400 hover:text-warm-600'
              }`}
              aria-label={item.label}
              aria-current={state.currentPage === item.page ? 'page' : undefined}
            >
              {item.icon}
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Sidebar navigation (desktop) */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-warm-200 flex-col z-30 pt-20">
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(item => (
            <button
              key={item.page}
              onClick={() => dispatch({ type: 'SET_PAGE', payload: item.page })}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                state.currentPage === item.page
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-warm-600 hover:bg-warm-100 hover:text-warm-800'
              }`}
            >
              {item.icon}
              {item.label}
              {item.page === 'alerts' && unreadAlerts > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {unreadAlerts}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-warm-200">
          <p className="text-xs text-warm-500">
            Sesión: <span className="font-medium text-warm-700">{state.currentUser?.name}</span>
          </p>
          <p className="text-[10px] text-warm-400 capitalize">
            Rol: {state.currentUser?.role === 'owner' ? 'Dueña' : state.currentUser?.role === 'kitchen' ? 'Cocina' : state.currentUser?.role === 'warehouse' ? 'Almacén' : 'Atención'}
          </p>
        </div>
      </aside>

      {/* Toast */}
      {state.toast && (
        <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 bg-warm-800 text-white px-4 py-3 rounded-xl shadow-lg z-50 text-sm font-medium animate-bounce">
          {state.toast}
        </div>
      )}
    </div>
  );
}
