import { createPortal } from 'react-dom'
import { Icon } from './Icon.jsx'

const toastVariants = {
  error: {
    icon: 'error',
    iconClass: 'bg-rose-100 text-rose-700',
    label: 'Lỗi',
  },
  success: {
    icon: 'check_circle',
    iconClass: 'bg-emerald-100 text-emerald-700',
    label: 'Thông báo',
  },
  warning: {
    icon: 'warning',
    iconClass: 'bg-amber-100 text-amber-700',
    label: 'Thông báo',
  },
}

export function AppToastContainer({ onClose, toasts }) {
  if (!toasts.length) {
    return null
  }

  return createPortal(
    <div className="pointer-events-none fixed right-4 top-5 z-[170] flex w-[calc(100%-2rem)] max-w-[340px] flex-col gap-3 sm:right-6 lg:right-8 lg:top-7">
      {toasts.map((toast) => {
        const variant = toastVariants[toast.tone] ?? toastVariants.success

        return (
          <article
            className="motion-toast pointer-events-auto relative rounded-[20px] bg-white px-4 py-3.5 shadow-[0_18px_36px_rgba(15,23,42,0.14)]"
            key={toast.id}
            role={toast.tone === 'error' ? 'alert' : 'status'}
          >
            <div className="flex items-start gap-3">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${variant.iconClass}`}>
                <Icon className="text-[24px]" name={toast.icon ?? variant.icon} />
              </div>

              <div className="min-w-0 flex-1 pr-7 pt-0.5">
                <p className="text-[14px] font-bold leading-5 text-slate-950">{variant.label}</p>
                <p className="mt-1 text-[13px] leading-5 text-slate-600">{toast.message || toast.title}</p>
              </div>

              <button
                aria-label="Đóng thông báo"
                className="motion-button absolute right-3 top-3 h-7 w-7 rounded-full text-slate-400 hover:text-slate-600"
                onClick={() => onClose(toast.id)}
                type="button"
              >
                <Icon className="text-[18px]" name="close" />
              </button>
            </div>
          </article>
        )
      })}
    </div>,
    document.body,
  )
}
