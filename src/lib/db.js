import Dexie from 'dexie'

export const db = new Dexie('walletly')

db.version(1).stores({
  transactions: '++id, type, category, date, createdAt',
})

export async function addTransaction(data) {
  return db.transactions.add({ ...data, createdAt: Date.now() })
}

export async function updateTransaction(id, data) {
  return db.transactions.update(id, data)
}

export async function deleteTransaction(id) {
  return db.transactions.delete(id)
}

export async function getTransactions({ type, category, search, dateFrom, dateTo } = {}) {
  let col = db.transactions.orderBy('date').reverse()
  const results = await col.toArray()

  return results.filter((t) => {
    if (type && t.type !== type) return false
    if (category && t.category !== category) return false
    if (search && !t.note?.toLowerCase().includes(search.toLowerCase())) return false
    if (dateFrom && t.date < dateFrom) return false
    if (dateTo && t.date > dateTo) return false
    return true
  })
}
