'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function Footer() {
  const [moreInfoOpen, setMoreInfoOpen] = useState(false)

  return (
    <footer className="w-full relative mt-6">
      {/* 1. Botão "MAIS INFORMAÇÕES ∨" centralizado no topo */}
      <div className="flex justify-center -mb-px relative z-10">
        <button
          onClick={() => setMoreInfoOpen(!moreInfoOpen)}
          className="bg-[#2e130a] hover:bg-[#250f08] text-[#f5ede5] text-xs sm:text-sm font-bold tracking-wider uppercase px-6 py-2.5 rounded-t-xl flex items-center gap-2 transition-colors cursor-pointer shadow-md"
          aria-expanded={moreInfoOpen}
        >
          <span>MAIS INFORMAÇÕES</span>
          {moreInfoOpen ? (
            <ChevronUp size={16} strokeWidth={2.5} />
          ) : (
            <ChevronDown size={16} strokeWidth={2.5} />
          )}
        </button>
      </div>

      {/* Accordion expansível de informações institucionais */}
      {moreInfoOpen && (
        <div className="bg-[#250f08] border-t border-[#4a2215] text-[#dfd2c4] px-6 py-6 text-xs sm:text-sm">
          <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-6 leading-relaxed">
            <div>
              <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-wider">Institucional</h4>
              <ul className="space-y-1 text-gray-300">
                <li><Link href="/sobre" className="hover:underline">Sobre a Cacau Show</Link></li>
                <li><Link href="/categoria/todos" className="hover:underline">Nossas Lojas</Link></li>
                <li><Link href="/checkout" className="hover:underline">Seja um Revendedor</Link></li>
                <li><Link href="/sobre" className="hover:underline">Franquias</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-wider">Atendimento</h4>
              <ul className="space-y-1 text-gray-300">
                <li><Link href="/sobre" className="hover:underline">Central de Ajuda</Link></li>
                <li><Link href="/termos" className="hover:underline">Política de Entrega</Link></li>
                <li><Link href="/privacidade" className="hover:underline">Privacidade & Segurança</Link></li>
                <li><Link href="/admin/login" className="hover:underline text-[#f5a623]">Painel Admin</Link></li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-wider">Pagamento</h4>
              <p className="text-xs text-gray-400">
                Aceitamos PIX com aprovação imediata e cartões de crédito em até 6x sem juros.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Seção Principal de Chocolate Escuro com Logo e Slogan Oficial */}
      <div className="bg-[#2e130a] relative overflow-hidden pt-8 pb-7 px-4 text-center">
        {/* Onda decorativa de chocolate em tom quente */}
        <div
          className="absolute top-0 left-0 right-0 h-14 opacity-25 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 80% at 20% 0%, #6e331f 0%, transparent 100%)',
          }}
        />

        {/* Logo Cursivo Oficial Cacau Show */}
        <div className="relative flex justify-center mb-2">
          <span className="logo-font text-3xl sm:text-4xl text-[#fff5ee] tracking-tight drop-shadow-sm select-none">
            CacauShow
          </span>
        </div>

        {/* Slogan Cursivo Oficial "feliz hoje!" em tom terracota/coral */}
        <p className="logo-font text-2xl sm:text-3xl text-[#d95938] italic tracking-wide select-none">
          feliz hoje!
        </p>
      </div>

      {/* 3. Faixa Inferior de Dados Legais e Copyright (100% igual ao print oficial) */}
      <div className="bg-[#451c0e] px-4 py-4 text-center">
        <p className="text-[11px] sm:text-xs text-[#e2d5c5]/80 leading-relaxed max-w-xl mx-auto">
          © Copyright 2023. Todos os direitos reservados. | Cacau Comércio Eletrônico LTDA 32.143.933/0002-05
          <br />
          Endereço: Avenida Helio Ossamu Daikuara, 1445 Bairro Jardim Vista Alegre Município Embu das Artes - SP: 06807-000
        </p>
      </div>
    </footer>
  )
}
