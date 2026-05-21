import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DropdownSelect } from '../components/DropdownSelect.jsx'
import { Icon } from '../components/Icon.jsx'

const planCatalog = {
  free: {
    name: 'Free',
    price: '0đ',
    suffix: '',
    storage: { limit: '5 GB', percent: 24, used: '1.2 GB' },
    features: ['500 video', 'Lưu trữ 30 ngày'],
  },
  pro: {
    name: 'Pro',
    price: '500k',
    suffix: '/tháng',
    storage: { limit: '100 GB', percent: 80, used: '80 GB' },
    features: ['2000 video', 'Lưu trữ 1 năm'],
  },
  master: {
    name: 'Master',
    price: '2000k',
    suffix: '/tháng',
    storage: { limit: '500 GB', percent: 16, used: '80 GB' },
    features: ['4000 video', 'Lưu trữ 3 năm', 'AI trợ giúp'],
  },
  business: {
    name: 'Business',
    price: 'Liên hệ',
    suffix: '',
    storage: { limit: 'Không giới hạn', percent: 8, used: '80 GB' },
    features: ['Không giới hạn', 'AI nhận diện nâng cao'],
  },
}

const paymentMethods = [
  { id: 'card', label: 'Thẻ tín dụng / Ghi nợ', icon: 'credit_card' },
  { id: 'bank', label: 'Chuyển khoản ngân hàng', icon: 'account_balance' },
  { id: 'wallet', label: 'Ví điện tử (Momo / ZaloPay)', icon: 'account_balance_wallet' },
]

const paymentHistory = [
  { code: 'INV-0520-001', type: 'Gia hạn Pro', amount: '500k', status: 'Đã thanh toán', date: '20/05/2026 - 14:42' },
  { code: 'INV-0420-014', type: 'Nâng cấp Free -> Pro', amount: '500k', status: 'Đã thanh toán', date: '20/04/2026 - 09:18' },
  { code: 'INV-0320-009', type: 'Bổ sung lưu trữ', amount: '150k', status: 'Hoàn tất', date: '20/03/2026 - 16:05' },
]

const cameraSources = [
  { id: 'logitech-brio-4k', name: 'Logitech Brio 4K', status: 'current' },
  { id: 'usb-02', name: 'Camera USB 02', status: 'available' },
  { id: 'packing-main', name: 'Camera đóng gói chính', status: 'available' },
  { id: 'backup-camera', name: 'Camera dự phòng', status: 'available' },
  { id: 'old-camera', name: 'Camera cũ', status: 'offline' },
]

const resolutionOptions = [
  { id: '1080p', label: '1080p (FHD)' },
  { id: '2k', label: '1440p (2K)' },
  { id: '4k', label: '2160p (4K UHD)' },
  { id: '720p', label: '720p (HD)' },
]

function formatDateFromNow(daysToAdd) {
  const baseDate = new Date('2026-05-20T00:00:00')
  baseDate.setDate(baseDate.getDate() + daysToAdd)

  const day = `${baseDate.getDate()}`.padStart(2, '0')
  const month = `${baseDate.getMonth() + 1}`.padStart(2, '0')
  const year = baseDate.getFullYear()

  return `${day}/${month}/${year}`
}

function getSourceBadge(status) {
  if (status === 'current') {
    return 'bg-blue-100 text-blue-700'
  }
  if (status === 'available') {
    return 'bg-emerald-100 text-emerald-700'
  }
  return 'bg-rose-100 text-rose-500'
}

function getSourceStatusLabel(status) {
  if (status === 'current') {
    return 'Đang sử dụng'
  }
  if (status === 'available') {
    return 'Khả dụng'
  }
  return 'Mất kết nối'
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      aria-pressed={enabled}
      className={`motion-button relative h-8 w-14 rounded-full ${
        enabled
          ? 'bg-blue-600 shadow-[0_8px_20px_rgba(37,99,235,0.28)]'
          : 'border border-slate-300 bg-slate-200 shadow-[inset_0_1px_2px_rgba(148,163,184,0.28)]'
      }`}
      onClick={() => onChange(!enabled)}
      type="button"
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full transition ${
          enabled
            ? 'left-7 bg-white shadow-sm'
            : 'left-1 border border-slate-300 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.16)]'
        }`}
      />
    </button>
  )
}

function CameraSourceSelect({ currentSource, onSelect }) {
  return (
    <DropdownSelect
      footer={
        <div className="flex items-center justify-between border-t border-slate-900/12 px-4 py-3">
          <span className="text-sm text-slate-400">Không thấy thiết bị?</span>
          <button className="text-sm font-semibold text-blue-700 transition hover:text-blue-800" type="button">
            Quét lại
          </button>
        </div>
      }
      getOptionMeta={(option) => (
        <span className={`rounded-xl px-3 py-1 text-xs font-semibold ${getSourceBadge(option.source.status)}`}>
          {getSourceStatusLabel(option.source.status)}
        </span>
      )}
      label="Nguồn máy ảnh"
      onChange={(_, option) => onSelect(option.source)}
      options={cameraSources.map((source) => ({
        disabled: source.status === 'offline',
        label: source.name,
        source,
        value: source.id,
      }))}
      value={currentSource.id}
    />
  )
}

function ResolutionSelect({ currentResolution, onSelect }) {
  return (
    <DropdownSelect
      label="Độ phân giải"
      onChange={(_, option) => onSelect(option.resolution)}
      options={resolutionOptions.map((resolution) => ({
        label: resolution.label,
        resolution,
        value: resolution.id,
      }))}
      value={currentResolution.id}
    />
  )
}

function SettingRow({ caption, description, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-slate-900/12 pt-6 first:border-t-0 first:pt-0">
      <div>
        <p className="text-base font-medium text-slate-900">{caption}</p>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  )
}

function PlanCard({ currentTier, planId, onSelect }) {
  const plan = planCatalog[planId]
  const isCurrent = currentTier === planId
  const isUpgrade = currentTier === 'free' && (planId === 'pro' || planId === 'master')
  const isHigherUpgrade = currentTier === 'pro' && planId === 'master'
  const canAct = planId !== 'free' && planId !== 'business' && (isCurrent || isUpgrade || isHigherUpgrade)
  const isBusiness = planId === 'business'
  const buttonLabel = isCurrent ? 'Gia hạn' : 'Nâng cấp'

  return (
    <article
      className={`relative flex min-h-[336px] flex-col overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,rgba(207,224,248,0.94),rgba(213,228,250,0.84))] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] ${
        isCurrent ? 'ring-2 ring-blue-500 shadow-[0_18px_40px_rgba(37,99,235,0.16)]' : ''
      }`}
    >
      {isCurrent ? (
        <span className="absolute right-0 top-0 rounded-bl-2xl bg-blue-600 px-7 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
          Hiện tại
        </span>
      ) : null}

      <h3 className="text-[22px] font-bold text-slate-950">{plan.name}</h3>

      <div className="mt-5 flex items-end gap-1">
        <span className="text-[38px] font-extrabold leading-none text-blue-700">{plan.price}</span>
        {plan.suffix ? <span className="pb-1 text-base font-medium text-slate-600">{plan.suffix}</span> : null}
      </div>

      <div className="mt-8 flex-1 space-y-4">
        {plan.features.map((feature) => (
          <div className="flex items-center gap-3 text-slate-700" key={feature}>
            <Icon className="text-[18px] text-blue-700" name="check" />
            <span className="text-base">{feature}</span>
          </div>
        ))}
      </div>

      <button
        className={`mt-8 h-12 w-full rounded-2xl text-base font-semibold transition ${
          canAct || isBusiness
            ? 'bg-blue-700 text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)] hover:bg-blue-800'
            : 'bg-white/55 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]'
        }`}
        onClick={() => (canAct ? onSelect(planId, isCurrent ? 'renew' : 'upgrade') : null)}
        type="button"
      >
        {planId === 'business' ? 'Nâng cấp' : canAct ? buttonLabel : 'Hiện tại'}
      </button>
    </article>
  )
}

function CameraPreview({ autoFocus, stabilizer, currentSource, currentResolution }) {
  return (
    <div className="relative mt-8 overflow-hidden rounded-[20px] border border-white/40 bg-white/75 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{currentSource.name}</span>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">{currentResolution.label}</span>
        {autoFocus ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Auto focus</span> : null}
        {stabilizer ? <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">Stabilizer</span> : null}
      </div>

      <div className="grid min-h-[316px] grid-cols-[120px_1fr] overflow-hidden rounded-[18px] bg-slate-50">
        <aside className="border-r border-slate-900/12 bg-white p-3">
          <div className="space-y-2">
            {['Dashboard', 'Patients', 'Messages', 'Scheduling', 'Team', 'Medical Records', 'Reports'].map((item) => (
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] text-slate-500" key={item}>
                <span className="h-3 w-3 rounded-[4px] border border-slate-300" />
                {item}
              </div>
            ))}
          </div>
        </aside>

        <div className="relative bg-white">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex gap-2">
              {['All', 'Active (58)', 'Inactive (56)'].map((tab, index) => (
                <span
                  className={`rounded-md px-2.5 py-1 text-[10px] font-medium ${
                    index === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                  key={tab}
                >
                  {tab}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-24 rounded-md bg-slate-100" />
              <div className="h-7 w-10 rounded-md bg-slate-100" />
            </div>
          </div>

          <div className="space-y-3 p-4">
            {[...Array(10)].map((_, index) => (
              <div className="grid grid-cols-[1.4fr_1fr_0.9fr_1fr_0.4fr] items-center gap-3" key={index}>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-slate-200" />
                  <div className="space-y-1">
                    <div className="h-2.5 w-24 rounded-full bg-slate-200" />
                    <div className="h-2 w-18 rounded-full bg-slate-100" />
                  </div>
                </div>
                <div className="h-2.5 w-20 rounded-full bg-slate-100" />
                <div className={`h-5 w-18 rounded-full ${index % 3 === 1 ? 'bg-rose-100' : 'bg-emerald-100'}`} />
                <div className="h-2.5 w-22 rounded-full bg-slate-100" />
                <div className="ml-auto h-4 w-1 rounded-full bg-slate-300" />
              </div>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            REC
          </div>
        </div>
      </div>
    </div>
  )
}

function PaymentMethodRow({ checked, icon, label, onClick }) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
        checked ? 'border-blue-200 bg-blue-50/70 shadow-sm' : 'border-slate-200 bg-white/65 hover:bg-white/85'
      }`}
      onClick={onClick}
      type="button"
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
          checked ? 'border-blue-700' : 'border-slate-400'
        }`}
      >
        {checked ? <span className="h-2 w-2 rounded-full bg-blue-700" /> : null}
      </span>
      <Icon className="text-[18px] text-slate-600" name={icon} />
      <span className="flex-1 text-sm text-slate-700">{label}</span>
      {checked && icon === 'credit_card' ? (
        <div className="flex gap-1">
          <span className="h-4 w-4 rounded-sm bg-slate-400" />
          <span className="h-4 w-4 rounded-sm bg-amber-300" />
        </div>
      ) : null}
    </button>
  )
}

function ModalShell({ children, maxWidth = 'max-w-[660px]', onClose }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return createPortal(
    <div
      className="motion-overlay fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 px-4 py-10 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`motion-modal relative max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.22)] sm:p-8`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="motion-button modal-close-button"
          onClick={onClose}
          type="button"
        >
          <Icon name="close" />
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}

function ConfirmPlanModal({ action, method, onClose, onMethodChange, onNext, planId }) {
  const plan = planCatalog[planId]
  const title = action === 'renew' ? `Xác nhận gia hạn gói ${plan.name}` : `Xác nhận nâng cấp gói ${plan.name}`

  return (
    <ModalShell onClose={onClose}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[16px] bg-blue-600 text-white shadow-[0_16px_34px_rgba(37,99,235,0.25)]">
        <Icon className="filled text-[28px]" name="verified_user" />
      </div>

      <div className="mt-5 text-center">
        <h3 className="text-[22px] font-bold text-slate-950">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">Vui lòng kiểm tra lại thông tin đơn hàng trước khi thanh toán.</p>
      </div>

      <div className="mt-6 rounded-[22px] bg-[linear-gradient(135deg,#0f54c7,#1e66d0_45%,#2f75dc)] p-5 text-white shadow-[0_18px_38px_rgba(30,102,208,0.24)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-blue-100">Gói dịch vụ đã chọn</p>
            <h4 className="mt-1 text-[28px] font-bold">{plan.name}</h4>
          </div>
          <div className="text-right">
            <p className="text-[26px] font-extrabold">{plan.price}</p>
            {plan.suffix ? <p className="text-sm text-blue-100">{plan.suffix}</p> : null}
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {plan.features.map((feature) => (
            <div className="flex items-center gap-2 text-sm text-blue-50" key={feature}>
              <Icon className="text-[16px]" name="check_circle" />
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">Phương thức thanh toán</p>
        <div className="space-y-2.5">
          {paymentMethods.map((item) => (
            <PaymentMethodRow
              checked={method === item.id}
              icon={item.icon}
              key={item.id}
              label={item.label}
              onClick={() => onMethodChange(item.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          className="h-11 flex-1 rounded-2xl bg-blue-100 text-sm font-semibold text-slate-700 transition hover:bg-blue-200/80"
          onClick={onClose}
          type="button"
        >
          Quay lại
        </button>
        <button
          className="h-11 flex-[1.4] rounded-2xl bg-blue-700 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(37,99,235,0.22)] transition hover:bg-blue-800"
          onClick={onNext}
          type="button"
        >
          Thanh toán ngay
        </button>
      </div>
    </ModalShell>
  )
}

function PaymentDetailsModal({ action, method, onBack, onClose, onConfirm, planId }) {
  const plan = planCatalog[planId]
  const methodLabel = paymentMethods.find((item) => item.id === method)?.label
  const isRenew = action === 'renew'
  const actionLabel = isRenew ? 'Gia hạn' : 'Nâng cấp'

  return (
    <ModalShell maxWidth="max-w-[920px]" onClose={onClose}>
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="flex flex-col">
          <h3 className="text-[24px] font-bold leading-tight text-slate-950">{actionLabel} gói {plan.name}</h3>
          <p className="mt-3 max-w-[280px] text-sm leading-6 text-slate-500">
            {isRenew ? 'Duy trì quyền sử dụng và lưu trữ hiện tại cho doanh nghiệp của bạn.' : 'Mở khóa toàn bộ tiềm năng cho doanh nghiệp của bạn.'}
          </p>

          <div className="mt-7 space-y-4">
            {plan.features.map((feature) => (
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700" key={feature}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <Icon className="text-[15px]" name="check" />
                </span>
                {feature}
              </div>
            ))}
          </div>

          <div className="mt-5 ">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Chi phí gói {plan.name}</p>
            <div className="mt-2 flex items-end gap-1">
              <span className="text-[34px] font-extrabold leading-none text-blue-700">{plan.price}</span>
              {plan.suffix ? <span className="pb-1 text-sm font-medium text-slate-700">{plan.suffix}</span> : null}
            </div>
          </div>
        </aside>

        <section>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Thông tin thanh toán</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-600">Họ và tên</span>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">Nguyễn Văn A</div>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-slate-600">Email</span>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">vana.nguyen@email.com</div>
            </label>
          </div>

          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Chi tiết {methodLabel}</p>
              <button className="text-xs font-semibold text-blue-700 transition hover:text-blue-800" onClick={onBack} type="button">
                Đổi phương thức
              </button>
            </div>

            {method === 'card' ? (
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">Số thẻ</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                    <Icon className="text-[18px] text-slate-400" name="credit_card" />
                    0000 0000 0000 0000
                  </div>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">Ngày hết hạn</span>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400">MM/YY</div>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">CVV</span>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">•••</div>
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">Tên chủ thẻ</span>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase text-slate-500">NGUYEN VAN A</div>
                </label>
              </div>
            ) : null}

            {method === 'bank' ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">Ngân hàng</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">ACB - Chi nhánh Quận 1</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">Số tài khoản</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">0520 8888 9999</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 p-4 text-sm text-slate-700">
                  Nội dung chuyển khoản: <span className="font-bold text-blue-700">KURIFURI {plan.name.toUpperCase()} ALEX</span>
                </div>
              </div>
            ) : null}

            {method === 'wallet' ? (
              <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
                <div className="flex aspect-square items-center justify-center rounded-[20px] border border-slate-200 bg-white">
                  <div className="grid grid-cols-5 gap-1">
                    {[...Array(25)].map((_, index) => (
                      <span className={`h-4 w-4 ${index % 2 === 0 ? 'bg-slate-900' : 'bg-white'}`} key={index} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm leading-6 text-slate-600">Quét mã bằng Momo hoặc ZaloPay để tiếp tục.</p>
                  <div className="mt-4 flex gap-2">
                    <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-600">Momo</span>
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-600">ZaloPay</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <button
            className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(37,99,235,0.24)] transition hover:bg-blue-800"
            onClick={onConfirm}
            type="button"
          >
            Xác nhận {isRenew ? 'gia hạn' : 'nâng cấp'}
            <Icon className="text-[18px]" name="arrow_forward" />
          </button>

          <p className="mt-3 text-center text-[11px] text-slate-400">Giao dịch được bảo mật bởi mã hóa 256-bit SSL.</p>
        </section>
      </div>
    </ModalShell>
  )
}

function PaymentSuccessModal({ onClose, planId }) {
  const plan = planCatalog[planId]

  return (
    <ModalShell onClose={onClose}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <Icon className="filled text-[34px]" name="check_circle" />
      </div>
      <div className="mt-5 text-center">
        <h3 className="text-[24px] font-bold text-slate-950">Thanh toán thành công</h3>
        <p className="mt-2 text-sm text-slate-500">Gói {plan.name} đã được kích hoạt. Hệ thống đã gửi hóa đơn đến email của bạn.</p>
      </div>

      <div className="mt-6 rounded-[22px] bg-white/75 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">Mã giao dịch</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">KRF-20260520-8842</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">Thời gian</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">20/05/2026 - 14:42</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">Chu kỳ</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">Kích hoạt ngay</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          className="h-11 flex-1 rounded-2xl bg-blue-100 text-sm font-semibold text-slate-700 transition hover:bg-blue-200/80"
          onClick={onClose}
          type="button"
        >
          Đóng
        </button>
        <button
          className="h-11 flex-[1.25] rounded-2xl bg-blue-700 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(37,99,235,0.22)] transition hover:bg-blue-800"
          onClick={onClose}
          type="button"
        >
          Xem lịch sử thanh toán
        </button>
      </div>
    </ModalShell>
  )
}

function SubscriptionStatusCard({ subscription }) {
  const currentPlan = planCatalog[subscription.tier]
  const urgencyClass =
    subscription.daysRemaining <= 7
      ? 'bg-amber-50 text-amber-700'
      : 'bg-emerald-50 text-emerald-700'

  return (
    <div className="mt-6 grid grid-cols-1 items-center gap-8 rounded-[30px] bg-white/55 px-7 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] lg:grid-cols-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue-700">Subscription hiện tại</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-[26px] font-bold leading-none text-slate-950">{currentPlan.name}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${urgencyClass}`}>
            Còn {subscription.daysRemaining} ngày
          </span>
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue-700">Ngày hết hạn</p>
        <p className="mt-2 text-[26px] font-bold leading-none text-slate-950">{subscription.renewalDate}</p>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue-700">Khuyến nghị</p>
        <p className="mt-2 max-w-[260px] text-base leading-6 text-slate-600">
          {subscription.daysRemaining <= 7 ? 'Nên gia hạn sớm để tránh gián đoạn lưu trữ.' : 'Gói của bạn đang hoạt động bình thường.'}
        </p>
      </div>
    </div>
  )
}

export function SettingsPage({
  showToast,
  scrollTarget,
  subscription = { tier: 'free', daysRemaining: 0, renewalDate: '--/--/----' },
  onSubscriptionChange,
}) {
  const plansSectionRef = useRef(null)
  const [selectedSource, setSelectedSource] = useState(cameraSources[0])
  const [selectedResolution, setSelectedResolution] = useState(resolutionOptions[0])
  const [autoFocus, setAutoFocus] = useState(true)
  const [stabilizer, setStabilizer] = useState(true)
  const [autoDelete, setAutoDelete] = useState(false)
  const [checkoutState, setCheckoutState] = useState({
    open: false,
    step: 'confirm',
    action: 'upgrade',
    planId: 'pro',
    method: 'card',
  })

  useEffect(() => {
    if (scrollTarget?.id !== 'plans') {
      return
    }

    const frameId = window.requestAnimationFrame(() => {
      plansSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [scrollTarget])

  function openCheckout(planId, action) {
    setCheckoutState({
      open: true,
      step: 'confirm',
      action,
      planId,
      method: 'card',
    })
  }

  function closeCheckout() {
    setCheckoutState((current) => ({ ...current, open: false }))
  }

  function handlePaymentSuccess() {
    const nextTier = checkoutState.planId === 'pro' || checkoutState.planId === 'master' ? checkoutState.planId : subscription.tier
    const nextDays = checkoutState.action === 'renew' ? subscription.daysRemaining + 30 : 30

    onSubscriptionChange?.({
      tier: nextTier,
      daysRemaining: nextDays,
      renewalDate: formatDateFromNow(nextDays),
    })

    setCheckoutState((current) => ({ ...current, step: 'success' }))
    showToast?.({
      message: `${checkoutState.action === 'renew' ? 'Gia hạn' : 'Nâng cấp'} gói ${planCatalog[checkoutState.planId].name} đã hoàn tất.`,
      title: 'Thanh toán thành công',
      tone: 'success',
    })
  }

  function handleSourceChange(source) {
    setSelectedSource(source)
    showToast?.({
      message: `Nguồn camera đã đổi sang ${source.name}.`,
      title: 'Đã cập nhật nguồn camera',
      tone: 'success',
    })
  }

  function handleResolutionChange(resolution) {
    setSelectedResolution(resolution)
    showToast?.({
      message: `Độ phân giải đã đổi sang ${resolution.label}.`,
      title: 'Đã cập nhật độ phân giải',
      tone: 'success',
    })
  }

  function handleToggleSetting(label, setter) {
    return (enabled) => {
      setter(enabled)
      showToast?.({
        message: `${label} đã được ${enabled ? 'bật' : 'tắt'}.`,
        title: 'Đã cập nhật cài đặt',
        tone: 'success',
      })
    }
  }

  return (
    <>
      <div className="dashboard-page page-scroll-pad-sm space-y-6">
        <section className="glass-panel rounded-[30px] p-6 lg:p-7">
          <h1 className="text-[32px] font-bold leading-tight text-slate-950">Cấu hình hệ thống</h1>
          <p className="mt-2 text-base text-slate-600">Quản lý thiết bị và gói dịch vụ của bạn.</p>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.9fr_0.95fr]">
          <article className="glass-card rounded-[30px] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <Icon className="text-[24px] text-slate-900" name="videocam" />
                <h2 className="text-[18px] font-bold text-slate-950">Cài đặt Camera</h2>
              </div>

              <div className="flex w-fit items-center gap-3 rounded-full bg-white/75 px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                <span className="text-sm font-bold uppercase tracking-[0.08em] text-slate-700">Trạng thái: Hoạt động</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              <CameraSourceSelect currentSource={selectedSource} onSelect={handleSourceChange} />
              <ResolutionSelect currentResolution={selectedResolution} onSelect={handleResolutionChange} />
            </div>

            <div className="mt-8 space-y-6">
              <SettingRow caption="Tự động lấy nét" enabled={autoFocus} onChange={handleToggleSetting('Tự động lấy nét', setAutoFocus)} />
              <SettingRow
                caption="Ổn định khung hình"
                description="Giảm rung cho camera khi đóng gói"
                enabled={stabilizer}
                onChange={handleToggleSetting('Ổn định khung hình', setStabilizer)}
              />
            </div>

            <CameraPreview
              autoFocus={autoFocus}
              currentResolution={selectedResolution}
              currentSource={selectedSource}
              stabilizer={stabilizer}
            />
          </article>

          <article className="glass-card flex min-h-full flex-col rounded-[30px] p-6">
            <div className="flex items-center gap-3">
              <Icon className="text-[23px] text-slate-900" name="storage" />
              <h2 className="text-[18px] font-bold text-slate-950">Dữ liệu & Lưu trữ</h2>
            </div>

            <div className="mt-10">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-base text-slate-700">Giới hạn dung lượng</span>
                <span className="text-xl font-bold text-blue-700">80%</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-200/80">
                <div className="h-full w-4/5 rounded-full bg-blue-600" />
              </div>
            </div>

            <div className="mt-6 pt-6">
              <SettingRow
                caption="Tự động xóa đơn hàng cũ"
                description="xóa sau 30 ngày"
                enabled={autoDelete}
                onChange={handleToggleSetting('Tự động xóa đơn hàng cũ', setAutoDelete)}
              />
            </div>

            <div className="mt-6 flex-1 border-t border-slate-900/12" />

            <button
              className="mt-6 h-11 rounded-2xl bg-white/55 text-base font-medium text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition hover:bg-white/75"
              onClick={() =>
                showToast?.({
                  message: 'Bộ nhớ đệm đã được xóa trong chế độ mô phỏng.',
                  title: 'Đã xóa bộ nhớ đệm',
                  tone: 'success',
                })
              }
              type="button"
            >
              Xóa bộ nhớ đệm
            </button>
          </article>
        </section>

        <section className="scroll-mt-28 rounded-[30px] lg:scroll-mt-32" ref={plansSectionRef}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Icon className="text-[23px] text-slate-900" name="workspace_premium" />
              <h2 className="text-[18px] font-bold text-slate-950">Gói dịch vụ</h2>
            </div>
            <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Gói hiện tại: {planCatalog[subscription.tier].name}
            </div>
          </div>

          <SubscriptionStatusCard subscription={subscription} />

          <div className="mt-8 grid grid-cols-1 items-stretch gap-7 lg:grid-cols-3">
            {['pro', 'master', 'business'].map((planId) => (
              <PlanCard currentTier={subscription.tier} key={planId} onSelect={openCheckout} planId={planId} />
            ))}
          </div>
        </section>

        <section className="glass-card rounded-[30px] p-6">
          <div className="flex items-center gap-3">
            <Icon className="text-[22px] text-slate-900" name="receipt_long" />
            <h2 className="text-[18px] font-bold text-slate-950">Lịch sử thanh toán</h2>
          </div>

          <div className="mt-6 overflow-hidden rounded-[24px] bg-white/45">
            <div className="hidden grid-cols-[1.2fr_1.5fr_0.8fr_0.9fr_1fr] gap-4 border-b border-slate-900/12 px-6 py-4 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500 md:grid">
              <span>Mã hóa đơn</span>
              <span>Nội dung</span>
              <span>Số tiền</span>
              <span>Trạng thái</span>
              <span>Thời gian</span>
            </div>
            {paymentHistory.map((item, index) => (
              <div
                className={`grid gap-2 px-5 py-4 md:grid-cols-[1.2fr_1.5fr_0.8fr_0.9fr_1fr] md:items-center md:gap-4 md:px-6 ${
                  index < paymentHistory.length - 1 ? 'border-b border-slate-900/12' : ''
                }`}
                key={item.code}
              >
                <p className="text-sm font-semibold text-slate-900">{item.code}</p>
                <p className="text-sm text-slate-700">{item.type}</p>
                <p className="text-sm font-semibold text-blue-700">{item.amount}</p>
                <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {item.status}
                </span>
                <p className="text-sm text-slate-500">{item.date}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {checkoutState.open && checkoutState.step === 'confirm' ? (
        <ConfirmPlanModal
          action={checkoutState.action}
          method={checkoutState.method}
          onClose={closeCheckout}
          onMethodChange={(method) => setCheckoutState((current) => ({ ...current, method }))}
          onNext={() => setCheckoutState((current) => ({ ...current, step: 'details' }))}
          planId={checkoutState.planId}
        />
      ) : null}

      {checkoutState.open && checkoutState.step === 'details' ? (
        <PaymentDetailsModal
          action={checkoutState.action}
          method={checkoutState.method}
          onBack={() => setCheckoutState((current) => ({ ...current, step: 'confirm' }))}
          onClose={closeCheckout}
          onConfirm={handlePaymentSuccess}
          planId={checkoutState.planId}
        />
      ) : null}

      {checkoutState.open && checkoutState.step === 'success' ? (
        <PaymentSuccessModal onClose={closeCheckout} planId={checkoutState.planId} />
      ) : null}
    </>
  )
}
