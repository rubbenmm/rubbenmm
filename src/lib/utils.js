export function formatCurrency(amount) {
  const negative = amount < 0
  const abs = Math.abs(amount)
  const [intPart, decPart] = abs.toFixed(2).split('.')
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${negative ? '-' : ''}${intFormatted},${decPart} €`
}

export function getMonthLabel(monthStr, locale = 'es-ES') {
  const [y, m] = monthStr.split('-').map(Number)
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })
    .format(new Date(y, m - 1, 1))
}

export function prevMonth(monthStr) {
  const [y, m] = monthStr.split('-').map(Number)
  const d = new Date(y, m - 2, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function nextMonth(monthStr) {
  const [y, m] = monthStr.split('-').map(Number)
  const d = new Date(y, m, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Intl.DateTimeFormat(navigator.language, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(y, m - 1, d))
}

export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
