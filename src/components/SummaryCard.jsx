import { cn } from '@/lib/utils'

export function SummaryCard({ label, value, accent, className }) {
  return (
    <div
      className={cn(
        'rounded-2xl px-5 py-4 flex flex-col gap-1 shadow-sm',
        accent ? 'text-white' : 'bg-card text-label',
        className
      )}
      style={accent ? { backgroundColor: accent } : {}}
    >
      <span className={cn('text-xs font-medium uppercase tracking-wide', accent ? 'text-white/70' : 'text-muted')}>
        {label}
      </span>
      <span className="text-2xl font-bold tabular-nums">{value}</span>
    </div>
  )
}
