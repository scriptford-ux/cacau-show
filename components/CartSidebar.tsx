'use client'

import { X, Trash2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore()
  const total = getTotal()
  const itemCount = getItemCount()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-cs-brown text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <h2 className="font-bold text-lg">Meu Carrinho</h2>
            {itemCount > 0 && (
              <span className="bg-cs-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 text-gray-400">
              <ShoppingBag size={48} className="mb-4 opacity-30" />
              <p className="font-medium text-gray-500">Seu carrinho está vazio</p>
              <p className="text-sm mt-1">Adicione produtos deliciosos!</p>
              <button
                onClick={closeCart}
                className="mt-6 btn-primary text-sm"
              >
                Explorar produtos
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                {/* Image */}
                <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 leading-tight line-clamp-2">
                    {item.product.name}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 text-gray-500 hover:text-cs-orange text-sm font-bold"
                      >
                        −
                      </button>
                      <span className="px-2 text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 text-gray-500 hover:text-cs-orange text-sm font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <span className="text-sm font-bold text-cs-brown">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 self-start mt-0.5"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-4 space-y-3 bg-white">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total</span>
              <span className="text-xl font-black text-cs-brown">{formatPrice(total)}</span>
            </div>

            {/* Checkout button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-sm"
            >
              Finalizar Compra
            </Link>

            {/* Keep shopping */}
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-cs-brown hover:underline font-medium"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
