'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { mockBanners } from '@/lib/mockData'

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  const heroBanners = mockBanners.filter((b) => b.section === 'hero' && b.active)

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroBanners.length)
  }, [heroBanners.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)
  }, [heroBanners.length])

  // Auto-play
  useEffect(() => {
    if (isHovered || heroBanners.length <= 1) return
    const timer = setInterval(goNext, 5000)
    return () => clearInterval(timer)
  }, [goNext, isHovered, heroBanners.length])

  // Touch Swipe
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
    if (distance > minSwipeDistance) {
      goNext()
    } else if (distance < -minSwipeDistance) {
      goPrev()
    }
  }

  if (heroBanners.length === 0) return null

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="w-full max-w-2xl mx-auto"
    >
      {/* 1. Main Banner Card */}
      <div className="relative w-full rounded-3xl overflow-hidden shadow-xs bg-[#fbf5ed] border border-[#f0e3d5]">
        {/* Aspect Ratio Container for 737x1024 Banners */}
        <div className="relative w-full aspect-[737/1024] max-h-[580px] sm:max-h-[680px]">
          {heroBanners.map((banner, index) => {
            const isActive = index === currentIndex

            return (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <Link href={banner.link_url || '#'} className="block relative w-full h-full">
                  <Image
                    src={banner.image_url}
                    alt={banner.title}
                    fill
                    className="object-cover object-center rounded-3xl"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 680px"
                  />
                </Link>
              </div>
            )
          })}

          {/* Left Arrow Button with Red Chevron */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              goPrev()
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-[#d32f2f] border border-gray-200/90 shadow-md rounded-xl p-2.5 transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
            aria-label="Banner anterior"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>

          {/* Right Arrow Button with Red Chevron */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              goNext()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-[#d32f2f] border border-gray-200/90 shadow-md rounded-xl p-2.5 transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
            aria-label="Próximo banner"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* 2. AS BOLINHAS ABAIXO (Pill Container Centered Below the Banner - 100% IDÊNTICO À FOTO) */}
      <div className="flex justify-center items-center mt-3.5 mb-4">
        <div className="bg-white border border-[#e5d8cb] rounded-full px-5 py-2 shadow-xs flex items-center gap-2.5">
          {heroBanners.map((_, index) => {
            const isActive = index === currentIndex

            return (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentIndex(index)
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#851926] scale-110'
                    : 'bg-[#edd5da] hover:bg-[#d8bac0]'
                }`}
                aria-label={`Ir para banner ${index + 1}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
