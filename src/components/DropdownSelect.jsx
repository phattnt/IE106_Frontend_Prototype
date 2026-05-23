import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon.jsx'

export function DropdownSelect({
  align = 'left',
  buttonClassName = '',
  className = '',
  disabled = false,
  footer = null,
  getOptionMeta,
  label,
  menuClassName = '',
  menuWidth,
  onChange,
  options,
  placeholder = 'Chọn',
  placement = 'bottom',
  triggerClassName = '',
  theme = 'blue',
  value,
}) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState(null)
  const ref = useRef(null)
  const menuRef = useRef(null)
  const selectedOption = options.find((option) => option.value === value)
  const triggerBaseClass =
    theme === 'gray'
      ? 'border-slate-200 bg-slate-100 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)]'
      : 'border-white/70 bg-white/65 text-slate-700 shadow-[0_10px_24px_rgba(42,76,130,0.08)]'
  const menuBaseClass =
    theme === 'gray'
      ? 'border-slate-200 bg-slate-100 shadow-[0_24px_54px_rgba(15,23,42,0.16)]'
      : 'border-white/80 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]'
  const tone =
    theme === 'gray'
      ? {
          activeButton: 'border-slate-300 bg-slate-100 text-slate-900 shadow-[0_16px_34px_rgba(15,23,42,0.10)]',
          activeOption: 'bg-slate-200/80 font-bold text-slate-950',
          check: 'text-slate-700',
          hoverOption: 'font-semibold text-slate-700 hover:bg-slate-200/70 hover:text-slate-950',
          triggerIcon: 'text-slate-500',
        }
      : {
          activeButton: 'border-blue-200 bg-white text-slate-900 shadow-[0_16px_34px_rgba(37,99,235,0.14)]',
          activeOption: 'bg-blue-50 font-bold text-blue-700',
          check: 'text-blue-700',
          hoverOption: 'font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-700',
          triggerIcon: 'text-slate-500',
        }

  useEffect(() => {
    function updateMenuPosition() {
      if (!ref.current) {
        return
      }

      const rect = ref.current.getBoundingClientRect()
      const requestedWidth = typeof menuWidth === 'number' ? menuWidth : rect.width
      const width = Math.min(requestedWidth, window.innerWidth - 24)
      const rawLeft = align === 'right' ? rect.right - width : rect.left
      const left = Math.min(Math.max(rawLeft, 12), window.innerWidth - width - 12)
      const top = placement === 'top' ? rect.top - 12 : rect.bottom + 12

      setMenuStyle({
        left,
        top,
        transform: placement === 'top' ? 'translateY(-100%)' : 'none',
        width,
      })
    }

    function handlePointerDown(event) {
      const target = event.target
      const clickedTrigger = ref.current?.contains(target)
      const clickedMenu = menuRef.current?.contains(target)

      if (!clickedTrigger && !clickedMenu) {
        setOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', updateMenuPosition)
    window.addEventListener('scroll', updateMenuPosition, true)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', updateMenuPosition)
      window.removeEventListener('scroll', updateMenuPosition, true)
    }
  }, [align, menuWidth, placement])

  useEffect(() => {
    if (!open || !ref.current) {
      return
    }

    const rect = ref.current.getBoundingClientRect()
    const requestedWidth = typeof menuWidth === 'number' ? menuWidth : rect.width
    const width = Math.min(requestedWidth, window.innerWidth - 24)
    const rawLeft = align === 'right' ? rect.right - width : rect.left
    const left = Math.min(Math.max(rawLeft, 12), window.innerWidth - width - 12)
    const top = placement === 'top' ? rect.top - 12 : rect.bottom + 12

    setMenuStyle({
      left,
      top,
      transform: placement === 'top' ? 'translateY(-100%)' : 'none',
      width,
    })
  }, [align, menuWidth, open, placement])

  return (
    <div className={`relative ${className}`} ref={ref}>
      {label ? <span className="mb-3 block text-sm font-medium text-slate-600">{label}</span> : null}
      <button
        className={`motion-button flex h-11 w-full items-center justify-between gap-3 rounded-2xl border px-4 text-left text-sm font-semibold transition ${triggerBaseClass} ${
          open ? tone.activeButton : ''
        } ${triggerClassName} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className={selectedOption ? 'truncate' : 'truncate text-slate-400'}>{selectedOption?.label ?? placeholder}</span>
        <Icon className={`text-[18px] ${tone.triggerIcon} transition ${open ? 'rotate-180' : ''} ${buttonClassName}`} name="expand_more" />
      </button>

      {open && menuStyle
        ? createPortal(
        <div
          className={`motion-dropdown fixed z-[120] overflow-hidden rounded-[22px] border ${menuBaseClass} ${menuClassName}`}
          ref={menuRef}
          style={menuStyle}
        >
          <div className="py-3">
            {options.map((option) => {
              const active = option.value === value
              const meta = getOptionMeta?.(option)

              return (
                <button
                  className={`flex min-h-10 w-full items-center gap-3 px-5 py-3 text-left text-[15px] transition ${
                    active ? tone.activeOption : tone.hoverOption
                  } ${option.disabled ? 'cursor-not-allowed' : ''}`}
                  disabled={option.disabled}
                  key={option.value}
                  onClick={() => {
                    onChange(option.value, option)
                    setOpen(false)
                  }}
                  type="button"
                >
                  <span className={`min-w-0 flex-1 truncate ${option.disabled ? 'text-slate-500' : ''}`}>{option.label}</span>
                  {meta ? <span className="shrink-0">{meta}</span> : null}
                  {active ? <Icon className={`text-[18px] ${tone.check}`} name="check" /> : null}
                </button>
              )
            })}
          </div>
          {footer}
        </div>,
          document.body
        )
        : null}
    </div>
  )
}
