import { Product, StockBalance, StockMovement, StockCount, Need, PurchaseRequest, PurchaseOrder, Supplier, Alert, User } from '../types/domain';

export const users: User[] = [
  { id: 'u1', name: 'Doña Carmen', role: 'owner' },
  { id: 'u2', name: 'Roberto Quispe', role: 'kitchen' },
  { id: 'u3', name: 'Miguel Ángel Torres', role: 'warehouse' },
  { id: 'u4', name: 'Lucía Mendoza', role: 'service' },
];

export const suppliers: Supplier[] = [
  {
    id: 's1',
    name: 'Distribuidora El Pollero SAC',
    contact: 'Sr. Vásquez',
    phone: '+51 944 123 456',
    products: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'],
  },
  {
    id: 's2',
    name: 'Mercado Central - Puesto 42',
    contact: 'Sra. Rosa',
    phone: '+51 988 765 432',
    products: ['p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18', 'p19', 'p20', 'p21', 'p22', 'p23', 'p24', 'p25', 'p26', 'p27', 'p28'],
  },
];

export const products: Product[] = [
  { id: 'p1', name: 'Pollo entero', product_type: 'protein', base_unit: 'pollo', min_stock: 10, last_cost: 14.50, is_perishable: true, supplier_id: 's1', category: 'Proteínas', conversions: [{ unit: 'pollo', factor_to_base: 1 }, { unit: 'cuarto', factor_to_base: 0.25 }, { unit: 'octavo', factor_to_base: 0.125 }], favorite: true },
  { id: 'p2', name: 'Papa canchán', product_type: 'vegetable', base_unit: 'kg', min_stock: 20, last_cost: 3.20, is_perishable: true, supplier_id: 's2', category: 'Verduras', conversions: [{ unit: 'kg', factor_to_base: 1 }, { unit: 'bolsa (5kg)', factor_to_base: 5 }], favorite: true },
  { id: 'p3', name: 'Aceite vegetal', product_type: 'supply', base_unit: 'litro', min_stock: 8, last_cost: 7.80, is_perishable: false, supplier_id: 's1', category: 'Insumos', conversions: [{ unit: 'litro', factor_to_base: 1 }, { unit: 'galón (3.5L)', factor_to_base: 3.5 }], favorite: true },
  { id: 'p4', name: 'Gas (balón 10kg)', product_type: 'gas', base_unit: 'balón', min_stock: 2, last_cost: 52.00, is_perishable: false, supplier_id: 's1', category: 'Gas', conversions: [{ unit: 'balón', factor_to_base: 1 }], favorite: false },
  { id: 'p5', name: 'Carbón', product_type: 'supply', base_unit: 'kg', min_stock: 15, last_cost: 4.50, is_perishable: false, supplier_id: 's1', category: 'Insumos', conversions: [{ unit: 'kg', factor_to_base: 1 }, { unit: 'bolsa (5kg)', factor_to_base: 5 }], favorite: false },
  { id: 'p6', name: 'Crema de ají', product_type: 'condiment', base_unit: 'litro', min_stock: 3, last_cost: 12.00, is_perishable: true, supplier_id: 's2', category: 'Salsas', conversions: [{ unit: 'litro', factor_to_base: 1 }], favorite: false },
  { id: 'p7', name: 'Mayonesa', product_type: 'condiment', base_unit: 'litro', min_stock: 2, last_cost: 9.50, is_perishable: true, supplier_id: 's2', category: 'Salsas', conversions: [{ unit: 'litro', factor_to_base: 1 }], favorite: false },
  { id: 'p8', name: 'Lechuga', product_type: 'vegetable', base_unit: 'kg', min_stock: 5, last_cost: 3.80, is_perishable: true, supplier_id: 's2', category: 'Verduras', conversions: [{ unit: 'kg', factor_to_base: 1 }], favorite: false },
  { id: 'p9', name: 'Tomate', product_type: 'vegetable', base_unit: 'kg', min_stock: 5, last_cost: 4.20, is_perishable: true, supplier_id: 's2', category: 'Verduras', conversions: [{ unit: 'kg', factor_to_base: 1 }], favorite: false },
  { id: 'p10', name: 'Cebolla roja', product_type: 'vegetable', base_unit: 'kg', min_stock: 5, last_cost: 3.50, is_perishable: true, supplier_id: 's2', category: 'Verduras', conversions: [{ unit: 'kg', factor_to_base: 1 }], favorite: false },
  { id: 'p11', name: 'Limón', product_type: 'vegetable', base_unit: 'kg', min_stock: 3, last_cost: 5.00, is_perishable: true, supplier_id: 's2', category: 'Verduras', conversions: [{ unit: 'kg', factor_to_base: 1 }], favorite: false },
  { id: 'p12', name: 'Gaseosa personal', product_type: 'beverage', base_unit: 'unidad', min_stock: 24, last_cost: 2.50, is_perishable: false, supplier_id: 's2', category: 'Bebidas', conversions: [{ unit: 'unidad', factor_to_base: 1 }, { unit: 'six-pack', factor_to_base: 6 }], favorite: false },
  { id: 'p13', name: 'Cerveza personal', product_type: 'beverage', base_unit: 'unidad', min_stock: 20, last_cost: 4.80, is_perishable: false, supplier_id: 's2', category: 'Bebidas', conversions: [{ unit: 'unidad', factor_to_base: 1 }], favorite: false },
  { id: 'p14', name: 'Chicha morada (litro)', product_type: 'beverage', base_unit: 'litro', min_stock: 5, last_cost: 6.00, is_perishable: true, supplier_id: 's2', category: 'Bebidas', conversions: [{ unit: 'litro', factor_to_base: 1 }], favorite: false },
  { id: 'p15', name: 'Papel toalla', product_type: 'disposable', base_unit: 'rollo', min_stock: 6, last_cost: 5.50, is_perishable: false, supplier_id: 's2', category: 'Descartables', conversions: [{ unit: 'rollo', factor_to_base: 1 }], favorite: false },
  { id: 'p16', name: 'Servilletas', product_type: 'disposable', base_unit: 'paquete', min_stock: 5, last_cost: 8.00, is_perishable: false, supplier_id: 's2', category: 'Descartables', conversions: [{ unit: 'paquete', factor_to_base: 1 }], favorite: false },
  { id: 'p17', name: 'Bolsas medianas', product_type: 'disposable', base_unit: 'paquete', min_stock: 3, last_cost: 6.00, is_perishable: false, supplier_id: 's2', category: 'Descartables', conversions: [{ unit: 'paquete', factor_to_base: 1 }], favorite: false },
  { id: 'p18', name: 'Tápers mediano', product_type: 'disposable', base_unit: 'paquete', min_stock: 4, last_cost: 12.00, is_perishable: false, supplier_id: 's2', category: 'Descartables', conversions: [{ unit: 'paquete', factor_to_base: 1 }], favorite: false },
  { id: 'p19', name: 'Tápers grande', product_type: 'disposable', base_unit: 'paquete', min_stock: 3, last_cost: 14.00, is_perishable: false, supplier_id: 's2', category: 'Descartables', conversions: [{ unit: 'paquete', factor_to_base: 1 }], favorite: false },
  { id: 'p20', name: 'Cubiertos descartables', product_type: 'disposable', base_unit: 'paquete', min_stock: 4, last_cost: 7.00, is_perishable: false, supplier_id: 's2', category: 'Descartables', conversions: [{ unit: 'paquete', factor_to_base: 1 }], favorite: false },
  { id: 'p21', name: 'Arroz', product_type: 'supply', base_unit: 'kg', min_stock: 15, last_cost: 4.20, is_perishable: false, supplier_id: 's2', category: 'Insumos', conversions: [{ unit: 'kg', factor_to_base: 1 }, { unit: 'bolsa (5kg)', factor_to_base: 5 }], favorite: false },
  { id: 'p22', name: 'Sal', product_type: 'condiment', base_unit: 'kg', min_stock: 3, last_cost: 2.50, is_perishable: false, supplier_id: 's2', category: 'Salsas', conversions: [{ unit: 'kg', factor_to_base: 1 }], favorite: false },
  { id: 'p23', name: 'Ajo', product_type: 'vegetable', base_unit: 'kg', min_stock: 2, last_cost: 8.00, is_perishable: true, supplier_id: 's2', category: 'Verduras', conversions: [{ unit: 'kg', factor_to_base: 1 }], favorite: false },
  { id: 'p24', name: 'Papa criolla', product_type: 'vegetable', base_unit: 'kg', min_stock: 8, last_cost: 4.50, is_perishable: true, supplier_id: 's2', category: 'Verduras', conversions: [{ unit: 'kg', factor_to_base: 1 }], favorite: false },
  { id: 'p25', name: 'Ají amarillo', product_type: 'vegetable', base_unit: 'kg', min_stock: 3, last_cost: 7.00, is_perishable: true, supplier_id: 's2', category: 'Verduras', conversions: [{ unit: 'kg', factor_to_base: 1 }], favorite: false },
  { id: 'p26', name: 'Inca Kola 1.5L', product_type: 'beverage', base_unit: 'unidad', min_stock: 8, last_cost: 6.50, is_perishable: false, supplier_id: 's2', category: 'Bebidas', conversions: [{ unit: 'unidad', factor_to_base: 1 }], favorite: false },
  { id: 'p27', name: 'Agua mineral', product_type: 'beverage', base_unit: 'unidad', min_stock: 12, last_cost: 1.50, is_perishable: false, supplier_id: 's2', category: 'Bebidas', conversions: [{ unit: 'unidad', factor_to_base: 1 }], favorite: false },
  { id: 'p28', name: 'Especias (mix pollería)', product_type: 'condiment', base_unit: 'kg', min_stock: 2, last_cost: 18.00, is_perishable: false, supplier_id: 's1', category: 'Salsas', conversions: [{ unit: 'kg', factor_to_base: 1 }], favorite: false },
];

export const initialStockBalances: StockBalance[] = [
  { product_id: 'p1', quantity: 8 },
  { product_id: 'p2', quantity: 25 },
  { product_id: 'p3', quantity: 6 },
  { product_id: 'p4', quantity: 3 },
  { product_id: 'p5', quantity: 12 },
  { product_id: 'p6', quantity: 2.5 },
  { product_id: 'p7', quantity: 1.8 },
  { product_id: 'p8', quantity: 4 },
  { product_id: 'p9', quantity: 3.5 },
  { product_id: 'p10', quantity: 6 },
  { product_id: 'p11', quantity: 1.5 },
  { product_id: 'p12', quantity: 18 },
  { product_id: 'p13', quantity: 15 },
  { product_id: 'p14', quantity: 4 },
  { product_id: 'p15', quantity: 8 },
  { product_id: 'p16', quantity: 3 },
  { product_id: 'p17', quantity: 2 },
  { product_id: 'p18', quantity: 5 },
  { product_id: 'p19', quantity: 4 },
  { product_id: 'p20', quantity: 6 },
  { product_id: 'p21', quantity: 22 },
  { product_id: 'p22', quantity: 4 },
  { product_id: 'p23', quantity: 1.2 },
  { product_id: 'p24', quantity: 10 },
  { product_id: 'p25', quantity: 2 },
  { product_id: 'p26', quantity: 6 },
  { product_id: 'p27', quantity: 14 },
  { product_id: 'p28', quantity: 1.5 },
];

export const initialMovements: StockMovement[] = [
  { id: 'm1', product_id: 'p1', movement_type: 'waste', reason: 'Quemado', quantity: -0.25, input_quantity: 1, input_unit: 'cuarto', user_id: 'u2', occurred_at: '2026-01-15T14:30:00' },
  { id: 'm2', product_id: 'p1', movement_type: 'consumption', reason: 'Venta', quantity: -1, input_quantity: 1, input_unit: 'pollo', user_id: 'u2', occurred_at: '2026-01-15T13:00:00' },
  { id: 'm3', product_id: 'p2', movement_type: 'consumption', reason: 'Venta', quantity: -5, input_quantity: 5, input_unit: 'kg', user_id: 'u2', occurred_at: '2026-01-15T13:15:00' },
  { id: 'm4', product_id: 'p3', movement_type: 'waste', reason: 'Derramado', quantity: -0.5, input_quantity: 0.5, input_unit: 'litro', user_id: 'u2', occurred_at: '2026-01-15T11:00:00' },
  { id: 'm5', product_id: 'p6', movement_type: 'waste', reason: 'Vencido', quantity: -0.5, input_quantity: 0.5, input_unit: 'litro', user_id: 'u3', occurred_at: '2026-01-14T09:00:00' },
  { id: 'm6', product_id: 'p1', movement_type: 'purchase_in', reason: 'Compra proveedor', quantity: 20, input_quantity: 20, input_unit: 'pollo', user_id: 'u3', occurred_at: '2026-01-14T07:00:00' },
  { id: 'm7', product_id: 'p12', movement_type: 'consumption', reason: 'Venta', quantity: -6, input_quantity: 6, input_unit: 'unidad', user_id: 'u4', occurred_at: '2026-01-15T15:00:00' },
  { id: 'm8', product_id: 'p13', movement_type: 'consumption', reason: 'Venta', quantity: -4, input_quantity: 4, input_unit: 'unidad', user_id: 'u4', occurred_at: '2026-01-15T14:45:00' },
  { id: 'm9', product_id: 'p1', movement_type: 'waste', reason: 'Caído al piso', quantity: -0.125, input_quantity: 1, input_unit: 'octavo', user_id: 'u2', occurred_at: '2026-01-15T12:00:00' },
  { id: 'm10', product_id: 'p8', movement_type: 'waste', reason: 'Malogrado', quantity: -1, input_quantity: 1, input_unit: 'kg', user_id: 'u3', occurred_at: '2026-01-14T08:00:00' },
  { id: 'm11', product_id: 'p21', movement_type: 'purchase_in', reason: 'Compra proveedor', quantity: 25, input_quantity: 5, input_unit: 'bolsa (5kg)', user_id: 'u3', occurred_at: '2026-01-13T07:30:00' },
  { id: 'm12', product_id: 'p4', movement_type: 'purchase_in', reason: 'Compra balón', quantity: 2, input_quantity: 2, input_unit: 'balón', user_id: 'u3', occurred_at: '2026-01-13T10:00:00' },
  { id: 'm13', product_id: 'p1', movement_type: 'waste', reason: 'Error de preparación', quantity: -0.25, input_quantity: 1, input_unit: 'cuarto', user_id: 'u2', occurred_at: '2026-01-14T16:00:00' },
  { id: 'm14', product_id: 'p2', movement_type: 'waste', reason: 'Dañado en almacenamiento', quantity: -2, input_quantity: 2, input_unit: 'kg', user_id: 'u3', occurred_at: '2026-01-13T14:00:00' },
  { id: 'm15', product_id: 'p11', movement_type: 'consumption', reason: 'Venta', quantity: -0.5, input_quantity: 0.5, input_unit: 'kg', user_id: 'u2', occurred_at: '2026-01-15T14:00:00' },
  { id: 'm16', product_id: 'p25', movement_type: 'waste', reason: 'Vencido', quantity: -0.5, input_quantity: 0.5, input_unit: 'kg', user_id: 'u3', occurred_at: '2026-01-13T09:00:00' },
  { id: 'm17', product_id: 'p1', movement_type: 'waste', reason: 'Quemado', quantity: -0.25, input_quantity: 1, input_unit: 'cuarto', user_id: 'u2', occurred_at: '2026-01-13T15:30:00' },
  { id: 'm18', product_id: 'p14', movement_type: 'consumption', reason: 'Venta', quantity: -2, input_quantity: 2, input_unit: 'litro', user_id: 'u4', occurred_at: '2026-01-15T16:00:00' },
];

export const initialCounts: StockCount[] = [
  {
    id: 'c1',
    user_id: 'u2',
    created_at: '2026-01-14T22:00:00',
    status: 'pending',
    items: [
      { product_id: 'p1', expected_qty: 10, counted_qty: 8, difference_qty: -2 },
      { product_id: 'p2', expected_qty: 28, counted_qty: 25, difference_qty: -3 },
      { product_id: 'p3', expected_qty: 6.5, counted_qty: 6, difference_qty: -0.5 },
      { product_id: 'p12', expected_qty: 24, counted_qty: 18, difference_qty: -6 },
      { product_id: 'p13', expected_qty: 19, counted_qty: 15, difference_qty: -4 },
    ],
  },
];

export const initialNeeds: Need[] = [
  { id: 'n1', product_id: 'p1', description: 'Faltan pollos para el fin de semana', priority: 'urgent', status: 'open', user_id: 'u2', created_at: '2026-01-15T10:00:00' },
  { id: 'n2', product_id: 'p6', description: 'Crema de ají se está acabando', priority: 'normal', status: 'in_purchase', user_id: 'u2', created_at: '2026-01-14T16:00:00' },
  { id: 'n3', product_id: undefined, description: 'Necesitamos más tápers grandes', priority: 'normal', status: 'open', user_id: 'u4', created_at: '2026-01-15T11:30:00' },
  { id: 'n4', product_id: 'p17', description: 'Bolsas medianas casi agotadas', priority: 'urgent', status: 'open', user_id: 'u3', created_at: '2026-01-15T09:00:00' },
];

export const initialPurchaseRequests: PurchaseRequest[] = [
  { id: 'pr1', product_id: 'p1', quantity: 15, unit: 'pollo', supplier_id: 's1', status: 'pending', created_at: '2026-01-15T10:30:00' },
  { id: 'pr2', product_id: 'p6', quantity: 3, unit: 'litro', supplier_id: 's2', status: 'approved', created_at: '2026-01-14T16:30:00' },
  { id: 'pr3', product_id: 'p17', quantity: 5, unit: 'paquete', supplier_id: 's2', status: 'pending', created_at: '2026-01-15T09:15:00' },
];

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po1',
    supplier_id: 's1',
    items: [
      { product_id: 'p1', quantity: 20, unit: 'pollo', unit_cost: 14.50 },
      { product_id: 'p3', quantity: 5, unit: 'litro', unit_cost: 7.80 },
    ],
    status: 'sent',
    created_at: '2026-01-14T10:00:00',
    total: 329.00,
  },
];

export const initialAlerts: Alert[] = [
  { id: 'a1', type: 'low_stock', product_id: 'p1', message: 'Pollo entero bajo mínimo (8 de 10)', created_at: '2026-01-15T08:00:00', read: false },
  { id: 'a2', type: 'low_stock', product_id: 'p6', message: 'Crema de ají bajo mínimo (2.5 de 3)', created_at: '2026-01-15T08:00:00', read: false },
  { id: 'a3', type: 'low_stock', product_id: 'p16', message: 'Servilletas bajo mínimo (3 de 5)', created_at: '2026-01-15T08:00:00', read: false },
  { id: 'a4', type: 'low_stock', product_id: 'p17', message: 'Bolsas medianas bajo mínimo (2 de 3)', created_at: '2026-01-15T08:00:00', read: false },
  { id: 'a5', type: 'low_stock', product_id: 'p23', message: 'Ajo bajo mínimo (1.2 de 2)', created_at: '2026-01-15T08:00:00', read: false },
  { id: 'a6', type: 'low_stock', product_id: 'p25', message: 'Ají amarillo bajo mínimo (2 de 3)', created_at: '2026-01-15T08:00:00', read: false },
  { id: 'a7', type: 'low_stock', product_id: 'p12', message: 'Gaseosa personal bajo mínimo (18 de 24)', created_at: '2026-01-15T08:00:00', read: true },
  { id: 'a8', type: 'out_of_stock', product_id: 'p11', message: 'Limón agotado - verificar stock', created_at: '2026-01-15T07:00:00', read: false },
  { id: 'a9', type: 'count_discrepancy', product_id: 'p1', message: 'Diferencia en conteo: -2 pollos', created_at: '2026-01-14T22:30:00', read: true },
];

// Waste amounts per day for chart (last 7 days)
export const wasteByDay = [
  { day: 'Lun', amount: 45.50 },
  { day: 'Mar', amount: 32.00 },
  { day: 'Mié', amount: 68.75 },
  { day: 'Jue', amount: 28.50 },
  { day: 'Vie', amount: 52.00 },
  { day: 'Sáb', amount: 85.25 },
  { day: 'Dom', amount: 41.00 },
];
