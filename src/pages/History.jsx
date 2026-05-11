import { useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTransactions } from '@/hooks/useTransactions'
import { formatCurrency, formatDate, getMonthLabel } from '@/lib/utils'
import { useLang } from '@/lib/i18n'
import { getCategoryMeta } from '@/lib/categories'

const MONTH_ABBR = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
}

function fmtCompact(n) {
  const abs = Math.abs(n)
  const sign = n >= 0 ? '+' : '−'
  if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(1)}k`
  return `${sign}${abs.toFixed(0)}`
}

function buildMonthMap(transactions) {
  const map = {}
  for (const tx of transactions) {
    const key = tx.date.slice(0, 7)
    if (!map[key]) map[key] = { income: 0, expense: 0, count: 0, txns: [] }
    if (tx.type === 'income') map[key].income += tx.amount
    else map[key].expense += tx.amount
    map[key].count++
    map[key].txns.push(tx)
  }
  return map
}

export function History() {
  const { transactions, loading } = useTransactions()
  const { lang, t } = useLang()
  const [activeMonth, setActiveMonth] = useState(null)
  const [txTypeFilter, setTxTypeFilter] = useState('')

  const handleSetActiveMonth = (key) => { setActiveMonth(key); setTxTypeFilter('') }

  const monthMap = buildMonthMap(transactions)
  const abbr = MONTH_ABBR[lang] ?? MONTH_ABBR.en

  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonthKey = `${currentYear}-${String(today.getMonth() + 1).padStart(2, '0')}`

  const dataYears = new Set(transactions.map((tx) => tx.date.slice(0, 4)))
  dataYears.add(String(currentYear))
  const years = [...dataYears].sort((a, b) => b.localeCompare(a))

  const activeData = activeMonth ? monthMap[activeMonth] : null
  const activeBalance = activeData ? activeData.income - activeData.expense : 0
  const activeSavingsRate =
    activeData?.income > 0 ? Math.round((activeBalance / activeData.income) * 100) : null

  return (
    <div className="bg-page h-full flex flex-col overflow-y-auto scrollbar-none">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-page px-4 pb-4 border-b border-border" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 48px)' }}>
        <h1 className="text-lg font-bold text-label">{t('monthlyHistory')}</h1>
      </div>

      <div className="px-4 py-5 pb-32">
        {loading && (
          <div className="flex flex-col gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && years.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-muted">
            <p className="text-3xl mb-4 opacity-20">—</p>
            <p className="text-sm">{t('noTransactionsYet')}</p>
          </div>
        )}

        {!loading && years.map((year, yearIdx) => (
          <div key={year} className="mb-7 animate-fade-in-up" style={{ animationDelay: `${yearIdx * 80}ms` }}>
            {/* Year divider */}
            <div className="flex items-center gap-3 mb-3">
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{year}</p>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* 3-column month grid */}
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, i) => {
                const monthNum = String(i + 1).padStart(2, '0')
                const key = `${year}-${monthNum}`
                const data = monthMap[key]
                const isFuture = key > currentMonthKey
                const isDisabled = !data || isFuture
                const balance = data ? data.income - data.expense : 0
                const balancePos = balance >= 0

                return (
                  <motion.button
                    key={key}
                    disabled={isDisabled}
                    onClick={() => handleSetActiveMonth(key)}
                    style={{ animationDelay: `${i * 30}ms` }}
                    className={`animate-card-enter flex flex-col items-center justify-center gap-1.5 py-4 rounded-2xl bg-white ${
                      isDisabled ? 'opacity-30 cursor-default' : ''
                    }`}
                    whileTap={isDisabled ? {} : { scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
                      {abbr[i]}
                    </p>
                    <p
                      className="text-xs font-bold tabular-nums"
                      style={{
                        color: isDisabled ? '#515151' : balancePos ? '#3D9970' : '#C0392B',
                        opacity: isDisabled ? 0.3 : 1,
                      }}
                    >
                      {isDisabled ? '—' : fmtCompact(balance)}
                    </p>
                  </motion.button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Month detail sheet */}
      <AnimatePresence>
        {activeMonth && activeData && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setActiveMonth(null)}
            />
            <motion.div
              className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-xl p-6"
              initial={{ y: '100%', opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            >
              <div className="w-8 h-1 rounded-full bg-border mx-auto mb-5 sm:hidden" />

              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-label capitalize">
                  {getMonthLabel(activeMonth, lang === 'es' ? 'es-ES' : 'en-GB')}
                </h2>
                <motion.button
                  onClick={() => setActiveMonth(null)}
                  className="p-2 rounded-full text-muted"
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Balance */}
              <p className="text-[10px] text-muted uppercase tracking-widest mb-1">{t('thisMonth')}</p>
              <p
                className="text-4xl font-bold tabular-nums leading-none mb-5"
                style={{ color: activeBalance >= 0 ? '#3D9970' : '#C0392B' }}
              >
                {activeBalance >= 0 ? '+' : '−'}{formatCurrency(Math.abs(activeBalance))}
              </p>

              {/* Income / Expenses */}
              <div className="flex gap-3 mb-4">
                <motion.button
                  onClick={() => setTxTypeFilter(txTypeFilter === 'income' ? '' : 'income')}
                  className="flex-1 rounded-2xl px-4 py-3 text-left transition-colors"
                  style={{ backgroundColor: txTypeFilter === 'income' ? '#515151' : '#ffffff' }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                >
                  <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: txTypeFilter === 'income' ? 'rgba(255,255,255,0.6)' : '#9A9A9A' }}>{t('income')}</p>
                  <p className="text-base font-bold tabular-nums" style={{ color: txTypeFilter === 'income' ? '#fff' : '#3D9970' }}>+{formatCurrency(activeData.income)}</p>
                </motion.button>
                <motion.button
                  onClick={() => setTxTypeFilter(txTypeFilter === 'expense' ? '' : 'expense')}
                  className="flex-1 rounded-2xl px-4 py-3 text-left transition-colors"
                  style={{ backgroundColor: txTypeFilter === 'expense' ? '#515151' : '#ffffff' }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                >
                  <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: txTypeFilter === 'expense' ? 'rgba(255,255,255,0.6)' : '#9A9A9A' }}>{t('expenses')}</p>
                  <p className="text-base font-bold tabular-nums" style={{ color: txTypeFilter === 'expense' ? 'rgba(255,255,255,0.7)' : '#C0392B' }}>−{formatCurrency(activeData.expense)}</p>
                </motion.button>
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">{activeData.count} {t('txUnit')}</span>
                {activeSavingsRate !== null && (
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-label"
                    style={{ opacity: activeBalance >= 0 ? 1 : 0.55 }}
                  >
                    {activeSavingsRate >= 0 ? '+' : ''}{activeSavingsRate}%
                  </span>
                )}
              </div>

              {/* Spending bar */}
              {activeData.income > 0 && (
                <div className="mt-4">
                  <div className="h-1.5 rounded-full bg-white overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, (activeData.expense / activeData.income) * 100)}%`,
                        backgroundColor: '#515151',
                        opacity: 0.4,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-muted mt-1">
                    {Math.round((activeData.expense / activeData.income) * 100)}{t('ofIncomeSpent')}
                  </p>
                </div>
              )}

              {/* Transaction list */}
              {activeData.txns?.length > 0 && (
                <div className="mt-5">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">{t('recent')}</p>
                  <div className="max-h-56 overflow-y-auto scrollbar-none -mx-1 px-1">
                    {[...activeData.txns]
                      .filter(tx => !txTypeFilter || tx.type === txTypeFilter)
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((tx) => {
                        const meta = getCategoryMeta(tx.category, tx.type, t)
                        const isIncome = tx.type === 'income'
                        return (
                          <div key={tx.id} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 bg-white">
                              <img
                                src={meta.icon}
                                alt=""
                                className="w-4 h-4"
                                style={{ filter: 'grayscale(1)', opacity: 0.6 }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-label">{meta.label}</p>
                              {tx.note && <p className="text-xs text-muted truncate">{tx.note}</p>}
                              <p className="text-[10px] text-muted">{formatDate(tx.date)}</p>
                            </div>
                            <span
                              className="text-sm font-bold tabular-nums flex-shrink-0"
                              style={{ color: isIncome ? '#3D9970' : '#C0392B' }}
                            >
                              {isIncome ? '+' : '−'}{formatCurrency(tx.amount)}
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
