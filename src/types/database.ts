// Database types for Supabase integration
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  image_url: string | null;
  available: boolean;
  preparation_time: number;
  cost_price: number | null;
  stock_quantity: number;
  track_stock: boolean;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
    color: string;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  color: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  table_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  order_type: 'dine-in' | 'takeout' | 'delivery';
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  subtotal: number;
  discount: number;
  total: number;
  guest_count: number | null;
  notes: string | null;
  integration_source: string | null;
  integration_order_id: string | null;
  nfe_number: string | null;
  nfe_key: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  tables?: {
    number: number;
  };
  payments?: Payment[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
  created_at: string;
  products?: {
    name: string;
    price: number;
    preparation_time: number;
  };
}

export interface Payment {
  id: string;
  order_id: string;
  payment_method_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  transaction_id: string | null;
  change_amount: number;
  pix_code: string | null;
  card_type: 'credit' | 'debit' | null;
  installments: number;
  created_at: string;
  payment_methods?: {
    name: string;
    type: string;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'pix' | 'voucher';
  active: boolean;
  fee_percentage: number;
  created_at: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  section: string;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  current_order_id: string | null;
  reserved_by: string | null;
  reserved_at: string | null;
  occupied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Integration {
  id: string;
  name: string;
  type: 'delivery' | 'payment' | 'nfe';
  active: boolean;
  config: Record<string, any>;
  credentials: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string | null;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PrinterConfig {
  id: string;
  name: string;
  type: 'kitchen' | 'receipt' | 'bar';
  ip_address: string | null;
  port: number;
  model: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NFeConfig {
  id: string;
  company_id: string;
  certificate_path: string | null;
  certificate_password: string | null;
  environment: 'producao' | 'homologacao';
  serie_number: number;
  last_number: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}