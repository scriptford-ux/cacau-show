'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Search, Target, CircleUserRound } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useShippingStore } from '@/lib/shippingStore'
import CartSidebar from './CartSidebar'
import CepModal from './CepModal'
import FullscreenMenu from './FullscreenMenu'

export default function Header() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const { getItemCount, toggleCart } = useCartStore()
  const { openModal, userAddress } = useShippingStore()
  const itemCount = getItemCount()

  // Dynamic location text or default
  const locationText = userAddress?.city && userAddress?.state
    ? `${userAddress.city} - ${userAddress.state}`
    : 'Cacau Show - SP'

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/categoria/todos?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <>
      <header className="bg-[#3B180D] text-white sticky top-0 z-50 shadow-md border-b border-[#4a2214]">
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-3">
          {/* ROW 1: Logo Oficial CacauShow (Left) + Cart Badge & Menu 3 Barras (Right) */}
          <div className="flex items-center justify-between h-9 mb-3">
            {/* Logo CacauShow Oficial */}
            <Link href="/" className="flex items-center py-1">
              <Image
                src="/images/cacaushow-logo.png"
                alt="CacauShow"
                width={147}
                height={28}
                priority
                className="h-[27px] w-auto object-contain select-none brightness-105"
              />
            </Link>

            {/* Right Group: Cart com Selo Âmbar '0' + Menu Hambúrguer (3 Barras Finas) */}
            <div className="flex items-center gap-4">
              {/* Shopping Cart com badge 0 âmbar */}
              <button
                onClick={toggleCart}
                className="relative p-0.5 text-[#FEE9D8] hover:text-[#FBA800] transition-colors cursor-pointer"
                aria-label="Ver carrinho"
              >
                <ShoppingCart size={24} strokeWidth={2.1} />
                <span className="absolute -top-1.5 -right-2 bg-[#FBA800] text-[#3A0F00] text-[10.5px] font-black w-[17px] h-[17px] rounded-full flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              </button>

              {/* Menu Hambúrguer Oficial (3 Barras Finas) */}
              <button
                onClick={() => setMenuOpen(true)}
                className="p-1 text-[#FEE9D8] hover:text-[#FBA800] transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Abrir menu de navegação"
              >
                <div className="flex flex-col justify-between w-[18px] h-[13px]">
                  <span className="w-full h-[2px] bg-[#FEE9D8] rounded-full" />
                  <span className="w-full h-[2px] bg-[#FEE9D8] rounded-full" />
                  <span className="w-full h-[2px] bg-[#FEE9D8] rounded-full" />
                </div>
              </button>
            </div>
          </div>

          {/* ROW 2: Barra de Busca "Buscar produto" com Borda Fina e Lupa */}
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
            <input
              type="text"
              placeholder="Buscar produto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[45px] bg-[#34140A] border border-[#745343] rounded-xl pl-4 pr-12 text-[15px] text-[#FEE9D8] placeholder-[#FEE9D8] focus:outline-none focus:border-[#FBA800] transition-colors"
            />
            <button
              type="submit"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FDE9D2] hover:text-[#FBA800] transition-colors cursor-pointer"
              aria-label="Pesquisar"
            >
              <Search size={22} strokeWidth={2.2} />
            </button>
          </form>

          {/* ROW 3: Bloco de Localização à Esquerda + Botão Âmbar ENTRAR à Direita */}
          <div className="flex items-stretch gap-2.5">
            {/* Bloco de Localização e Alterar */}
            <div
              onClick={openModal}
              className="flex-1 bg-[#34140A] border border-[#4e2716] hover:border-[#6a361e] rounded-xl px-3.5 py-2 flex flex-col justify-center cursor-pointer transition-colors shadow-xs"
              role="button"
              tabIndex={0}
              aria-label="Alterar localização ou CEP"
            >
              {/* Linha: Ícone de Alvo / Mira + Localização */}
              <div className="flex items-center gap-1.5">
                <Target size={15} className="text-[#D4C5B3] flex-shrink-0" strokeWidth={2.2} />
                <span className="text-[#FCE4D3] text-[13.5px] font-semibold truncate leading-tight">
                  {locationText}
                </span>
              </div>
              {/* ALTERAR em âmbar dourado */}
              <span className="text-[#FEAF1F] font-extrabold text-[12px] tracking-wider uppercase pl-[21px] leading-tight mt-0.5 hover:underline">
                ALTERAR
              </span>
            </div>

            {/* Botão Sólido Âmbar: ENTRAR */}
            <Link
              href="/admin/login"
              className="w-[38%] sm:w-[35%] bg-[#FBA800] hover:bg-[#eaa000] text-[#3A0F00] rounded-xl flex items-center justify-center gap-2 px-3 transition-transform active:scale-[0.98] shadow-xs flex-shrink-0"
            >
              <CircleUserRound size={19} strokeWidth={2.4} className="text-[#3A0F00] flex-shrink-0" />
              <span className="font-black text-[13.5px] tracking-wider uppercase text-[#3A0F00]">
                ENTRAR
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Cart sidebar */}
      <CartSidebar />

      {/* CEP & Shipping Carrier Modal */}
      <CepModal />

      {/* Tela Cheia de Categorias (Menu Hamburger) */}
      <FullscreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
