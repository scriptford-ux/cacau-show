'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, ShoppingCart } from 'lucide-react'
import { Product } from '@/lib/types'
import { useCartStore, useWishlistStore } from '@/lib/store'

interface ProductCarouselProps {
  title: string
  subtitle?: string
  products: Product[]
}

export default function ProductCarousel({ title, subtitle, products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const { addItem } = useCartStore()
  const { toggleWishlist, isWishlisted } = useWishlistStore()

  if (products.length === 0) return null

  const currentProduct = products[currentIndex]
  const currentQuantity = quantities[currentProduct.id] || 1
  const wishlisted = isWishlisted(currentProduct.id)

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  // Swipe handling
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe) {
      handleNext()
    } else if (isRightSwipe) {
      handlePrev()
    }
  }

  const updateQuantity = (delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [currentProduct.id]: Math.max(1, (prev[currentProduct.id] || 1) + delta),
    }))
  }

  const handleAddToCart = () => {
    addItem(currentProduct, currentQuantity)
  }

  // Price formatting
  const priceParts = currentProduct.price.toFixed(2).split('.')
  const intPart = priceParts[0]
  const decPart = priceParts[1]

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="px-4 mb-3">
        <h2 className="text-2xl font-black text-[#1a1a1a] tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-700 font-medium mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* 1-Product Carousel Card Container */}
      <div className="px-4 relative">
        {/* Main Single-Product Card */}
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="bg-white rounded-3xl border border-gray-200/90 shadow-sm overflow-hidden relative"
        >
          {/* Top Wishlist Heart (Golden Outline) */}
          <button
            onClick={() => toggleWishlist(currentProduct.id)}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:scale-110 transition-transform"
            aria-label="Favoritar"
          >
            <Heart
              size={26}
              className={wishlisted ? 'text-red-500 fill-red-500' : 'text-[#e5a020]'}
              strokeWidth={2}
            />
          </button>

          {/* Product Image Area with centered navigation arrows */}
          <div className="relative pt-6 pb-2 px-6 flex items-center justify-center bg-white">
            {/* Left Nav Button - centralizado na imagem sem sobrepor o título */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handlePrev()
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-50 text-[#d32f2f] border border-gray-200 shadow-md rounded-xl p-2.5 transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
              aria-label="Produto anterior"
            >
              <ChevronLeft size={24} strokeWidth={3} />
            </button>

            <Link
              href={`/produto/${currentProduct.slug}`}
              className="relative w-full h-64 sm:h-72 flex items-center justify-center"
            >
              <Image
                src={currentProduct.image_url}
                alt={currentProduct.name}
                fill
                className="object-contain hover:scale-105 transition-transform duration-300"
                priority
              />
            </Link>

            {/* Right Nav Button - centralizado na imagem sem sobrepor o título */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-50 text-[#d32f2f] border border-gray-200 shadow-md rounded-xl p-2.5 transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
              aria-label="Próximo produto"
            >
              <ChevronRight size={24} strokeWidth={3} />
            </button>
          </div>

          {/* Card Body Info */}
          <div className="px-5 pt-2 pb-5">
            {/* Product Title */}
            <Link href={`/produto/${currentProduct.slug}`}>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug line-clamp-2 hover:text-cs-brown transition-colors mb-3">
                {currentProduct.name}
              </h3>
            </Link>

            {/* Badges Row (Cacaus & Promos) */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {currentProduct.cacaus_points > 0 && (
                <span className="inline-flex items-center gap-1 bg-[#7a1622] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  🍫 {currentProduct.cacaus_points} CACAUS
                </span>
              )}
              {currentProduct.promo_badge && (
                <span className="inline-flex items-center text-xs font-semibold text-[#8b1a3a] border border-[#a83250] bg-[#fff5f6] px-3.5 py-1 rounded-full">
                  {currentProduct.promo_badge}
                </span>
              )}
            </div>

            {/* Price & Quantity Row (side by side!) */}
            <div className="flex items-end justify-between pt-1">
              {/* Left: Prices */}
              <div className="flex flex-col">
                {currentProduct.original_price && (
                  <span className="text-sm text-gray-400 line-through italic mb-0.5 font-medium">
                    R$ {currentProduct.original_price.toFixed(2).replace('.', ',')}
                  </span>
                )}
                <div className="flex items-baseline">
                  <span className="text-sm font-extrabold text-gray-900 mr-1">R$</span>
                  <span className="text-3xl font-black text-gray-950 tracking-tight">
                    {intPart}
                  </span>
                  <span className="text-xl font-black text-gray-950">
                    ,{decPart}
                  </span>
                  <span className="text-xs text-gray-400 font-normal ml-1">/un</span>
                </div>
              </div>

              {/* Right: Quantity Selector */}
              <div className="flex items-center border border-gray-200 rounded-xl px-3 py-1.5 bg-white min-w-[124px] justify-between shadow-xs">
                <button
                  onClick={() => updateQuantity(-1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="Diminuir quantidade"
                >
                  <Minus size={18} strokeWidth={2.5} />
                </button>
                <span className="text-base font-bold text-gray-900 px-2 min-w-[24px] text-center">
                  {currentQuantity}
                </span>
                <button
                  onClick={() => updateQuantity(1)}
                  className="w-8 h-8 flex items-center justify-center text-[#f5a623] hover:text-[#d48914] transition-colors"
                  aria-label="Aumentar quantidade"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>

          {/* Full-Width Bottom CTA Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#f5a623] hover:bg-[#e69715] text-[#2c1408] font-black text-sm py-4 flex items-center justify-center gap-3 transition-colors active:scale-[0.99] uppercase tracking-wider"
          >
            <span>ADICIONAR AO CARRINHO</span>
            <ShoppingCart size={20} strokeWidth={2.2} />
          </button>
        </div>

        {/* Carousel Indicators / Dots below card */}
        {products.length > 1 && (
          <div className="flex justify-center items-center gap-1.5 mt-3">
            {products.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-6 bg-cs-orange' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ver produto ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
