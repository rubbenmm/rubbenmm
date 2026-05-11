import { getCategoryMeta } from '@/lib/categories'
import { cn } from '@/lib/utils'

export function CategoryBadge({ category, type, className }) {
  const meta = getCategoryMeta(category, type)
  return (
    <span
      className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white text-label', className)}
    >
      {meta.label}
    </span>
  )
}
