'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

export interface VideoStory {
  id: string
  title: string
  originalPrice: string
  price: string
  posterUrl: string
  videoUrl?: string
  productSlug: string
  thumbUrl: string
}

const stories: VideoStory[] = [
  {
    id: 'story-frutas-vermelhas',
    title: 'Panetone de Frutas Vermelhas 58...',
    originalPrice: 'R$ 99,99',
    price: 'R$ 89,99',
    posterUrl: '/images/video-reels-frutas-vermelhas.jpg',
    videoUrl: '/images/chocofriday/chocofriday-anim-1.mp4',
    productSlug: 'panettone-trufado-frutas-750g',
    thumbUrl: '/images/momentos/momento-natal.webp',
  },
  {
    id: 'story-lacreme',
    title: 'Panettone laCreme ao Leite 65...',
    originalPrice: 'R$ 109,99',
    price: 'R$ 69,99',
    posterUrl: '/images/momentos/momento-natal.webp',
    videoUrl: '/images/chocofriday/chocofriday-anim-2.mp4',
    productSlug: 'panettone-lacreme-ao-leite-650g',
    thumbUrl: '/images/momentos/momento-natal.webp',
  },
  {
    id: 'story-miau',
    title: 'Tablete Miau de Chocolate ao ...',
    originalPrice: 'R$ 22,29',
    price: 'R$ 19,99',
    posterUrl: '/images/marcas/marca-lacreme.jpg',
    videoUrl: '/images/chocofriday/chocofriday-anim-1.mp4',
    productSlug: 'tablete-miau-de-chocolate-ao-leite-70g',
    thumbUrl: '/images/produtos/tablete-miau-clean.png',
  },
]

export default function VideoStoriesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePrev = useCallback(() => {
    setIsPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length)
  }, [])

  const handleNext = useCallback(() => {
    setIsPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % stories.length)
  }, [])

  const togglePlay = () => {
    if (!videoRef.current) {
      setIsPlaying(!isPlaying)
      return
    }
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  // Touch Swipe
  const minSwipe = 40
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

  const current = stories[currentIndex]
  const prevStory = stories[(currentIndex - 1 + stories.length) % stories.length]
  const nextStory = stories[(currentIndex + 1) % stories.length]

  return (
    <section className="mb-10">
      {/* 1. Header da Seção: Título igual ao print do usuário */}
      <div className="px-4 mb-2">
        <h2 className="text-2xl sm:text-[26px] font-black text-[#1a1a1a] tracking-tight leading-tight">
          O encanto do Natal em cada escolha
        </h2>
      </div>

      {/* 2. Botões de Navegação no topo/laterais como na referência */}
      <div className="relative px-4">
        <div className="flex justify-between items-center mb-2 px-1">
          <button
            onClick={handlePrev}
            className="bg-white hover:bg-gray-50 text-[#d32f2f] border border-gray-200/90 shadow-xs rounded-xl p-2 transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
            aria-label="Vídeo anterior"
          >
            <ChevronLeft size={22} strokeWidth={3} />
          </button>
          <button
            onClick={handleNext}
            className="bg-white hover:bg-gray-50 text-[#d32f2f] border border-gray-200/90 shadow-xs rounded-xl p-2 transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
            aria-label="Próximo vídeo"
          >
            <ChevronRight size={22} strokeWidth={3} />
          </button>
        </div>

        {/* 3. Container do Carrossel com cards laterais visíveis (peeking) */}
        <div
          className="relative w-full overflow-hidden py-1"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-4 px-1">
            {/* Card Anterior (Peek à esquerda - visível em todos os tamanhos) */}
            <div
              onClick={handlePrev}
              className="relative w-[12%] sm:w-[16%] aspect-[9/13.5] rounded-xl sm:rounded-2xl overflow-hidden opacity-35 blur-[0.5px] cursor-pointer hover:opacity-60 transition-opacity flex-shrink-0"
            >
              <Image
                src={prevStory.posterUrl}
                alt={prevStory.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/25" />
            </div>

            {/* Card Ativo Central (100% IDÊNTICO À FOTO DO USUÁRIO) */}
            <div className="relative w-[76%] max-w-[340px] aspect-[9/13.5] rounded-3xl overflow-hidden shadow-md bg-black flex-shrink-0">
              {/* Vídeo / Poster */}
              {isPlaying && current.videoUrl ? (
                <video
                  ref={videoRef}
                  src={current.videoUrl}
                  autoPlay
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                  onEnded={() => setIsPlaying(false)}
                />
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={current.posterUrl}
                    alt={current.title}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="340px"
                  />

                  {/* Botão de Play circular translúcido no centro (apenas se não estiver embutido) */}
                  {currentIndex !== 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-xs border border-white/60 flex items-center justify-center text-white shadow-lg">
                        <Play size={24} className="ml-1 fill-white" />
                      </div>
                    </div>
                  )}

                  {/* Clique no card para tocar vídeo */}
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 w-full h-full cursor-pointer z-10"
                    aria-label="Reproduzir vídeo"
                  />
                </div>
              )}

              {/* Botão de Pausa se estiver tocando */}
              {isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                  aria-label="Pausar"
                >
                  <Pause size={18} />
                </button>
              )}

              {/* Pílula flutuante inferior com informações do produto (para o card 2 e 3 que não têm no poster) */}
              {currentIndex !== 0 && (
                <Link
                  href={`/produto/${current.productSlug}`}
                  className="absolute bottom-3 left-3 right-3 z-20 bg-black/80 hover:bg-black/90 backdrop-blur-md rounded-2xl p-2.5 flex items-center gap-3 text-white shadow-xl transition-transform active:scale-95"
                >
                  <div className="w-12 h-12 rounded-xl bg-white p-1 overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={current.thumbUrl}
                      alt={current.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {current.title}
                    </h4>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-[11px] text-gray-400 line-through">
                        {current.originalPrice}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {current.price}
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Para o card 1 (que já tem o design exato com a pílula gravada na imagem), tornamos a área inferior clicável para abrir o produto */}
              {currentIndex === 0 && !isPlaying && (
                <Link
                  href={`/produto/${current.productSlug}`}
                  className="absolute bottom-2 left-2 right-2 h-16 z-20 rounded-2xl cursor-pointer"
                  aria-label="Ver Panetone de Frutas Vermelhas"
                />
              )}
            </div>

            {/* Card Seguinte (Peek à direita - visível em todos os tamanhos) */}
            <div
              onClick={handleNext}
              className="relative w-[12%] sm:w-[16%] aspect-[9/13.5] rounded-xl sm:rounded-2xl overflow-hidden opacity-35 blur-[0.5px] cursor-pointer hover:opacity-60 transition-opacity flex-shrink-0"
            >
              <Image
                src={nextStory.posterUrl}
                alt={nextStory.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/25" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
