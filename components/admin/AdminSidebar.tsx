'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  Tag,
  ShoppingBag,
  CreditCard,
  Percent,
  Truck,
  Settings,
  Target,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Produtos', href: '/admin/produtos', icon: Package },
  { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
  { label: 'Categorias', href: '/admin/categorias', icon: Tag },
  { label: 'Transportadoras', href: '/admin/transportadoras', icon: Truck },
  { label: 'Pedidos', href: '/admin/pedidos', icon: ShoppingBag },
  { label: 'Gateway FreePay', href: '/admin/freepay', icon: CreditCard },
  { label: 'Pixel Facebook', href: '/admin/pixel', icon: Target },
  { label: 'Promoções', href: '/admin/promocoes', icon: Percent },
  { label: 'Configurações', href: '/admin/configuracoes', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'bg-cs-brown text-white flex flex-col min-h-screen transition-all duration-300 relative',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        {collapsed ? (
          <div className="flex justify-center">
            <span className="text-cs-orange font-black text-xl">CS</span>
          </div>
        ) : (
          <div>
            <span className="logo-font text-white text-xl">CacauShow</span>
            <p className="text-white/50 text-xs mt-0.5">Painel Admin</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-white text-cs-brown shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Ver loja' : undefined}
        >
          <span className={cn('text-base', collapsed && 'text-lg')}>🏪</span>
          {!collapsed && <span>Ver Loja</span>}
        </Link>
        <button
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-red-300 hover:bg-white/10 transition-all',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Sair' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-cs-brown border-2 border-white/20 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-cs-brown-dark transition-colors shadow-md"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
