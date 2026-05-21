import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '../components/Icon.jsx'
import { Pagination } from '../components/Pagination.jsx'

const demoVideoUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'

const channelFilters = ['Tất cả', 'Shopee', 'TikTok', 'Lazada']

const summaryCards = [
  { icon: 'inventory_2', label: 'Tổng đơn hàng', value: '12,458' },
  { icon: 'video_library', label: 'Video đã lưu', value: '12,458' },
  { icon: 'verified_user', label: 'Khiếu nại đã giải quyết', value: '142' },
]

const orderTemplates = [
  { packedAt: '14/05/2024 - 10:32 AM', platform: 'Shopee', customer: 'Nguyễn Văn An' },
  { packedAt: '14/05/2024 - 09:15 AM', platform: 'TikTok', customer: 'Trần Thị B' },
  { packedAt: '13/05/2024 - 16:45 PM', platform: 'Lazada', customer: 'Lê Văn C' },
  { packedAt: '13/05/2024 - 14:10 PM', platform: 'Lazada', customer: 'Phạm Minh D' },
  { packedAt: '12/05/2024 - 17:20 PM', platform: 'Shopee', customer: 'Hoàng Thị E' },
  { packedAt: '12/05/2024 - 11:05 AM', platform: 'TikTok', customer: 'Ngô Văn F' },
]

const orderRows = Array.from({ length: 20 }, (_, index) => {
  const template = orderTemplates[index % orderTemplates.length]

  return {
    code: `${template.platform.slice(0, 2).toUpperCase()}-${89237492 + index * 7}${String.fromCharCode(65 + (index % 26))}`,
    packedAt: template.packedAt,
    platform: template.platform,
    customer: `${template.customer}${index >= orderTemplates.length ? ` ${index + 1}` : ''}`,
  }
})

const packedProducts = [
  {
    name: 'Camera Optic Pro X1',
    sku: '#OPX-772-B',
    quantity: 'x1',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Tai nghe Sonic Wireless',
    sku: '#SNW-102-S',
    quantity: 'x2',
    imageUrl: 'https://images.unsplash.com/photo-1600086827875-a63b01f1335c?auto=format&fit=crop&q=80&w=600',
  },
]

const proofDetails = [
  { label: 'Trạm đóng gói', value: 'Station 04' },
  { label: 'Nhân viên', value: 'Alex Rivera' },
  { label: 'Trọng lượng', value: '1.2 kg' },
  { label: 'Kích thước', value: '20×15×10 cm' },
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

function FilterButton({ active, children }) {
  return (
    <button
      className={`motion-button h-11 rounded-full px-5 text-sm font-bold uppercase tracking-[0.08em] ${
        active
          ? 'bg-blue-700 text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)]'
          : 'bg-white/65 text-slate-800 hover:bg-white/80'
      }`}
      type="button"
    >
      {children}
    </button>
  )
}

function SummaryCard({ icon, label, value }) {
  return (
    <article className="glass-card rounded-[24px] p-6">
      <div className="mb-3 flex items-center gap-2 text-slate-600">
        <Icon className="text-[20px]" name={icon} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-[44px] font-bold leading-none text-slate-950">{value}</p>
    </article>
  )
}

function PlatformBadge({ children }) {
  return (
    <span className="inline-flex rounded-full bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
      {children}
    </span>
  )
}

function ActionButton({ icon, onClick, tone }) {
  const toneClass =
    tone === 'danger'
      ? 'bg-rose-50 text-red-500 ring-1 ring-red-200/80 hover:bg-rose-100'
      : 'bg-blue-600 text-white hover:bg-blue-700'

  return (
    <button
      className={`motion-button flex h-11 w-11 items-center justify-center rounded-full ${toneClass}`}
      onClick={onClick}
      type="button"
    >
      <Icon className={tone === 'primary' ? 'filled text-[22px]' : 'text-[22px]'} name={icon} />
    </button>
  )
}

function ProductLine({ product }) {
  return (
    <div className="flex items-center gap-4 rounded-[20px] bg-white/45 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
      <img alt={product.name} className="h-16 w-16 rounded-2xl object-cover" src={product.imageUrl} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[18px] font-semibold text-slate-900">{product.name}</p>
        <p className="mt-1 text-sm text-slate-500">SKU: {product.sku}</p>
      </div>
      <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-blue-700">{product.quantity}</span>
    </div>
  )
}

function OrderProofModal({ onClose, order }) {
  useModalLifecycle(Boolean(order), onClose)

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="motion-modal relative max-h-[92vh] w-full max-w-[1024px] overflow-y-auto rounded-[34px] bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.22)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Chi tiết video minh chứng đơn hàng ${order.code}`}
      >
        <button className="motion-button absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-900/8 hover:text-slate-800" onClick={onClose} type="button">
          <Icon name="close" />
        </button>

        <div className="pr-10">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <h2 className="text-[26px] font-bold text-slate-950">Chi tiết video minh chứng - Đơn hàng #{order.code}</h2>
            <span className="w-fit rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.08em] text-emerald-700">Đã đóng gói</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-[0.95fr_1.35fr]">
          <div className="space-y-7">
            <section>
              <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-slate-600">Thông tin khách hàng</p>
              <div className="mt-4 rounded-[24px] bg-slate-50 p-5 ring-1 ring-slate-900/8">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">NV</div>
                  <div>
                    <p className="text-[18px] font-bold text-slate-900">{order.customer}</p>
                    <div className="mt-2 space-y-1.5 text-slate-500">
                      <p className="flex items-center gap-2 text-sm">
                        <Icon className="text-[18px]" name="call" />
                        090 123 4567
                      </p>
                      <p className="flex items-start gap-2 text-sm">
                        <Icon className="mt-0.5 text-[18px]" name="location_on" />
                        123 Đường Nguyễn Thị Minh Khai, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-slate-600">Sản phẩm đóng gói</p>
              <div className="mt-4 space-y-3">
                {packedProducts.map((product) => (
                  <ProductLine key={`${order.code}-${product.sku}`} product={product} />
                ))}
              </div>
            </section>
          </div>

          <div>
            <div className="overflow-hidden rounded-[30px] bg-slate-950 shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
              <div className="relative aspect-video">
                <video autoPlay className="h-full w-full object-cover" controls muted src={demoVideoUrl} />
                <span className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">{order.packedAt}</span>
              </div>
            </div>

            <section className="mt-6">
              <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-slate-600">Chi tiết đóng gói</p>
              <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
                {proofDetails.map((item) => (
                  <div className="rounded-[20px] bg-slate-50 p-4 ring-1 ring-slate-900/8" key={item.label}>
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{item.label}</p>
                    <p className="mt-2 text-[18px] font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <a className="motion-button inline-flex h-12 items-center gap-2 rounded-full bg-blue-700 px-6 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)] hover:bg-blue-800" href={demoVideoUrl}>
            <Icon className="text-[18px]" name="download" />
            Tải video xuống
          </a>
        </div>
      </div>
    </ModalOverlay>
  )
}

function DeleteOrderModal({ onClose, onConfirm, order }) {
  useModalLifecycle(Boolean(order), onClose)

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="motion-modal relative w-full max-w-[400px] rounded-[30px] bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.22)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Xác nhận xóa đơn hàng ${order.code}`}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-red-600">
          <Icon className="filled text-[24px]" name="delete" />
        </div>

        <div className="mt-5 text-center">
          <h2 className="text-[22px] font-bold text-slate-950">Xác nhận xóa đơn hàng</h2>
          <p className="mt-3 text-[15px] leading-7 text-slate-600">
            Bạn có chắc muốn xóa đơn hàng <span className="font-semibold text-slate-950">#{order.code}</span> không? Hành động này không thể hoàn tác.
          </p>
        </div>

        <div className="mt-6 rounded-[22px] border border-blue-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Mã đơn hàng</p>
              <p className="mt-2 text-[20px] font-bold text-blue-700">#{order.code}</p>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <Icon className="text-[18px]" name="calendar_today" />
                {order.packedAt.split(' - ')[0]}
              </p>
            </div>
            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase text-white">{order.platform}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button className="motion-button h-12 flex-1 rounded-full bg-white text-base font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50" onClick={onClose} type="button">
            Hủy bỏ
          </button>
          <button className="motion-button h-12 flex-1 rounded-full bg-red-600 text-base font-semibold text-white shadow-[0_14px_28px_rgba(220,38,38,0.22)] hover:bg-red-700" onClick={onConfirm} type="button">
            Xóa đơn hàng
          </button>
        </div>
      </div>
    </ModalOverlay>
  )
}

function QrScannerModal({ onClose, onScanned }) {
  const [tab, setTab] = useState('camera')
  useModalLifecycle(true, onClose)

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="motion-modal relative w-full max-w-[480px] rounded-[30px] bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.22)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Quét mã QR"
      >
        <button className="motion-button absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-900/8 hover:text-slate-800" onClick={onClose} type="button">
          <Icon name="close" />
        </button>

        <h2 className="text-center text-[24px] font-bold text-slate-950">Quét mã QR</h2>

        <div className="mt-6 flex rounded-full bg-slate-100 p-1">
          <button className={`motion-button h-12 flex-1 rounded-full text-lg font-semibold ${tab === 'camera' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`} onClick={() => setTab('camera')} type="button">
            Quét camera
          </button>
          <button className={`motion-button h-12 flex-1 rounded-full text-lg font-semibold ${tab === 'manual' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'}`} onClick={() => setTab('manual')} type="button">
            Nhập thủ công
          </button>
        </div>

        {tab === 'camera' ? (
          <>
            <div className="mt-8 flex justify-center">
              <div className="relative flex aspect-square w-[320px] items-center justify-center overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#1f2937,#111827)]">
                <div className="absolute inset-5 rounded-[28px] border border-blue-700/15" />
                <div className="absolute left-5 top-5 h-12 w-12 rounded-tl-[28px] border-l-4 border-t-4 border-blue-700" />
                <div className="absolute right-5 top-5 h-12 w-12 rounded-tr-[28px] border-r-4 border-t-4 border-blue-700" />
                <div className="absolute bottom-5 left-5 h-12 w-12 rounded-bl-[28px] border-b-4 border-l-4 border-blue-700" />
                <div className="absolute bottom-5 right-5 h-12 w-12 rounded-br-[28px] border-b-4 border-r-4 border-blue-700" />
                <div className="absolute left-4 right-4 top-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-600 shadow-[0_0_14px_rgba(37,99,235,0.85)]" />
                <p className="absolute bottom-5 text-[15px] text-slate-200">Căn chuẩn mã QR vào khung</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button className="motion-button h-12 rounded-full bg-emerald-600 text-base font-semibold text-white shadow-[0_14px_28px_rgba(5,150,105,0.22)] hover:bg-emerald-700" onClick={onScanned} type="button">
                Đã quét
              </button>
              <button className="motion-button h-12 rounded-full bg-white text-base font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50" onClick={onClose} type="button">
                Hủy
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mt-8 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-500">Mã đơn hàng</span>
                <input className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-700 outline-none" defaultValue={orders[0].code} type="text" />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button className="motion-button h-12 rounded-full bg-blue-700 text-base font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)] hover:bg-blue-800" onClick={onScanned} type="button">
                Tìm đơn hàng
              </button>
              <button className="motion-button h-12 rounded-full bg-white text-base font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50" onClick={onClose} type="button">
                Hủy
              </button>
            </div>
          </>
        )}
      </div>
    </ModalOverlay>
  )
}

export function OrderArchivePage({ showToast }) {
  const [orders, setOrders] = useState(orderRows)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [deleteOrder, setDeleteOrder] = useState(null)
  const [qrOpen, setQrOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const visibleOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  function openScannedOrder() {
    setQrOpen(false)
    setSelectedOrder(orders[0])
    showToast?.({
      message: `Đã tìm thấy đơn ${orders[0].code} từ mã QR.`,
      title: 'Quét QR thành công',
      tone: 'success',
    })
  }

  function confirmDelete() {
    const deletedCode = deleteOrder.code
    setOrders((current) => current.filter((item) => item.code !== deleteOrder.code))
    setDeleteOrder(null)
    showToast?.({
      message: `Đơn hàng ${deletedCode} đã được xóa khỏi lưu trữ.`,
      title: 'Xóa đơn hàng thành công',
      tone: 'success',
    })
  }

  function openOrderVideo(order) {
    setSelectedOrder(order)
    showToast?.({
      message: `Đang mở video minh chứng của đơn ${order.code}.`,
      title: 'Mở video đơn hàng',
      tone: 'info',
    })
  }

  return (
    <>
      <div className="dashboard-page space-y-5 pb-6">
        <section className="glass-panel rounded-[30px] p-6 lg:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1 className="page-header-title">Lưu trữ đơn hàng</h1>
              <p className="page-header-subtitle">Tra cứu và quản lý video đóng gói theo mã đơn.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {channelFilters.map((filter, index) => (
                <FilterButton active={index === 0} key={filter}>
                  {filter}
                </FilterButton>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {summaryCards.map((card) => (
            <SummaryCard key={card.label} {...card} />
          ))}
        </section>

        <section className="flex flex-col gap-4 xl:flex-row">
          <label className="glass-card flex h-13 flex-1 items-center rounded-full px-5">
            <input className="w-full bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400" placeholder="Nhập mã đơn hàng..." type="text" />
          </label>

          <button className="motion-button flex h-13 items-center justify-center gap-3 rounded-full bg-blue-700 px-7 text-lg font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)] hover:bg-blue-800 xl:min-w-[156px]" onClick={() => setQrOpen(true)} type="button">
            <Icon className="filled text-[24px]" name="qr_code_scanner" />
            Quét QR
          </button>
        </section>

        <section className="glass-card overflow-hidden rounded-[30px]">
          <div className="hidden grid-cols-[1.25fr_1.55fr_0.9fr_1.15fr_0.8fr] gap-4 px-6 pb-2 pt-4 text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500 md:grid">
            <span>Mã đơn hàng</span>
            <span>Ngày đóng gói</span>
            <span>Nền tảng</span>
            <span>Khách hàng</span>
            <span className="text-right">Thao tác</span>
          </div>

          <div className="md:hidden">
            {visibleOrders.map((row, index) => (
              <article className={`px-5 py-4 ${index < visibleOrders.length - 1 ? 'border-b border-slate-900/12' : ''}`} key={`${row.code}-${index}-mobile`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-bold text-slate-900">{row.code}</p>
                    <p className="mt-1 text-sm text-slate-500">{row.packedAt}</p>
                  </div>
                  <PlatformBadge>{row.platform}</PlatformBadge>
                </div>
                <p className="mt-3 text-sm text-slate-700">{row.customer}</p>
                <div className="mt-4 flex justify-end gap-3">
                  <ActionButton icon="play_circle" onClick={() => openOrderVideo(row)} tone="primary" />
                  <ActionButton icon="delete" onClick={() => setDeleteOrder(row)} tone="danger" />
                </div>
              </article>
            ))}
          </div>

          <div className="hidden md:block">
            {visibleOrders.map((row, index) => (
              <div
                className={`grid grid-cols-[1.25fr_1.55fr_0.9fr_1.15fr_0.8fr] items-center gap-4 px-6 py-4 ${
                  index < visibleOrders.length - 1 ? 'border-b border-slate-900/12' : ''
                }`}
                key={`${row.code}-${index}`}
              >
                <p className="text-[18px] font-medium text-slate-900">{row.code}</p>
                <p className="text-[17px] text-slate-600">{row.packedAt}</p>
                <div>
                  <PlatformBadge>{row.platform}</PlatformBadge>
                </div>
                <p className="text-[17px] text-slate-700">{row.customer}</p>
                <div className="flex justify-end gap-3">
                  <ActionButton icon="play_circle" onClick={() => openOrderVideo(row)} tone="primary" />
                  <ActionButton icon="delete" onClick={() => setDeleteOrder(row)} tone="danger" />
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-4 sm:px-6">
            <Pagination
              currentPage={currentPage}
              itemLabel="đơn hàng"
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              totalItems={orders.length}
              totalPages={Math.ceil(orders.length / itemsPerPage)}
            />
          </div>
        </section>
      </div>

      {selectedOrder ? <OrderProofModal onClose={() => setSelectedOrder(null)} order={selectedOrder} /> : null}
      {deleteOrder ? <DeleteOrderModal onClose={() => setDeleteOrder(null)} onConfirm={confirmDelete} order={deleteOrder} /> : null}
      {qrOpen ? <QrScannerModal onClose={() => setQrOpen(false)} onScanned={openScannedOrder} /> : null}
    </>
  )
}
