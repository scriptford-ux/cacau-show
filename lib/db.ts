import fs from 'fs'
import path from 'path'
import { Product, Category, Banner } from './types'
import { mockProducts, mockCategories, mockBanners } from './mockData'

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string
}

export interface ShippingAddress {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_cpf?: string
  shipping_address: ShippingAddress
  items: OrderItem[]
  total: number
  status: 'paid' | 'pending' | 'cancelled'
  payment_method: 'pix' | 'credit_card' | 'boleto'
  freepay_transaction_id?: string
  pix_qr_code?: string
  pix_code?: string
  created_at: string
}

export interface StoreSettings {
  facebook_pixel_id: string
  facebook_access_token: string
  facebook_test_code?: string
  live_visitors_base: number
  freepay_enabled?: boolean
  freepay_public_key?: string
  freepay_secret_key?: string
  freepay_environment?: 'production' | 'sandbox'
}

interface DatabaseSchema {
  products: Product[]
  categories: Category[]
  banners: Banner[]
  orders: Order[]
  settings: StoreSettings
}

const DB_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DB_DIR, 'database.json')

const initialOrders: Order[] = [
  {
    id: 'ord-1092',
    order_number: '#CS-1092',
    customer_name: 'Mariana Alves Souza',
    customer_email: 'mariana.souza@gmail.com',
    customer_phone: '(11) 98765-4321',
    shipping_address: {
      street: 'Av. Paulista',
      number: '1578',
      complement: 'Apto 82',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zip_code: '01310-200',
    },
    items: [
      {
        id: '4',
        name: 'Caixa de Tabletes com Pelúcia Livro dos Monstros Harry Potter 160g',
        price: 99.99,
        quantity: 1,
        image_url: '/images/produtos/harry-potter-clean.jpg',
      },
      {
        id: '10',
        name: 'Tablete Miau de Chocolate ao Leite 70g',
        price: 19.99,
        quantity: 2,
        image_url: '/images/produtos/tablete-miau-clean.png',
      },
    ],
    total: 139.97,
    status: 'paid',
    payment_method: 'pix',
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 minutos atrás
  },
]

const initialSettings: StoreSettings = {
  facebook_pixel_id: '',
  facebook_access_token: '',
  facebook_test_code: '',
  live_visitors_base: 0,
}

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }

  if (!fs.existsSync(DB_FILE)) {
    const data: DatabaseSchema = {
      products: mockProducts,
      categories: mockCategories,
      banners: mockBanners,
      orders: initialOrders,
      settings: initialSettings,
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
    return data
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8')
    return JSON.parse(content) as DatabaseSchema
  } catch (err) {
    console.error('Error reading DB, reinitializing:', err)
    const data: DatabaseSchema = {
      products: mockProducts,
      categories: mockCategories,
      banners: mockBanners,
      orders: initialOrders,
      settings: initialSettings,
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
    return data
  }
}

function saveDb(data: DatabaseSchema) {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

// ============================================
// EXPORTED DB OPERATIONS
// ============================================

export const db = {
  // PRODUCTS
  getProducts(): Product[] {
    const data = ensureDb()
    return data.products
  },
  getProductById(id: string): Product | undefined {
    const data = ensureDb()
    return data.products.find((p) => p.id === id)
  },
  getProductBySlug(slug: string): Product | undefined {
    const data = ensureDb()
    return data.products.find((p) => p.slug === slug)
  },
  addProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    const data = ensureDb()
    const newProduct: Product = {
      ...product,
      id: String(Date.now()),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    data.products.unshift(newProduct)
    saveDb(data)
    return newProduct
  },
  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const data = ensureDb()
    const idx = data.products.findIndex((p) => p.id === id)
    if (idx === -1) return null
    data.products[idx] = {
      ...data.products[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    saveDb(data)
    return data.products[idx]
  },
  deleteProduct(id: string): boolean {
    const data = ensureDb()
    const lenBefore = data.products.length
    data.products = data.products.filter((p) => p.id !== id)
    if (data.products.length !== lenBefore) {
      saveDb(data)
      return true
    }
    return false
  },

  // ORDERS
  getOrders(): Order[] {
    const data = ensureDb()
    return data.orders
  },
  addOrder(order: Omit<Order, 'id' | 'order_number' | 'created_at'>): Order {
    const data = ensureDb()
    const id = `ord-${Date.now()}`
    const num = `#CS-${Math.floor(1000 + Math.random() * 9000)}`
    const newOrder: Order = {
      ...order,
      id,
      order_number: num,
      created_at: new Date().toISOString(),
    }
    data.orders.unshift(newOrder)
    saveDb(data)
    return newOrder
  },
  updateOrderStatus(id: string, status: Order['status']): boolean {
    const data = ensureDb()
    const order = data.orders.find((o) => o.id === id || o.order_number === id || o.freepay_transaction_id === id)
    if (!order) return false
    order.status = status
    saveDb(data)
    return true
  },
  updateOrder(id: string, updates: Partial<Order>): Order | null {
    const data = ensureDb()
    const index = data.orders.findIndex((o) => o.id === id || o.order_number === id || o.freepay_transaction_id === id)
    if (index === -1) return null
    data.orders[index] = { ...data.orders[index], ...updates }
    saveDb(data)
    return data.orders[index]
  },
  findOrder(id: string): Order | undefined {
    const data = ensureDb()
    return data.orders.find((o) => o.id === id || o.order_number === id || o.freepay_transaction_id === id)
  },
  deleteOrder(id: string): boolean {
    const data = ensureDb()
    const lenBefore = data.orders.length
    data.orders = data.orders.filter((o) => o.id !== id)
    if (data.orders.length !== lenBefore) {
      saveDb(data)
      return true
    }
    return false
  },

  // SETTINGS (Pixel & Token)
  getSettings(): StoreSettings {
    const data = ensureDb()
    return data.settings || initialSettings
  },
  updateSettings(settings: Partial<StoreSettings>): StoreSettings {
    const data = ensureDb()
    data.settings = {
      ...data.settings,
      ...settings,
    }
    saveDb(data)
    return data.settings
  },
}
