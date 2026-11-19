'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface ChocoPromoSlide {
  id: string
  type: 'image' | 'video'
  src: string
  title: string
  linkUrl: string
}

// Apenas as fotos e GIFs enviados pelo usuário para esta seção
const defaultSlides: ChocoPromoSlide[] = [
  // 1. Banner Esquenta Chocofriday (Foto enviada pelo usuário)
  {
    id: 'choco-banner-esquenta',
    type: 'image',
    src: '/images/chocofriday/banner-esquenta.jpg',
    title: 'Esquenta Choco Friday - Na compra de 2 o segundo sai por R$ 10,00',
    linkUrl: '/categoria/tabletes',
  },
  // 2. GIF / Vídeo Animado 1 (GIF enviado pelo usuário)
  {
    id: 'choco-anim-1',
    type: 'video',
    src: '/images/chocofriday/chocofriday-anim-1.mp4',
    title: 'Choco Friday Animado 1',
    linkUrl: '/categoria/todos',
  },
  // 3. GIF / Vídeo Animado 2 (GIF enviado pelo usuário)
  {
    id: 'choco-anim-2',
    type: 'video',
    src: '/images/chocofriday/chocofriday-anim-2.mp4',
    title: 'Choco Friday Animado 2',
    linkUrl: '/categoria/todos',
  },
]

interface PromoBannerCarouselProps {
  title?: string
  subtitle?: string
}

export default function PromoBannerCarousel({
  title = 'Chocofriday Cacau Show até 40% OFF!',
  subtitle = 'Aproveite já!',
}: PromoBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + defaultSlides.length) % defaultSlides.length)
  }, [])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % defaultSlides.length)
  }, [])

  // Auto-play suave a cada 6 segundos
  useEffect(() => {
    const timer = setInterval(handleNext, 6000)
    return () => clearInterval(timer)
  }, [handleNext])

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
      handleNext()
    } else if (distance < -minSwipeDistance) {
      handlePrev()
    }
  }

  return (
    <section className="mb-10">
      {/* 1. Título e Subtítulo da Seção (100% igual ao screenshot) */}
      <div className="px-4 mb-2">
        <h2 className="text-2xl sm:text-[26px] font-black text-[#1a1a1a] tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-gray-800 font-semibold mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* 2. Container do Banner em Largura Cheia com Cantos Arredondados */}
      <div
        className="px-4 relative"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Card do Banner (Preenche todo o container sem bordas extras) */}
        <div className="relative w-full aspect-[390/410] max-h-[460px] rounded-2xl overflow-hidden shadow-xs bg-[#f8ede1]">
          {defaultSlides.map((slide, index) => {
            const isActive = index === currentIndex

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* TIPO 1: BANNER IMAGEM (ESQUENTA CHOCO FRIDAY - 100% IGUAL À FOTO) */}
                {slide.type === 'image' && (
                  <Link href={slide.linkUrl} className="block relative w-full h-full">
                    <Image
                      src={slide.src}
                      alt={slide.title}
                      fill
                      priority={index === 0}
                      className="object-cover object-center rounded-2xl"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </Link>
                )}

                {/* TIPO 2: GIF / VÍDEO ANIMADO (WhatsApp Animated) */}
                {slide.type === 'video' && (
                  <Link href={slide.linkUrl} className="block relative w-full h-full bg-[#3a1a0c] rounded-2xl overflow-hidden">
                    <video
                      src={slide.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover object-center rounded-2xl"
                    />
                  </Link>
                )}
              </div>
            )
          })}

          {/* Seta Esquerda Branca com Chevron Vermelho */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handlePrev()
            }}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-[#d32f2f] border border-gray-200/90 shadow-md rounded-xl p-2.5 transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
            aria-label="Item anterior"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>

          {/* Seta Direita Branca com Chevron Vermelho */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-[#d32f2f] border border-gray-200/90 shadow-md rounded-xl p-2.5 transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
            aria-label="Próximo item"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Indicador de Bolinhas Abaixo */}
        <div className="flex justify-center items-center gap-1.5 mt-3">
          {defaultSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-[#f5a623]'
                  : 'w-2 bg-[#d8c7b6] hover:bg-[#c2aea0]'
              }`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
