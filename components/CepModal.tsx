'use client'

import { useState, useEffect } from 'react'
import { X, Check, Truck, Sparkles, MapPin, Loader2 } from 'lucide-react'
import { useShippingStore } from '@/lib/shippingStore'
import { Carrier } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function CepModal() {
  const { isOpen, closeModal, userAddress, setUserAddress, carriers, selectCarrier } = useShippingStore()

  const [step, setStep] = useState<'input' | 'carriers'>('input')
  const [cep, setCep] = useState('')
  const [number, setNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [addressDetails, setAddressDetails] = useState<{
    street: string
    neighborhood: string
    city: string
    state: string
  }>({
    street: '',
    neighborhood: '',
    city: '',
    state: '',
  })

  // Selected carrier in modal
  const [selectedCarrier, setSelectedCarrierState] = useState<Carrier | null>(null)

  // Initialize with current address when opening
  useEffect(() => {
    if (isOpen) {
      if (userAddress) {
        setCep(userAddress.cep || '')
        setNumber(userAddress.number || '')
        setAddressDetails({
          street: userAddress.street || 'Avenida Principal',
          neighborhood: userAddress.neighborhood || 'Centro',
          city: userAddress.city || 'São Paulo',
          state: userAddress.state || 'SP',
        })
        setSelectedCarrierState(userAddress.carrier || carriers[0] || null)
        // If address already set, open on input so user can edit, or carriers
        setStep('input')
      } else {
        setSelectedCarrierState(carriers[0] || null)
        setStep('input')
      }
    }
  }, [isOpen, userAddress, carriers])

  // Format CEP (00000-000)
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 8) value = value.slice(0, 8)
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`
    }
    setCep(value)
  }

  // Handle Search CEP
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanCep = cep.replace(/\D/g, '')

    if (cleanCep.length < 8) {
      toast.error('Por favor, informe um CEP válido com 8 dígitos.')
      return
    }

    if (!number.trim()) {
      toast.error('Por favor, informe o número do endereço.')
      return
    }

    setLoading(true)

    try {
      // Query ViaCEP
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await res.json()

      if (!data.erro) {
        setAddressDetails({
          street: data.logradouro || 'Rua Principal',
          neighborhood: data.bairro || 'Centro',
          city: data.localidade || 'São Paulo',
          state: data.uf || 'SP',
        })
      } else {
        // Fallback for valid format
        setAddressDetails({
          street: 'Endereço Local',
          neighborhood: 'Bairro',
          city: 'São Paulo',
          state: 'SP',
        })
      }
    } catch {
      // Offline / network fallback
      setAddressDetails({
        street: 'Endereço Local',
        neighborhood: 'Bairro',
        city: 'São Paulo',
        state: 'SP',
      })
    } finally {
      setLoading(false)
      setStep('carriers')
    }
  }

  // Confirm and advance
  const handleAdvance = () => {
    if (!selectedCarrier) {
      toast.error('Escolha uma opção de transportadora para continuar.')
      return
    }

    const updatedAddress = {
      cep,
      number,
      street: addressDetails.street,
      neighborhood: addressDetails.neighborhood,
      city: addressDetails.city,
      state: addressDetails.state,
      carrier: selectedCarrier,
    }

    setUserAddress(updatedAddress)
    selectCarrier(selectedCarrier)
    closeModal()
    toast.success(`Entrega via ${selectedCarrier.name} selecionada!`)
  }

  if (!isOpen) return null

  // Filter active carriers
  const activeCarriers = carriers.filter((c) => c.active)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeModal}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-fade-in">
        {/* Header Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors z-20 p-1"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-7 overflow-y-auto flex-1">
          {/* Welcome Title */}
          <h2 className="text-2xl sm:text-3xl font-black text-[#2b1208] leading-tight mb-3">
            Bem-vindo à Cacau Show
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-700 leading-relaxed mb-6 font-normal">
            Para encontrarmos os <strong className="font-bold text-gray-900">melhores preços e o estoque</strong> mais perto de você, por gentileza <strong className="font-bold text-gray-900">informe seu CEP:</strong>
          </p>

          {/* Form Inputs (Photo 1 & Photo 2) */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">
                <span className="text-[#a52020] mr-1">*</span>CEP
              </label>
              <input
                type="text"
                value={cep}
                onChange={handleCepChange}
                placeholder="00000-000"
                maxLength={9}
                required
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-base font-semibold text-gray-900 focus:border-[#f5a623] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">
                <span className="text-[#a52020] mr-1">*</span>Número
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Ex: 114"
                required
                className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-base font-semibold text-gray-900 focus:border-[#f5a623] focus:outline-none transition-colors"
              />
            </div>

            {/* Link Não sei meu CEP */}
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-bold text-[#e5a020] hover:underline"
            >
              Não sei meu CEP
            </a>

            {/* Step 1: BUSCAR Button */}
            {step === 'input' && (
              <div className="pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#f5a623] hover:bg-[#e69715] text-[#2b1408] font-black text-base py-4 rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 uppercase tracking-wide disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      <span>BUSCANDO...</span>
                    </>
                  ) : (
                    <span>BUSCAR</span>
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Step 2: Escolha de Transportadoras (Photo 2) */}
          {step === 'carriers' && (
            <div className="mt-6 pt-5 border-t border-gray-100 animate-fade-in">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#2b1208] leading-tight">
                  Escolha uma opção de entrega abaixo:
                </h3>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin size={13} className="text-[#f5a623]" />
                  <span>{addressDetails.street}, {number} - {addressDetails.city}/{addressDetails.state}</span>
                </p>
              </div>

              {/* Carrier Option Cards */}
              <div className="space-y-3 mb-6">
                {activeCarriers.map((carrier) => {
                  const isSelected = selectedCarrier?.id === carrier.id

                  return (
                    <div
                      key={carrier.id}
                      onClick={() => setSelectedCarrierState(carrier)}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#3d5a80] bg-[#f4f7fa] shadow-xs'
                          : 'border-gray-200/90 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex-1 pr-3">
                        {/* Carrier Badge & Name */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black text-[#1e293b] uppercase tracking-wide">
                            {carrier.name}
                          </span>
                          {carrier.badge && (
                            <span className="text-[10px] bg-[#fef3c7] text-[#92400e] font-bold px-2 py-0.5 rounded-full">
                              {carrier.badge}
                            </span>
                          )}
                        </div>

                        {/* Route & Delivery Detail */}
                        <p className="text-xs text-gray-500 font-medium">
                          {carrier.deadline}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {addressDetails.street.toUpperCase()}, Nº {number} • {addressDetails.city} - {addressDetails.state}
                        </p>

                        {/* Price */}
                        <div className="mt-2 flex items-baseline gap-1">
                          {carrier.price === 0 ? (
                            <span className="text-sm font-black text-green-700">GRÁTIS</span>
                          ) : (
                            <span className="text-sm font-black text-gray-900">
                              {formatPrice(carrier.price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Selected Checkmark Circle */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                          isSelected
                            ? 'bg-[#475569] text-white shadow-sm'
                            : 'border-2 border-gray-300 text-transparent'
                        }`}
                      >
                        <Check size={16} strokeWidth={3} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Step 2: AVANÇAR Button */}
              <button
                type="button"
                onClick={handleAdvance}
                className="w-full bg-[#fed480] hover:bg-[#f5a623] text-[#2b1408] font-black text-base py-4 rounded-xl shadow-md transition-all active:scale-[0.99] uppercase tracking-wide"
              >
                AVANÇAR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
