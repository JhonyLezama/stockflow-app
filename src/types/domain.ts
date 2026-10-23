export type Role = 'owner' | 'kitchen' | 'warehouse' | 'service';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
}

export type ProductType = 'protein' | 'vegetable' | 'supply' | 'beverage' | 'disposable' | 'gas' | 'condiment';

export interface Product {
  id: string;
  name: string;
  product_type: ProductType;
  base_unit: string;
  min_stock: number;
  last_cost: number;
  is_perishable: boolean;
  supplier_id?: string;
  category: string;
  conversions: ProductUnit[];
  favorite?: boolean;
}

export interface ProductUnit {
  unit: string;
  factor_to_base: number;
}

export interface StockBalance {
  product_id: string;
  quantity: number;
}

export type MovementType = 'purchase_in' | 'consumption' | 'waste' | 'adjustment' | 'count_adjustment';

export interface StockMovement {
  id: string;
  product_id: string;
  movement_type: MovementType;
  reason: string;
  quantity: number; // signed in base unit
  input_quantity: number;
  input_unit: string;
  user_id: string;
  occurred_at: string;
}

export interface StockCount {
  id: string;
  user_id: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  items: StockCountItem[];
}

export interface StockCountItem {
  product_id: string;
  expected_qty: number;
  counted_qty: number;
  difference_qty: number;
}

export type NeedPriority = 'urgent' | 'normal';
export type NeedStatus = 'open' | 'in_purchase' | 'resolved' | 'dismissed';

export interface Need {
  id: string;
  product_id?: string;
  description: string;
  priority: NeedPriority;
  status: NeedStatus;
  user_id: string;
  created_at: string;
}

export interface PurchaseRequest {
  id: string;
  product_id: string;
  quantity: number;
  unit: string;
  supplier_id?: string;
  status: 'pending' | 'approved' | 'ordered';
  created_at: string;
}

export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  items: PurchaseOrderItem[];
  status: 'pending' | 'sent' | 'partial' | 'received';
  created_at: string;
  total: number;
}

export interface PurchaseOrderItem {
  product_id: string;
  quantity: number;
  unit: string;
  unit_cost: number;
}

export interface PurchaseReceipt {
  id: string;
  order_id: string;
  user_id: string;
  received_at: string;
  items: PurchaseReceiptItem[];
}

export interface PurchaseReceiptItem {
  product_id: string;
  expected_qty: number;
  received_qty: number;
  damaged_qty: number;
  notes: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  products: string[];
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'waste_spike' | 'count_discrepancy';
  product_id?: string;
  message: string;
  created_at: string;
  read: boolean;
}

export type Page = 'login' | 'dashboard' | 'stock' | 'register' | 'count' | 'needs' | 'purchases' | 'receive' | 'catalog' | 'history' | 'alerts';

export interface AppState {
  currentUser: User | null;
  currentPage: Page;
  products: Product[];
  stockBalances: StockBalance[];
  movements: StockMovement[];
  counts: StockCount[];
  needs: Need[];
  purchaseRequests: PurchaseRequest[];
  purchaseOrders: PurchaseOrder[];
  suppliers: Supplier[];
  alerts: Alert[];
  toast: string | null;
}
