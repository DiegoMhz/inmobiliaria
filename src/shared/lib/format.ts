export function formatPrice(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatSqm(sqm: number): string {
  return `${new Intl.NumberFormat('es-AR').format(sqm)} m²`
}
