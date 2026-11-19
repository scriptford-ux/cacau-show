'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle, Save, Send, ShieldCheck, Key, Target } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminPixelPage() {
  const [pixelId, setPixelId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [testCode, setTestCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.facebook_pixel_id) setPixelId(data.facebook_pixel_id)
        if (data.facebook_access_token) setAccessToken(data.facebook_access_token)
        if (data.facebook_test_code) setTestCode(data.facebook_test_code)
      })
      .catch((err) => toast.error('Erro ao carregar configurações'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facebook_pixel_id: pixelId,
          facebook_access_token: accessToken,
          facebook_test_code: testCode,
        }),
      })

      if (res.ok) {
        toast.success('Configurações do Meta Pixel & Token salvas com sucesso!')
      } else {
        toast.error('Erro ao salvar configurações.')
      }
    } catch (err: any) {
      toast.error('Erro de conexão ao salvar: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleTestEvent = () => {
    if (!pixelId) {
      toast.error('Configure e salve o Pixel ID antes de testar.')
      return
    }

    setTesting(true)
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView')
        window.fbq('track', 'ViewContent', {
          content_name: 'Caixa de Tabletes Harry Potter 160g',
          content_type: 'product',
          value: 99.99,
          currency: 'BRL',
        })
        toast.success('Evento de teste disparado com sucesso (PageView e ViewContent)!')
      } else {
        toast.info('Pixel ID registrado. O evento será disparado nas páginas da loja.')
      }
      setTesting(false)
    }, 800)
  }

  const isConfigured = Boolean(pixelId && pixelId.length >= 8)

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Carregando configurações do Meta Pixel...
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
            <Target className="text-blue-600" size={28} />
            Facebook & Meta Pixel
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Configure seu Pixel ID e Token de Conversões (CAPI) para rastreamento de anúncios
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {isConfigured ? (
            <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200 shadow-xs">
              <CheckCircle2 size={16} className="text-green-600" />
              PIXEL ATIVO ({pixelId})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-full border border-yellow-200">
              <AlertCircle size={16} className="text-yellow-600" />
              PIXEL NÃO CONFIGURADO
            </span>
          )}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. Pixel ID */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1.5 flex items-center gap-2">
              <Target size={16} className="text-blue-600" />
              ID do Pixel do Facebook (Meta Pixel ID)
            </label>
            <input
              type="text"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              placeholder="Ex: 123456789012345"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Encontrado no Gerenciador de Eventos da Meta &gt; Configurações do Pixel.
            </p>
          </div>

          {/* 2. Access Token */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1.5 flex items-center gap-2">
              <Key size={16} className="text-amber-600" />
              Token de Acesso da API de Conversões (CAPI Token)
            </label>
            <textarea
              rows={3}
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Ex: EAAB..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">
              Gere seu token em: Gerenciador de Eventos &gt; Configurações &gt; API de Conversões &gt; Gerar token de acesso.
            </p>
          </div>

          {/* 3. Test Code (opcional) */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-1.5 flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-600" />
              Código de Evento de Teste (Opcional)
            </label>
            <input
              type="text"
              value={testCode}
              onChange={(e) => setTestCode(e.target.value)}
              placeholder="Ex: TEST12345"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">
              Usado para testar eventos em tempo real na aba &quot;Testar Eventos&quot; do Gerenciador de Eventos.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Save size={18} />
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </button>

            <button
              type="button"
              onClick={handleTestEvent}
              disabled={testing || !pixelId}
              className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send size={18} />
              {testing ? 'Disparando...' : 'Disparar Evento de Teste'}
            </button>
          </div>
        </form>
      </div>

      {/* Guide Info Box */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 text-sm text-blue-900 leading-relaxed">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <span>💡</span> Eventos Automáticos Rastreados na Loja:
        </h3>
        <ul className="list-disc list-inside space-y-1 text-xs text-blue-800">
          <li><strong>PageView</strong>: Disparado em todas as páginas visitadas.</li>
          <li><strong>ViewContent</strong>: Ao visualizar a página de detalhes de qualquer produto.</li>
          <li><strong>AddToCart</strong>: Ao clicar em &quot;Adicionar ao Carrinho&quot; em qualquer produto.</li>
          <li><strong>InitiateCheckout</strong>: Ao acessar a tela de finalização de compra.</li>
          <li><strong>Purchase</strong>: Ao confirmar o pedido no checkout.</li>
        </ul>
      </div>
    </div>
  )
}
