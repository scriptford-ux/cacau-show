'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Truck, ShieldCheck, Check, Power, DollarSign, Clock, Sparkles } from 'lucide-react'
import { useShippingStore } from '@/lib/shippingStore'
import { Carrier } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminTransportadorasPage() {
  const { carriers, addCarrier, updateCarrier, deleteCarrier, toggleCarrierActive } = useShippingStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    deadline: '',
    price: '',
    badge: '',
    active: true,
  })

  // Open modal for new
  const handleOpenNew = () => {
    setEditingId(null)
    setForm({
      name: '',
      deadline: '',
      price: '',
      badge: '',
      active: true,
    })
    setIsModalOpen(true)
  }

  // Open modal for edit
  const handleOpenEdit = (carrier: Carrier) => {
    setEditingId(carrier.id)
    setForm({
      name: carrier.name,
      deadline: carrier.deadline,
      price: carrier.price.toString(),
      badge: carrier.badge || '',
      active: carrier.active,
    })
    setIsModalOpen(true)
  }

  // Save (add or update)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim() || !form.deadline.trim()) {
      toast.error('Preencha o nome e o prazo de entrega.')
      return
    }

    const priceNum = parseFloat(form.price.replace(',', '.')) || 0

    if (editingId) {
      updateCarrier(editingId, {
        name: form.name.trim(),
        deadline: form.deadline.trim(),
        price: priceNum,
        badge: form.badge.trim() || undefined,
        active: form.active,
      })
      toast.success('Transportadora atualizada com sucesso!')
    } else {
      addCarrier({
        name: form.name.trim(),
        deadline: form.deadline.trim(),
        price: priceNum,
        badge: form.badge.trim() || undefined,
        active: form.active,
      })
      toast.success('Nova transportadora cadastrada com sucesso!')
    }

    setIsModalOpen(false)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir a transportadora "${name}"?`)) {
      deleteCarrier(id)
      toast.success('Transportadora removida!')
    }
  }

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Truck className="text-cs-orange" size={28} />
            Opções de Entrega & Transportadoras
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Gerencie as transportadoras, prazos e taxas de frete que aparecem para o cliente ao clicar em "ALTERAR" CEP
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 bg-cs-orange hover:bg-cs-orange-dark text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
        >
          <Plus size={16} />
          Nova Transportadora
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-cs-orange flex items-center justify-center font-black text-xl">
            {carriers.length}
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total de Opções</p>
            <p className="text-lg font-black text-gray-900">{carriers.length} Transportadoras</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center font-black text-xl">
            {carriers.filter((c) => c.active).length}
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Ativas na Loja</p>
            <p className="text-lg font-black text-gray-900">Visíveis no Popup de CEP</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xl">
            {carriers.filter((c) => c.price === 0).length}
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Frete Grátis</p>
            <p className="text-lg font-black text-gray-900">Modalidades Gratuitas</p>
          </div>
        </div>
      </div>

      {/* Carriers Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-bold text-gray-500 uppercase px-5 py-3.5">Transportadora / Serviço</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase px-4 py-3.5">Prazo Estimado</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase px-4 py-3.5">Valor do Frete</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase px-4 py-3.5">Selo / Destaque</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase px-4 py-3.5">Status</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase px-5 py-3.5">Ações</th>
              </tr>
            </thead>
            <tbody>
              {carriers.map((carrier) => (
                <tr
                  key={carrier.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                >
                  {/* Name */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0">
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">
                          {carrier.name}
                        </p>
                        <p className="text-xs text-gray-400">ID: {carrier.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Deadline */}
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-400" />
                      {carrier.deadline}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-4">
                    {carrier.price === 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-green-100 text-green-800">
                        GRÁTIS
                      </span>
                    ) : (
                      <span className="text-sm font-black text-gray-900">
                        {formatPrice(carrier.price)}
                      </span>
                    )}
                  </td>

                  {/* Badge */}
                  <td className="px-4 py-4">
                    {carrier.badge ? (
                      <span className="text-xs bg-[#fef3c7] text-[#92400e] font-bold px-2.5 py-1 rounded-full border border-amber-200">
                        {carrier.badge}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>

                  {/* Status Toggle */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleCarrierActive(carrier.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full transition-all ${
                        carrier.active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <Power size={12} />
                      {carrier.active ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(carrier)}
                        className="p-2 text-gray-400 hover:text-cs-orange hover:bg-orange-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(carrier.id, carrier.name)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden z-10 p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {editingId ? 'Editar Transportadora' : 'Nova Transportadora'}
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              Defina os dados da opção de frete que o cliente visualiza no site.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Nome da Opção / Transportadora *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: SEDEX 10 ou ENTREGA EXPRESSA CACAU SHOW"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-cs-orange outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Prazo de Entrega Estimado *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Chega em 1 a 2 dias úteis ou até às 18h"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-cs-orange outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    Valor do Frete (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00 para Grátis"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-cs-orange outline-none"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">0 = Frete Grátis</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                    Selo / Badge (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 🚀 MAIS RÁPIDA"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-cs-orange outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="w-4 h-4 accent-cs-orange rounded"
                  />
                  <span className="text-xs font-bold text-gray-700">Ativa e visível no modal de CEP</span>
                </label>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-cs-orange hover:bg-cs-orange-dark text-white rounded-xl text-sm font-bold shadow-sm"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
