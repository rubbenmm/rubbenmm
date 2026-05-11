import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTransactions } from '@/hooks/useTransactions'
import { TransactionList } from '@/components/TransactionList'
import { getExpenseCategories, getIncomeCategories } from '@/lib/categories'
import { useLang } from '@/lib/i18n'
import { todayISO } from '@/lib/utils'

function currentMonthRange() {
  const today = todayISO()
  const [y, m] = today.slice(0, 7).split('-')
  const lastDay = new Date(Number(y), Number(m), 0).getDate()
  return { from: `${y}-${m}-01`, to: `${y}-${m}-${String(lastDay).padStart(2, '0')}` }
}

export function Transactions({ onEdit, onDelete }) {
  const { t } = useLang()
  const defaultRange = currentMonthRange()
  const [type, setType] = useState('')
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState(defaultRange.from)
  const [dateTo, setDateTo]     = useState(defaultRange.to)

  const TYPE_OPTIONS = [
    { value: '', label: t('typeAll') },
    { value: 'expense', label: t('typeExpenses') },
    { value: 'income', label: t('typeIncome') },
  ]

  const filters = {
    ...(type && { type }),
    ...(category && { category }),
    ...(search && { search }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
  }

  const { transactions, loading } = useTransactions(filters)

  const categoryOptions = [
    { value: '', label: t('allCategories') },
    ...(type === 'income' ? getIncomeCategories(t) : type === 'expense' ? getExpenseCategories(t) : [...getExpenseCategories(t), ...getIncomeCategories(t)]),
  ]

  const clearFilters = () => { setType(''); setCategory(''); setSearch(''); setDateFrom(defaultRange.from); setDateTo(defaultRange.to) }
  const hasFilters = type || category || search || dateFrom !== defaultRange.from || dateTo !== defaultRange.to

  const inputCls = 'w-full bg-card border border-border rounded-xl px-3 py-2 text-sm text-label focus:outline-none focus:ring-2 focus:ring-[#515151]/15 transition'

  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="flex flex-col gap-2.5 px-4 pt-5 pb-3 flex-shrink-0 bg-surface">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputCls} pl-8 pr-4`}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex flex-col gap-0.5">
            <label className="text-[10px] text-muted uppercase tracking-widest font-semibold px-1">{t('dateFrom')}</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="flex-1 flex flex-col gap-0.5">
            <label className="text-[10px] text-muted uppercase tracking-widest font-semibold px-1">{t('dateTo')}</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Filter pills row */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TYPE_OPTIONS.map((opt) => (
            <motion.button
              key={opt.value}
              onClick={() => { setType(opt.value); setCategory('') }}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
              style={
                type === opt.value
                  ? { backgroundColor: '#515151', color: '#fff' }
                  : { backgroundColor: '#EBEBEB', color: '#9A9A9A' }
              }
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              {opt.label}
            </motion.button>
          ))}

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold focus:outline-none border-0 appearance-none"
            style={{ backgroundColor: '#EBEBEB', color: '#9A9A9A' }}
          >
            {categoryOptions.map((c, i) => (
              <option key={`${c.value}-${i}`} value={c.value}>{c.label}</option>
            ))}
          </select>

          {hasFilters && (
            <motion.button
              onClick={clearFilters}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs text-muted flex items-center gap-1"
              style={{ backgroundColor: '#EBEBEB' }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <X size={11} /> {t('clearFilters')}
            </motion.button>
          )}
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-4 pt-3 pb-16">
        {loading ? (
          <div className="bg-card rounded-2xl h-40 animate-pulse" />
        ) : (
          <TransactionList
            transactions={transactions}
            onEdit={onEdit}
            onDelete={onDelete}
            emptyMessage={hasFilters ? t('noMatchFilters') : t('noTransactionsYet')}
          />
        )}
      </div>
    </div>
  )
}
