import { createPortal } from 'react-dom'
import { Icon } from './Icon.jsx'

const toastVariants = {
  error: {
    icon: 'error',
    accentClass: 'bg-rose-500',
    iconClass: 'bg-rose-100 text-rose-700',
    ringClass: 'ring-rose-200/80',
  },
  success: {
    icon: 'check_circle',
    accentClass: 'bg-emerald-500',
    iconClass: 'bg-emerald-100 text-emerald-700',
    ringClass: 'ring-emerald-200/80',
  },
  warning: {
    icon: 'warning',
    accentClass: 'bg-amber-500',
    iconClass: 'bg-amber-100 text-amber-700',
    ringClass: 'ring-amber-200/80',
  },
}

export function AppToastContainer({ onClose, toasts }) {
  if (!toasts.length) {
    return null
  }

  return createPortal(
    <div className="pointer-events-none fixed right-4 top-5 z-[170] flex w-[calc(100%-2rem)] max-w-[480px] flex-col gap-3 sm:right-6 lg:right-8 lg:top-7">
      {toasts.map((toast) => {
        const variant = toastVariants[toast.tone] ?? toastVariants.success

        return (
          <article
            className={`motion-modal pointer-events-auto relative overflow-hidden rounded-[26px] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.18)] ring-1 ${variant.ringClass}`}
            key={toast.id}
            role={toast.tone === 'error' ? 'alert' : 'status'}
          >
            <span className={`absolute inset-y-0 left-0 w-1.5 ${variant.accentClass}`} />
            <div className="flex gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${variant.iconClass}`}>
                <Icon className="text-[24px]" name={toast.icon ?? variant.icon} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[17px] font-semibold text-slate-950">{toast.title}</p>
                {toast.message ? <p className="mt-1 text-sm leading-6 text-slate-700">{toast.message}</p> : null}
              </div>
              <button
                aria-label="Đóng thông báo"
                className="motion-button h-8 w-8 rounded-full text-slate-500 hover:bg-slate-50"
                onClick={() => onClose(toast.id)}
                type="button"
              >
                <Icon className="text-[20px]" name="close" />
              </button>
            </div>
          </article>
        )
      })}
    </div>,
    document.body,
  )
}
