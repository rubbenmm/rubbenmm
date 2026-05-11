import { useLang } from '@/lib/i18n'
import { db } from '@/lib/db'
import { motion } from 'framer-motion'

export function Settings() {
  const { lang, t, switchLang } = useLang()

  const handleReset = async () => {
    if (window.confirm(t('resetConfirm'))) {
      await db.transactions.clear()
      window.dispatchEvent(new Event('walletly:changed'))
    }
  }

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
  ]

  return (
    <div className="bg-page h-full flex flex-col overflow-y-auto scrollbar-none">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-page px-4 pb-4 border-b border-border" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 48px)' }}>
        <h1 className="text-lg font-bold text-label">{t('settingsTitle')}</h1>
      </div>

      <div className="px-4 py-6 pb-32 flex flex-col gap-6">
        {/* Language */}
        <section className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">{t('languageSection')}</p>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            {languages.map((opt, i) => (
              <motion.button
                key={opt.code}
                onClick={() => switchLang(opt.code)}
                className={`w-full flex items-center justify-between px-4 py-4${i < languages.length - 1 ? ' border-b border-border' : ''}`}
                whileTap={{ scale: 0.985 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              >
                <span className="text-sm font-medium text-label">{opt.label}</span>
                {lang === opt.code && (
                  <span className="animate-pop-in w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-label">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </section>

        {/* About */}
        <section className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">{t('aboutSection')}</p>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center justify-between px-4 py-4">
              <span className="text-sm font-medium text-label">Walletly</span>
              <span className="text-sm text-muted">{t('appVersion')} 1.0</span>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="animate-fade-in-up" style={{ animationDelay: '160ms' }}>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">{t('dangerZone')}</p>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <motion.button
              onClick={handleReset}
              className="w-full flex flex-col items-start px-4 py-4"
              whileTap={{ scale: 0.985 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            >
              <span className="text-sm font-semibold text-label">{t('resetData')}</span>
              <span className="text-xs text-muted mt-0.5">{t('resetDesc')}</span>
            </motion.button>
          </div>
        </section>
      </div>
    </div>
  )
}
