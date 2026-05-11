import { getExpenseCategories } from '@/lib/categories'
import { formatCurrency } from '@/lib/utils'
import { useLang } from '@/lib/i18n'

export function SpendingChart({ transactions }) {
  const { t } = useLang()

  const expensesByCategory = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount
      return acc
    }, {})

  const data = getExpenseCategories(t)
    .map((c) => ({
      name: c.label,
      value: expensesByCategory[c.value] || 0,
      icon: c.icon,
    }))
    .sort((a, b) => b.value - a.value)

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="flex flex-col">
      {data.map((entry, i) => (
        <div
          key={entry.name}
          className="flex items-center gap-3 py-1"
          style={{ borderBottom: i < data.length - 1 ? '1px solid #F0F0F0' : 'none' }}
        >
          <img
            src={entry.icon}
            alt=""
            className="w-4 h-4 flex-shrink-0"
            style={{ filter: 'grayscale(1)', opacity: 0.4 }}
          />
          <p className="flex-1 text-sm text-label truncate" style={{ opacity: entry.value === 0 ? 0.35 : 1 }}>{entry.name}</p>
          <p className="text-sm font-semibold tabular-nums text-label" style={{ opacity: entry.value === 0 ? 0.3 : 1 }}>
            {entry.value === 0 ? '—' : formatCurrency(entry.value)}
          </p>
        </div>
      ))}
      <div className="pt-3 flex items-center justify-between">
        <p className="text-[10px] text-muted uppercase tracking-widest font-semibold">{t('expenses')}</p>
        <p className="text-sm font-bold text-label tabular-nums">{formatCurrency(total)}</p>
      </div>
    </div>
  )
}


