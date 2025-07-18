import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Currency formatting utility
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 2
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount)
}

// Percentage formatting utility
export function formatPercentage(
  value: number,
  minimumFractionDigits: number = 1,
  maximumFractionDigits: number = 2
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value / 100)
}

// Number formatting utility
export function formatNumber(
  value: number,
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 2
): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value)
} 