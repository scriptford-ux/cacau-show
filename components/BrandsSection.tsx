'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// As 5 marcas oficiais na ordem solicitada pelo usuário (iniciando por Lifestyle)
const marcas = [
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    image: '/images/marcas/marca-lifestyle.jpg',
    href: '/categoria/lifestyle',
  },
  {
    id: 'lacreme',
    name: 'laCreme',
    image: '/images/marcas/marca-lacreme.jpg',
    href: '/categoria/chocolate',
  },
  {
    id: 'bytes',
    name: 'Bytes',
    image: '/images/marcas/marca-bytes.jpg',
    href: '/categoria/chocolate',
  },
  {
    id: 'bendito-cacao',
    name: 'Bendito Cacao',
    image: '/images/marcas/marca-bendito-cacao.jpg',
    href: '/categoria/chocolate',
  },
  {
    id: 'biscoiteria',
    name: 'Biscoiteria',
    image: '/images/marcas/marca-biscoiteria.jpg',
    href: '/categoria/biscoito',
  },
]

export default function BrandsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + marcas.length) % marcas.length)
  }, [])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % marcas.length)
  }, [])

  // Auto-play suave a cada 5 segundos
  useEffect(() => {
    const timer = setInterval(handleNext, 5000)
    return () => clearInterval(timer)
  }, [handleNext])

  // Touch swipe
  const minSwipe = 50
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const dist = touchStart - touchEnd
    if (dist > minSwipe) handleNext()
    else if (dist < -minSwipe) handlePrev()
  }

  return (
    <section className="mb-10">
      {/* Título e Subtítulo da Seção (100% igual ao screenshot de Nossas Marcas) */}
      <div className="px-4 mb-2">
        <h2 className="text-2xl sm:text-[26px] font-black text-[#1a1a1a] tracking-tight leading-tight">
          Nossas Marcas
        </h2>
        <p className="text-sm sm:text-base text-gray-800 font-medium mt-0.5">
          Um universo de sabores para descobrir
        </p>
      </div>

      {/* Carrossel com fotos oficiais enviadas pelo usuário */}
      <div
        className="relative px-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Seta Esquerda */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handlePrev()
          }}
          className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-white text-[#d32f2f] border border-gray-200/90 shadow-md rounded-xl p-2.5 transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
          aria-label="Anterior"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>

        {/* Card da Imagem - quadrado perfeito com cantos arredondados */}
        <div className="relative w-full aspect-square max-h-[420px] rounded-2xl overflow-hidden shadow-xs bg-[#f8ede1]">
          {marcas.map((m, idx) => (
            <div
              key={m.id}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Link href={m.href} className="block relative w-full h-full">
                <Image
                  src={m.image}
                  alt={m.name}
                  fill
                  priority={idx === 0}
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Seta Direita */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleNext()
          }}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-white text-[#d32f2f] border border-gray-200/90 shadow-md rounded-xl p-2.5 transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
          aria-label="Próximo"
        >
          <ChevronRight size={24} strokeWidth={3} />
        </button>

        {/* Dots indicadores */}
        <div className="flex justify-center items-center gap-1.5 mt-3">
          {marcas.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-[#f5a623]'
                  : 'w-2 bg-[#d8c7b6] hover:bg-[#c2aea0]'
              }`}
              aria-label={`Ver marca ${marcas[idx].name}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
