import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, getExpenseCategories, getIncomeCategories } from '@/lib/categories'
import { todayISO } from '@/lib/utils'
import { useLang } from '@/lib/i18n'

const DEFAULT = { type: 'expense', amount: '', category: 'food', note: '', date: todayISO() }

const inputCls = 'w-full bg-white border border-border rounded-xl px-4 py-3 text-label text-sm placeholder-muted focus:outline-none focus:ring-2 focus:ring-[#515151]/15 transition'

export function TransactionForm({ open, onClose, onSave, initial }) {
  const { t } = useLang()
  const [form, setForm] = useState(DEFAULT)

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial, amount: String(initial.amount) } : { ...DEFAULT, date: todayISO() })
    }
  }, [open, initial])

  const categories = form.type === 'income' ? getIncomeCategories(t) : getExpenseCategories(t)

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleTypeChange = (type) => {
    const defaultCat = type === 'income' ? 'salary' : 'food'
    setForm((f) => ({ ...f, type, category: defaultCat }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (!amount || amount <= 0) return
    onSave({ ...form, amount })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          {/* Backdrop */}
          <motion.div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

          {/* Sheet */}
          <motion.div
            className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-xl p-6"
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          >
            {/* Handle (mobile only) */}
            <div className="w-8 h-1 rounded-full bg-border mx-auto mb-5 sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-label">
                {initial ? t('editTransaction') : t('newTransaction')}
              </h2>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full text-muted"
                whileTap={{ scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                <X size={16} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Type toggle */}
              <div className="flex rounded-xl overflow-hidden border border-border p-1 gap-1 bg-white">
                {['expense', 'income'].map((type) => (
                  <motion.button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className="flex-1 py-2 text-sm font-medium rounded-lg transition-colors"
                    style={
                      form.type === type
                        ? { backgroundColor: '#515151', color: '#fff' }
                        : { color: '#9A9A9A' }
                    }
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    {type === 'expense' ? t('expense') : t('income')}
                  </motion.button>
                ))}
              </div>

              {/* Amount */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted uppercase tracking-widest px-1">{t('amountLabel')}</label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) => set('amount', e.target.value)}
                  className={`${inputCls} text-lg font-bold`}
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted uppercase tracking-widest px-1">{t('categoryLabel')}</label>
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className={`${inputCls} appearance-none`}
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Note */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted uppercase tracking-widest px-1">{t('noteLabel')}</label>
                <input
                  type="text"
                  placeholder={t('notePlaceholder')}
                  value={form.note}
                  onChange={(e) => set('note', e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold text-muted uppercase tracking-widest px-1">{t('dateLabel')}</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm bg-label"
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                {initial ? t('saveChanges') : t('addTransaction')}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
