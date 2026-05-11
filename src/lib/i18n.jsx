import { createContext, useContext, useState } from 'react'

const T = {
  en: {
    // Nav
    home: 'Home', history: 'Calendar', historial: 'Historial', add: 'Add', all: 'All', settings: 'Settings',
    // Dashboard
    thisMonth: 'This month', income: 'Income', expenses: 'Expenses',
    allTimeBalance: 'All-time balance', spendingByCategory: 'Spending by Category',
    recent: 'Recent', noExpenseData: 'No expense data yet',
    noTransactionsMonth: 'No transactions this month',
    // History
    monthlyHistory: 'Monthly History', txUnit: 'tx',
    ofIncomeSpent: '% of income spent', noTransactionsYet: 'No transactions yet', noMatchFilters: 'No transactions match the filters',
    // Transactions
    searchPlaceholder: 'Search by note…', allCategories: 'All categories',
    typeAll: 'All', typeExpenses: 'Expenses', typeIncome: 'Income',
    clearFilters: 'Clear', dateFrom: 'From', dateTo: 'To', seeAll: 'See all',
    // Form
    newTransaction: 'New Transaction', editTransaction: 'Edit Transaction',
    expense: 'Expense', amountLabel: 'Amount', categoryLabel: 'Category',
    noteLabel: 'Note', notePlaceholder: 'What was this for?',
    dateLabel: 'Date', saveChanges: 'Save Changes', addTransaction: 'Add Transaction',
    // Settings
    settingsTitle: 'Settings', languageSection: 'Language',
    english: 'English', spanish: 'Spanish',
    dangerZone: 'Danger Zone', resetData: 'Reset all data',
    resetDesc: 'Permanently deletes all your transactions.',
    resetConfirm: 'This will permanently delete all your transactions. Are you sure?',
    deleteConfirm: 'Delete this transaction?',
    aboutSection: 'About', appVersion: 'Version',
    loading: 'Loading…',
    // Heatmap
    dailyActivity: 'Daily Activity', activeDays: 'Active days',
    peakDay: 'Peak day', avgPerDay: 'Avg / day',
    vsLastMonth: 'vs last month', noTransactions: 'No transactions', dElapsed: 'days elapsed',
    // Categories
    cat_food: 'Food & Drink', cat_transport: 'Transport', cat_entertainment: 'Entertainment',
    cat_health: 'Health', cat_shopping: 'Shopping', cat_utilities: 'Utilities', cat_other: 'Other',
    cat_salary: 'Salary', cat_freelance: 'Freelance', cat_gift: 'Gift',
  },
  es: {
    home: 'Inicio', history: 'Calendario', historial: 'Historial', add: 'Añadir', all: 'Todo', settings: 'Ajustes',
    thisMonth: 'Este mes', income: 'Ingresos', expenses: 'Gastos',
    allTimeBalance: 'Balance total', spendingByCategory: 'Gastos por categoría',
    recent: 'Reciente', noExpenseData: 'Sin gastos registrados',
    noTransactionsMonth: 'Sin movimientos este mes',
    monthlyHistory: 'Historial mensual', txUnit: 'mov',
    ofIncomeSpent: '% del ingreso gastado', noTransactionsYet: 'Sin transacciones aún', noMatchFilters: 'Ningún movimiento coincide con los filtros',
    searchPlaceholder: 'Buscar por nota…', allCategories: 'Todas las categorías',
    typeAll: 'Todo', typeExpenses: 'Gastos', typeIncome: 'Ingresos',
    clearFilters: 'Limpiar', dateFrom: 'Desde', dateTo: 'Hasta', seeAll: 'Ver todo',
    newTransaction: 'Nueva transacción', editTransaction: 'Editar transacción',
    expense: 'Gasto', amountLabel: 'Importe', categoryLabel: 'Categoría',
    noteLabel: 'Nota', notePlaceholder: '¿Para qué fue esto?',
    dateLabel: 'Fecha', saveChanges: 'Guardar cambios', addTransaction: 'Añadir transacción',
    settingsTitle: 'Ajustes', languageSection: 'Idioma',
    english: 'Inglés', spanish: 'Español',
    dangerZone: 'Zona de peligro', resetData: 'Borrar todos los datos',
    resetDesc: 'Elimina permanentemente todas tus transacciones.',
    resetConfirm: '¿Seguro? Esto borrará todas tus transacciones de forma permanente.',
    deleteConfirm: '¿Eliminar esta transacción?',
    aboutSection: 'Acerca de', appVersion: 'Versión',
    loading: 'Cargando…',
    // Heatmap
    dailyActivity: 'Actividad diaria', activeDays: 'Días activos',
    peakDay: 'Día pico', avgPerDay: 'Media / día',
    vsLastMonth: 'vs mes anterior', noTransactions: 'Sin transacciones', dElapsed: 'días transcurridos',
    // Categories
    cat_food: 'Comida y bebida', cat_transport: 'Transporte', cat_entertainment: 'Entretenimiento',
    cat_health: 'Salud', cat_shopping: 'Compras', cat_utilities: 'Facturas', cat_other: 'Otros',
    cat_salary: 'Salario', cat_freelance: 'Freelance', cat_gift: 'Regalo',
  },
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('walletly-lang') || 'en')
  const t = (key) => T[lang][key] ?? key
  const switchLang = (l) => { setLang(l); localStorage.setItem('walletly-lang', l) }
  return <LangContext.Provider value={{ lang, t, switchLang }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
