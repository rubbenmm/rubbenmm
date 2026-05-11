import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTransactions } from '@/hooks/useTransactions'
import { SpendingChart } from '@/components/SpendingChart'
import { DailyHeatmap } from '@/components/DailyHeatmap'
import { formatCurrency, todayISO, getMonthLabel, prevMonth, nextMonth } from '@/lib/utils'
import { useLang } from '@/lib/i18n'

export function Dashboard({ onEdit, onDelete }) {
  const navigate = useNavigate()
  const { lang, t } = useLang()
  const { transactions, loading, totals } = useTransactions()
  const currentMonthStr = todayISO().slice(0, 7)
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr)
  const isCurrentMonth = selectedMonth === currentMonthStr

  const monthlyTxns = transactions.filter((tx) => tx.date.startsWith(selectedMonth))
  const monthly = monthlyTxns.reduce(
    (acc, tx) => { tx.type === 'income' ? (acc.income += tx.amount) : (acc.expense += tx.amount); return acc },
    { income: 0, expense: 0 }
  )
  monthly.balance = monthly.income - monthly.expense

  return (
    <div
      className="flex flex-col h-full gap-3 px-4 overflow-hidden"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)', paddingBottom: '88px' }}
    >
      {/* Hero card — clean white, flat */}
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-white px-5 pt-4 pb-4 animate-fade-in-up flex-shrink-0 cursor-pointer"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)' }}
        onClick={() => navigate('/history')}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        role="button"
        aria-label="Open monthly history"
      >
        {/* Month selector */}
        <div className="flex items-center justify-between mb-3" onClick={(e) => e.stopPropagation()}>
          <motion.button
            onClick={() => setSelectedMonth(prevMonth(selectedMonth))}
            className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-label"
            whileTap={{ scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          >
            <ChevronLeft size={14} />
          </motion.button>
          <p className="text-xs font-semibold text-muted capitalize tracking-wide">
            {getMonthLabel(selectedMonth, lang === 'es' ? 'es-ES' : 'en-GB')}
          </p>
          <motion.button
            onClick={() => setSelectedMonth(nextMonth(selectedMonth))}
            disabled={isCurrentMonth}
            className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-label disabled:opacity-25"
            whileTap={{ scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          >
            <ChevronRight size={14} />
          </motion.button>
        </div>

        {/* Balance */}
        <p className="text-[10px] text-muted uppercase tracking-widest mb-1">{t('thisMonth')}</p>
        <p
          className="text-4xl font-extrabold tabular-nums leading-none mb-4"
          style={{ color: monthly.balance >= 0 ? '#3D9970' : '#C0392B' }}
        >
          {monthly.balance >= 0 ? '+' : ''}{formatCurrency(monthly.balance)}
        </p>

        {/* Income / Expense sub-cards */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 bg-white rounded-xl px-3 py-2.5">
            <p className="text-[9px] text-muted uppercase tracking-widest mb-0.5">{t('income')}</p>
            <p className="text-sm font-bold tabular-nums" style={{ color: '#3D9970' }}>{formatCurrency(monthly.income)}</p>
          </div>
          <div className="flex-1 bg-white rounded-xl px-3 py-2.5">
            <p className="text-[9px] text-muted uppercase tracking-widest mb-0.5">{t('expenses')}</p>
            <p className="text-sm font-bold tabular-nums" style={{ color: '#C0392B' }}>{formatCurrency(monthly.expense)}</p>
          </div>
        </div>

        {/* All-time balance footer */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div>
            <p className="text-[9px] text-muted uppercase tracking-widest">{t('allTimeBalance')}</p>
            <p className="text-xs font-semibold tabular-nums text-label">{formatCurrency(totals.balance)}</p>
          </div>
          <p className="text-[10px] text-muted">{t('history')} →</p>
        </div>
      </motion.div>

      {/* Spending by Category */}
      <div className="bg-white rounded-2xl p-4 flex flex-col flex-shrink-0 animate-fade-in-up" style={{ animationDelay: '60ms', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <p className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3 flex-shrink-0">{t('spendingByCategory')}</p>
        {loading
          ? <div className="flex-1 flex items-center justify-center text-muted text-sm">{t('loading')}</div>
          : <SpendingChart transactions={monthlyTxns} />
        }
      </div>

      {/* Daily Activity */}
      <div className="bg-white rounded-2xl p-4 flex flex-col flex-1 min-h-0 animate-fade-in-up" style={{ animationDelay: '120ms', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <p className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-3 flex-shrink-0">{t('dailyActivity')}</p>
        {loading
          ? <div className="flex-1 flex items-center justify-center text-muted text-sm">{t('loading')}</div>
          : <DailyHeatmap transactions={monthlyTxns} selectedMonth={selectedMonth} />
        }
      </div>
    </div>
  )
}
