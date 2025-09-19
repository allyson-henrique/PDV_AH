export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  preparationTime: number; // in minutes
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentOrder?: string;
  reservedBy?: string;
  reservedAt?: Date;
  occupiedAt?: Date;
  section?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod?: 'card' | 'pix' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'failed';
  customerName?: string;
  customerPhone?: string;
  tableId?: string;
  orderType: 'dine-in' | 'takeout' | 'delivery';
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface PaymentInfo {
  method: 'card' | 'pix' | 'cash';
  amount: number;
  change?: number;
  cardType?: 'credit' | 'debit';
  pixCode?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'admin' | 'cashier' | 'waiter' | 'kitchen' | 'manager';
  permissions: string[];
  createdAt?: Date;
  lastLogin?: Date;
}

export type View = 'menu' | 'cart' | 'payment' | 'admin' | 'kitchen' | 'tables' | 'totem';