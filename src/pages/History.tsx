import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Filter, ArrowDownCircle, ArrowUpCircle, AlertTriangle, ClipboardList } from 'lucide-react';
import { MovementType } from '../types/domain';

const typeLabels: Record<MovementType, string> = {
  purchase_in: 'Ingreso',
  consumption: 'Consumo',
  waste: 'Merma',
  adjustment: 'Ajuste',
  count_adjustment: 'Ajuste conteo',
};

const typeColors: Record<MovementType, string> = {
  purchase_in: 'bg-emerald-100 text-emerald-700',
  consumption: 'bg-blue-100 text-blue-700',
  waste: 'bg-red-100 text-red-700',
  adjustment: 'bg-amber-100 text-amber-700',
  count_adjustment: 'bg-purple-100 text-purple-700',
};

const typeIcons: Record<MovementType, React.ReactNode> = {
  purchase_in: <ArrowDownCircle size={14} />,
  consumption: <ArrowUpCircle size={14} />,
  waste: <AlertTriangle size={14} />,
  adjustment: <ClipboardList size={14} />,
  count_adjustment: <ClipboardList size={14} />,
};

export default function HistoryPage() {
  const { state } = useApp();
  const [typeFilter, setTypeFilter] = useState<MovementType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = state.movements.filter(m => {
    if (typeFilter !== 'all' && m.movement_type !== typeFilter) return false;
    return true;
  });

  const getUser = (userId: string) => {
    const userNames: Record<string, string> = {
      u1: 'Doña Carmen',
      u2: 'Roberto Q.',
      u3: 'Miguel Á.',
      u4: 'Lucía M.',
    };
    return userNames[userId] || userId;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-warm-800">Historial</h2>
          <p className="text-sm text-warm-500">{state.movements.length} movimientos</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg ${showFilters ? 'bg-brand-100 text-brand-600' : 'bg-warm-100 text-warm-600'}`}
          aria-label="Filtros"
        >
          <Filter size={18} />
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {(['all', 'purchase_in', 'consumption', 'waste', 'adjustment', 'count_adjustment'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                typeFilter === t ? 'bg-brand-500 text-white' : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
              }`}
            >
              {t === 'all' ? 'Todos' : typeLabels[t]}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-warm-400 text-sm">
            No hay movimientos con este filtro
          </div>
        ) : (
          filtered.map(m => {
            const product = state.products.find(p => p.id === m.product_id);
            return (
              <div key={m.id} className="bg-white border border-warm-200 rounded-xl p-3">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[m.movement_type]}`}>
                    {typeIcons[m.movement_type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-warm-700 truncate">{product?.name || 'Producto'}</p>
                      <span className={`text-sm font-bold ${m.quantity > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {m.quantity > 0 ? '+' : ''}{m.quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${typeColors[m.movement_type]}`}>
                        {typeLabels[m.movement_type]}
                      </span>
                      <span className="text-[10px] text-warm-400">{m.reason}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-warm-400">
                        {getUser(m.user_id)} · {new Date(m.occurred_at).toLocaleDateString('es-PE')} {new Date(m.occurred_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[10px] text-warm-300 mt-0.5">
                      Entrada: {m.input_quantity} {m.input_unit}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
