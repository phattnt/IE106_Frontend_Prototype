import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon.jsx'

const profileMenuItems = [
  { id: 'staff', icon: 'person', label: 'Chỉnh sửa hồ sơ', target: 'self' },
  { id: 'settings', icon: 'settings', label: 'Cài đặt tài khoản' },
  { badge: 'Mới', id: 'settings', icon: 'verified', label: 'Nâng cấp gói cước', target: 'plans' },
]

const alertNotifications = [
  {
    description: 'Bộ nhớ lưu trữ đã dùng 86%, cần dọn cache hoặc nâng cấp gói.',
    icon: 'warning',
    id: 'storage',
    time: '10 phút trước',
    title: 'Cảnh báo: Bộ nhớ sắp đầy',
    tone: 'rose',
  },
  {
    description: 'Camera chính ngắt kết nối trong 2 phút, hệ thống đã chuyển sang camera dự phòng.',
    icon: 'videocam_off',
    id: 'camera',
    time: '18 phút trước',
    title: 'Camera đóng gói mất tín hiệu',
    tone: 'amber',
  },
  {
    description: 'Đơn #99821-Z có video minh chứng thiếu 12 giây cuối.',
    icon: 'error',
    id: 'video',
    time: '25 phút trước',
    title: 'Video minh chứng chưa hoàn chỉnh',
    tone: 'blue',
  },
  {
    description: 'Kho vận - HCM còn 8 đơn quá hạn chưa xác nhận đóng gói.',
    icon: 'inventory_2',
    id: 'late-orders',
    time: '42 phút trước',
    title: 'Đơn hàng quá hạn xử lý',
    tone: 'amber',
  },
  {
    description: 'Nhân viên ca chiều chưa check-in đủ theo lịch hôm nay.',
    icon: 'groups',
    id: 'staff-checkin',
    time: '1 giờ trước',
    title: 'Thiếu nhân sự trong ca làm',
    tone: 'emerald',
  },
]

const alertToneClass = {
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  rose: 'bg-rose-100 text-rose-700',
}

export function Topbar({ onLogout, onNavigate, profile, subscriptionTier = 'free' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const menuRef = useRef(null)
  const notificationRef = useRef(null)
  const planLabel = subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)
  const visibleNotifications = showAllNotifications ? alertNotifications : alertNotifications.slice(0, 3)

  useEffect(() => {
    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }

      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false)
        setShowAllNotifications(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setNotificationOpen(false)
        setShowAllNotifications(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function handleNavigate(page, target) {
    onNavigate(page, target)
    setMenuOpen(false)
  }

  function handleLogout() {
    setMenuOpen(false)
    onLogout?.()
  }

  function toggleNotifications() {
    setNotificationOpen((current) => !current)
    setMenuOpen(false)
    setShowAllNotifications(false)
  }

  return (
    <header className="dashboard-topbar glass-panel fixed left-4 right-4 top-4 z-40 flex min-h-16 items-center justify-between rounded-3xl px-4 py-3 lg:left-80 lg:right-6 lg:top-5 lg:justify-end lg:rounded-full lg:px-8">
      <div className="flex items-center gap-3 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white">
          <Icon className="filled" name="package_2" />
        </div>
        <div>
          <p className="font-bold leading-none">Kurifuri</p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-slate-500">Logistics</p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative" ref={notificationRef}>
          <button
            aria-label="Mở thông báo"
            className={`motion-button relative flex h-11 w-11 items-center justify-center rounded-full border transition ${
              notificationOpen
                ? 'border-blue-200 bg-white text-blue-700 shadow-[0_12px_28px_rgba(37,99,235,0.18)]'
                : 'border-transparent bg-white/35 text-slate-600 hover:border-white/80 hover:bg-white/72 hover:text-blue-700 hover:shadow-[0_12px_28px_rgba(42,76,130,0.12)]'
            }`}
            onClick={toggleNotifications}
            type="button"
          >
            <Icon name="notifications" />
            <span className="absolute right-0.5 top-0.5 flex h-3 w-3 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-red-500/25" />
              <span className="h-2 w-2 rounded-full bg-red-500 shadow-sm" />
            </span>
          </button>

          {notificationOpen ? (
            <div className="motion-dropdown fixed left-4 right-4 top-[112px] z-[140] max-h-[calc(100vh-132px)] overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] sm:left-auto sm:w-[420px] lg:right-6 lg:top-[116px]">
              <div className="px-6 py-5">
                <h2 className="text-[18px] font-semibold text-slate-950">Thông báo cảnh báo</h2>
              </div>

              <div className="max-h-[420px] space-y-1 overflow-y-auto px-4 pb-3">
                {visibleNotifications.map((item) => (
                  <article className="flex gap-4 rounded-2xl px-3 py-3 transition hover:bg-slate-50" key={item.id}>
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${alertToneClass[item.tone]}`}>
                      <Icon className="text-[21px]" name={item.icon} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-5 text-slate-950">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-700">{item.description}</p>
                      <p className="mt-1 text-xs text-slate-600">{item.time}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="border-t border-slate-900/8 px-5 py-4 text-center">
                <button
                  className="motion-button text-sm font-semibold text-blue-700 hover:text-blue-800"
                  onClick={() => setShowAllNotifications((current) => !current)}
                  type="button"
                >
                  {showAllNotifications ? 'Thu gọn thông báo' : 'Xem tất cả thông báo'}
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <button className="motion-button hidden h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:text-blue-700 sm:flex" type="button">
          <Icon name="help_outline" />
        </button>
        <button
          className="motion-button hidden h-10 items-center rounded-full bg-blue-50/80 px-4 text-xs font-bold text-blue-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:bg-white sm:inline-flex"
          onClick={() => onNavigate('settings', 'plans')}
          type="button"
        >
          {planLabel}
        </button>
        <div className="hidden h-8 w-px bg-slate-900/12 sm:block" />

        <div className="relative" ref={menuRef}>
          <button
            className="motion-button flex items-center gap-3 rounded-full px-1 py-1 transition hover:bg-white/35"
            onClick={() => setMenuOpen((current) => !current)}
            type="button"
          >
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-none">{profile.name}</p>
              <p className="mt-1 text-[11px] text-slate-600">{profile.title}</p>
            </div>
            <img alt="User profile" className="h-10 w-10 rounded-full object-cover shadow-sm" src={profile.avatar} />
          </button>

          {menuOpen ? (
            <div className="motion-dropdown absolute right-0 top-[calc(100%+16px)] z-[80] w-[320px] overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
              <div className="border-b border-slate-900/8 px-7 py-6">
                <p className="text-[18px] font-bold text-slate-950">{profile.name}</p>
                <p className="mt-1 text-sm uppercase tracking-[0.12em] text-slate-600">{profile.title}</p>
              </div>

              <div className="px-4 py-4">
                {profileMenuItems.map((item) => (
                  <button
                    className="motion-button flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50"
                    key={`${item.id}-${item.label}`}
                    onClick={() => handleNavigate(item.id, item.target)}
                    type="button"
                  >
                    <Icon className={item.id === 'settings' && item.label === 'Nâng cấp gói cước' ? 'text-blue-700' : 'text-slate-500'} name={item.icon} />
                    <span className="flex-1 text-[15px] font-semibold">{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{item.badge}</span>
                    ) : null}
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-900/8 px-4 py-4">
                <button className="motion-button flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-red-600 transition hover:bg-rose-50" onClick={handleLogout} type="button">
                  <Icon className="text-red-700" name="logout" />
                  <span className="text-[15px] font-semibold">Đăng xuất</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
