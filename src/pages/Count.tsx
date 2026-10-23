import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Check, X, AlertTriangle } from 'lucide-react';

export default function CountPage() {
  const { state, dispatch } = useApp();
  const role = state.currentUser?.role;
  const [countValues, setCountValues] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  // Products to count (top items)
  const countProducts = state.products.filter(p =>
    ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p12', 'p13', 'p21'].includes(p.id)
  );

  const pendingCounts = state.counts.filter(c => c.status === 'pending');

  const handleCountChange = (productId: string, value: string) => {
    const num = parseFloat(value) || 0;
    setCountValues(prev => ({ ...prev, [productId]: num }));
  };

  const handleSubmitCount = () => {
    const items = countProducts.map(p => {
      const balance = state.stockBalances.find(b => b.product_id === p.id);
      const expected = balance?.quantity || 0;
      const counted = countValues[p.id] ?? expected;
      return {
        product_id: p.id,
        expected_qty: expected,
        counted_qty: counted,
        difference_qty: counted - expected,
      };
    });

    dispatch({
      type: 'ADD_COUNT',
      payload: {
        id: `c_${Date.now()}`,
        user_id: state.currentUser?.id || 'u2',
        created_at: new Date().toISOString(),
        status: 'pending',
        items,
      },
    });

    setSubmitted(true);
    dispatch({ type: 'SET_TOAST', payload: '✓ Conteo enviado para revisión' });
    setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 2500);
  };

  const handleApproveCount = (countId: string) => {
    dispatch({ type: 'APPROVE_COUNT', payload: countId });
    dispatch({ type: 'SET_TOAST', payload: '✓ Conteo aprobado y ajustes aplicados' });
    setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 2500);
  };

  if (submitted) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <Check size={32} className="text-emerald-600" />
        </div>
        <p className="text-lg font-bold text-warm-800">¡Conteo enviado!</p>
        <p className="text-sm text-warm-500">El dueño revisará las diferencias</p>
        <button
          onClick={() => { setSubmitted(false); setCountValues({}); }}
          className="bg-brand-500 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-warm-800">
          {role === 'owner' ? 'Conteos de cierre' : 'Conteo de cierre'}
        </h2>
        <p className="text-sm text-warm-500">
          {role === 'owner' ? 'Revisa y aprueba las diferencias' : 'Cuenta lo que tienes en almacén'}
        </p>
      </div>

      {/* Owner: pending counts to approve */}
      {role === 'owner' && pendingCounts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-warm-700">Pendientes de aprobación</h3>
          {pendingCounts.map(count => (
            <div key={count.id} className="bg-white border border-warm-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-warm-700">
                    Conteo del {new Date(count.created_at).toLocaleDateString('es-PE')}
                  </p>
                  <p className="text-xs text-warm-400">
                    Por: {state.movements.find(m => m.user_id === count.user_id) ? 'Personal' : count.user_id}
                  </p>
                </div>
                <button
                  onClick={() => handleApproveCount(count.id)}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-emerald-600 active:scale-95"
                >
                  Aprobar ajustes
                </button>
              </div>
              <div className="space-y-1">
                {count.items.filter(i => i.difference_qty !== 0).map(item => {
                  const product = state.products.find(p => p.id === item.product_id);
                  return (
                    <div key={item.product_id} className="flex items-center justify-between text-xs py-1">
                      <span className="text-warm-600">{product?.name}</span>
                      <span className={`font-medium ${item.difference_qty < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {item.difference_qty > 0 ? '+' : ''}{item.difference_qty} {product?.base_unit}
                      </span>
                    </div>
                  );
                })}
                {count.items.filter(i => i.difference_qty !== 0).length === 0 && (
                  <p className="text-xs text-emerald-600 font-medium">✓ Sin diferencias</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Kitchen: count form */}
      {role === 'kitchen' && (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              Cuenta cada producto y anota lo que realmente tienes. El sistema comparará con lo esperado.
            </p>
          </div>

          <div className="space-y-2">
            {countProducts.map(p => {
              const balance = state.stockBalances.find(b => b.product_id === p.id);
              const expected = balance?.quantity || 0;
              const counted = countValues[p.id];
              const diff = counted !== undefined ? counted - expected : 0;

              return (
                <div key={p.id} className="bg-white border border-warm-200 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-warm-700">{p.name}</span>
                    <span className="text-xs text-warm-400">Esperado: {expected} {p.base_unit}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-warm-500">Contado:</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={counted ?? ''}
                      onChange={e => handleCountChange(p.id, e.target.value)}
                      placeholder={expected.toString()}
                      className="w-24 px-3 py-2 border border-warm-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-300"
                      aria-label={`Conteo de ${p.name}`}
                    />
                    <span className="text-xs text-warm-400">{p.base_unit}</span>
                    {counted !== undefined && diff !== 0 && (
                      <span className={`text-xs font-bold ml-auto ${diff < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {diff > 0 ? '+' : ''}{diff}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSubmitCount}
            className="w-full bg-brand-500 text-white py-4 rounded-xl text-base font-semibold hover:bg-brand-600 active:scale-[0.98] transition-all"
          >
            Enviar conteo
          </button>
        </div>
      )}

      {/* Owner: initiate new count */}
      {role === 'owner' && pendingCounts.length === 0 && (
        <div className="text-center py-8 text-warm-400 text-sm">
          No hay conteos pendientes. El personal de cocina enviará el conteo de cierre.
        </div>
      )}
    </div>
  );
}
