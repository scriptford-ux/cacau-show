'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Minus, Plus } from 'lucide-react'
import { Product } from '@/lib/types'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { calculateDiscount } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCartStore()
  const { toggleWishlist, isWishlisted } = useWishlistStore()
  const wishlisted = isWishlisted(product.id)
  const discount = product.original_price
    ? calculateDiscount(product.original_price, product.price)
    : null

  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  // Parse price
  const priceParts = product.price.toFixed(2).split('.')
  const intPart = priceParts[0]
  const decPart = priceParts[1]

  return (
    <div
      className={cn(
        'product-card flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex-shrink-0',
        variant === 'compact' ? 'w-[220px]' : 'w-[250px]'
      )}
    >
      {/* Top Image area */}
      <div className="relative bg-white pt-4 px-4 pb-2 flex items-center justify-center h-48">
        {/* Wishlist button with golden outline */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-4 right-4 z-10 p-1 rounded-full transition-transform hover:scale-110"
          aria-label="Favoritar"
        >
          <Heart
            size={22}
            className={wishlisted ? 'text-red-500 fill-red-500' : 'text-[#d4a017]'}
            strokeWidth={1.8}
          />
        </button>

        {/* Discount badge if original price exists and no special promo */}
        {discount && discount > 0 && !product.promo_badge && (
          <div className="absolute top-4 left-4 bg-cs-orange text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            -{discount}%
          </div>
        )}

        {/* Product image */}
        <Link href={`/produto/${product.slug}`} className="relative w-36 h-36 flex items-center justify-center">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-contain hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Info container */}
      <div className="flex flex-col flex-1 px-4 pb-4 pt-1 gap-2 bg-white">
        {/* Product title */}
        <Link href={`/produto/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 min-h-[2.5rem] hover:text-cs-brown transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Badges container */}
        <div className="flex flex-wrap items-center gap-1.5 min-h-[28px]">
          {product.cacaus_points > 0 && (
            <span className="inline-flex items-center gap-1 bg-[#8b1a2b] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              🍫 {product.cacaus_points} CACAUS
            </span>
          )}
          {product.promo_badge && (
            <span className="inline-flex items-center text-[11px] font-medium text-[#8b1a3a] border border-[#b23b55] bg-[#fff5f6] px-3 py-1 rounded-full">
              {product.promo_badge}
            </span>
          )}
        </div>

        {/* Price section */}
        <div className="flex flex-col mt-0.5">
          {product.original_price && (
            <span className="text-xs text-gray-400 line-through italic">
              R$ {product.original_price.toFixed(2).replace('.', ',')}
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-gray-800">R$</span>
            <span className="text-2xl font-black text-gray-950 tracking-tight">
              {intPart}
            </span>
            <span className="text-sm font-bold text-gray-900">
              ,{decPart}
            </span>
            <span className="text-xs text-gray-400 font-normal ml-0.5">/un</span>
          </div>
        </div>

        {/* Quantity selector */}
        <div className="flex items-center border border-gray-200 rounded-xl px-2 py-1.5 justify-between bg-white mt-1">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Diminuir quantidade"
          >
            <Minus size={16} />
          </button>
          <span className="text-sm font-bold text-gray-900 min-w-[28px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-7 h-7 flex items-center justify-center text-cs-orange hover:text-cs-orange-dark transition-colors font-bold"
            aria-label="Aumentar quantidade"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Add to cart CTA */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#f5a623] hover:bg-[#e69715] text-[#2c1408] font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all uppercase tracking-wide mt-1"
        >
          <span>ADICIONAR AO CARRINHO</span>
          <ShoppingCart size={16} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}
