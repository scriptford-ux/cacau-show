'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  Copy,
  Clock,
  ExternalLink,
  Lock,
} from 'lucide-react'
import Header from '@/components/Header'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const total = getTotal()

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit'>('pix')
  const [submitting, setSubmitting] = useState(false)
  const [orderStage, setOrderStage] = useState<'form' | 'pix' | 'success'>('form')

  const [createdOrder, setCreatedOrder] = useState<any>(null)
  const [pixData, setPixData] = useState<{
    qr_code_image: string
    qr_code_text: string
    expires_in_minutes: number
  } | null>(null)
  const [pixTimer, setPixTimer] = useState(15 * 60) // 15 minutos

  const [formData, setFormData] = useState({
    name: 'Mariana Alves Souza',
    email: 'mariana.souza@gmail.com',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    cep: '01310-200',
    street: 'Av. Paulista',
    number: '1578',
    complement: 'Apto 82',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
  })

  // Timer regressivo do PIX
  useEffect(() => {
    if (orderStage !== 'pix') return
    const timer = setInterval(() => {
      setPixTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [orderStage])

  // Monitora aprovação do pagamento em tempo real
  useEffect(() => {
    if (orderStage !== 'pix' || !createdOrder?.id) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${createdOrder.id}`)
        if (res.ok) {
          const data = await res.json()
          if (data?.status === 'paid') {
            setOrderStage('success')
            toast.success('Pagamento confirmado via FreePay!')
          }
        }
      } catch {
        // silencioso
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [orderStage, createdOrder])

  const handleFinishOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) {
      toast.error('Seu carrinho está vazio.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/payment/freepay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((it) => ({
            id: it.product.id,
            name: it.product.name,
            price: it.product.price,
            quantity: it.quantity,
            image_url: it.product.image_url,
          })),
          customer: {
            name: formData.name,
            email: formData.email,
            cpf: formData.cpf,
            phone: formData.phone,
          },
          address: {
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            zip_code: formData.cep,
          },
          payment_method: paymentMethod,
        }),
      })

      const result = await res.json()

      if (res.ok && result.success) {
        setCreatedOrder(result.order)
        clearCart()

        if (paymentMethod === 'pix' && result.pix) {
          setPixData(result.pix)
          setOrderStage('pix')
          toast.success('Chave Pix gerada com sucesso pela FreePay!')
        } else {
          setOrderStage('success')
        }
      } else {
        toast.error(result.error || 'Erro ao processar pedido na FreePay.')
      }
    } catch (err) {
      toast.error('Falha de conexão com o gateway de pagamento.')
    } finally {
      setSubmitting(false)
    }
  }

  const copyPixCode = () => {
    if (!pixData?.qr_code_text) return
    navigator.clipboard.writeText(pixData.qr_code_text)
    toast.success('Código Pix Copia e Cola copiado com sucesso!')
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // TELA 1: PAGAMENTO PIX AGUARDANDO
  if (orderStage === 'pix' && pixData) {
    return (
      <div className="min-h-screen bg-cs-cream-light">
        <Header />
        <main className="max-w-xl mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>Aguardando Pagamento Pix</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900">
                Pague com Pix via FreePay
              </h1>
              <p className="text-xs text-gray-500">
                Pedido <strong>{createdOrder?.order_number}</strong> • Total:{' '}
                <strong className="text-gray-900 text-sm">
                  {formatPrice(createdOrder?.total || total)}
                </strong>
              </p>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50/70 border border-gray-200/80 rounded-2xl">
              <div className="w-52 h-52 bg-white p-3 rounded-2xl shadow-xs border border-gray-200 relative flex items-center justify-center">
                {pixData.qr_code_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pixData.qr_code_image}
                    alt="QR Code Pix"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <QrCode size={120} className="text-gray-700" />
                )}
              </div>

              {/* Timer */}
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                <Clock size={14} />
                <span>Expira em: {formatTimer(pixTimer)}</span>
              </div>
            </div>

            {/* Código Copia e Cola */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Código Pix Copia e Cola
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={pixData.qr_code_text}
                  className="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 outline-none select-all truncate"
                />
                <button
                  type="button"
                  onClick={copyPixCode}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex-shrink-0 shadow-xs"
                >
                  <Copy size={14} />
                  Copiar Código
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Abra o app do seu banco, escolha a opção <strong>Pix Copia e Cola</strong> e cole o código acima.
              </p>
            </div>

            {/* Instruções */}
            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 text-xs text-gray-700 space-y-1.5">
              <p className="font-bold text-orange-950 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-orange-600" />
                Como funciona a confirmação:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-gray-600">
                <li>O pagamento é processado diretamente pelo gateway <strong>FreePay Brasil</strong>.</li>
                <li>Assim que você pagar no app do banco, esta tela atualizará automaticamente.</li>
              </ul>
            </div>

            {/* Botão de Verificação Manual */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOrderStage('success')}
                className="btn-primary w-full text-center text-sm py-3"
              >
                Já realizei o pagamento
              </button>
              <Link
                href="/"
                className="text-center text-xs text-gray-500 hover:text-gray-800 font-medium py-2"
              >
                Voltar à Página Inicial
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // TELA 2: SUCESSO / CONFIRMADO
  if (orderStage === 'success') {
    return (
      <div className="min-h-screen bg-cs-cream-light">
        <Header />
        <main className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-orange-100">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Pedido Registrado!</h1>
            <p className="text-sm text-gray-600 mb-6">
              Seu pedido foi registrado com sucesso e processado pelo gateway FreePay Brasil.
            </p>
            <div className="bg-amber-50/70 border border-amber-100 p-5 rounded-2xl mb-6 text-left text-xs text-gray-700 space-y-1.5">
              <p><strong>Número do Pedido:</strong> {createdOrder?.order_number || '#CS-1093'}</p>
              <p><strong>Destinatário:</strong> {formData.name}</p>
              <p><strong>CPF:</strong> {formData.cpf}</p>
              <p><strong>Endereço:</strong> {formData.street}, {formData.number} {formData.complement ? `- ${formData.complement}` : ''}, {formData.city} - {formData.state}</p>
              <p><strong>Gateway:</strong> FreePay Brasil (Pix)</p>
            </div>
            <Link
              href="/"
              className="btn-primary w-full inline-block text-center text-sm py-3"
            >
              Voltar para a Página Inicial
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // TELA 3: FORMULÁRIO DE CHECKOUT
  return (
    <div className="min-h-screen bg-cs-cream-light">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6 pb-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-cs-brown mb-6 font-medium"
        >
          <ArrowLeft size={16} />
          Continuar Comprando
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Coluna do Formulário */}
          <div className="md:col-span-3 space-y-4">
            {/* Dados Pessoais e Entrega */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck size={18} className="text-cs-orange" />
                Dados do Cliente & Entrega
              </h2>
              <form id="checkout-form" onSubmit={handleFinishOrder} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cs-orange outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cs-orange outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">CPF (Obrigatório)</label>
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cs-orange outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Telefone</label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cs-orange outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">CEP</label>
                    <input
                      type="text"
                      required
                      value={formData.cep}
                      onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cs-orange outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Rua / Avenida</label>
                    <input
                      type="text"
                      required
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cs-orange outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Número</label>
                    <input
                      type="text"
                      required
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cs-orange outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Complemento</label>
                    <input
                      type="text"
                      value={formData.complement}
                      onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cs-orange outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Bairro</label>
                    <input
                      type="text"
                      required
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cs-orange outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Cidade / UF</label>
                    <input
                      type="text"
                      required
                      value={`${formData.city} - ${formData.state}`}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value.split('-')[0]?.trim() || formData.city })}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-cs-orange outline-none"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Método de Pagamento */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-cs-orange" />
                Forma de Pagamento (Gateway FreePay)
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'pix'
                      ? 'border-cs-orange bg-orange-50/50 text-cs-brown font-bold'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <QrCode size={20} className="text-green-600" />
                  <span className="text-xs">Pix (Instantâneo)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'credit'
                      ? 'border-cs-orange bg-orange-50/50 text-cs-brown font-bold'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <CreditCard size={20} className="text-cs-orange" />
                  <span className="text-xs">Cartão de Crédito</span>
                </button>
              </div>

              {paymentMethod === 'pix' ? (
                <div className="p-3 bg-green-50 rounded-xl border border-green-100 text-xs text-green-800 flex items-center gap-2">
                  <ShieldCheck size={18} className="flex-shrink-0" />
                  <span>Aprovação imediata do pedido via QR Code Pix FreePay.</span>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="Número do Cartão"
                    defaultValue="4532 •••• •••• 8890"
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Validade (MM/AA)"
                      defaultValue="12/28"
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      defaultValue="123"
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resumo da Compra */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-orange-100 sticky top-20">
              <h2 className="text-base font-bold text-gray-900 mb-4">Resumo do Pedido</h2>

              <div className="space-y-3 max-h-56 overflow-y-auto mb-4 pr-1">
                {items.length === 0 ? (
                  <p className="text-xs text-gray-400">Nenhum item selecionado.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-xs">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                        <Image src={item.product.image_url} alt={item.product.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{item.product.name}</p>
                        <p className="text-gray-400">{item.quantity}x {formatPrice(item.product.price)}</p>
                      </div>
                      <span className="font-bold text-gray-900">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span className="text-green-600 font-bold">Grátis</span>
                </div>
                <div className="flex justify-between text-sm font-black text-cs-brown pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={items.length === 0 || submitting}
                className="btn-primary w-full mt-6 text-sm py-3.5 shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock size={15} />
                {submitting ? 'Processando na FreePay...' : 'Confirmar e Pagar'}
              </button>

              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  Pagamento protegido por FreePay Brasil
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
