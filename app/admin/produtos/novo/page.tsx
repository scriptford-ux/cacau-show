'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { mockCategories } from '@/lib/mockData'
import { toast } from 'sonner'

export default function NovoProduto() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    image_url: '',
    category_id: '',
    stock: '',
    cacaus_points: '',
    active: true,
    featured: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast.success('Produto criado com sucesso e adicionado à loja!')
        router.push('/admin/produtos')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erro ao cadastrar produto')
      }
    } catch (err: any) {
      toast.error('Erro de conexão ao salvar produto')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/produtos"
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Novo Produto</h1>
          <p className="text-gray-500 text-sm mt-0.5">Preencha as informações do produto</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Informações Básicas</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Ex: Panettone laCreme ao Leite 650g"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cs-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Descrição detalhada do produto..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cs-orange resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cs-orange bg-white"
            >
              <option value="">Selecionar categoria</option>
              {mockCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
            <input
              type="url"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cs-orange"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Preços e Estoque</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço Atual (R$) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0,00"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cs-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço Original (R$)</label>
              <input
                type="number"
                name="original_price"
                value={form.original_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0,00"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cs-orange"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estoque *</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cs-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pontos Cacaus</label>
              <input
                type="number"
                name="cacaus_points"
                value={form.cacaus_points}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cs-orange"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Opções</h2>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              className="w-4 h-4 accent-cs-orange rounded"
            />
            <span className="text-sm font-medium text-gray-700">Produto ativo (visível na loja)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="w-4 h-4 accent-cs-orange rounded"
            />
            <span className="text-sm font-medium text-gray-700">Produto em destaque (aparecer nas seções especiais)</span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Link
            href="/admin/produtos"
            className="flex-1 text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-cs-orange hover:bg-cs-orange-dark text-white font-bold py-3 rounded-xl transition-colors text-sm disabled:opacity-70"
          >
            {saving ? (
              <span className="animate-pulse">Salvando...</span>
            ) : (
              <>
                <Save size={16} />
                Salvar Produto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
