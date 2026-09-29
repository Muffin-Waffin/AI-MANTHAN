import Icon from './Icon'
import { cn } from '@/lib/utils'

/**
 * Design-system badge — accent-colored pill used across cards & headers.
 * `accent` picks a brand color; shadcn-style named export kept for compat.
 * Titanium Cyber Lumina: cyan is the primary accent.
 */
export const accent = {
  cyan: 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30',
  sky: 'bg-sky-500/10 text-sky-400 border border-sky-500/30',
  emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
  amber: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
  pink: 'bg-pink-500/10 text-pink-400 border border-pink-500/30',
}

export default function Badge({ accent: tone = 'cyan', icon, children, className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit shrink-0 items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold whitespace-nowrap transition-colors duration-300',
        accent[tone] ?? accent.cyan,
        className
      )}
      {...props}
    >
      {icon && <Icon name={icon} className="text-[13px]" />}
      {children}
    </span>
  )
}

export { Badge }
