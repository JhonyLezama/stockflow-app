import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Plus, AlertTriangle, Check, X } from 'lucide-react';

export default function NeedsPage() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');
  const [productId, setProductId] = useState<string>('');
  const [priority, setPriority] = useState<'urgent' | 'normal'>('normal');

  const handleSubmit = () => {
    if (!description.trim()) return;
    dispatch({
      type: 'ADD_NEED',
      payload: {
        id: `n_${Date.now()}`,
        product_id: productId || undefined,
        description: description.trim(),
        priority,
        status: 'open',
        user_id: state.currentUser?.id || 'u2',
        created_at: new Date().toISOString(),
      },
    });
    setDescription('');
    setProductId('');
    setPriority('normal');
    setShowForm(false);
    dispatch({ type: 'SET_TOAST', payload: '✓ Necesidad registrada' });
    setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 2500);
  };

  const handleDismiss = (id: string) => {
    dispatch({ type: 'UPDATE_NEED_STATUS', payload: { id, status: 'dismissed' } });
  };

  const handleResolve = (id: string) => {
    dispatch({ type: 'UPDATE_NEED_STATUS', payload: { id, status: 'resolved' } });
  };

  const openNeeds = state.needs.filter(n => n.status === 'open' || n.status === 'in_purchase');
  const closedNeeds = state.needs.filter(n => n.status === 'resolved' || n.status === 'dismissed');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-warm-800">Necesidades</h2>
          <p className="text-sm text-warm-500">Avisa lo que falta</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 hover:bg-brand-600 active:scale-95 transition-all"
        >
          <Plus size={16} /> Me falta algo
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-brand-200 rounded-xl p-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-warm-600 mb-1 block">Producto (opcional)</label>
            <select
              value={productId}
              onChange={e => setProductId(e.target.value)}
              className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            >
              <option value="">-- Texto libre --</option>
              {state.products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-warm-600 mb-1 block">¿Qué necesitas?</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ej: Faltan tápers para llevar..."
              className="w-full px-3 py-2.5 border border-warm-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              aria-label="Descripción de necesidad"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-warm-600 mb-1 block">Prioridad</label>
            <div className="flex gap-2">
              <button
                onClick={() => setPriority('normal')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  priority === 'normal' ? 'bg-warm-200 text-warm-700' : 'bg-warm-50 text-warm-500 border border-warm-200'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setPriority('urgent')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  priority === 'urgent' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-warm-50 text-warm-500 border border-warm-200'
                }`}
              >
                🔴 Urgente
              </button>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSubmit}
              disabled={!description.trim()}
              className="flex-1 bg-brand-500 text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-brand-600 active:scale-95 transition-all"
            >
              Enviar aviso
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 bg-warm-100 text-warm-600 rounded-lg text-sm font-medium hover:bg-warm-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Open needs */}
      {openNeeds.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-warm-500 uppercase tracking-wide">Abiertas</h3>
          {openNeeds.map(need => {
            const product = need.product_id ? state.products.find(p => p.id === need.product_id) : null;
            return (
              <div
                key={need.id}
                className={`bg-white border rounded-xl p-3 flex items-start gap-3 ${
                  need.priority === 'urgent' ? 'border-red-200' : 'border-warm-200'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  need.priority === 'urgent' ? 'bg-red-500' : 'bg-amber-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-warm-700">{need.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {product && <span className="text-[10px] text-warm-400">{product.name}</span>}
                    <span className="text-[10px] text-warm-400">
                      {new Date(need.created_at).toLocaleDateString('es-PE')}
                    </span>
                    {need.status === 'in_purchase' && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">En compra</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleResolve(need.id)}
                    className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"
                    aria-label="Resolver"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => handleDismiss(need.id)}
                    className="p-1.5 rounded-lg hover:bg-warm-100 text-warm-400"
                    aria-label="Descartar"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Closed needs */}
      {closedNeeds.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-warm-500 uppercase tracking-wide">Resueltas</h3>
          {closedNeeds.slice(0, 3).map(need => (
            <div key={need.id} className="bg-warm-50 border border-warm-100 rounded-xl p-3 opacity-60">
              <p className="text-sm text-warm-500 line-through">{need.description}</p>
              <span className="text-[10px] text-warm-400">
                {need.status === 'resolved' ? '✓ Resuelto' : '✕ Descartado'}
              </span>
            </div>
          ))}
        </div>
      )}

      {state.needs.length === 0 && (
        <div className="text-center py-8 text-warm-400 text-sm">
          No hay necesidades registradas
        </div>
      )}
    </div>
  );
}
