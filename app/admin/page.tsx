'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  Plus,
  Radio,
  MapPin,
  ExternalLink,
  Target,
  Search,
  Filter,
} from 'lucide-react'
import { Order } from '@/lib/db'
import { Product } from '@/lib/types'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [pixelId, setPixelId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [liveVisitors, setLiveVisitors] = useState(0)
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending'>('all')
  const [search, setSearch] = useState('')

  // Carrega dados da API
  const loadData = async () => {
    try {
      const [resOrders, resProducts, resSettings] = await Promise.all([
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/settings').then((r) => r.json()),
      ])

      if (Array.isArray(resOrders)) setOrders(resOrders)
      if (Array.isArray(resProducts)) setProducts(resProducts)
      if (resSettings?.facebook_pixel_id) setPixelId(resSettings.facebook_pixel_id)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  // Verifica contagem real de visitantes navegando na loja
  const checkPresence = async () => {
    try {
      const res = await fetch('/api/presence')
      const data = await res.json()
      if (typeof data.liveVisitors === 'number') {
        setLiveVisitors(data.liveVisitors)
      }
    } catch {
      // Ignora erro de rede temporário
    }
  }

  useEffect(() => {
    loadData()
    checkPresence()

    // Atualiza contagem ao vivo em tempo real a cada 3 segundos
    const presenceInterval = setInterval(checkPresence, 3000)

    return () => clearInterval(presenceInterval)
  }, [])

  // Excluir pedido com a lixeira
  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Deseja realmente excluir o pedido ${orderNumber}?`)) return

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId))
        toast.success(`Pedido ${orderNumber} excluído com sucesso!`)
      } else {
        toast.error('Erro ao excluir pedido.')
      }
    } catch (err) {
      toast.error('Erro de conexão ao excluir pedido.')
    }
  }

  // Alternar status do pedido
  const handleToggleStatus = async (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'paid' ? 'pending' : 'paid'

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus as any } : o))
        )
        toast.success(`Status atualizado para: ${nextStatus === 'paid' ? 'Pago' : 'Pendente'}`)
      }
    } catch (err) {
      toast.error('Erro ao atualizar status.')
    }
  }

  // Cálculos financeiros
  const paidOrders = orders.filter((o) => o.status === 'paid')
  const pendingOrders = orders.filter((o) => o.status === 'pending')
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0)
  const pendingRevenue = pendingOrders.reduce((sum, o) => sum + o.total, 0)

  // Filtro de pedidos
  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      filterStatus === 'all' ? true : o.status === filterStatus
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.shipping_address.city.toLowerCase().includes(search.toLowerCase()) ||
      o.shipping_address.street.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Header com Visitantes Ao Vivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Dashboard Cacau Show
            </h1>
            {/* Indicador de Ao Vivo */}
            <div
              className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full shadow-xs transition-colors ${
                liveVisitors > 0
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full inline-block ${
                  liveVisitors > 0 ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'
                }`}
              />
              <span>
                {liveVisitors > 0
                  ? `AO VIVO: ${liveVisitors} ${liveVisitors === 1 ? 'cliente online' : 'clientes online'}`
                  : 'AO VIVO: 0 clientes online'}
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Gestão completa de vendas, clientes, pedidos e integração com Meta Pixel
          </p>
        </div>

        {/* Links Rápidos */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/pixel"
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-colors"
          >
            <Target size={16} />
            {pixelId ? `Pixel: ${pixelId}` : 'Configurar Pixel'}
          </Link>
          <Link
            href="/admin/produtos/novo"
            className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#e09600] text-gray-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors shadow-xs"
          >
            <Plus size={16} strokeWidth={3} />
            Novo Produto
          </Link>
        </div>
      </div>

      {/* 2. Cards de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Faturamento Confirmado */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Faturamento Pago
            </span>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              R$ {totalRevenue.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 size={13} /> {paidOrders.length} pagamentos confirmados
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
        </div>

        {/* Pagamentos Pendentes */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Valor Pendente
            </span>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
              R$ {pendingRevenue.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-xs text-amber-700 font-semibold mt-1 flex items-center gap-1">
              <Clock size={13} /> {pendingOrders.length} aguardando pagamento
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock size={24} />
          </div>
        </div>

        {/* Total de Pedidos */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total de Pedidos
            </span>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              {orders.length}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Ticket Médio: R${' '}
              {orders.length
                ? (totalRevenue / (paidOrders.length || 1)).toFixed(2).replace('.', ',')
                : '0,00'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cs-brown text-white flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Clientes Cadastrados */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Clientes & Tráfego
            </span>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              {new Set(orders.map((o) => o.customer_email)).size}
            </p>
            <p
              className={`text-xs font-semibold mt-1 flex items-center gap-1 ${
                liveVisitors > 0 ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              <Radio size={13} className={liveVisitors > 0 ? 'animate-pulse' : ''} />{' '}
              {liveVisitors} navegando agora
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* 3. Tabela de Pedidos Completa com Endereço e LIXEIRA */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200/90 overflow-hidden">
        {/* Header da Tabela com Filtros */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <ShoppingBag size={22} className="text-[#3b180d]" />
              Gestão de Pedidos
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Lista com endereço de entrega, itens, valor pago/pendente e exclusão
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Barra de Busca */}
            <div className="relative min-w-[220px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pedido, cliente, cidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cs-orange"
              />
            </div>

            {/* Filtros de Status */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'all' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Todos ({orders.length})
              </button>
              <button
                onClick={() => setFilterStatus('paid')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'paid' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Pagos ({paidOrders.length})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterStatus === 'pending' ? 'bg-amber-500 text-white shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Pendentes ({pendingOrders.length})
              </button>
            </div>
          </div>
        </div>

        {/* Tabela de Pedidos */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[11px] font-black uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <th className="py-3.5 px-4">Pedido / Data</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Endereço de Entrega</th>
                <th className="py-3.5 px-4">Itens Comprados</th>
                <th className="py-3.5 px-4">Valor</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Lixeira / Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Nenhum pedido encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isPaid = order.status === 'paid'
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      {/* 1. Pedido / Data */}
                      <td className="py-4 px-4 font-bold text-gray-900">
                        <span className="text-[#3b180d]">{order.order_number}</span>
                        <div className="text-[11px] text-gray-400 font-normal mt-0.5">
                          {new Date(order.created_at).toLocaleString('pt-BR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </div>
                      </td>

                      {/* 2. Cliente */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900 leading-tight">
                          {order.customer_name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {order.customer_email}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                          {order.customer_phone}
                        </div>
                      </td>

                      {/* 3. Endereço Completo */}
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

                      {/* 4. Itens */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 max-w-[220px]">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="text-xs text-gray-700 flex items-center justify-between">
                              <span className="truncate pr-2">
                                <strong className="text-gray-900">{it.quantity}x</strong> {it.name}
                              </span>
                              <span className="text-[11px] text-gray-400 flex-shrink-0">
                                R$ {it.price.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* 5. Valor */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-black text-gray-950 text-base">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </span>
                        <div className="text-[10px] text-gray-400 uppercase">
                          {order.payment_method === 'pix' ? 'PIX' : order.payment_method === 'credit_card' ? 'Cartão' : 'Boleto'}
                        </div>
                      </td>

                      {/* 6. Status com botão para alternar */}
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

                      {/* 7. LIXEIRA AO LADO DOS PEDIDOS */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteOrder(order.id, order.order_number)}
                          className="p-2 text-red-500 hover:text-white hover:bg-red-600 rounded-xl transition-all duration-200 cursor-pointer shadow-xs border border-red-200 hover:border-red-600"
                          title={`Excluir pedido ${order.order_number}`}
                          aria-label={`Excluir pedido ${order.order_number}`}
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

      {/* 4. Seção de Produtos Existentes + Adicionar Outros */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200/90 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Package size={22} className="text-[#f5a623]" />
              Produtos da Loja ({products.length} Ativos)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Todos os produtos continuam salvos e você pode adicionar novos a qualquer momento
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/produtos"
              className="text-xs font-bold text-gray-600 hover:text-[#3b180d] underline"
            >
              Gerenciar Todos os Produtos
            </Link>
            <Link
              href="/admin/produtos/novo"
              className="inline-flex items-center gap-1.5 bg-[#f5a623] hover:bg-[#e09600] text-gray-950 font-black px-4 py-2 rounded-xl text-xs transition-colors shadow-xs"
            >
              <Plus size={15} strokeWidth={3} />
              Adicionar Outro Produto
            </Link>
          </div>
        </div>

        {/* Grade de Produtos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.slice(0, 6).map((prod) => (
            <div
              key={prod.id}
              className="border border-gray-200/80 rounded-2xl p-3 flex flex-col justify-between hover:shadow-md transition-shadow bg-white"
            >
              <div className="relative w-full aspect-square mb-2 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
                <Image
                  src={prod.image_url}
                  alt={prod.name}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                  {prod.name}
                </h3>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-sm font-black text-gray-950">
                    R$ {prod.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Qtd: {prod.stock}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
