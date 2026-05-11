import { useState, useEffect, useCallback } from 'react'
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
} from '@/lib/db'

const DB_CHANGE_EVENT = 'walletly:changed'

function notifyAll() {
  window.dispatchEvent(new Event(DB_CHANGE_EVENT))
}

export function useTransactions(filters = {}) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    const data = await getTransactions(filters)
    setTransactions(data)
    setLoading(false)
  }, [JSON.stringify(filters)]) // eslint-disable-line

  useEffect(() => {
    reload()
    window.addEventListener(DB_CHANGE_EVENT, reload)
    return () => window.removeEventListener(DB_CHANGE_EVENT, reload)
  }, [reload])

  const add = async (data) => {
    await addTransaction(data)
    notifyAll()
  }

  const update = async (id, data) => {
    await updateTransaction(id, data)
    notifyAll()
  }

  const remove = async (id) => {
    await deleteTransaction(id)
    notifyAll()
  }

  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.income += t.amount
      else acc.expense += t.amount
      return acc
    },
    { income: 0, expense: 0 }
  )
  totals.balance = totals.income - totals.expense

  return { transactions, loading, add, update, remove, reload, totals }
}
