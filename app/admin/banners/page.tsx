'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { mockBanners } from '@/lib/mockData'
import { Banner } from '@/lib/types'

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>(mockBanners)

  const handleToggleActive = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
    )
  }

  const handleDelete = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Banners</h1>
          <p className="text-gray-500 text-sm mt-1">{banners.length} banners cadastrados</p>
        </div>
        <Link
          href="/admin/banners/novo"
          className="inline-flex items-center gap-2 bg-cs-orange hover:bg-cs-orange-dark text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
        >
          <Plus size={16} />
          Novo Banner
        </Link>
      </div>

      <div className="grid gap-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex gap-4 p-4">
              {/* Preview */}
              <div className="relative w-32 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={banner.image_url}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-800">{banner.title}</h3>
                    {banner.subtitle && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{banner.subtitle}</p>
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${
                      banner.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {banner.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs bg-cs-brown/10 text-cs-brown font-medium px-2 py-0.5 rounded-full">
                    {banner.section === 'hero' ? 'Hero' : banner.section === 'promo' ? 'Promoção' : 'Destaque'}
                  </span>
                  <span className="text-xs text-gray-400">Ordem: {banner.order_index}</span>
                  {banner.link_url && (
                    <span className="text-xs text-gray-400 truncate max-w-[200px]">{banner.link_url}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex border-t border-gray-100">
              <button
                onClick={() => handleToggleActive(banner.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                {banner.active ? <EyeOff size={14} /> : <Eye size={14} />}
                {banner.active ? 'Desativar' : 'Ativar'}
              </button>
              <div className="w-px bg-gray-100" />
              <Link
                href={`/admin/banners/${banner.id}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Pencil size={14} />
                Editar
              </Link>
              <div className="w-px bg-gray-100" />
              <button
                onClick={() => handleDelete(banner.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-red-400 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
