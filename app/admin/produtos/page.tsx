'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search, Filter, Package } from 'lucide-react'
import { mockProducts } from '@/lib/mockData'
import { Product } from '@/lib/types'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminProdutos() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data)
      }
    } catch (err) {
      console.error('Erro ao carregar produtos da API:', err)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
        toast.success('Produto excluído com sucesso!')
      } else {
        toast.error('Erro ao excluir produto')
      }
    } catch (err) {
      toast.error('Erro de conexão ao excluir')
    }
    setDeleteConfirm(null)
  }

  const handleToggleActive = async (id: string) => {
    const prod = products.find((p) => p.id === id)
    if (!prod) return
    const nextActive = !prod.active

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: nextActive }),
      })
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, active: nextActive } : p))
        )
        toast.success(`Produto ${nextActive ? 'ativado' : 'desativado'} com sucesso!`)
      }
    } catch (err) {
      toast.error('Erro ao atualizar produto')
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Produtos</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} produtos cadastrados</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-2 bg-cs-orange hover:bg-cs-orange-dark text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm"
        >
          <Plus size={16} />
          Novo Produto
        </Link>
      </div>

      {/* Search & filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-5 flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cs-orange focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 hover:border-cs-orange hover:text-cs-orange transition-colors">
          <Filter size={15} />
          Filtrar
        </button>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Produto</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Preço</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Estoque</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Pontos</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <Package size={36} className="mx-auto mb-2 opacity-30" />
                    <p>Nenhum produto encontrado</p>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const discount = product.original_price
                    ? calculateDiscount(product.original_price, product.price)
                    : null

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-400">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </p>
                          {product.original_price && (
                            <div className="flex items-center gap-1">
                              <p className="text-xs text-gray-400 line-through">
                                {formatPrice(product.original_price)}
                              </p>
                              <span className="text-xs bg-green-100 text-green-700 font-bold px-1 rounded">
                                -{discount}%
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-sm font-semibold ${
                            product.stock < 20
                              ? 'text-red-500'
                              : product.stock < 50
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="cacaus-badge text-xs">
                          🍫 {product.cacaus_points}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(product.id)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                            product.active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {product.active ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/produtos/${product.id}`}
                            className="p-1.5 text-gray-400 hover:text-cs-orange hover:bg-orange-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Pencil size={15} />
                          </Link>
                          {deleteConfirm === product.id ? (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-300"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
