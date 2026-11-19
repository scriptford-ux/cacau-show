// Tipos principais da aplicação CacauShow

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  active: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  original_price: number | null
  image_url: string
  images: string[]
  category_id: string | null
  category?: Category
  stock: number
  cacaus_points: number
  promo_badge?: string | null
  brand?: string
  active: boolean
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  link_url: string | null
  button_text: string | null
  order_index: number
  active: boolean
  section: 'hero' | 'promo' | 'featured'
  created_at: string
}

export interface PromoSection {
  id: string
  title: string
  subtitle: string | null
  type: 'carousel' | 'grid' | 'featured'
  active: boolean
  order_index: number
  products?: Product[]
  banner?: Banner
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

export interface Order {
  id: string
  user_id: string | null
  session_id: string | null
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  shipping_address: ShippingAddress | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  product_id: string
  product_name: string
  product_image: string
  price: number
  quantity: number
  cacaus_points: number
}

export interface ShippingAddress {
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'editor'
  created_at: string
}

// Store types
export interface Store {
  id: string
  name: string
  city: string
  state: string
  address: string
}

// Shipping & Carrier types
export interface Carrier {
  id: string
  name: string
  deadline: string
  price: number
  active: boolean
  badge?: string
}

export interface UserDeliveryAddress {
  cep: string
  number: string
  street?: string
  neighborhood?: string
  city?: string
  state?: string
  carrier?: Carrier
}
