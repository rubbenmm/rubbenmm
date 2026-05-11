import { TransactionItem } from './TransactionItem'

export function TransactionList({ transactions, onEdit, onDelete, emptyMessage = 'No transactions yet' }) {
  if (!transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted">
        <p className="text-2xl mb-3 opacity-30">—</p>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl px-4">
      {transactions.map((t, i) => (
        <TransactionItem
          key={t.id}
          transaction={t}
          onEdit={onEdit}
          onDelete={onDelete}
          index={i}
        />
      ))}
    </div>
  )
}
