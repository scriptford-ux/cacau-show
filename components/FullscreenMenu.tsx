'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  X,
  ShoppingCart,
  Search,
  ChevronDown,
  ChevronUp,
  Bookmark,
  User,
  Accessibility,
} from 'lucide-react'
import { useCartStore } from '@/lib/store'

interface FullscreenMenuProps {
  isOpen: boolean
  onClose: () => void
}

interface CategoryMenu {
  id: string
  title: string
  href: string
  items: { label: string; href: string }[]
}

const menuCategories: CategoryMenu[] = [
  {
    id: 'todos',
    title: 'Todos os Produtos',
    href: '/categoria/todos',
    items: [
      { label: 'Ver todos os chocolates', href: '/categoria/todos' },
      { label: 'Lançamentos & Novidades', href: '/novidades' },
      { label: 'Mais Vendidos', href: '/mais-vendidos' },
      { label: 'Promoções Choco Friday', href: '/promocoes' },
    ],
  },
  {
    id: 'chocolate',
    title: 'Chocolate',
    href: '/categoria/chocolate',
    items: [
      { label: 'Tabletes laCreme', href: '/categoria/tabletes' },
      { label: 'Trufas Artesanais', href: '/categoria/trufas' },
      { label: 'Bombons & Caixas', href: '/categoria/bombons' },
      { label: 'Linha Bendito Cacao (Puro Cacau)', href: '/categoria/bendito-cacao' },
      { label: 'Chocolates Zero Açúcar & Veganos', href: '/categoria/zero-acucar' },
    ],
  },
  {
    id: 'biscoito',
    title: 'Biscoito',
    href: '/categoria/biscoito',
    items: [
      { label: 'Waffles Holandeses com Chocolate', href: '/categoria/biscoito' },
      { label: 'Cookies Artesanais', href: '/categoria/biscoito' },
      { label: 'Canudos Recheados', href: '/categoria/biscoito' },
      { label: 'Biscoitos Amanteigados Finos', href: '/categoria/biscoito' },
    ],
  },
  {
    id: 'presentes',
    title: 'Presentes',
    href: '/categoria/presentes',
    items: [
      { label: 'Cestas Especiais com Laço', href: '/categoria/presentes' },
      { label: 'Pelúcias & Kits Colecionáveis', href: '/categoria/presentes' },
      { label: 'Caixas de Bombons para Presentear', href: '/categoria/bombons' },
      { label: 'Kits Harry Potter', href: '/categoria/presentes' },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    href: '/categoria/lifestyle',
    items: [
      { label: 'Copos & Garrafas Térmicas laCreme', href: '/categoria/lifestyle' },
      { label: 'Bolsas & Nécessaires Acolchoadas', href: '/categoria/lifestyle' },
      { label: 'Chaveiros & Pins Colecionáveis', href: '/categoria/lifestyle' },
      { label: 'Mochilas e Itens Exclusivos', href: '/categoria/lifestyle' },
    ],
  },
  {
    id: 'natal',
    title: 'Natal',
    href: '/categoria/panettones',
    items: [
      { label: 'Panettones laCreme ao Leite 650g', href: '/categoria/panettones' },
      { label: 'Panettones Trufados Frutas & Mezzo', href: '/categoria/panettones' },
      { label: 'Árvores e Enfeites de Chocolate', href: '/categoria/panettones' },
      { label: 'Cestas e Lembrancinhas de Natal', href: '/categoria/presentes' },
    ],
  },
]

const institutionalLinks = [
  { label: 'Seja um Revendedor', href: '/admin/login' },
  { label: 'Seja um Franqueado', href: '/franqueado' },
  { label: 'Para Empresas', href: '/empresas' },
  { label: 'Hotéis', href: '/hoteis' },
  { label: 'Cacau Park', href: '/cacau-park' },
  { label: 'Playcenter', href: '/playcenter' },
  { label: 'Cacau Lovers', href: '/cacau-lovers' },
  { label: 'Encontre uma Loja', href: '/lojas' },
  { label: 'Cartão Presente', href: '/cartao-presente' },
]

export default function FullscreenMenu({ isOpen, onClose }: FullscreenMenuProps) {
  const router = useRouter()
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const { getItemCount, toggleCart } = useCartStore()
  const itemCount = getItemCount()

  if (!isOpen) return null

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onClose()
      router.push(`/categoria/todos?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleCartClick = () => {
    onClose()
    toggleCart()
  }

  return (
    <div className="fixed inset-0 z-[60] bg-[#240e05] text-white overflow-y-auto flex flex-col animate-fade-in">
      {/* Top Header Row (Logo, Cart with badge, Close X) */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-white/5">
        {/* Logo Cursiva Oficial CacauShow */}
        <Link href="/" onClick={onClose} className="flex items-center">
          <Image
            src="/images/cacaushow-logo.png"
            alt="CacauShow"
            width={147}
            height={28}
            priority
            className="h-[27px] w-auto object-contain select-none brightness-105"
          />
        </Link>

        {/* Right Actions: Cart & X */}
        <div className="flex items-center gap-4">
          {/* Cart Icon with Counter */}
          <button
            onClick={handleCartClick}
            className="relative p-1 text-white hover:text-cs-orange transition-colors"
            aria-label="Carrinho"
          >
            <ShoppingCart size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-cs-orange text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

          {/* Close X Button */}
          <button
            onClick={onClose}
            className="p-1 text-white/90 hover:text-white transition-colors"
            aria-label="Fechar menu"
          >
            <X size={28} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Search Input Bar (Photo 1) */}
      <div className="px-5 pt-4 pb-2">
        <form onSubmit={handleSearch} className="relative w-full">
          <input
            type="text"
            placeholder="Buscar produto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e0b04] border border-[#4a2211] rounded-2xl py-3.5 pl-4 pr-12 text-sm text-white placeholder-white/50 focus:outline-none focus:border-cs-orange"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-cs-orange transition-colors"
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* Main Content Area */}
      <div className="px-5 py-4 space-y-3 flex-1 pb-16">
        {/* Category Accordion Cards (Photo 1) */}
        {menuCategories.map((category) => {
          const isAccordionOpen = !!openAccordions[category.id]

          return (
            <div key={category.id} className="rounded-2xl overflow-hidden transition-all">
              {/* Category Main Button */}
              <button
                onClick={() => toggleAccordion(category.id)}
                className="w-full bg-[#71301d] hover:bg-[#7e3722] text-white font-bold text-base sm:text-lg py-4 px-5 rounded-2xl flex items-center justify-between transition-colors shadow-xs"
              >
                <span>{category.title}</span>
                <span className="text-white/80 transition-transform">
                  {isAccordionOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                </span>
              </button>

              {/* Subcategories (Expanded Dropdown) */}
              {isAccordionOpen && (
                <div className="bg-[#562213] rounded-b-2xl mt-1 p-3 space-y-1 animate-fade-in">
                  {category.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className="block px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Bilhete Premiado (Golden Link with Bookmark) */}
        <div className="pt-2">
          <Link
            href="/bilhete-premiado"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-[#e5a020] hover:text-[#f7b94a] text-base font-bold transition-colors py-2"
          >
            <span>Bilhete Premiado</span>
            <Bookmark size={18} fill="currentColor" strokeWidth={1.5} />
          </Link>
        </div>

        {/* Destaque Natal (Solid Wine Red Card - Photo 1 & 2) */}
        <Link
          href="/categoria/panettones"
          onClick={onClose}
          className="block w-full bg-[#831628] hover:bg-[#961c31] text-white font-bold text-base sm:text-lg py-4 px-5 rounded-2xl shadow-sm transition-colors text-left"
        >
          <span>Natal</span>
        </Link>

        {/* Acessibilidade Row (Photo 1 & 2) */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={() => setAccessibilityOpen(!accessibilityOpen)}
            className="w-full flex items-center justify-between text-white/90 hover:text-white py-2 text-sm font-bold uppercase tracking-wider"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center">
                <Accessibility size={14} />
              </div>
              <span>ACESSIBILIDADE</span>
            </div>
            <ChevronDown
              size={18}
              className={`transition-transform ${accessibilityOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {accessibilityOpen && (
            <div className="bg-[#1c0a03] p-4 rounded-xl mt-2 text-xs text-white/70 space-y-2 animate-fade-in">
              <p>• Suporte a leitores de tela em conformidade com WCAG 2.1</p>
              <p>• Contraste aprimorado e navegação por teclado ativada</p>
            </div>
          )}
        </div>

        {/* Institutional Links List (Photo 2) */}
        <div className="pt-2 space-y-3.5 pb-6">
          {institutionalLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="block text-sm sm:text-base font-medium text-white/90 hover:text-[#f5a623] underline-offset-4 hover:underline transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
