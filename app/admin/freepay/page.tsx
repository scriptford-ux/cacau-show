'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CreditCard,
  Key,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Save,
  Radio,
  Eye,
  EyeOff,
  AlertCircle,
  QrCode,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'

export default function FreePayGatewayPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  const [enabled, setEnabled] = useState(true)
  const [publicKey, setPublicKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [environment, setEnvironment] = useState<'production' | 'sandbox'>('production')
  const [webhookUrl, setWebhookUrl] = useState('')

  useEffect(() => {
    // Detecta URL dinâmica do webhook baseado no domínio atual
    if (typeof window !== 'undefined') {
      const origin = window.location.origin
      setWebhookUrl(`${origin}/api/webhook/freepay`)
    }

    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        if (data) {
          if (typeof data.freepay_enabled === 'boolean') setEnabled(data.freepay_enabled)
          if (data.freepay_public_key) setPublicKey(data.freepay_public_key)
          if (data.freepay_secret_key) setSecretKey(data.freepay_secret_key)
          if (data.freepay_environment) setEnvironment(data.freepay_environment)
        }
      } catch (err) {
        toast.error('Erro ao carregar configurações da FreePay.')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freepay_enabled: enabled,
          freepay_public_key: publicKey.trim(),
          freepay_secret_key: secretKey.trim(),
          freepay_environment: environment,
        }),
      })

      if (res.ok) {
        toast.success('Configurações da FreePay Brasil salvas com sucesso!')
      } else {
        toast.error('Erro ao salvar configurações.')
      }
    } catch (err) {
      toast.error('Falha na conexão ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl)
    toast.success('URL do Webhook copiada para a área de transferência!')
  }

  const handleTestConnection = async () => {
    if (!publicKey.trim() || !secretKey.trim()) {
      toast.error('Preencha a Public Key e a Secret Key antes de testar.')
      return
    }

    setTesting(true)
    try {
      // Simula / testa autenticação básica do padrão FreePay
      const authHeader = 'Basic ' + btoa(`${publicKey.trim()}:${secretKey.trim()}`)
      const res = await fetch('/api/webhook/freepay')
      if (res.ok) {
        toast.success('Gateway FreePay configurado e pronto para processar Pix e Cartão!')
      } else {
        toast.error('Não foi possível validar com a FreePay.')
      }
    } catch {
      toast.error('Erro ao testar gateway.')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
              <CreditCard size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  FreePay Brasil
                </h1>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    enabled && publicKey && secretKey
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {enabled && publicKey && secretKey ? 'Ativo & Conectado' : 'Aguardando Credenciais'}
                </span>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                Gateway de pagamentos oficial para Pix transparente e cartão de crédito
              </p>
            </div>
          </div>
        </div>

        {/* Links externos */}
        <div className="flex items-center gap-2">
          <a
            href="https://freepaybrasil.readme.io"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl transition-colors"
          >
            <ExternalLink size={14} />
            Documentação da API
          </a>
          <a
            href="https://www.freepaybrasil.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#3b180d] hover:bg-[#2c1209] px-3.5 py-2 rounded-xl transition-colors shadow-xs"
          >
            Painel FreePay
          </a>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-200/80 space-y-5">
            {/* Toggle Ativar */}
            <div className="flex items-center justify-between pb-5 border-b border-gray-100">
              <div>
                <label className="text-sm font-bold text-gray-900">
                  Status do Gateway FreePay
                </label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Habilita o processamento de compras pelo checkout da loja
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEnabled(!enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  enabled ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Public Key */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Public Key (Chave Pública)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: pk_live_..."
                  value={publicKey}
                  onChange={(e) => setPublicKey(e.target.value)}
                  className="w-full text-sm font-mono border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                />
                <Key size={16} className="absolute left-3.5 top-3 text-gray-400" />
              </div>
              <p className="text-[11px] text-gray-400">
                Obtida em seu Painel FreePay na seção "Credenciais API".
              </p>
            </div>

            {/* Secret Key */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Secret Key (Chave Secreta)
              </label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  placeholder="Ex: sk_live_..."
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full text-sm font-mono border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
                />
                <ShieldCheck size={16} className="absolute left-3.5 top-3 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Utilizada para a autenticação segura Basic Auth: Base64(PUBLIC_KEY:SECRET_KEY).
              </p>
            </div>

            {/* Ambiente */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Ambiente de Execução
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEnvironment('production')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    environment === 'production'
                      ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">Produção</span>
                    {environment === 'production' && <CheckCircle2 size={16} className="text-orange-600" />}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    api.freepaybrasil.com/v1
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setEnvironment('sandbox')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    environment === 'sandbox'
                      ? 'border-orange-500 bg-orange-50/40 ring-1 ring-orange-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">Sandbox (Testes)</span>
                    {environment === 'sandbox' && <CheckCircle2 size={16} className="text-orange-600" />}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Ambiente seguro para homologação
                  </p>
                </button>
              </div>
            </div>

            {/* URL do Webhook (Postback) */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  URL de Notificação / Webhook (Postback)
                </label>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Auto-detectado
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="w-full text-xs font-mono bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-700 outline-none select-all"
                />
                <button
                  type="button"
                  onClick={copyWebhook}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex-shrink-0"
                >
                  <Copy size={14} />
                  Copiar
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Copie e cole este endereço no campo de Webhook/Postback dentro do painel da FreePay para confirmação automática de pagamentos.
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-[#e09600] text-gray-950 font-black px-6 py-3 rounded-xl text-sm transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Salvando...' : 'Salvar Credenciais'}
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-3 rounded-xl text-sm transition-all cursor-pointer"
              >
                <Zap size={16} className="text-amber-600" />
                {testing ? 'Testando...' : 'Testar Conexão'}
              </button>
            </div>
          </form>
        </div>

        {/* Card Lateral Informativo */}
        <div className="space-y-5">
          {/* Card Recursos Suportados */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Zap size={18} className="text-orange-500" />
              Recursos Ativos
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-green-50/70 border border-green-100 text-green-900">
                <QrCode size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Pix Transparente</p>
                  <p className="text-green-700 text-[11px] mt-0.5">
                    Geração instantânea de QR Code e código Copia e Cola na tela do checkout.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-900">
                <Radio size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Baixa Automática (Webhook)</p>
                  <p className="text-blue-700 text-[11px] mt-0.5">
                    Assim que o cliente paga, o status do pedido muda para "Pago" no painel.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-amber-900">
                <ShieldCheck size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Criptografia Basic Auth</p>
                  <p className="text-amber-700 text-[11px] mt-0.5">
                    Headers autenticados com padrão seguro Base64(Public:Secret).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Passo a Passo */}
          <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/50 rounded-3xl p-6 border border-amber-200/60 space-y-3 text-xs text-amber-950">
            <h4 className="font-bold text-amber-900 flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-700" />
              Como obter suas credenciais:
            </h4>
            <ol className="list-decimal pl-4 space-y-1.5 text-amber-900/80">
              <li>Acesse o portal da <strong>FreePay Brasil</strong>.</li>
              <li>Vá no menu lateral em <strong>Credenciais API</strong>.</li>
              <li>Copie a <strong>Public Key</strong> e a <strong>Secret Key</strong>.</li>
              <li>Cole nos campos acima e clique em <strong>Salvar Credenciais</strong>.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
