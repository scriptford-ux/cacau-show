'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, Search, Filter, Trash2, CheckCircle2, Clock, MapPin } from 'lucide-react'
import { Order } from '@/lib/db'
import { toast } from 'sonner'

export default function AdminPedidos() {
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all')
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      if (Array.isArray(data)) setOrders(data)
    } catch (err) {
      toast.error('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleDelete = async (id: string, orderNumber: string) => {
    if (!confirm(`Deseja excluir o pedido ${orderNumber}?`)) return

    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id))
        toast.success(`Pedido ${orderNumber} excluído com sucesso!`)
      } else {
        toast.error('Erro ao excluir pedido')
      }
    } catch (err) {
      toast.error('Erro de conexão ao excluir')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'paid' ? 'pending' : 'paid'
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: nextStatus as any } : o))
        )
        toast.success(`Pedido atualizado para: ${nextStatus === 'paid' ? 'Pago' : 'Pendente'}`)
      }
    } catch (err) {
      toast.error('Erro ao atualizar status')
    }
  }

  const filtered = orders.filter((o) => {
    const matchesStatus = filterStatus === 'all' ? true : o.status === filterStatus
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      o.shipping_address.city.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShoppingBag size={26} className="text-[#3b180d]" />
            Todos os Pedidos
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {orders.length} pedidos registrados com endereço completo e gerenciamento
          </p>
        </div>

        {/* Filtros de Status */}
        <div className="flex items-center gap-1.5 bg-gray-200/80 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'all' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Todos ({orders.length})
          </button>
          <button
            onClick={() => setFilterStatus('paid')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'paid' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pagos ({orders.filter((o) => o.status === 'paid').length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pendentes ({orders.filter((o) => o.status === 'pending').length})
          </button>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número do pedido, nome do cliente, email ou cidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cs-orange"
          />
        </div>
      </div>

      {/* Tabela de Pedidos com Lixeira */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200/90 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] font-black uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <th className="py-3.5 px-4">Pedido / Data</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Endereço de Entrega</th>
                <th className="py-3.5 px-4">Itens</th>
                <th className="py-3.5 px-4">Valor Total</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Lixeira</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const isPaid = order.status === 'paid'
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-4 font-bold text-gray-900">
                        <span className="text-[#3b180d]">{order.order_number}</span>
                        <div className="text-[11px] text-gray-400 font-normal mt-0.5">
                          {new Date(order.created_at).toLocaleString('pt-BR')}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900">{order.customer_name}</div>
                        <div className="text-xs text-gray-500">{order.customer_email}</div>
                        <div className="text-[11px] text-emerald-700 font-medium">{order.customer_phone}</div>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex items-start gap-1.5 text-xs text-gray-800 leading-snug">
                          <MapPin size={14} className="text-[#d32f2f] flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold">
                              {order.shipping_address.street}, {order.shipping_address.number}
                            </span>
                            {order.shipping_address.complement && (
                              <span className="text-gray-500"> ({order.shipping_address.complement})</span>
                            )}
                            <div className="text-gray-500 text-[11px]">
                              {order.shipping_address.neighborhood} - {order.shipping_address.city}/{order.shipping_address.state}
                            </div>
                            <div className="text-gray-400 text-[10px]">
                              CEP: {order.shipping_address.zip_code}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1 max-w-[200px]">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="text-xs text-gray-700 flex justify-between">
                              <span className="truncate pr-1">
                                <strong>{it.quantity}x</strong> {it.name}
                              </span>
                              <span className="text-[11px] text-gray-400 flex-shrink-0">
                                R$ {it.price.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-black text-gray-950 text-base">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </span>
                        <div className="text-[10px] text-gray-400 uppercase">
                          {order.payment_method}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(order.id, order.status)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black cursor-pointer transition-transform active:scale-95 ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                          }`}
                          title="Clique para alternar entre Pago e Pendente"
                        >
                          {isPaid ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                          {isPaid ? 'PAGO' : 'PENDENTE'}
                        </button>
                      </td>

                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(order.id, order.order_number)}
                          className="p-2 text-red-500 hover:text-white hover:bg-red-600 rounded-xl transition-all cursor-pointer border border-red-200 hover:border-red-600 shadow-xs"
                          title={`Excluir pedido ${order.order_number}`}
                        >
                          <Trash2 size={18} />
                        </button>
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
