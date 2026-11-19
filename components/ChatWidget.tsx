'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MessageCircle, X } from 'lucide-react'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showBubble, setShowBubble] = useState(true)

  return (
    <div className="fixed bottom-5 right-4 z-30 flex flex-col items-end gap-3">
      {/* Chat bubble tooltip */}
      {showBubble && !isOpen && (
        <div className="relative bg-white rounded-2xl rounded-br-none shadow-lg px-4 py-2 text-sm font-medium text-gray-700 max-w-[160px] text-center">
          Precisa de ajuda?
          <button
            onClick={() => setShowBubble(false)}
            className="absolute -top-1.5 -right-1.5 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center hover:bg-gray-300"
          >
            <X size={10} />
          </button>
          {/* Triangle */}
          <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-8 border-r-0 border-t-8 border-l-transparent border-t-white" />
        </div>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-72 overflow-hidden">
          {/* Header */}
          <div className="bg-cs-brown text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cs-orange flex items-center justify-center">
                <MessageCircle size={16} />
              </div>
              <div>
                <p className="font-semibold text-sm">Atendimento</p>
                <p className="text-xs text-white/70">Online agora</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 h-48 flex flex-col justify-center items-center text-center text-gray-500">
            <MessageCircle size={32} className="mb-2 text-cs-orange opacity-50" />
            <p className="text-sm">Olá! Como posso ajudar você hoje?</p>
            <p className="text-xs mt-1 text-gray-400">Horário: seg-sáb 8h-22h</p>
            <button className="mt-4 bg-cs-orange text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-cs-orange-dark transition-colors">
              Iniciar conversa
            </button>
          </div>
        </div>
      )}

      {/* Avatar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chat-widget relative w-14 h-14 rounded-full overflow-hidden shadow-xl border-2 border-cs-orange hover:scale-110 transition-transform"
        aria-label="Abrir chat"
      >
        <Image
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100"
          alt="Atendimento"
          fill
          className="object-cover"
        />
        {/* Online indicator */}
        <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
      </button>
    </div>
  )
}
