import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import { formatCurrency } from '@/lib/utils'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/categories'

const ALL_CATS = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

const DAY_LABELS = {
  en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  es: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
}

export function DailyHeatmap({ transactions, selectedMonth }) {
  const { lang, t } = useLang()
  const dayLabels = DAY_LABELS[lang] ?? DAY_LABELS.en
  const [selectedDay, setSelectedDay] = useState(null)

  // Build expense + income maps for selected month
  const dayMap = {}
  const dayIncomeMap = {}
  for (const tx of transactions) {
    const day = Number(tx.date.slice(8, 10))
    if (tx.type === 'expense') dayMap[day] = (dayMap[day] || 0) + tx.amount
    else dayIncomeMap[day] = (dayIncomeMap[day] || 0) + tx.amount
  }

  const maxAmount = Object.values(dayMap).reduce((m, v) => Math.max(m, v), 0) || 1

  const [year, month] = selectedMonth.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()
  const firstDow = new Date(year, month - 1, 1).getDay()
  const startOffset = (firstDow + 6) % 7

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const today = new Date()
  const todayMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  const isCurrent = selectedMonth === todayMonthStr
  const todayDay = isCurrent ? today.getDate() : null

  function getColor(day) {
    if (!day) return 'transparent'
    const isFuture = isCurrent && day > today.getDate()
    if (isFuture) return '#EBEBEB'
    const amount = dayMap[day] || 0
    if (amount === 0) return '#EBEBEB'
    const ratio = amount / maxAmount
    if (ratio < 0.2) return 'rgba(81,81,81,0.18)'
    if (ratio < 0.4) return 'rgba(81,81,81,0.36)'
    if (ratio < 0.65) return 'rgba(81,81,81,0.55)'
    if (ratio < 0.85) return 'rgba(81,81,81,0.75)'
    return 'rgba(81,81,81,0.92)'
  }

  const numRows = cells.length / 7

  // Stats
  const peakDay = Object.entries(dayMap).reduce(
    (best, [d, v]) => v > best.val ? { day: Number(d), val: v } : best,
    { day: null, val: 0 }
  )

  const currExpense = Object.values(dayMap).reduce((s, v) => s + v, 0)
  const elapsedDays = isCurrent ? today.getDate() : daysInMonth
  const avgPerDay = elapsedDays > 0 ? currExpense / elapsedDays : 0

  // Day modal transactions
  const dayTxns = selectedDay
    ? transactions.filter(tx => Number(tx.date.slice(8, 10)) === selectedDay).sort((a, b) => a.type.localeCompare(b.type))
    : []
  const dayTotalExp = dayTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const dayTotalInc = dayTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)

  return (
    <>
      <div className="flex gap-3 flex-1 min-h-0">
        {/* Heatmap */}
        <div className="flex flex-col gap-1 min-w-0" style={{ flex: '0 0 68%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
            {dayLabels.map((d, i) => (
              <p key={i} className="text-[8px] text-muted text-center font-semibold select-none leading-none">{d}</p>
            ))}
          </div>
          <div
            className="flex-1 min-h-0"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gridTemplateRows: `repeat(${numRows}, 1fr)`,
              gap: 3,
            }}
          >
            {cells.map((day, i) => {
              if (!day) return <div key={i} />
              const isToday = day === todayDay
              const isFuture = isCurrent && day > today.getDate()
              const isSelected = day === selectedDay
              const bg = getColor(day)
              const intensity = dayMap[day] ? dayMap[day] / maxAmount : 0
              const textLight = intensity > 0.5
              return (
                <div
                  key={i}
                  onClick={() => !isFuture && setSelectedDay(day === selectedDay ? null : day)}
                  style={{
                    position: 'relative',
                    borderRadius: 3,
                    backgroundColor: bg,
                    outline: isSelected || isToday ? '1.5px solid #515151' : 'none',
                    outlineOffset: isSelected ? 2 : 1,
                    opacity: isFuture ? 0.35 : 1,
                    cursor: !isFuture ? 'pointer' : 'default',
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 9,
                    fontWeight: 600,
                    lineHeight: 1,
                    pointerEvents: 'none',
                    color: textLight ? 'rgba(255,255,255,0.7)' : 'rgba(81,81,81,0.35)',
                    userSelect: 'none',
                  }}>
                    {day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, backgroundColor: '#F0F0F0', flexShrink: 0, alignSelf: 'stretch' }} />

        {/* Stats — always visible */}
        <div className="flex flex-col justify-around min-w-0" style={{ flex: '1 1 0' }}>
          <div>
            <p className="text-[9px] text-muted uppercase tracking-widest font-semibold mb-0.5">{t('peakDay')}</p>
            <p className="text-xl font-extrabold text-label tabular-nums leading-none">
              {peakDay.day ?? '—'}
            </p>
            <p className="text-xs text-muted tabular-nums mt-0.5">
              {peakDay.val > 0 ? formatCurrency(peakDay.val) : '—'}
            </p>
          </div>
          <div style={{ width: '100%', height: 1, backgroundColor: '#F0F0F0' }} />
          <div>
            <p className="text-[9px] text-muted uppercase tracking-widest font-semibold mb-0.5">{t('avgPerDay')}</p>
            <p className="text-xl font-extrabold text-label tabular-nums leading-none">
              {avgPerDay > 0 ? formatCurrency(avgPerDay) : '—'}
            </p>
            <p className="text-xs text-muted tabular-nums mt-0.5">
              {isCurrent ? `${elapsedDays} ${t('dElapsed')}` : `${daysInMonth}d`}
            </p>
          </div>
        </div>
      </div>

      {/* Day detail modal — rendered via portal to escape card transform context */}
      {createPortal(
        <AnimatePresence>
        {selectedDay && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
            />
            <motion.div
              className="fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-2xl"
              style={{ maxHeight: '70vh', display: 'flex', flexDirection: 'column', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                <div className="w-8 h-1 rounded-full bg-border" />
              </div>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 flex-shrink-0 border-b border-border">
                <div>
                  <p className="text-base font-bold text-label">
                    {new Date(year, month - 1, selectedDay).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  <div className="flex gap-3 mt-0.5">
                    {dayTotalInc > 0 && <p className="text-xs tabular-nums" style={{ color: '#3D9970' }}>+{formatCurrency(dayTotalInc)}</p>}
                    {dayTotalExp > 0 && <p className="text-xs tabular-nums" style={{ color: '#C0392B' }}>-{formatCurrency(dayTotalExp)}</p>}
                  </div>
                </div>
                <motion.button
                  onClick={() => setSelectedDay(null)}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-muted"
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <X size={14} />
                </motion.button>
              </div>
              {/* Transaction list */}
              <div className="overflow-y-auto flex-1 px-5 py-2">
                {dayTxns.length === 0 ? (
                  <p className="text-sm text-muted py-6 text-center">{t('noTransactions')}</p>
                ) : (
                  dayTxns.map((tx) => {
                    const cat = ALL_CATS.find(c => c.value === tx.category)
                    return (
                      <div key={tx.id} className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid #F5F5F5' }}>
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                          {cat?.icon && <img src={cat.icon} alt="" className="w-4 h-4" style={{ filter: 'grayscale(1)', opacity: 0.5 }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-label truncate">{tx.note || (cat?.value ?? tx.category)}</p>
                          <p className="text-xs text-muted capitalize">{tx.category}</p>
                        </div>
                        <p
                          className="text-sm font-semibold tabular-nums text-label flex-shrink-0"
                          style={{ color: tx.type === 'expense' ? '#C0392B' : '#3D9970' }}
                        >
                          {tx.type === 'expense' ? '-' : '+'}{formatCurrency(tx.amount)}
                        </p>
                      </div>
                    )
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
</AnimatePresence>,
        document.body
      )}
    </>
  )
}

