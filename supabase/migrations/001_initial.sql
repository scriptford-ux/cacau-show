-- ============================================
-- CacauShow Clone - Database Schema
-- Execute no SQL Editor do Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image_url TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  cacaus_points INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BANNERS
-- ============================================
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  button_text VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  section VARCHAR(20) DEFAULT 'hero' CHECK (section IN ('hero', 'promo', 'featured')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROMOTIONAL SECTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS promotional_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  subtitle TEXT,
  type VARCHAR(20) DEFAULT 'carousel' CHECK (type IN ('carousel', 'grid', 'featured')),
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CARRIERS & SHIPPING
-- ============================================
CREATE TABLE IF NOT EXISTS carriers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  deadline VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  badge VARCHAR(50),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Section to products mapping
CREATE TABLE IF NOT EXISTS section_products (
  section_id UUID REFERENCES promotional_sections(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  PRIMARY KEY (section_id, product_id)
);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10, 2) NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  customer_name VARCHAR(100),
  customer_email VARCHAR(200),
  customer_phone VARCHAR(20),
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CART (session-based)
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(100) NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, product_id)
);

-- ============================================
-- WISHLIST
-- ============================================
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id VARCHAR(100),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADMIN USERS
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(200) NOT NULL UNIQUE,
  role VARCHAR(20) DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_banners_section ON banners(section);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items(session_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies (products, categories, banners)
CREATE POLICY "products_public_read" ON products FOR SELECT USING (active = true);
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (active = true);
CREATE POLICY "banners_public_read" ON banners FOR SELECT USING (active = true);

-- Cart policies (session-based)
CREATE POLICY "cart_session_read" ON cart_items FOR SELECT USING (true);
CREATE POLICY "cart_session_insert" ON cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "cart_session_update" ON cart_items FOR UPDATE USING (true);
CREATE POLICY "cart_session_delete" ON cart_items FOR DELETE USING (true);

-- Orders: users can read their own
CREATE POLICY "orders_user_read" ON orders FOR SELECT
  USING (auth.uid() = user_id OR session_id IS NOT NULL);
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);

-- Admin full access (service role bypasses RLS)
-- For admin routes use service role key

-- ============================================
-- SEED DATA
-- ============================================

-- Categories
INSERT INTO categories (name, slug, active) VALUES
  ('Panettones', 'panettones', true),
  ('Trufas', 'trufas', true),
  ('Bombons', 'bombons', true),
  ('Tabletes', 'tabletes', true),
  ('Presentes', 'presentes', true)
ON CONFLICT (slug) DO NOTHING;

-- Banners
INSERT INTO banners (title, subtitle, image_url, link_url, button_text, order_index, section) VALUES
  ('CHOCO FRIDAY', 'Panettones 580g por apenas R$ 59,99', 
   'https://images.unsplash.com/photo-1607920592519-bab2a80c4b65?w=800',
   '/categoria/panettones', 'Compre agora', 1, 'hero'),
  ('Momento Natal', 'Panettone Trufado Frutas - O presente perfeito', 
   'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800',
   '/categoria/panettones', 'Ver mais', 2, 'hero'),
  ('Escolha o Presente Ideal', 'Todos os Momentos Combinam com Cacau Show', 
   'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800',
   '/categoria/presentes', 'Explorar', 3, 'hero')
ON CONFLICT DO NOTHING;

-- Products (insert after categories, using subquery for category_id)
INSERT INTO products (name, slug, description, price, original_price, image_url, category_id, stock, cacaus_points, active, featured)
SELECT 
  p.name, p.slug, p.description, p.price, p.original_price, p.image_url,
  c.id, p.stock, p.cacaus_points, p.active, p.featured
FROM (VALUES
  ('Caixa de Tabletes com Pelúcia Livro dos Monstros Harry Potter 160g', 'caixa-tabletes-pelucia-livro-monstros-harry-potter-160g',
   'Kit exclusivo Harry Potter com tabletes de chocolate e pelúcia oficial do Livro dos Monstros.',
   99.99, 109.99, '/images/produtos/harry-potter-clean.jpg',
   'presentes', 20, 8, true, true),
  ('Tablete Miau de Chocolate ao Leite 70g', 'tablete-miau-de-chocolate-ao-leite-70g',
   'O clássico chocolate Língua de Gato da Cacau Show com formato divertido e derretimento suave.',
   19.99, 22.29, '/images/produtos/tablete-miau-clean.png',
   'tabletes', 150, 0, true, true),
  ('Panettone laCreme ao Leite 650g', 'panettone-lacreme-ao-leite-650g',
   'Panettone artesanal com recheio cremoso de leite condensado e cobertura especial.',
   69.99, 109.99, '/images/momentos/momento-natal.webp',
   'panettones', 50, 10, true, true),
  ('Tablete laCreme Duo Intense 100g', 'tablete-lacreme-duo-intense-100g',
   'Combinação nobre de chocolate ao leite e intenso laCreme.',
   22.99, 24.49, '/images/produtos/tablete-duo-intense.jpg',
   'tabletes', 100, 2, true, true),
  ('Panettone Trufado Frutas 750g', 'panettone-trufado-frutas-750g',
   'Clássico panettone com frutas cristalizadas e trufas artesanais.',
   79.99, 119.99, '/images/momentos/momento-natal.webp',
   'panettones', 60, 12, true, true),
  ('Panettone Mezzo 580g', 'panettone-mezzo-580g',
   'Panettone premium com mix de chocolates finos.',
   59.99, 89.99, '/images/momentos/momento-natal.webp',
   'panettones', 35, 8, true, true),
  ('Trufa Premium Dark 70% 200g', 'trufa-premium-dark-70-200g',
   'Trufas artesanais com chocolate amargo 70% cacau de origem.',
   45.99, 65.99, '/images/marcas/marca-bendito-cacao.jpg',
   'trufas', 40, 6, true, false),
  ('Cesta Natal Premium', 'cesta-natal-premium',
   'Cesta especial de Natal com seleção dos melhores chocolates da CacauShow.',
   189.99, 249.99, '/images/momentos/momento-natal.webp',
   'presentes', 15, 20, true, false)
) AS p(name, slug, description, price, original_price, image_url, cat_slug, stock, cacaus_points, active, featured)
JOIN categories c ON c.slug = p.cat_slug
ON CONFLICT (slug) DO NOTHING;
