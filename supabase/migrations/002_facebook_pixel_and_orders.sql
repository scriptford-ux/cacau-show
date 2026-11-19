-- ============================================
-- CacauShow Clone - Migration 002: Facebook Pixel & Orders
-- ============================================

-- Tabela de Configurações da Loja (Pixel ID, Token CAPI, Visitantes)
CREATE TABLE IF NOT EXISTS store_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  facebook_pixel_id VARCHAR(100) DEFAULT '',
  facebook_access_token TEXT DEFAULT '',
  facebook_test_code VARCHAR(100) DEFAULT '',
  live_visitors_base INTEGER DEFAULT 14,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir registro padrão se não existir
INSERT INTO store_settings (id, facebook_pixel_id, facebook_access_token, facebook_test_code, live_visitors_base)
VALUES ('default', '', '', '', 14)
ON CONFLICT (id) DO NOTHING;

-- Tabela de Pedidos Completa com Endereço e Itens
CREATE TABLE IF NOT EXISTS store_orders (
  id VARCHAR(50) PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(200) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  shipping_street VARCHAR(200) NOT NULL,
  shipping_number VARCHAR(50) NOT NULL,
  shipping_complement VARCHAR(100),
  shipping_neighborhood VARCHAR(100) NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_state VARCHAR(10) NOT NULL,
  shipping_zip_code VARCHAR(20) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'cancelled')),
  payment_method VARCHAR(30) NOT NULL DEFAULT 'pix' CHECK (payment_method IN ('pix', 'credit_card', 'boleto')),
  items JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_store_orders_status ON store_orders(status);
CREATE INDEX IF NOT EXISTS idx_store_orders_created_at ON store_orders(created_at DESC);
