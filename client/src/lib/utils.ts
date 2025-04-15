import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  // Convert from USD to KSH (approximate exchange rate: 1 USD = 130 KSH)
  const kshAmount = amount * 130;
  
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(kshAmount);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-');
}

export function getStockStatusClass(status: string): string {
  switch (status) {
    case 'in_stock':
      return 'bg-green-100 text-green-800';
    case 'low_stock':
      return 'bg-yellow-100 text-yellow-800';
    case 'out_of_stock':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getStockStatusText(status: string): string {
  switch (status) {
    case 'in_stock':
      return 'In Stock';
    case 'low_stock':
      return 'Low Stock';
    case 'out_of_stock':
      return 'Out of Stock';
    default:
      return 'Unknown';
  }
}

export function calculateDiscount(originalPrice: string, discountPrice?: string): number {
  if (!discountPrice) return 0;
  
  const original = parseFloat(originalPrice);
  const discount = parseFloat(discountPrice);
  
  if (original <= 0 || discount >= original) return 0;
  
  return Math.round(((original - discount) / original) * 100);
}
