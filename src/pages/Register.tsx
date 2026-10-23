import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Minus, Plus, Check, X, Flame, ArrowLeft } from 'lucide-react';

type Step = 'product' | 'quantity' | 'reason' | 'done';

const wasteReasons = [
  { id: 'vencido', label: 'Vencido', icon: '🕐' },
  { id: 'quemado', label: 'Quemado', icon: '🔥' },
  { id: 'caido', label: 'Caído al piso', icon: '💧' },
  { id: 'error', label: 'Error de preparación', icon: '❌' },
  { id: 'malogrado', label: 'Malogrado', icon: '🤢' },
  { id: 'otro', label: 'Otro', icon: '📝' },
];

export default function RegisterPage() {
  const { state, dispatch } = useApp();
  const [step, setStep] = useState<Step>('product');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [search, setSearch] = useState('');
  const [reason, setReason] = useState('');

  const product = state.products.find(p => p.id === selectedProduct);
  const favorites = state.products.filter(p => p.favorite);
  const filtered = state.products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleSelectProduct = (id: string) => {
    setSelectedProduct(id);
    const p = state.products.find(pr => pr.id === id);
    if (p) {
      setSelectedUnit(p.conversions[0].unit);
      setQuantity(1);
    }
    setStep('quantity');
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleConfirmQuantity = () => {
    setStep('reason');
  };

  const handleConfirmReason = (reasonId: string) => {
    setReason(reasonId);
    if (!product) return;

    const unitConv = product.conversions.find(c => c.unit === selectedUnit);
    const factor = unitConv?.factor_to_base || 1;
    const baseQty = -(quantity * factor);

    dispatch({
      type: 'ADD_MOVEMENT',
      payload: {
        id: `m_${Date.now()}`,
        product_id: product.id,
        movement_type: 'waste',
        reason: wasteReasons.find(r => r.id === reasonId)?.label || reasonId,
        quantity: baseQty,
        input_quantity: quantity,
        input_unit: selectedUnit,
        user_id: state.currentUser?.id || 'u2',
        occurred_at: new Date().toISOString(),
      },
    });

    setStep('done');
    setTimeout(() => {
      dispatch({ type: 'SET_TOAST', payload: '✓ Merma registrada correctamente' });
      setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 2500);
    }, 100);
  };

  const handleReset = () => {
    setStep('product');
    setSelectedProduct(null);
    setSelectedUnit('');
    setQuantity(1);
    setSearch('');
    setReason('');
  };

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-2">
        {['Producto', 'Cantidad', 'Motivo'].map((label, i) => {
          const stepIndex = ['product', 'quantity', 'reason'].indexOf(step === 'done' ? 'reason' : step);
          const isActive = i === stepIndex;
          const isDone = i < stepIndex || step === 'done';
          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-brand-500 text-white' : 'bg-warm-200 text-warm-500'
              }`}>
                {isDone ? <Check size={12} /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-brand-600' : isDone ? 'text-emerald-600' : 'text-warm-400'}`}>
                {label}
              </span>
              {i < 2 && <div className="flex-1 h-px bg-warm-200" />}
            </div>
          );
        })}
      </div>

      {/* Step 1: Product selection */}
      {step === 'product' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-warm-800">¿Qué producto?</h2>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full px-4 py-3 bg-white border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            aria-label="Buscar producto"
            autoFocus
          />

          {/* Favorites */}
          {!search && favorites.length > 0 && (
            <div>
              <p className="text-xs font-medium text-warm-500 mb-2">⭐ Favoritos</p>
              <div className="grid grid-cols-2 gap-2">
                {favorites.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProduct(p.id)}
                    className="bg-brand-50 border border-brand-200 rounded-xl p-3 text-left hover:bg-brand-100 active:scale-95 transition-all"
                  >
                    <p className="text-sm font-semibold text-brand-800">{p.name}</p>
                    <p className="text-[10px] text-brand-500">Stock: {state.stockBalances.find(b => b.product_id === p.id)?.quantity || 0} {p.base_unit}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All products */}
          <div>
            {!search && <p className="text-xs font-medium text-warm-500 mb-2">Todos los productos</p>}
            <div className="space-y-1.5 max-h-[40vh] overflow-y-auto">
              {(search ? filtered : state.products).map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProduct(p.id)}
                  className="w-full bg-white border border-warm-200 rounded-lg p-3 flex items-center justify-between hover:border-brand-300 active:scale-[0.98] transition-all"
                >
                  <span className="text-sm text-warm-700">{p.name}</span>
                  <span className="text-xs text-warm-400">{p.base_unit}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Quantity */}
      {step === 'quantity' && product && (
        <div className="space-y-5">
          <button onClick={() => setStep('product')} className="flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700">
            <ArrowLeft size={16} /> Volver
          </button>

          <div className="text-center">
            <p className="text-sm text-warm-500">Producto seleccionado:</p>
            <p className="text-lg font-bold text-warm-800">{product.name}</p>
          </div>

          {/* Unit selector */}
          <div className="flex justify-center gap-2">
            {product.conversions.map(c => (
              <button
                key={c.unit}
                onClick={() => setSelectedUnit(c.unit)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedUnit === c.unit ? 'bg-brand-500 text-white' : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                }`}
              >
                {c.unit}
              </button>
            ))}
          </div>

          {/* Quantity controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-16 h-16 bg-warm-100 rounded-2xl flex items-center justify-center hover:bg-warm-200 active:scale-90 transition-all"
              aria-label="Disminuir"
            >
              <Minus size={28} className="text-warm-700" />
            </button>
            <div className="text-center">
              <p className="text-5xl font-bold text-warm-800">{quantity}</p>
              <p className="text-sm text-warm-500">{selectedUnit}{quantity > 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center hover:bg-brand-200 active:scale-90 transition-all"
              aria-label="Aumentar"
            >
              <Plus size={28} className="text-brand-700" />
            </button>
          </div>

          {/* Numeric keypad */}
          <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
              <button
                key={n}
                onClick={() => setQuantity(n)}
                className="h-12 bg-white border border-warm-200 rounded-xl text-lg font-bold text-warm-700 hover:bg-warm-50 active:scale-95 transition-all"
              >
                {n}
              </button>
            ))}
          </div>

          <button
            onClick={handleConfirmQuantity}
            className="w-full bg-brand-500 text-white py-4 rounded-xl text-base font-semibold hover:bg-brand-600 active:scale-[0.98] transition-all"
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* Step 3: Reason */}
      {step === 'reason' && product && (
        <div className="space-y-4">
          <button onClick={() => setStep('quantity')} className="flex items-center gap-1 text-sm text-warm-500 hover:text-warm-700">
            <ArrowLeft size={16} /> Volver
          </button>

          <div className="text-center">
            <p className="text-sm text-warm-500">Resumen:</p>
            <p className="text-lg font-bold text-warm-800">
              {quantity} {selectedUnit}{quantity > 1 ? 's' : ''} de {product.name}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-warm-700 mb-3">¿Cuál es el motivo?</p>
            <div className="grid grid-cols-2 gap-2">
              {wasteReasons.map(r => (
                <button
                  key={r.id}
                  onClick={() => handleConfirmReason(r.id)}
                  className={`bg-white border rounded-xl p-3 flex items-center gap-2 hover:border-brand-300 active:scale-95 transition-all ${
                    reason === r.id ? 'border-brand-500 bg-brand-50' : 'border-warm-200'
                  }`}
                >
                  <span className="text-xl">{r.icon}</span>
                  <span className="text-sm font-medium text-warm-700">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Done */}
      {step === 'done' && (
        <div className="text-center py-8 space-y-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Check size={40} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-warm-800">¡Registrado!</p>
            <p className="text-sm text-warm-500 mt-1">
              Se registró {quantity} {selectedUnit}{quantity > 1 ? 's' : ''} de {product?.name}
            </p>
            <p className="text-xs text-warm-400 mt-1">Motivo: {wasteReasons.find(r => r.id === reason)?.label}</p>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleReset}
              className="flex-1 bg-brand-500 text-white py-3 rounded-xl font-semibold hover:bg-brand-600 active:scale-95 transition-all"
            >
              Registrar otra
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: 'dashboard' })}
              className="flex-1 bg-warm-100 text-warm-700 py-3 rounded-xl font-semibold hover:bg-warm-200 active:scale-95 transition-all"
            >
              Ir al inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
