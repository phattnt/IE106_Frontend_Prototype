import { createPortal } from 'react-dom'
import { Icon } from './Icon.jsx'

const toneConfig = {
  error: {
    icon: 'error',
    iconClass: 'bg-rose-100 text-rose-700',
  },
  info: {
    icon: 'info',
    iconClass: 'bg-blue-100 text-blue-700',
  },
  success: {
    icon: 'check_circle',
    iconClass: 'bg-emerald-100 text-emerald-700',
  },
  warning: {
    icon: 'warning',
    iconClass: 'bg-amber-100 text-amber-700',
  },
}

export function AppToastContainer({ onClose, toasts }) {
  if (!toasts.length) {
    return null
  }

  return createPortal(
    <div className="pointer-events-none fixed right-4 top-5 z-[170] flex w-[calc(100%-2rem)] max-w-[480px] flex-col gap-3 sm:right-6 lg:right-8 lg:top-7">
      {toasts.map((toast) => {
        const tone = toneConfig[toast.tone] ?? toneConfig.info

        return (
          <article
            className="motion-modal pointer-events-auto rounded-[26px] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
            key={toast.id}
          >
            <div className="flex gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tone.iconClass}`}>
                <Icon className="text-[24px]" name={toast.icon ?? tone.icon} />
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
