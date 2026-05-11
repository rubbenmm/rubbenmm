import { NavLink } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useLang } from '@/lib/i18n'
import homeIcon      from '@/assets/icons/home.png'
import historyIcon   from '@/assets/icons/calendar.png'
import historialIcon from '@/assets/icons/historial.png'
import settingsIcon  from '@/assets/icons/settings.png'

function NavItem({ to, end, icon, label }) {
  return (
    <NavLink
      to={to}
      end={end}
      className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium"
    >
      {({ isActive }) => (
        <motion.div
          className="flex flex-col items-center gap-0.5"
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <img
            src={icon}
            alt=""
            className="w-5 h-5"
            style={{ filter: 'grayscale(1)', opacity: isActive ? 0.85 : 0.28 }}
          />
          <span
            key={label}
            className="animate-label-swap"
            style={{ color: isActive ? '#515151' : '#9A9A9A' }}
          >
            {label}
          </span>
        </motion.div>
      )}
    </NavLink>
  )
}

export function BottomNav({ onAdd }) {
  const { t, lang } = useLang()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 px-4"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
    >
      <div
        className="max-w-lg mx-auto bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-stretch">
          <NavItem to="/" end icon={homeIcon} label={t('home')} />
          <NavItem to="/history" icon={historyIcon} label={t('history')} />

          {/* Center Add button */}
          <div className="flex-1 flex items-center justify-center py-2.5">
            <motion.button
              onClick={onAdd}
              className="flex items-center justify-center text-white rounded-xl"
              style={{ backgroundColor: '#515151', width: 56, height: 36 }}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              aria-label="Add transaction"
            >
              <Plus size={18} strokeWidth={2.5} />
            </motion.button>
          </div>

          <NavItem to="/transactions" icon={historialIcon} label={t('historial')} />
          <NavItem to="/settings" icon={settingsIcon} label={t('settings')} />
        </div>
      </div>
    </nav>
  )
}

