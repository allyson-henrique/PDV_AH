/*
  # Sistema POS - Schema Inicial

  1. Tabelas Principais
    - `companies` - Dados da empresa
    - `products` - Produtos do cardápio
    - `categories` - Categorias dos produtos
    - `tables` - Mesas do restaurante
    - `orders` - Pedidos
    - `order_items` - Itens dos pedidos
    - `payments` - Pagamentos
    - `payment_methods` - Métodos de pagamento
    - `suppliers` - Fornecedores
    - `integrations` - Integrações (iFood, Uber Eats, etc.)
    - `nfe_config` - Configuração NFe
    - `printer_config` - Configuração de impressoras

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas para usuários autenticados
*/

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cnpj text,
  address text,
  phone text,
  email text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  color text DEFAULT '#f97316',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  category_id uuid REFERENCES categories(id),
  image_url text,
  available boolean DEFAULT true,
  preparation_time integer DEFAULT 15,
  cost_price decimal(10,2),
  stock_quantity integer DEFAULT 0,
  track_stock boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tables
CREATE TABLE IF NOT EXISTS tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer NOT NULL UNIQUE,
  capacity integer NOT NULL,
  section text DEFAULT 'Principal',
  status text DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'cleaning')),
  current_order_id uuid,
  reserved_by text,
  reserved_at timestamptz,
  occupied_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payment Methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('cash', 'card', 'pix', 'voucher')),
  active boolean DEFAULT true,
  fee_percentage decimal(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  table_id uuid REFERENCES tables(id),
  customer_name text,
  customer_phone text,
  customer_email text,
  order_type text NOT NULL CHECK (order_type IN ('dine-in', 'takeout', 'delivery')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'delivered', 'cancelled')),
  subtotal decimal(10,2) NOT NULL,
  discount decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,
  guest_count integer,
  notes text,
  integration_source text, -- 'ifood', 'ubereats', 'local', etc.
  integration_order_id text,
  nfe_number text,
  nfe_key text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  payment_method_id uuid REFERENCES payment_methods(id),
  amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  transaction_id text,
  change_amount decimal(10,2) DEFAULT 0,
  pix_code text,
  card_type text CHECK (card_type IN ('credit', 'debit')),
  installments integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cnpj text,
  contact_name text,
  phone text,
  email text,
  address text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Integrations
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, -- 'ifood', 'ubereats', 'rappi', etc.
  type text NOT NULL CHECK (type IN ('delivery', 'payment', 'nfe')),
  active boolean DEFAULT false,
  config jsonb DEFAULT '{}',
  credentials jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- NFe Configuration
CREATE TABLE IF NOT EXISTS nfe_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  certificate_path text,
  certificate_password text,
  environment text DEFAULT 'homologacao' CHECK (environment IN ('producao', 'homologacao')),
  serie_number integer DEFAULT 1,
  last_number integer DEFAULT 0,
  active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Printer Configuration
CREATE TABLE IF NOT EXISTS printer_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('kitchen', 'receipt', 'bar')),
  ip_address text,
  port integer DEFAULT 9100,
  model text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfe_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE printer_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow all operations for authenticated users" ON companies FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON tables FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON payment_methods FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON orders FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON order_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON payments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON suppliers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON integrations FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON nfe_config FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON printer_config FOR ALL TO authenticated USING (true);

-- Insert default data
INSERT INTO payment_methods (name, type) VALUES
  ('Dinheiro', 'cash'),
  ('Cartão de Crédito', 'card'),
  ('Cartão de Débito', 'card'),
  ('PIX', 'pix'),
  ('Vale Refeição', 'voucher');

INSERT INTO categories (name, description, color) VALUES
  ('Hamburgers', 'Hambúrgueres artesanais', '#f97316'),
  ('Acompanhamentos', 'Batatas, anéis de cebola e mais', '#eab308'),
  ('Bebidas', 'Refrigerantes, sucos e milkshakes', '#3b82f6'),
  ('Sobremesas', 'Doces e sobremesas', '#ec4899');

INSERT INTO integrations (name, type, active) VALUES
  ('iFood', 'delivery', false),
  ('Uber Eats', 'delivery', false),
  ('Rappi', 'delivery', false),
  ('Mercado Pago', 'payment', false),
  ('PagSeguro', 'payment', false),
  ('NFe.io', 'nfe', false);