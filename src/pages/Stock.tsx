import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Search, Filter } from 'lucide-react';

type StockFilter = 'all' | 'low' | 'out';
type CategoryFilter = 'all' | string;

function formatQty(qty: number, unit: string): string {
  if (unit === 'pollo') {
    const whole = Math.floor(qty);
    const remainder = qty - whole;
    if (remainder === 0) return `${whole} pollo${whole !== 1 ? 's' : ''}`;
    const quarters = Math.floor(remainder / 0.25);
    const eighths = Math.round((remainder - quarters * 0.25) / 0.125);
    let parts = [];
    if (whole > 0) parts.push(`${whole} pollo${whole !== 1 ? 's' : ''}`);
    if (quarters > 0) parts.push(`${quarters} cuarto${quarters !== 1 ? 's' : ''}`);
    if (eighths > 0) parts.push(`${eighths} octavo${eighths !== 1 ? 's' : ''}`);
    return parts.join(' y ');
  }
  if (qty % 1 === 0) return `${qty} ${unit}${qty !== 1 && unit !== 'litro' ? 's' : ''}`;
  return `${qty.toFixed(1)} ${unit}`;
}

export default function StockPage() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [catFilter, setCatFilter] = useState<CategoryFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', ...new Set(state.products.map(p => p.category))];

  const filtered = state.products.filter(p => {
    const balance = state.stockBalances.find(b => b.product_id === p.id);
    const qty = balance?.quantity || 0;
    const isLow = qty <= p.min_stock && qty > 0;
    const isOut = qty === 0;

    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter !== 'all' && p.category !== catFilter) return false;
    if (stockFilter === 'low' && !isLow) return false;
    if (stockFilter === 'out' && !isOut) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-warm-800">Stock actual</h2>
        <p className="text-sm text-warm-500">{state.products.length} productos</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full pl-10 pr-10 py-3 bg-white border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-300"
          aria-label="Buscar producto"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg ${showFilters ? 'bg-brand-100 text-brand-600' : 'text-warm-400 hover:text-warm-600'}`}
          aria-label="Filtros"
        >
          <Filter size={18} />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border border-warm-200 rounded-xl p-3 space-y-3">
          <div>
            <label className="text-xs font-medium text-warm-600 mb-1.5 block">Estado</label>
            <div className="flex gap-2">
              {([['all', 'Todos'], ['low', 'Bajo mínimo'], ['out', 'Agotado']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setStockFilter(val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    stockFilter === val ? 'bg-brand-500 text-white' : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-warm-600 mb-1.5 block">Categoría</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCatFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    catFilter === cat ? 'bg-brand-500 text-white' : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                  }`}
                >
                  {cat === 'all' ? 'Todas' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stock list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-warm-400 text-sm">
            No se encontraron productos
          </div>
        ) : (
          filtered.map(p => {
            const balance = state.stockBalances.find(b => b.product_id === p.id);
            const qty = balance?.quantity || 0;
            const isOut = qty === 0;
            const isLow = qty <= p.min_stock && qty > 0;
            return (
              <div
                key={p.id}
                className={`bg-white border rounded-xl p-3 flex items-center justify-between ${
                  isOut ? 'border-red-200 bg-red-50' : isLow ? 'border-amber-200 bg-amber-50' : 'border-warm-200'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-warm-800 truncate">{p.name}</p>
                  <p className="text-xs text-warm-500">{p.category}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className={`text-sm font-bold ${isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-warm-800'}`}>
                    {formatQty(qty, p.base_unit)}
                  </p>
                  <p className="text-[10px] text-warm-400">
                    {isOut ? 'AGOTADO' : isLow ? 'bajo mínimo' : `mín. ${p.min_stock} ${p.base_unit}`}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
