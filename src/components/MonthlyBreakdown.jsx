import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { SpendingChart } from './SpendingChart'
import { formatCurrency } from '@/lib/utils'

function MonthRow({ data }) {
  const [open, setOpen] = useState(false)

  const label = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' })
    .format(new Date(data.month + '-02')) // +02 avoids UTC midnight rollback

  const balance = data.income - data.expense

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 py-3.5 text-left transition-colors active:bg-gray-50"
      >
        {/* Month + count */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-label capitalize">{label}</p>
          <p className="text-xs text-muted mt-0.5">
            {data.transactions.length} transaction{data.transactions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Income */}
        <div className="text-right">
          <p className="text-xs text-muted">In</p>
          <p className="text-sm font-semibold tabular-nums" style={{ color: '#3D9970' }}>
            +{formatCurrency(data.income)}
          </p>
        </div>

        {/* Expense */}
        <div className="text-right">
          <p className="text-xs text-muted">Out</p>
          <p className="text-sm font-semibold tabular-nums" style={{ color: '#C0392B' }}>
            -{formatCurrency(data.expense)}
          </p>
        </div>

        {/* Chevron */}
        <span className="text-muted flex-shrink-0 ml-1">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
      </button>

      {/* Expanded chart */}
      {open && (
        <div className="pb-3 pt-1">
          <p className="text-xs text-muted px-0.5 mb-1">
            Balance: <span
              className="font-semibold"
              style={{ color: balance >= 0 ? '#34C759' : '#FF3B30' }}
            >{formatCurrency(balance)}</span>
          </p>
          <SpendingChart transactions={data.transactions} />
        </div>
      )}
    </div>
  )
}

export function MonthlyBreakdown({ transactions }) {
  const map = {}
  for (const t of transactions) {
    const month = t.date.slice(0, 7)
    if (!map[month]) map[month] = { month, income: 0, expense: 0, transactions: [] }
    if (t.type === 'income') map[month].income += t.amount
    else map[month].expense += t.amount
    map[month].transactions.push(t)
  }

  const months = Object.values(map).sort((a, b) => b.month.localeCompare(a.month))

  if (!months.length) {
    return (
      <div className="flex items-center justify-center py-8 text-muted text-sm">
        No monthly data yet
      </div>
    )
  }

  return (
    <div className="bg-card rounded-2xl shadow-sm px-4">
      {months.map((m) => (
        <MonthRow key={m.month} data={m} />
      ))}
    </div>
  )
}
