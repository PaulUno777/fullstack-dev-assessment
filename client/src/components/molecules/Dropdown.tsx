import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type Props = {
  label?: string
  trigger: ReactNode
  children: ReactNode | ((api: { close: () => void }) => ReactNode)
  align?: 'left' | 'right'
  className?: string
  /** When true, clicks inside the panel do not auto-close (multi-select). */
  keepOpenOnSelect?: boolean
}

export function Dropdown({
  label,
  trigger,
  children,
  align = 'left',
  className = '',
  keepOpenOnSelect = false,
}: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('mousedown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const close = () => setOpen(false)
  const content =
    typeof children === 'function' ? children({ close }) : children

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {label ? (
        <span className="mb-1 block text-xs font-medium text-slate-600">
          {label}
        </span>
      ) : null}
      <button
        type="button"
        className="inline-flex w-full items-center justify-between gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-900 shadow-sm outline-none hover:bg-slate-50 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {trigger}
        <span className="text-slate-400" aria-hidden="true">
          ▾
        </span>
      </button>
      {open ? (
        <div
          id={menuId}
          role="listbox"
          className={`absolute z-30 mt-1 min-w-full overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          onClick={() => {
            if (!keepOpenOnSelect) close()
          }}
        >
          {content}
        </div>
      ) : null}
    </div>
  )
}
