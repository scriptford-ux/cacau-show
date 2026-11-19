'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
import { mockCategories } from '@/lib/mockData'
import { Category } from '@/lib/types'

export default function AdminCategorias() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)

  const handleToggleActive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    )
  }

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Categorias</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categorias cadastradas</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-cs-orange hover:bg-cs-orange-dark text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm">
          <Plus size={16} />
          Nova Categoria
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Categoria</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Slug</th>
              <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
              <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cs-brown/10 rounded-xl flex items-center justify-center">
                      <Tag size={16} className="text-cs-brown" />
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs bg-gray-100 text-gray-600 font-mono px-2 py-1 rounded-lg">
                    {cat.slug}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => handleToggleActive(cat.id)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                      cat.active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {cat.active ? 'Ativa' : 'Inativa'}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-cs-orange hover:bg-orange-50 rounded-lg transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
