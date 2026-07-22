import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

const variants: Record<Variant, string> = {
  primary:
    'bg-teal-800 text-white hover:bg-teal-900 disabled:bg-slate-300 disabled:text-slate-500',
  secondary:
    'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 disabled:opacity-50',
  danger:
    'bg-rose-700 text-white hover:bg-rose-800 disabled:bg-slate-300 disabled:text-slate-500',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 disabled:opacity-50',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

export function Button({
  variant = 'secondary',
  className = '',
  children,
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
