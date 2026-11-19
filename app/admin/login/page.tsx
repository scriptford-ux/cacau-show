'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Demo login - in production use Supabase auth
    await new Promise((r) => setTimeout(r, 1000))
    
    if (form.email === 'admin@cacaushow.com' && form.password === 'admin123') {
      toast.success('Login realizado com sucesso!')
      router.push('/admin')
    } else {
      toast.error('Email ou senha incorretos. Use admin@cacaushow.com / admin123')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cs-brown to-cs-brown-dark flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="logo-font text-4xl text-cs-brown mb-1">CacauShow</h1>
          <p className="text-sm text-gray-500 font-medium">Painel Administrativo</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="admin@cacaushow.com"
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cs-orange focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cs-orange focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cs-orange hover:bg-cs-orange-dark text-white font-bold py-3 rounded-xl transition-colors mt-2 disabled:opacity-70"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Demo hint & Quick Access */}
        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={() => {
              setForm({ email: 'admin@cacaushow.com', password: 'admin123' })
              toast.success('Credenciais preenchidas!')
              router.push('/admin')
            }}
            className="w-full bg-[#f5a623] hover:bg-[#e09600] text-gray-950 font-black text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>⚡ Entrar no Painel com 1 Clique</span>
          </button>
          <p className="text-[11px] text-gray-400 text-center font-medium">
            Email: <code className="text-gray-700">admin@cacaushow.com</code> | Senha: <code className="text-gray-700">admin123</code>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-cs-brown transition-colors">
            ← Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  )
}
