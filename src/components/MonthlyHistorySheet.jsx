import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency, getMonthLabel } from '@/lib/utils'

function buildMonths(transactions) {
  const map = {}
  for (const t of transactions) {
    const month = t.date.slice(0, 7)
    if (!map[month]) map[month] = { month, income: 0, expense: 0, count: 0 }
    if (t.type === 'income') map[month].income += t.amount
    else map[month].expense += t.amount
    map[month].count++
  }
  return Object.values(map).sort((a, b) => b.month.localeCompare(a.month))
}

export function MonthlyHistorySheet({ open, onClose, transactions, onSelectMonth }) {
  const months = buildMonths(transactions)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <motion.div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-xl flex flex-col max-h-[85vh]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          >
            {/* Handle + header */}
            <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b border-border">
              <div className="w-8 h-1 rounded-full bg-border mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-label">Monthly History</h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full text-muted"
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <X size={15} />
                </motion.button>
              </div>
            </div>

            {/* Scrollable month cards */}
            <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-2 pb-8 scrollbar-none">
              {months.length === 0 && (
                <p className="text-center text-muted text-sm py-12">No data yet</p>
              )}
              {months.map((m) => {
                const balance = m.income - m.expense
                const balancePos = balance >= 0
                return (
                  <motion.button
                    key={m.month}
                    onClick={() => { onSelectMonth(m.month); onClose() }}
                    className="bg-white rounded-2xl p-4 text-left"
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-label capitalize">{getMonthLabel(m.month)}</p>
                      <span className="text-xs text-muted bg-white px-2 py-0.5 rounded-full">{m.count} tx</span>
                    </div>
                    <p className="text-2xl font-bold tabular-nums mb-3 text-label" style={{ opacity: balancePos ? 1 : 0.55 }}>
                      {balancePos ? '+' : ''}{formatCurrency(balance)}
                    </p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white rounded-xl px-3 py-2">
                        <p className="text-[10px] text-muted uppercase tracking-widest mb-0.5">Income</p>
                        <p className="text-sm font-semibold tabular-nums" style={{ color: '#3D9970' }}>+{formatCurrency(m.income)}</p>
                      </div>
                      <div className="flex-1 bg-white rounded-xl px-3 py-2">
                        <p className="text-[10px] text-muted uppercase tracking-widest mb-0.5">Expenses</p>
                        <p className="text-sm font-semibold tabular-nums" style={{ color: '#C0392B' }}>−{formatCurrency(m.expense)}</p>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl animate-slide-up flex flex-col max-h-[85vh]">
        {/* Handle + header */}
        <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b border-border">
          <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-label">Monthly History</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-muted hover:bg-gray-100 transition-colors"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Scrollable month cards */}
        <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-3 pb-8">
          {months.length === 0 && (
            <p className="text-center text-muted text-sm py-12">No data yet</p>
          )}
          {months.map((m) => {
            const balance = m.income - m.expense
            const balancePos = balance >= 0
            return (
              <button
                key={m.month}
                onClick={() => { onSelectMonth(m.month); onClose() }}
                className="bg-white rounded-2xl p-4 shadow-sm text-left active:scale-[0.98] transition-transform"
              >
                {/* Month label + transaction count */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-label capitalize">
                    {getMonthLabel(m.month)}
                  </p>
                  <span className="text-xs text-muted bg-white px-2 py-0.5 rounded-full">
                    {m.count} tx
                  </span>
                </div>

                {/* Balance */}
                <p
                  className="text-2xl font-bold tabular-nums mb-3"
                  style={{ color: balancePos ? '#3D9970' : '#C0392B' }}
                >
                  {balancePos ? '+' : ''}{formatCurrency(balance)}
                </p>

                {/* Income / Expense row */}
                <div className="flex gap-2">
                  <div className="flex-1 bg-white rounded-xl px-3 py-2">
                    <p className="text-[10px] text-muted uppercase tracking-widest mb-0.5">Income</p>
                    <p className="text-sm font-semibold tabular-nums" style={{ color: '#3D9970' }}>
                      +{formatCurrency(m.income)}
                    </p>
                  </div>
                  <div className="flex-1 bg-white rounded-xl px-3 py-2">
                    <p className="text-[10px] text-muted uppercase tracking-widest mb-0.5">Expenses</p>
                    <p className="text-sm font-semibold tabular-nums" style={{ color: '#C0392B' }}>
                      −{formatCurrency(m.expense)}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
