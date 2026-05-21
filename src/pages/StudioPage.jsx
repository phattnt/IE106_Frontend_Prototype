import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { DropdownSelect } from '../components/DropdownSelect.jsx'
import { Icon } from '../components/Icon.jsx'

const demoVideoUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

const currentOrder = {
  code: 'ORD-88291',
  customer: 'Nguyễn Văn An',
  packedAt: '10:42 AM',
  status: 'Đang xử lý',
  products: [
    {
      id: 'camera-x1',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=160',
      meta: 'Black • SKU: #OPX-772-B',
      name: 'Camera Optic Pro X1',
      quantity: 1,
      sku: '#OPX-772-B',
    },
    {
      id: 'sonic-wireless',
      imageUrl: 'https://images.unsplash.com/photo-1600086827875-a63b01f1335c?auto=format&fit=crop&q=80&w=160',
      meta: 'Midnight • SKU: #SNW-102-S',
      name: 'Tai nghe Sonic Wireless',
      quantity: 1,
      sku: '#SNW-102-S',
    },
  ],
}

const initialRecords = [
  { code: 'ORD-88290', status: 'success', time: '10:42 AM • 01:24s' },
  { code: 'ORD-88289', status: 'success', time: '10:35 AM • 00:58s' },
  { code: 'ORD-88288', status: 'error', time: '10:15 AM • Lỗi nhãn' },
]

const cameraOptions = [
  { label: 'Camera Optic Pro X1', value: 'optic-x1' },
  { label: 'Camera USB Station 02', value: 'usb-02' },
  { label: 'Camera dự phòng', value: 'backup' },
]

const resolutionOptions = [
  { label: '1080p (FHD)', value: '1080p' },
  { label: '720p (HD)', value: '720p' },
  { label: '1440p (QHD)', value: '1440p' },
]

function useModalLifecycle(active, onClose) {
  useEffect(() => {
    if (!active) {
      return undefined
    }

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
  }, [active, onClose])
}

function ModalOverlay({ children, onClose }) {
  return createPortal(
    <div
      className="motion-overlay fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/28 px-4 py-8 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      {children}
    </div>,
    document.body
  )
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      aria-pressed={enabled}
      className={`motion-button relative h-8 w-14 rounded-full ${enabled ? 'bg-blue-600' : 'border border-slate-300 bg-slate-200'}`}
      onClick={() => onChange(!enabled)}
      type="button"
    >
      <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition ${enabled ? 'left-7' : 'left-1'}`} />
    </button>
  )
}

function Barcode({ className = '' }) {
  return (
    <div className={`rounded-sm bg-white p-2 shadow-[0_10px_22px_rgba(15,23,42,0.18)] ${className}`}>
      <div className="studio-barcode h-11 w-28" />
      <div className="mt-1 h-1 w-20 rounded-full bg-slate-300" />
    </div>
  )
}

function CameraScene() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_38%_22%,rgba(255,255,255,0.22),transparent_18rem),linear-gradient(145deg,#64748b_0%,#1e293b_100%)] opacity-75" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:36px_36px] opacity-35" />
      <div className="absolute left-[24%] top-[17%] h-[26%] w-[38%] rounded-md bg-slate-200 shadow-[0_22px_45px_rgba(15,23,42,0.30)]">
        <div className="h-[48%] rounded-t-md bg-slate-300" />
        <Barcode className="absolute left-[14%] top-[-5%]" />
      </div>
      <Barcode className="absolute bottom-[12%] left-[22%]" />
      <div className="absolute bottom-[10%] right-[21%] h-[26%] w-[18%] rounded-[34px] bg-slate-950/72 shadow-[0_24px_40px_rgba(15,23,42,0.45)]">
        <div className="absolute left-[18%] top-[18%] h-[18%] w-[46%] rounded-full bg-slate-700" />
        <div className="absolute bottom-[8%] right-[-8%] h-[72%] w-[34%] rounded-full bg-slate-950" />
      </div>
    </>
  )
}

function ScanFrame({ enabled, tone = 'blue' }) {
  if (!enabled) {
    return null
  }

  const borderClass = tone === 'green' ? 'border-emerald-400' : 'border-blue-500/95'
  const cornerClass = tone === 'green' ? 'border-emerald-400' : 'border-blue-500'

  return (
    <div className={`studio-scan-frame absolute left-[24%] top-[21%] h-[48%] w-[52%] border-[3px] ${borderClass}`}>
      <span className={`absolute -left-1 -top-1 h-8 w-8 border-l-4 border-t-4 ${cornerClass}`} />
      <span className={`absolute -right-1 -top-1 h-8 w-8 border-r-4 border-t-4 ${cornerClass}`} />
      <span className={`absolute -bottom-1 -left-1 h-8 w-8 border-b-4 border-l-4 ${cornerClass}`} />
      <span className={`absolute -bottom-1 -right-1 h-8 w-8 border-b-4 border-r-4 ${cornerClass}`} />
      <span className="studio-scan-line absolute left-0 right-0 top-1/2 h-0.5 bg-blue-300/95 shadow-[0_0_20px_rgba(96,165,250,0.75)]" />
    </div>
  )
}

function CameraMock({ isDisconnected, isRecording, onRetry, recognized, scanFrame }) {
  return (
    <div className="studio-camera relative min-h-[360px] overflow-hidden rounded-[22px] bg-slate-900 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
      <CameraScene />
      <ScanFrame enabled={scanFrame} tone={isRecording ? 'green' : 'blue'} />

      {recognized ? (
        <div className="absolute left-1/2 top-5 flex -translate-x-1/2 items-center gap-3 rounded-[18px] bg-emerald-50 px-5 py-3 shadow-[0_18px_42px_rgba(15,23,42,0.20)]">
          <Icon className="filled text-[28px] text-emerald-600" name="check_circle" />
          <div>
            <p className="text-sm font-semibold text-emerald-700">Đã nhận diện mã đơn hàng</p>
            <p className="text-[18px] font-bold leading-tight text-slate-950">{currentOrder.code}</p>
          </div>
        </div>
      ) : null}

      {isRecording ? (
        <>
          <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-slate-950/80 px-4 py-2 text-xs font-semibold text-white">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            REC
            <span className="h-4 w-px bg-white/25" />
            00:12:45
          </div>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-slate-950/80 px-4 py-2 text-xs font-semibold uppercase text-white">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Đang ghi
          </div>
        </>
      ) : null}

      {isDisconnected ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-300/62 backdrop-blur-[1px]">
          <div className="rounded-[24px] bg-white p-7 text-center shadow-[0_24px_60px_rgba(15,23,42,0.22)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Icon className="text-[38px]" name="videocam_off" />
            </div>
            <h3 className="mt-4 text-[18px] font-semibold text-slate-950">Mất kết nối camera</h3>
            <p className="mt-1 text-sm text-slate-700">Kiểm tra thiết bị hoặc thử lại.</p>
            <button className="motion-button mt-4 rounded-full bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800" onClick={onRetry} type="button">
              Thử kết nối lại
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function SettingsModal({ settings, onChange, onClose, showToast }) {
  useModalLifecycle(true, onClose)

  function updateSetting(field, value) {
    onChange((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div
        aria-label="Cài đặt camera"
        aria-modal="true"
        className="motion-modal w-full max-w-[480px] rounded-[24px] bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.22)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[20px] font-semibold text-slate-950">Cài đặt camera</h2>
          <button className="motion-button modal-close-button-inline" onClick={onClose} type="button">
            <Icon name="close" />
          </button>
        </div>

        <div className="space-y-5">
          <DropdownSelect
            label="Nguồn camera"
            onChange={(value) => updateSetting('cameraSource', value)}
            options={cameraOptions}
            theme="gray"
            value={settings.cameraSource}
          />
          <DropdownSelect
            label="Độ phân giải"
            onChange={(value) => updateSetting('resolution', value)}
            options={resolutionOptions}
            theme="gray"
            value={settings.resolution}
          />

          {[
            ['autoFocus', 'Tự động lấy nét'],
            ['scanFrame', 'Khung quét mã'],
            ['cameraError', 'Mô phỏng mất kết nối'],
            ['storageFull', 'Mô phỏng dung lượng đầy'],
          ].map(([field, label]) => (
            <div className="flex items-center justify-between gap-4" key={field}>
              <span className="text-sm font-semibold text-slate-950">{label}</span>
              <Toggle enabled={settings[field]} onChange={(value) => updateSetting(field, value)} />
            </div>
          ))}
        </div>

        <div className="mt-7 flex items-center gap-3">
          <button className="motion-button h-11 flex-1 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800 hover:bg-slate-50" onClick={onClose} type="button">
            Hủy
          </button>
          <button
            className="motion-button h-11 flex-1 rounded-2xl bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800"
            onClick={() => {
              showToast?.({
                message: 'Cài đặt camera mô phỏng đã được lưu.',
                title: 'Lưu cài đặt thành công',
                tone: 'success',
              })
              onClose()
            }}
            type="button"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}

function VideoProofModal({ onClose, record }) {
  useModalLifecycle(Boolean(record), onClose)

  return (
    <ModalOverlay onClose={onClose}>
      <div
        aria-label={`Chi tiết video minh chứng đơn hàng ${record.code}`}
        aria-modal="true"
        className="motion-modal relative max-h-[92vh] w-full max-w-[1024px] overflow-y-auto rounded-[34px] bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.22)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button className="motion-button modal-close-button" onClick={onClose} type="button">
          <Icon name="close" />
        </button>

        <div className="pr-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <h2 className="text-[26px] font-bold text-slate-950">Chi tiết video minh chứng - Đơn hàng #{record.code}</h2>
            <span className="w-fit rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.08em] text-emerald-700">Đã đóng gói</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-[0.95fr_1.35fr]">
          <div className="space-y-7">
            <section>
              <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-slate-600">Thông tin khách hàng</p>
              <div className="mt-4 rounded-[24px] bg-slate-50 p-5 ring-1 ring-slate-900/8">
                <p className="text-[18px] font-bold text-slate-900">{currentOrder.customer}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">123 Đường Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh</p>
              </div>
            </section>

            <section>
              <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-slate-600">Sản phẩm đóng gói</p>
              <div className="mt-4 space-y-3">
                {currentOrder.products.map((product) => (
                  <div className="flex items-center gap-4 rounded-[20px] bg-white/45 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]" key={product.id}>
                    <img alt={product.name} className="h-16 w-16 rounded-2xl object-cover" src={product.imageUrl} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[18px] font-semibold text-slate-900">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-600">SKU: {product.sku}</p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">x{product.quantity}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div>
            <div className="overflow-hidden rounded-[30px] bg-slate-950 shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
              <div className="relative aspect-video">
                <video autoPlay className="h-full w-full object-cover" controls muted src={demoVideoUrl} />
                <span className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">{record.time}</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
              {[
                ['Trạm đóng gói', 'Station 04'],
                ['Nhân viên', 'Alex Rivera'],
                ['Trọng lượng', '1.2 kg'],
                ['Kích thước', '20x15x10 cm'],
              ].map(([label, value]) => (
                <div className="rounded-[20px] bg-slate-50 p-4 ring-1 ring-slate-900/8" key={label}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-600">{label}</p>
                  <p className="mt-2 text-[18px] font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModalOverlay>
  )
}

function RecordHistoryItem({ onView, record }) {
  const success = record.status === 'success'

  return (
    <article className="flex items-center gap-4 rounded-[22px] bg-white/42 px-4 py-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${success ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-600'}`}>
        <Icon className="text-[20px]" name={success ? 'check_circle' : 'error'} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-950">{record.code}</p>
        <p className="mt-0.5 text-xs text-slate-700">{record.time}</p>
      </div>
      <button className="motion-button flex h-8 items-center gap-1.5 rounded-full bg-blue-700 px-4 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(37,99,235,0.22)] hover:bg-blue-800" onClick={() => onView(record)} type="button">
        <Icon className="text-[15px]" name="play_arrow" />
        Xem video
      </button>
    </article>
  )
}

function StorageCard({ storageFull }) {
  const used = storageFull ? 95 : 75
  const amount = storageFull ? '1.5 TB' : '1.2 TB'

  return (
    <section className="glass-panel rounded-[28px] p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700">Trạng thái lưu trữ</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <span className="text-[30px] font-bold leading-none text-slate-950">{amount}</span>
          <span className="ml-2 text-lg font-medium text-slate-700">/ 1.6 TB</span>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-xs font-semibold ${storageFull ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'}`}>
          {used}% đã dùng
        </span>
      </div>

      <div className="mt-7 h-3 rounded-full bg-white/55">
        <div className={`h-full rounded-full ${storageFull ? 'bg-red-500' : 'bg-blue-700'}`} style={{ width: `${used}%` }} />
      </div>

      <div className="mt-6 space-y-4">
        {[
          ['analytics', 'Mức tiêu thụ trung bình', '~150 MB / video'],
          ['settings_input_antenna', 'Dự báo lưu trữ', '+2.500 video bổ sung'],
        ].map(([icon, label, value]) => (
          <div className="flex items-center gap-4 rounded-[22px] bg-white/42 p-4" key={label}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Icon className="text-[20px]" name={icon} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-700">{label}</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function StudioPage({ showToast }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recognized, setRecognized] = useState(false)
  const [records, setRecords] = useState(initialRecords)
  const [settings, setSettings] = useState({
    autoFocus: true,
    cameraError: false,
    cameraSource: 'optic-x1',
    resolution: '1080p',
    scanFrame: true,
    storageFull: false,
  })

  useEffect(() => {
    if (settings.storageFull) {
      showToast?.({
        message: 'Dung lượng lưu trữ của bạn sắp đầy (95%). Vui lòng nâng cấp gói cước hoặc xóa video cũ.',
        title: 'Cảnh báo dung lượng',
        tone: 'warning',
      })
    }
  }, [settings.storageFull, showToast])

  function startRecording() {
    if (settings.cameraError) {
      showToast?.({
        message: 'Camera đang mất kết nối. Hãy thử kết nối lại trước khi bắt đầu quay.',
        title: 'Mất kết nối camera',
        tone: 'warning',
      })
      return
    }

    setIsRecording(true)
    setRecognized(true)
  }

  function stopRecording() {
    const newRecord = { code: currentOrder.code, status: 'success', time: 'Vừa xong • 00:42s' }
    setIsRecording(false)
    setRecognized(false)
    setRecords((items) => [newRecord, ...items.slice(0, 4)])
    showToast?.({
      message: `Video minh chứng cho đơn ${currentOrder.code} đã được lưu vào lịch sử quay.`,
      title: 'Video đã lưu thành công',
      tone: 'success',
    })
  }

  function retryCamera() {
    setSettings((current) => ({ ...current, cameraError: false }))
  }

  function openRecordedVideo(record) {
    setSelectedVideo(record)
  }

  return (
    <>
      <div className="dashboard-page page-scroll-pad-sm">
        <div className="studio-layout grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.7fr)]">
          <div className="space-y-6">
            <section className="glass-panel rounded-[28px] p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Trực tiếp
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-slate-800">
                  <Icon className="text-[18px]" name="qr_code_scanner" />
                  Chế độ quét đang hoạt động
                </div>
              </div>

              <CameraMock
                isDisconnected={settings.cameraError}
                isRecording={isRecording}
                onRetry={retryCamera}
                recognized={recognized}
                scanFrame={settings.scanFrame}
              />

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <button className="motion-button flex h-11 items-center gap-2 rounded-full bg-white/70 px-7 text-sm font-semibold text-slate-900 shadow-[0_10px_24px_rgba(42,76,130,0.10)] hover:bg-white" onClick={() => setSettingsOpen(true)} type="button">
                  <Icon className="text-[19px]" name="tune" />
                  Cài đặt
                </button>
                <button
                  className={`motion-button flex h-11 min-w-[190px] items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold shadow-[0_14px_28px_rgba(37,99,235,0.24)] ${
                    settings.cameraError
                      ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                      : isRecording
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-blue-700 text-white hover:bg-blue-800'
                  }`}
                  disabled={settings.cameraError}
                  onClick={isRecording ? stopRecording : startRecording}
                  type="button"
                >
                  <Icon className="text-[20px]" name={isRecording ? 'stop_circle' : 'radio_button_checked'} />
                  {isRecording ? 'Dừng quay' : 'Bắt đầu quay'}
                </button>
              </div>
            </section>

            <section className="glass-panel rounded-[28px] p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-[20px] font-semibold text-slate-950">Lịch sử quay gần đây</h2>
                <button className="motion-button rounded-full p-2 text-slate-700 hover:bg-white/60" type="button">
                  <Icon name="more_horiz" />
                </button>
              </div>
              <div className="space-y-3">
                {records.slice(0, 3).map((record) => (
                  <RecordHistoryItem key={`${record.code}-${record.time}`} onView={openRecordedVideo} record={record} />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="glass-panel rounded-[28px] p-6">
              <h2 className="text-[20px] font-semibold text-slate-950">Chi tiết đơn hàng hiện tại</h2>
              <div className="mt-5 rounded-[28px] bg-white/42 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700">Mã đơn hàng</p>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <p className="text-[26px] font-bold text-slate-950">{currentOrder.code}</p>
                  <span className="rounded-full bg-blue-100 px-4 py-1.5 text-xs font-semibold text-blue-700">{currentOrder.status}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {currentOrder.products.map((product) => (
                  <article className="flex items-center gap-4 rounded-[24px] bg-white/50 p-4" key={product.id}>
                    <img alt={product.name} className="h-12 w-12 rounded-full object-cover" src={product.imageUrl} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-950">{product.name}</p>
                      <p className="mt-1 truncate text-xs text-slate-700">{product.meta}</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-950">x{product.quantity}</span>
                  </article>
                ))}
              </div>
            </section>

            <StorageCard storageFull={settings.storageFull} />
          </aside>
        </div>
      </div>

      {settingsOpen ? <SettingsModal onChange={setSettings} onClose={() => setSettingsOpen(false)} settings={settings} showToast={showToast} /> : null}
      {selectedVideo ? <VideoProofModal onClose={() => setSelectedVideo(null)} record={selectedVideo} /> : null}
    </>
  )
}
