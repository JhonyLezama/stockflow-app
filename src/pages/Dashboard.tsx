import { useApp } from '../store/AppContext';
import { AlertTriangle, TrendingDown, ShoppingCart, ClipboardCheck, Flame, ArrowRight } from 'lucide-react';
import { wasteByDay } from '../mock/data';

export default function DashboardPage() {
  const { state, dispatch } = useApp();
  const role = state.currentUser?.role;

  // Calculate metrics
  const lowStockProducts = state.stockBalances.filter(b => {
    const p = state.products.find(pr => pr.id === b.product_id);
    return p && b.quantity <= p.min_stock && b.quantity > 0;
  });
  const outOfStock = state.stockBalances.filter(b => {
    const p = state.products.find(pr => pr.id === b.product_id);
    return p && b.quantity === 0;
  });
  const openAlerts = state.alerts.filter(a => !a.read).length;
  const weekWaste = wasteByDay.reduce((sum, d) => sum + d.amount, 0);
  const pendingCounts = state.counts.filter(c => c.status === 'pending').length;

  // What to buy today
  const toBuy = state.products.filter(p => {
    const b = state.stockBalances.find(sb => sb.product_id === p.id);
    return b && b.quantity <= p.min_stock;
  }).slice(0, 5);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-warm-800">
          {role === 'owner' ? 'Buen día, Doña Carmen 👋' : `Hola, ${state.currentUser?.name}`}
        </h2>
        <p className="text-sm text-warm-500">Resumen del local</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'alerts' })}
          className="bg-white border border-warm-200 rounded-xl p-3 text-left hover:border-brand-300 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-amber-500" />
            <span className="text-xs text-warm-500 font-medium">Alertas</span>
          </div>
          <p className="text-2xl font-bold text-warm-800">{openAlerts}</p>
          <p className="text-[11px] text-warm-400">abiertas hoy</p>
        </button>

        <button
          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'stock' })}
          className="bg-white border border-warm-200 rounded-xl p-3 text-left hover:border-brand-300 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={16} className="text-red-500" />
            <span className="text-xs text-warm-500 font-medium">Stock bajo</span>
          </div>
          <p className="text-2xl font-bold text-warm-800">{lowStockProducts.length + outOfStock.length}</p>
          <p className="text-[11px] text-warm-400">{outOfStock.length} agotado(s)</p>
        </button>

        <div className="bg-white border border-warm-200 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={16} className="text-brand-500" />
            <span className="text-xs text-warm-500 font-medium">Mermas semana</span>
          </div>
          <p className="text-2xl font-bold text-warm-800">S/ {weekWaste.toFixed(0)}</p>
          <p className="text-[11px] text-warm-400">en pérdidas</p>
        </div>

        <button
          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'count' })}
          className="bg-white border border-warm-200 rounded-xl p-3 text-left hover:border-brand-300 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <ClipboardCheck size={16} className="text-emerald-500" />
            <span className="text-xs text-warm-500 font-medium">Conteos</span>
          </div>
          <p className="text-2xl font-bold text-warm-800">{pendingCounts}</p>
          <p className="text-[11px] text-warm-400">por aprobar</p>
        </button>
      </div>

      {/* Waste chart */}
      <div className="bg-white border border-warm-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-warm-700 mb-3">Mermas por día (S/)</h3>
        <div className="flex items-end gap-2 h-24">
          {wasteByDay.map((d, i) => {
            const max = Math.max(...wasteByDay.map(w => w.amount));
            const height = (d.amount / max) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-brand-200 rounded-t-md relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-warm-700 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    S/ {d.amount.toFixed(0)}
                  </div>
                </div>
                <span className="text-[10px] text-warm-500">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* What to buy today */}
      <div className="bg-white border border-warm-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-warm-700 flex items-center gap-2">
            <ShoppingCart size={16} className="text-brand-500" />
            Qué comprar hoy
          </h3>
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'purchases' })}
            className="text-xs text-brand-600 font-medium flex items-center gap-0.5"
          >
            Ver todo <ArrowRight size={12} />
          </button>
        </div>
        <div className="space-y-2">
          {toBuy.map(p => {
            const b = state.stockBalances.find(sb => sb.product_id === p.id);
            const qty = b?.quantity || 0;
            const isOut = qty === 0;
            return (
              <div key={p.id} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isOut ? 'bg-red-500' : 'bg-amber-400'}`} />
                  <span className="text-sm text-warm-700">{p.name}</span>
                </div>
                <span className={`text-xs font-medium ${isOut ? 'text-red-600' : 'text-amber-600'}`}>
                  {qty} {p.base_unit} / mín. {p.min_stock}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions for kitchen */}
      {role === 'kitchen' && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'register' })}
            className="bg-brand-500 text-white rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-brand-600 transition-colors active:scale-95"
          >
            <Flame size={24} />
            <span className="text-sm font-semibold">Registrar merma</span>
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'needs' })}
            className="bg-amber-500 text-white rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-amber-600 transition-colors active:scale-95"
          >
            <AlertTriangle size={24} />
            <span className="text-sm font-semibold">Me falta algo</span>
          </button>
        </div>
      )}

      {/* Reset demo */}
      {role === 'owner' && (
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="w-full text-center text-xs text-warm-400 hover:text-warm-600 py-2"
        >
          Reiniciar demo
        </button>
      )}
    </div>
  );
}
