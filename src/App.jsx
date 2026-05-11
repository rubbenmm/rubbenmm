import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BottomNav } from '@/components/BottomNav'
import { TransactionForm } from '@/components/TransactionForm'
import { Dashboard } from '@/pages/Dashboard'
import { Transactions } from '@/pages/Transactions'
import { History } from '@/pages/History'
import { Settings } from '@/pages/Settings'
import { useTransactions } from '@/hooks/useTransactions'
import { LangProvider, useLang } from '@/lib/i18n'

function SplashScreen({ onDone }) {
  const word = 'walletly'

  useEffect(() => {
    const id = setTimeout(onDone, 2400)
    return () => clearTimeout(id)
  }, [onDone])

  const mono = "'Space Mono', 'Courier New', monospace"

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {/* Letters row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0 }}>
        {word.split('').map((l, i) => (
          <motion.span
            key={i}
            style={{
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: '-0.02em',
              color: '#0A0A0A',
              lineHeight: 1,
              userSelect: 'none',
              display: 'inline-block',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.45 + i * 0.06,
            }}
          >
            {l}
          </motion.span>
        ))}
      </div>

      {/* Tagline */}
      <motion.p
        style={{
          fontFamily: mono,
          fontWeight: 400,
          fontSize: 10,
          color: '#8E8E93',
          letterSpacing: '0.12em',
          marginTop: 18,
          userSelect: 'none',
          textTransform: 'lowercase',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5, ease: 'easeOut' }}
      >
        personal money tracker
      </motion.p>
    </motion.div>
  )
}

function AppContent() {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { add, update, remove } = useTransactions()
  const { t } = useLang()

  const openAdd = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (t) => { setEditing(t); setFormOpen(true) }
  const handleClose = () => { setFormOpen(false); setEditing(null) }

  const handleSave = async (data) => {
    if (editing) await update(editing.id, data)
    else await add(data)
    handleClose()
  }

  const handleDelete = async (id) => {
    if (window.confirm(t('deleteConfirm'))) await remove(id)
  }

  return (
    <>
      <main className="flex-1 min-h-0 flex flex-col">
        <Routes>
          <Route path="/" element={<Dashboard onEdit={openEdit} onDelete={handleDelete} />} />
          <Route path="/transactions" element={<Transactions onEdit={openEdit} onDelete={handleDelete} />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <BottomNav onAdd={openAdd} />
      <TransactionForm open={formOpen} onClose={handleClose} onSave={handleSave} initial={editing} />
    </>
  )
}

function App() {
  const [splashing, setSplashing] = useState(true)

  return (
    <HashRouter>
      <LangProvider>
        <div className="h-screen bg-surface font-sans flex flex-col max-w-lg mx-auto relative overflow-hidden">
          <AnimatePresence>
            {splashing && <SplashScreen onDone={() => setSplashing(false)} />}
          </AnimatePresence>
          {!splashing && <AppContent />}
        </div>
      </LangProvider>
    </HashRouter>
  )

}

export default App

