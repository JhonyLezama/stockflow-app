import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Search, ChevronRight, ArrowLeft } from 'lucide-react';

export default function CatalogPage() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = state.products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = state.products.find(p => p.id === selectedId);
  const selectedBalance = state.stockBalances.find(b => b.product_id === selectedId);
  const selectedSupplier = selected?.supplier_id ? state.suppliers.find(s => s.id === selected.supplier_id) : null;

  if (selected) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedId(null)}
          className="flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700"
        >
          <ArrowLeft size={16} /> Volver al catálogo
        </button>

        <div className="bg-white border border-warm-200 rounded-xl p-4 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-warm-800">{selected.name}</h2>
            <p className="text-sm text-warm-500">{selected.category}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-warm-50 rounded-lg p-3">
              <p className="text-[10px] text-warm-500 uppercase">Stock actual</p>
              <p className="text-lg font-bold text-warm-800">
                {selectedBalance?.quantity || 0} <span className="text-sm font-normal">{selected.base_unit}</span>
              </p>
            </div>
            <div className="bg-warm-50 rounded-lg p-3">
              <p className="text-[10px] text-warm-500 uppercase">Stock mínimo</p>
              <p className="text-lg font-bold text-warm-800">
                {selected.min_stock} <span className="text-sm font-normal">{selected.base_unit}</span>
              </p>
            </div>
            <div className="bg-warm-50 rounded-lg p-3">
              <p className="text-[10px] text-warm-500 uppercase">Último costo</p>
              <p className="text-lg font-bold text-warm-800">S/ {selected.last_cost.toFixed(2)}</p>
            </div>
            <div className="bg-warm-50 rounded-lg p-3">
              <p className="text-[10px] text-warm-500 uppercase">Perecible</p>
              <p className="text-lg font-bold text-warm-800">
                {selected.is_perishable ? 'Sí' : 'No'}
              </p>
            </div>
          </div>

          {/* Conversions */}
          <div>
            <h3 className="text-sm font-semibold text-warm-700 mb-2">Conversiones</h3>
            <div className="bg-warm-50 rounded-lg p-3 space-y-1.5">
              {selected.conversions.map(c => (
                <div key={c.unit} className="flex items-center justify-between text-sm">
                  <span className="text-warm-600">1 {c.unit}</span>
                  <span className="text-warm-800 font-medium">
                    = {c.factor_to_base} {selected.base_unit}{c.factor_to_base !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
              {selected.id === 'p1' && (
                <div className="border-t border-warm-200 pt-2 mt-2">
                  <p className="text-xs text-warm-500">Ejemplo: 1 pollo = 4 cuartos = 8 octavos</p>
                </div>
              )}
            </div>
          </div>

          {/* Supplier */}
          {selectedSupplier && (
            <div>
              <h3 className="text-sm font-semibold text-warm-700 mb-2">Proveedor</h3>
              <div className="bg-warm-50 rounded-lg p-3">
                <p className="text-sm font-medium text-warm-700">{selectedSupplier.name}</p>
                <p className="text-xs text-warm-500">Contacto: {selectedSupplier.contact}</p>
                <p className="text-xs text-warm-500">Tel: {selectedSupplier.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-warm-800">Catálogo de productos</h2>
        <p className="text-sm text-warm-500">{state.products.length} productos registrados</p>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          aria-label="Buscar en catálogo"
        />
      </div>

      <div className="space-y-1.5">
        {filtered.map(p => {
          const balance = state.stockBalances.find(b => b.product_id === p.id);
          const qty = balance?.quantity || 0;
          const isOut = qty === 0;
          const isLow = qty <= p.min_stock && qty > 0;

          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`w-full bg-white border rounded-xl p-3 flex items-center justify-between hover:border-brand-300 active:scale-[0.99] transition-all ${
                isOut ? 'border-red-200' : isLow ? 'border-amber-200' : 'border-warm-200'
              }`}
            >
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-warm-700">{p.name}</p>
                <p className="text-[10px] text-warm-400">{p.category} · {p.base_unit}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-warm-500'}`}>
                  {qty} {p.base_unit}
                </span>
                <ChevronRight size={16} className="text-warm-300" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
