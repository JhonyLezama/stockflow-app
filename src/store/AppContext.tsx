import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, Page, User, StockMovement, Need, PurchaseRequest, StockCount, Alert } from '../types/domain';
import { users, products, initialStockBalances, initialMovements, initialCounts, initialNeeds, initialPurchaseRequests, initialPurchaseOrders, suppliers, initialAlerts } from '../mock/data';

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_PAGE'; payload: Page }
  | { type: 'LOGOUT' }
  | { type: 'ADD_MOVEMENT'; payload: StockMovement }
  | { type: 'ADD_NEED'; payload: Need }
  | { type: 'UPDATE_NEED_STATUS'; payload: { id: string; status: Need['status'] } }
  | { type: 'ADD_PURCHASE_REQUEST'; payload: PurchaseRequest }
  | { type: 'APPROVE_PURCHASE_REQUEST'; payload: string }
  | { type: 'ADD_COUNT'; payload: StockCount }
  | { type: 'APPROVE_COUNT'; payload: string }
  | { type: 'UPDATE_STOCK'; payload: { product_id: string; quantity: number } }
  | { type: 'MARK_ALERT_READ'; payload: string }
  | { type: 'MARK_ALL_ALERTS_READ' }
  | { type: 'SET_TOAST'; payload: string | null }
  | { type: 'RESET' };

function getInitialState(): AppState {
  return {
    currentUser: null,
    currentPage: 'login',
    products: [...products],
    stockBalances: [...initialStockBalances],
    movements: [...initialMovements],
    counts: [...initialCounts],
    needs: [...initialNeeds],
    purchaseRequests: [...initialPurchaseRequests],
    purchaseOrders: [...initialPurchaseOrders],
    suppliers: [...suppliers],
    alerts: [...initialAlerts],
    toast: null,
  };
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload, currentPage: action.payload.role === 'owner' ? 'dashboard' : 'dashboard' };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null, currentPage: 'login' };
    case 'ADD_MOVEMENT': {
      const newBalances = state.stockBalances.map(b =>
        b.product_id === action.payload.product_id
          ? { ...b, quantity: Math.max(0, b.quantity + action.payload.quantity) }
          : b
      );
      // Check if new alert needed
      const product = state.products.find(p => p.id === action.payload.product_id);
      const newBalance = newBalances.find(b => b.product_id === action.payload.product_id);
      let newAlerts = [...state.alerts];
      if (product && newBalance && newBalance.quantity <= product.min_stock && newBalance.quantity > 0) {
        const exists = newAlerts.find(a => a.product_id === product.id && a.type === 'low_stock');
        if (!exists) {
          newAlerts.unshift({
            id: `a${Date.now()}`,
            type: 'low_stock',
            product_id: product.id,
            message: `${product.name} bajo mínimo (${newBalance.quantity} de ${product.min_stock})`,
            created_at: new Date().toISOString(),
            read: false,
          });
        }
      } else if (product && newBalance && newBalance.quantity === 0) {
        newAlerts.unshift({
          id: `a${Date.now()}`,
          type: 'out_of_stock',
          product_id: product.id,
          message: `${product.name} agotado`,
          created_at: new Date().toISOString(),
          read: false,
        });
      }
      return {
        ...state,
        stockBalances: newBalances,
        movements: [action.payload, ...state.movements],
        alerts: newAlerts,
      };
    }
    case 'ADD_NEED':
      return { ...state, needs: [action.payload, ...state.needs] };
    case 'UPDATE_NEED_STATUS':
      return {
        ...state,
        needs: state.needs.map(n => n.id === action.payload.id ? { ...n, status: action.payload.status } : n),
      };
    case 'ADD_PURCHASE_REQUEST':
      return { ...state, purchaseRequests: [action.payload, ...state.purchaseRequests] };
    case 'APPROVE_PURCHASE_REQUEST':
      return {
        ...state,
        purchaseRequests: state.purchaseRequests.map(pr =>
          pr.id === action.payload ? { ...pr, status: 'approved' as const } : pr
        ),
      };
    case 'ADD_COUNT':
      return { ...state, counts: [action.payload, ...state.counts] };
    case 'APPROVE_COUNT': {
      const count = state.counts.find(c => c.id === action.payload);
      if (!count) return state;
      let newBalances = [...state.stockBalances];
      const newMovements: StockMovement[] = [];
      count.items.forEach(item => {
        if (item.difference_qty !== 0) {
          newBalances = newBalances.map(b =>
            b.product_id === item.product_id
              ? { ...b, quantity: Math.max(0, b.quantity + item.difference_qty) }
              : b
          );
          newMovements.push({
            id: `m_adj_${Date.now()}_${item.product_id}`,
            product_id: item.product_id,
            movement_type: 'count_adjustment',
            reason: `Ajuste por conteo de cierre (${count.id})`,
            quantity: item.difference_qty,
            input_quantity: item.counted_qty,
            input_unit: 'conteo',
            user_id: state.currentUser?.id || 'u1',
            occurred_at: new Date().toISOString(),
          });
        }
      });
      return {
        ...state,
        stockBalances: newBalances,
        movements: [...newMovements, ...state.movements],
        counts: state.counts.map(c => c.id === action.payload ? { ...c, status: 'approved' as const } : c),
      };
    }
    case 'UPDATE_STOCK':
      return {
        ...state,
        stockBalances: state.stockBalances.map(b =>
          b.product_id === action.payload.product_id
            ? { ...b, quantity: b.quantity + action.payload.quantity }
            : b
        ),
      };
    case 'MARK_ALERT_READ':
      return {
        ...state,
        alerts: state.alerts.map(a => a.id === action.payload ? { ...a, read: true } : a),
      };
    case 'MARK_ALL_ALERTS_READ':
      return {
        ...state,
        alerts: state.alerts.map(a => ({ ...a, read: true })),
      };
    case 'SET_TOAST':
      return { ...state, toast: action.payload };
    case 'RESET':
      return getInitialState();
    default:
      return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { users };
