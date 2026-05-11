import { Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { getCategoryMeta } from '@/lib/categories'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useLang } from '@/lib/i18n'

export function TransactionItem({ transaction, onEdit, onDelete, index = 0 }) {
  const { id, type, amount, category, note, date } = transaction
  const isIncome = type === 'income'
  const { t } = useLang()
  const meta = getCategoryMeta(category, type, t)

  return (
    <motion.div
      className="animate-tx-enter relative flex items-center gap-3 py-3 border-b border-border last:border-0"
      style={{ animationDelay: `${index * 35}ms` }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {/* Category icon circle */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white"
      >
        <img
          src={meta.icon}
          alt=""
          className="w-5 h-5"
          style={{ filter: 'grayscale(1)', opacity: 0.6 }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-label">{meta.label}</p>
        {note && <p className="text-xs text-muted truncate mt-0.5">{note}</p>}
        <p className="text-xs text-muted mt-0.5">{formatDate(date)}</p>
      </div>

      {/* Amount — income full opacity, expense 55% */}
      <span
        className="text-sm font-bold tabular-nums flex-shrink-0"
        style={{ color: isIncome ? '#3D9970' : '#C0392B' }}
      >
        {isIncome ? '+' : '−'}{formatCurrency(amount)}
      </span>

      {/* Actions */}
      <div className="flex gap-0.5 flex-shrink-0">
        <motion.button
          onClick={() => onEdit(transaction)}
          className="p-1.5 rounded-xl text-muted"
          whileTap={{ scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          aria-label="Edit"
        >
          <Pencil size={13} />
        </motion.button>
        <motion.button
          onClick={() => onDelete(id)}
          className="p-1.5 rounded-xl text-muted"
          whileTap={{ scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          aria-label="Delete"
        >
          <Trash2 size={13} />
        </motion.button>
      </div>
    </motion.div>
  )
}
