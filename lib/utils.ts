import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

export function formatPriceParts(price: number): { integer: string; decimal: string } {
  const formatted = price.toFixed(2)
  const [integer, decimal] = formatted.split('.')
  return {
    integer: parseInt(integer).toLocaleString('pt-BR'),
    decimal,
  }
}

export function calculateDiscount(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100)
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
