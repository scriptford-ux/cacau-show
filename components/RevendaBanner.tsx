'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function RevendaBanner() {
  return (
    <section className="mb-10 px-4">
      <div className="relative">
        {/* Seta Esquerda */}
        <button
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-[#d32f2f] border border-gray-200/90 shadow-md rounded-xl p-2.5 transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
          aria-label="Anterior"
        >
          <ChevronLeft size={22} strokeWidth={3} />
        </button>

        {/* Container Principal com a cor verde-oliva oficial do print (#d2ce6c) */}
        <div className="bg-[#d2ce6c] rounded-3xl p-3 sm:p-5 shadow-xs">
          {/* Card Oficial Celso Portiolli + Revenda Cacau Show (100% fiel ao print) */}
          <div className="relative w-full aspect-[402/490] max-h-[500px] rounded-2xl overflow-hidden shadow-sm bg-[#3e160f] mb-3 sm:mb-4">
            <Link href="/checkout" className="block relative w-full h-full">
              <Image
                src="/images/banners/revenda-celso-oficial.jpg"
                alt="Cadastre-se na Revenda Cacau Show e tenha a chance de concorrer a R$ 1 milhão"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 550px"
              />
            </Link>
          </div>

          {/* Botão de Ação Inferior: "Comece agora" oficial */}
          <div className="flex justify-center px-2">
            <Link
              href="/checkout"
              className="w-full max-w-sm bg-[#063920] hover:bg-[#042a17] text-[#c8d76e] font-black text-lg sm:text-xl py-3 sm:py-3.5 px-8 rounded-full text-center transition-transform active:scale-95 shadow-md flex items-center justify-center tracking-tight"
            >
              Comece agora
            </Link>
          </div>
        </div>

        {/* Seta Direita */}
        <button
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-[#d32f2f] border border-gray-200/90 shadow-md rounded-xl p-2.5 transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
          aria-label="Próximo"
        >
          <ChevronRight size={22} strokeWidth={3} />
        </button>
      </div>
    </section>
  )
}
