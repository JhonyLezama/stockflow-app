import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ShoppingCart, Check, MessageCircle, Plus, Minus } from 'lucide-react';

export default function PurchasesPage() {
  const { state, dispatch } = useApp();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const role = state.currentUser?.role;

  // Products below minimum + open needs
  const lowStockProducts = state.products.filter(p => {
    const b = state.stockBalances.find(sb => sb.product_id === p.id);
    return b && b.quantity <= p.min_stock;
  });

  const needsProducts = state.needs
    .filter(n => n.product_id && n.status === 'open')
    .map(n => state.products.find(p => p.id === n.product_id))
    .filter(Boolean) as typeof state.products;

  const suggestedProducts = [...new Map([...lowStockProducts, ...needsProducts].map(p => [p.id, p])).values()];

  const getQty = (productId: string) => {
    if (quantities[productId] !== undefined) return quantities[productId];
    const p = state.products.find(pr => pr.id === productId);
    const b = state.stockBalances.find(sb => sb.product_id === productId);
    if (!p || !b) return 0;
    return Math.max(0, p.min_stock * 2 - b.quantity);
  };

  const handleQtyChange = (productId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, getQty(productId) + delta),
    }));
  };

  const handleApproveAll = () => {
    suggestedProducts.forEach(p => {
      const qty = getQty(p.id);
      if (qty > 0) {
        dispatch({
          type: 'ADD_PURCHASE_REQUEST',
          payload: {
            id: `pr_${Date.now()}_${p.id}`,
            product_id: p.id,
            quantity: qty,
            unit: p.base_unit,
            supplier_id: p.supplier_id,
            status: 'approved',
            created_at: new Date().toISOString(),
          },
        });
      }
    });
    setShowConfirm(true);
    dispatch({ type: 'SET_TOAST', payload: '✓ Compras aprobadas' });
    setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 2500);
  };

  const getWhatsAppText = () => {
    const bySupplier: Record<string, string[]> = {};
    suggestedProducts.forEach(p => {
      const qty = getQty(p.id);
      if (qty <= 0) return;
      const supplier = state.suppliers.find(s => s.id === p.supplier_id);
      const sName = supplier?.name || 'Sin proveedor';
      if (!bySupplier[sName]) bySupplier[sName] = [];
      bySupplier[sName].push(`- ${p.name}: ${qty} ${p.base_unit}`);
    });

    let text = '📋 *Pedido - Pollería Don Tito*\n\n';
    Object.entries(bySupplier).forEach(([supplier, items]) => {
      text += `*${supplier}:*\n${items.join('\n')}\n\n`;
    });
    return text;
  };

  const handleCopyWhatsApp = () => {
    const text = getWhatsAppText();
    navigator.clipboard?.writeText(text).then(() => {
      dispatch({ type: 'SET_TOAST', payload: '✓ Copiado para WhatsApp' });
      setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 2500);
    }).catch(() => {
      dispatch({ type: 'SET_TOAST', payload: 'No se pudo copiar' });
      setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 2500);
    });
  };

  if (showConfirm) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <Check size={32} className="text-emerald-600" />
        </div>
        <p className="text-lg font-bold text-warm-800">¡Órdenes generadas!</p>
        <p className="text-sm text-warm-500">Se crearon las órdenes por proveedor</p>
        <div className="flex gap-3 justify-center pt-4">
          <button
            onClick={handleCopyWhatsApp}
            className="bg-emerald-500 text-white px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-emerald-600 active:scale-95"
          >
            <MessageCircle size={18} /> Copiar para WhatsApp
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="bg-warm-100 text-warm-700 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-warm-200"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-warm-800">Lista de compras</h2>
        <p className="text-sm text-warm-500">
          {suggestedProducts.length} productos sugeridos
        </p>
      </div>

      {/* Pending requests */}
      {state.purchaseRequests.filter(pr => pr.status === 'pending').length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-xs font-medium text-amber-700 mb-2">
            {state.purchaseRequests.filter(pr => pr.status === 'pending').length} solicitudes pendientes
          </p>
          {role === 'owner' && (
            <button
              onClick={() => {
                state.purchaseRequests.filter(pr => pr.status === 'pending').forEach(pr => {
                  dispatch({ type: 'APPROVE_PURCHASE_REQUEST', payload: pr.id });
                });
                dispatch({ type: 'SET_TOAST', payload: '✓ Solicitudes aprobadas' });
                setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 2500);
              }}
              className="text-xs text-amber-800 font-semibold underline"
            >
              Aprobar todas
            </button>
          )}
        </div>
      )}

      {/* Suggested products */}
      <div className="space-y-2">
        {suggestedProducts.map(p => {
          const balance = state.stockBalances.find(b => b.product_id === p.id);
          const qty = balance?.quantity || 0;
          const supplier = state.suppliers.find(s => s.id === p.supplier_id);
          const buyQty = getQty(p.id);

          return (
            <div key={p.id} className="bg-white border border-warm-200 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-warm-700">{p.name}</p>
                  <p className="text-[10px] text-warm-400">
                    Stock: {qty} {p.base_unit} · Mín: {p.min_stock} · {supplier?.name || 'Sin proveedor'}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  qty === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {qty === 0 ? 'Agotado' : 'Bajo'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-warm-500">Comprar:</span>
                <button
                  onClick={() => handleQtyChange(p.id, -1)}
                  className="w-8 h-8 bg-warm-100 rounded-lg flex items-center justify-center hover:bg-warm-200 active:scale-90"
                  aria-label="Disminuir"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-bold text-warm-800">{buyQty}</span>
                <button
                  onClick={() => handleQtyChange(p.id, 1)}
                  className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center hover:bg-brand-200 active:scale-90"
                  aria-label="Aumentar"
                >
                  <Plus size={14} />
                </button>
                <span className="text-xs text-warm-400">{p.base_unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {suggestedProducts.length === 0 && (
        <div className="text-center py-8 text-warm-400 text-sm">
          ✓ Todo el stock está bien. No se necesita comprar nada.
        </div>
      )}

      {/* Actions */}
      {suggestedProducts.length > 0 && role === 'owner' && (
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleApproveAll}
            className="flex-1 bg-brand-500 text-white py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-brand-600 active:scale-95 transition-all"
          >
            <ShoppingCart size={18} /> Aprobar y generar órdenes
          </button>
          <button
            onClick={handleCopyWhatsApp}
            className="bg-emerald-500 text-white px-4 py-3.5 rounded-xl flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all"
            aria-label="Copiar para WhatsApp"
          >
            <MessageCircle size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
