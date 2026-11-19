import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Carrier, UserDeliveryAddress } from './types'

export const defaultCarriers: Carrier[] = [
  {
    id: 'c1',
    name: 'ENTREGA EXPRESSA CACAU SHOW',
    deadline: 'Chega hoje ou em até 24h',
    price: 12.90,
    active: true,
    badge: '❤️ MAIS RÁPIDA',
  },
  {
    id: 'c2',
    name: 'SEDEX - CORREIOS',
    deadline: '1 a 2 dias úteis',
    price: 18.50,
    active: true,
    badge: '📦 SEDEX',
  },
  {
    id: 'c3',
    name: 'JADLOG EXPRESS',
    deadline: '2 a 3 dias úteis',
    price: 14.90,
    active: true,
    badge: '🚚 JADLOG',
  },
  {
    id: 'c4',
    name: 'LOGGI REFRIGERADA',
    deadline: '1 a 3 dias úteis com frete refrigerado',
    price: 0.00,
    active: true,
    badge: '❄️ FRETE GRÁTIS',
  },
]

interface ShippingState {
  isOpen: boolean
  userAddress: UserDeliveryAddress | null
  carriers: Carrier[]
  openModal: () => void
  closeModal: () => void
  setUserAddress: (address: UserDeliveryAddress) => void
  selectCarrier: (carrier: Carrier) => void
  addCarrier: (carrier: Omit<Carrier, 'id'>) => void
  updateCarrier: (id: string, carrier: Partial<Carrier>) => void
  deleteCarrier: (id: string) => void
  toggleCarrierActive: (id: string) => void
}

export const useShippingStore = create<ShippingState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      userAddress: {
        cep: '01310-100',
        number: '1000',
        street: 'Avenida Paulista',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        carrier: defaultCarriers[0],
      },
      carriers: defaultCarriers,

      openModal: () => set({ isOpen: true }),
      closeModal: () => set({ isOpen: false }),

      setUserAddress: (address) => set({ userAddress: address }),

      selectCarrier: (carrier) => {
        const current = get().userAddress
        if (current) {
          set({
            userAddress: {
              ...current,
              carrier,
            },
          })
        }
      },

      addCarrier: (newCarrier) => {
        const id = 'c_' + Date.now()
        set((state) => ({
          carriers: [...state.carriers, { ...newCarrier, id }],
        }))
      },

      updateCarrier: (id, updated) => {
        set((state) => ({
          carriers: state.carriers.map((c) =>
            c.id === id ? { ...c, ...updated } : c
          ),
        }))
      },

      deleteCarrier: (id) => {
        set((state) => ({
          carriers: state.carriers.filter((c) => c.id !== id),
        }))
      },

      toggleCarrierActive: (id) => {
        set((state) => ({
          carriers: state.carriers.map((c) =>
            c.id === id ? { ...c, active: !c.active } : c
          ),
        }))
      },
    }),
    {
      name: 'cacaushow-shipping-storage',
    }
  )
)
