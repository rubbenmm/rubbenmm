import foodIcon         from '../assets/icons/food and drink.png'
import transportIcon    from '../assets/icons/transport.png'
import entIcon          from '../assets/icons/entertaiment.png'
import healthIcon       from '../assets/icons/health.png'
import shoppingIcon     from '../assets/icons/shopping.png'
import utilitiesIcon    from '../assets/icons/utilities.png'
import otherIcon        from '../assets/icons/other.png'
import salaryIcon       from '../assets/icons/salary.png'
import freelanceIcon    from '../assets/icons/freelance.png'
import giftIcon         from '../assets/icons/gitft.png'

const EXPENSE_DEFS = [
  { value: 'food',          color: '#515151', bg: '#F5F5F5', icon: foodIcon },
  { value: 'transport',     color: '#515151', bg: '#F5F5F5', icon: transportIcon },
  { value: 'entertainment', color: '#515151', bg: '#F5F5F5', icon: entIcon },
  { value: 'health',        color: '#515151', bg: '#F5F5F5', icon: healthIcon },
  { value: 'shopping',      color: '#515151', bg: '#F5F5F5', icon: shoppingIcon },
  { value: 'utilities',     color: '#515151', bg: '#F5F5F5', icon: utilitiesIcon },
  { value: 'other',         color: '#515151', bg: '#F5F5F5', icon: otherIcon },
]

const INCOME_DEFS = [
  { value: 'salary',    color: '#515151', bg: '#F5F5F5', icon: salaryIcon },
  { value: 'freelance', color: '#515151', bg: '#F5F5F5', icon: freelanceIcon },
  { value: 'gift',      color: '#515151', bg: '#F5F5F5', icon: giftIcon },
  { value: 'other',     color: '#515151', bg: '#F5F5F5', icon: otherIcon },
]

// Fallback static lists (labels in English) — used where t() isn't available
export const EXPENSE_CATEGORIES = EXPENSE_DEFS.map((c) => ({ ...c, label: c.value }))
export const INCOME_CATEGORIES  = INCOME_DEFS.map((c) => ({ ...c, label: c.value }))

// Translated versions — pass the t() function from useLang()
export function getExpenseCategories(t) {
  return EXPENSE_DEFS.map((c) => ({ ...c, label: t(`cat_${c.value}`) }))
}
export function getIncomeCategories(t) {
  return INCOME_DEFS.map((c) => ({ ...c, label: t(`cat_${c.value}`) }))
}

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

export function getCategoryMeta(value, type, t) {
  const list = type === 'income' ? INCOME_DEFS : EXPENSE_DEFS
  const def = list.find((c) => c.value === value) ?? { value, color: '#8E8E93', bg: '#F5F5F5', icon: '📦' }
  return { ...def, label: t ? t(`cat_${def.value}`) : def.value }
}
