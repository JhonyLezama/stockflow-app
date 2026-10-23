import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Truck, Check, Package, AlertTriangle } from 'lucide-react';

export default function ReceivePage() {
  const { state, dispatch } = useApp();
  const [received, setReceived] = useState<Record<string, { qty: number; damaged: number }>>({});
  const [confirmed, setConfirmed] = useState(false);

  // Show pending orders
  const pendingOrders = state.purchaseOrders.filter(o => o.status === 'sent' || o.status === 'partial');

  const handleReceiveChange = (productId: string, field: 'qty' | 'damaged', value: string) => {
    const num = parseFloat(value) || 0;
    setReceived(prev => ({
      ...prev,
      [productId]: {
        qty: field === 'qty' ? num : (prev[productId]?.qty || 0),
        damaged: field === 'damaged' ? num : (prev[productId]?.damaged || 0),
      },
    }));
  };

  const handleConfirmReceive = () => {
    if (!pendingOrders[0]) return;
    const order = pendingOrders[0];

    order.items.forEach(item => {
      const recv = received[item.product_id];
      const receivedQty = recv?.qty || 0;
      const damagedQty = recv?.damaged || 0;
      const netQty = receivedQty - damagedQty;

      if (netQty > 0) {
        // Update stock
        dispatch({
          type: 'UPDATE_STOCK',
          payload: { product_id: item.product_id, quantity: netQty },
        });

        // Add movement
        dispatch({
          type: 'ADD_MOVEMENT',
          payload: {
            id: `m_recv_${Date.now()}_${item.product_id}`,
            product_id: item.product_id,
            movement_type: 'purchase_in',
            reason: `Recepción orden ${order.id}`,
            quantity: netQty,
            input_quantity: receivedQty,
            input_unit: item.unit,
            user_id: state.currentUser?.id || 'u3',
            occurred_at: new Date().toISOString(),
          },
        });
      }
    });

    setConfirmed(true);
    dispatch({ type: 'SET_TOAST', payload: '✓ Mercadería recibida y stock actualizado' });
    setTimeout(() => dispatch({ type: 'SET_TOAST', payload: null }), 2500);
  };

  if (confirmed) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <Check size={32} className="text-emerald-600" />
        </div>
        <p className="text-lg font-bold text-warm-800">¡Recepción completada!</p>
        <p className="text-sm text-warm-500">El stock se actualizó automáticamente</p>
        <button
          onClick={() => { setConfirmed(false); setReceived({}); }}
          className="bg-brand-500 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Volver
        </button>
      </div>
    );
  }

  if (pendingOrders.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-warm-800">Recepción de mercadería</h2>
          <p className="text-sm text-warm-500">Contrasta lo pedido con lo recibido</p>
        </div>
        <div className="text-center py-12 text-warm-400 text-sm">
          No hay órdenes pendientes de recibir.
        </div>
      </div>
    );
  }

  const order = pendingOrders[0];
  const supplier = state.suppliers.find(s => s.id === order.supplier_id);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-warm-800">Recepción de mercadería</h2>
        <p className="text-sm text-warm-500">Contrasta lo pedido con lo recibido</p>
      </div>

      {/* Order info */}
      <div className="bg-white border border-warm-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Truck size={16} className="text-brand-500" />
          <span className="text-sm font-semibold text-warm-700">Orden #{order.id}</span>
        </div>
        <p className="text-xs text-warm-500">
          Proveedor: {supplier?.name || 'N/A'} · {new Date(order.created_at).toLocaleDateString('es-PE')}
        </p>
        <p className="text-xs text-warm-400 mt-1">Total: S/ {order.total.toFixed(2)}</p>
      </div>

      {/* Items to receive */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-warm-700 flex items-center gap-2">
          <Package size={14} /> Productos a recibir
        </h3>
        {order.items.map(item => {
          const product = state.products.find(p => p.id === item.product_id);
          const recv = received[item.product_id];
          const receivedQty = recv?.qty || 0;
          const damagedQty = recv?.damaged || 0;
          const isMissing = receivedQty > 0 && receivedQty < item.quantity;
          const isDamaged = damagedQty > 0;

          return (
            <div key={item.product_id} className="bg-white border border-warm-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-warm-700">{product?.name}</p>
                  <p className="text-[10px] text-warm-400">
                    Pedido: {item.quantity} {item.unit} × S/ {item.unit_cost.toFixed(2)}
                  </p>
                </div>
                {(isMissing || isDamaged) && (
                  <AlertTriangle size={14} className="text-amber-500" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-warm-500 block mb-1">Recibido</label>
                  <input
                    type="number"
                    min="0"
                    value={recv?.qty ?? ''}
                    onChange={e => handleReceiveChange(item.product_id, 'qty', e.target.value)}
                    placeholder={item.quantity.toString()}
                    className="w-full px-3 py-2 border border-warm-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-brand-300"
                    aria-label={`Cantidad recibida de ${product?.name}`}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-warm-500 block mb-1">Dañado/Faltante</label>
                  <input
                    type="number"
                    min="0"
                    value={recv?.damaged ?? ''}
                    onChange={e => handleReceiveChange(item.product_id, 'damaged', e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-warm-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-red-300"
                    aria-label={`Cantidad dañada de ${product?.name}`}
                  />
                </div>
              </div>

              {receivedQty > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-warm-500">
                    Neto: <span className="font-medium text-warm-700">{receivedQty - damagedQty} {item.unit}</span>
                  </span>
                  {isMissing && (
                    <span className="text-amber-600 font-medium">
                      Faltan {item.quantity - receivedQty}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={handleConfirmReceive}
        className="w-full bg-brand-500 text-white py-4 rounded-xl text-base font-semibold hover:bg-brand-600 active:scale-[0.98] transition-all"
      >
        Confirmar recepción
      </button>
    </div>
  );
}
