import { useEffect, useMemo, useState } from 'react'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { createPortal } from 'react-dom'
import { Line } from 'react-chartjs-2'
import { DropdownSelect } from '../components/DropdownSelect.jsx'
import { Icon } from '../components/Icon.jsx'
import { Pagination } from '../components/Pagination.jsx'
import { staffStatusStyles as statusStyles } from '../data/staffStatus.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const leaveDecisionStyles = {
  approved: {
    className: 'bg-emerald-100 text-emerald-800',
    label: 'Đã duyệt',
  },
  rejected: {
    className: 'bg-rose-100 text-rose-700',
    label: 'Từ chối',
  },
}

const roleOptions = ['Quản lý kho', 'Nhân viên kho', 'Giám sát kho']
const shiftOptions = ['Ca sáng', 'Ca chiều', 'Cả ngày']
const departmentOptions = ['Kho vận - HCM', 'Kho trung tâm - HN', 'Kho đóng gói - ĐN', 'Kho vận - Cần Thơ']
function createSeededValue(seed) {
  const next = Math.sin(seed * 12.9898) * 43758.5453
  return next - Math.floor(next)
}

function randomInt(seed, min, max) {
  return Math.round(min + createSeededValue(seed) * (max - min))
}

function buildWorkloadSeries(seed, length, min = 34, max = 82) {
  return Array.from({ length }, (_, index) => randomInt(seed * 13 + index + 1, min, max))
}

function buildPerformanceProfile(seed) {
  const workload = buildWorkloadSeries(seed, 14, 38, 84)
  const previousWorkload = buildWorkloadSeries(seed + 40, 30, 32, 86)
  const ordersPerHour = randomInt(seed * 7 + 2, 28, 48)
  const accuracyValue = (97.2 + createSeededValue(seed * 11 + 3) * 2.6).toFixed(1)
  const errorValue = (0.2 + createSeededValue(seed * 5 + 7) * 0.6).toFixed(1)
  const focus = randomInt(seed * 17 + 4, 46, 62)
  const support = randomInt(seed * 19 + 6, 18, 32)
  const remain = Math.max(100 - focus - support, 12)
  const correction = focus + support + remain - 100
  const label = ['Ổn định', 'Đang tăng', 'Cần theo dõi', 'Hiệu suất tốt'][seed % 4]

  return {
    workload,
    previousWorkload,
    ordersPerHour,
    ordersDelta: `+${randomInt(seed * 23 + 8, 1, 6)}`,
    accuracy: `${accuracyValue}%`,
    errorRate: `${errorValue}%`,
    errorDelta: `${(0.1 + createSeededValue(seed * 29 + 9) * 0.3).toFixed(1)}%`,
    performanceSplit: [focus, support, remain - correction],
    performanceLabel: label,
  }
}

const staffTemplates = [
  {
    name: 'Nguyễn Văn A',
    role: 'Giám sát kho',
    shift: 'Ca sáng',
    status: 'active',
    department: 'Kho vận - HCM',
    joinedAt: '12/03/2022',
    email: 'vana.nguyen@kurifuri.vn',
    phone: '+84 901 234 567',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    leaveRemaining: 12,
    leaveUsed: 3,
    leaveWithPermission: 5,
    leaveWithoutPermission: 0,
    accuracy: '99.8%',
    ordersPerHour: 45,
    ordersDelta: '+5',
    errorRate: '0.2%',
    errorDelta: '0.1%',
    workload: [56, 62, 44, 78, 51, 66, 31, 69, 55, 59, 41, 74],
  },
  {
    name: 'Trần Thị B',
    role: 'Quản lý kho',
    shift: 'Cả ngày',
    status: 'leave',
    department: 'Kho trung tâm - HN',
    joinedAt: '08/08/2021',
    email: 'thib.tran@kurifuri.vn',
    phone: '+84 936 772 118',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    leaveRemaining: 8,
    leaveUsed: 4,
    leaveWithPermission: 4,
    leaveWithoutPermission: 1,
    accuracy: '98.9%',
    ordersPerHour: 38,
    ordersDelta: '+2',
    errorRate: '0.4%',
    errorDelta: '0.1%',
    workload: [42, 48, 51, 63, 45, 57, 39, 60, 46, 52, 41, 58],
  },
  {
    name: 'Lê Văn C',
    role: 'Nhân viên kho',
    shift: 'Ca chiều',
    status: 'pending',
    department: 'Kho đóng gói - ĐN',
    joinedAt: '22/11/2023',
    email: 'vanc.le@kurifuri.vn',
    phone: '+84 903 556 201',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    leaveRemaining: 10,
    leaveUsed: 1,
    leaveWithPermission: 2,
    leaveWithoutPermission: 0,
    accuracy: '97.8%',
    ordersPerHour: 33,
    ordersDelta: '+3',
    errorRate: '0.6%',
    errorDelta: '0.2%',
    workload: [35, 41, 38, 47, 40, 49, 37, 53, 44, 46, 39, 50],
  },
  {
    name: 'Phạm Thị D',
    role: 'Nhân viên kho',
    shift: 'Ca sáng',
    status: 'active',
    department: 'Kho vận - Cần Thơ',
    joinedAt: '05/01/2023',
    email: 'thid.pham@kurifuri.vn',
    phone: '+84 978 220 419',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    leaveRemaining: 11,
    leaveUsed: 2,
    leaveWithPermission: 3,
    leaveWithoutPermission: 1,
    accuracy: '99.2%',
    ordersPerHour: 41,
    ordersDelta: '+4',
    errorRate: '0.3%',
    errorDelta: '0.1%',
    workload: [48, 52, 47, 58, 49, 61, 45, 63, 51, 56, 43, 64],
  },
]

const initialStaffRows = Array.from({ length: 20 }, (_, index) => {
  const template = staffTemplates[index % staffTemplates.length]
  const order = index + 1

  return {
    id: `staff-${order}`,
    code: `NV-${String(480 + order).padStart(4, '0')}`,
    ...template,
    gender: order % 2 === 0 ? 'Nữ' : 'Nam',
    identityNumber: `${String(100000000 + order).padStart(9, '0')}${order % 10}`,
    name: index < staffTemplates.length ? template.name : `${template.name} ${order}`,
    email: index < staffTemplates.length ? template.email : `nhanvien${order}@kurifuri.vn`,
    phone: `+84 9${String(10000000 + order).slice(0, 8)}`,
    ...buildPerformanceProfile(order),
  }
})

const leaveTemplates = [
  {
    type: 'Nghỉ bệnh',
    time: '2 ngày (15/10 - 16/10)',
    status: 'Chờ duyệt',
    statusClass: 'bg-amber-100 text-amber-700',
    reason: 'Điều trị sốt xuất huyết tại bệnh viện theo chỉ định của bác sĩ. Cần nghỉ ngơi tĩnh dưỡng 2 ngày.',
    attachment: 'giay_xac_nhan_y_te.pdf',
    leaveBalance: { total: '12 ngày', used: '2 ngày', remain: '10 ngày' },
    note: 'Cần bàn giao lại danh sách đơn tồn trước cuối ngày hôm nay.',
  },
  {
    type: 'Việc riêng',
    time: '1 ngày (18/10)',
    status: 'Đã duyệt',
    statusClass: 'bg-emerald-100 text-emerald-800',
    reason: 'Nghỉ phép 1 ngày để giải quyết công việc gia đình đã lên lịch từ trước.',
    attachment: 'don_xin_nghi_ca_nhan.pdf',
    leaveBalance: { total: '12 ngày', used: '4 ngày', remain: '8 ngày' },
    note: 'Đã được phê duyệt và sắp xếp nhân sự thay ca.',
  },
  {
    type: 'Nghỉ phép năm',
    time: '3 ngày (22/10 - 24/10)',
    status: 'Đã xong',
    statusClass: 'bg-slate-200 text-slate-700',
    reason: 'Sử dụng phép năm để nghỉ cùng gia đình theo kế hoạch đã đăng ký đầu tháng.',
    attachment: 'ke_hoach_nghi_phep.pdf',
    leaveBalance: { total: '12 ngày', used: '6 ngày', remain: '6 ngày' },
    note: 'Hoàn tất, đã quay lại làm việc đúng lịch.',
  },
]

const initialLeaveRows = Array.from({ length: 32 }, (_, index) => {
  const template = leaveTemplates[index % leaveTemplates.length]
  const staff = initialStaffRows[index % 4]

  return {
    id: `leave-${index + 1}`,
    code: `#LREQ-2024-${String(42 + index).padStart(4, '0')}`,
    createdAt: `${String(10 + (index % 18)).padStart(2, '0')}/10/2024`,
    role: `${staff.code} • ${staff.role}`,
    name: staff.name,
    avatar: staff.avatar,
    staffId: staff.id,
    ...template,
  }
})

const emptyEmployeeForm = {
  avatar: '',
  name: '',
  email: '',
  phone: '',
  identityNumber: '',
  gender: 'Nam',
  role: 'Quản lý kho',
  shift: 'Cả ngày',
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPhone(value) {
  return /^[+\d\s.-]{9,20}$/.test(value.trim())
}

function isValidIdentityNumber(value) {
  return /^\d{9,12}$/.test(value.trim())
}

function getLeaveDurationDays(timeText) {
  const matched = timeText.match(/(\d+)/)
  return matched ? Number.parseInt(matched[1], 10) : 1
}

function formatDate(value) {
  const day = `${value.getDate()}`.padStart(2, '0')
  const month = `${value.getMonth() + 1}`.padStart(2, '0')
  const year = value.getFullYear()

  return `${day}/${month}/${year}`
}

function ModalShell({ ariaLabel, children, maxWidth = 'max-w-[720px]', onClose }) {
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
      className="motion-overlay fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/28 px-4 py-8 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <div
        aria-label={ariaLabel}
        aria-modal="true"
        className={`motion-modal relative max-h-[92vh] w-full overflow-y-auto rounded-[32px] bg-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] ${maxWidth}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

function StatusPill({ children, className }) {
  return <span className={`inline-flex rounded-xl px-3 py-1.5 text-sm font-semibold ${className}`}>{children}</span>
}

function ClickablePersonCell({ avatar, name, onClick }) {
  return (
    <button className="motion-button flex items-center gap-3 rounded-2xl px-2 py-1 text-left" onClick={onClick} type="button">
      <img alt={name} className="h-10 w-10 rounded-full object-cover shadow-sm" src={avatar} />
      <span className="whitespace-nowrap text-sm font-bold text-slate-900 transition hover:text-blue-700">{name}</span>
    </button>
  )
}

function DetailButton({ onClick }) {
  return (
    <button
      className="motion-button ml-auto flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-blue-700 hover:text-blue-800"
      onClick={onClick}
      type="button"
    >
      <Icon className="text-[18px]" name="visibility" />
      Chi tiết
    </button>
  )
}

function DeleteEmployeeModal({ employee, onClose, onConfirm }) {
  return (
    <ModalShell ariaLabel={`Xác nhận xóa ${employee.name}`} maxWidth="max-w-[560px]" onClose={onClose}>
      <div className="px-8 pb-8 pt-10 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-rose-100">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <Icon className="text-[34px]" name="error" />
          </div>
        </div>

        <h2 className="mt-8 text-[22px] font-bold text-slate-950">Xác nhận xóa nhân viên</h2>
        <p className="mx-auto mt-4 max-w-[360px] text-[15px] leading-8 text-slate-600">
          Bạn có chắc chắn muốn xóa nhân viên này khỏi hệ thống không? Hành động này không thể hoàn tác.
        </p>

        <div className="mx-auto mt-8 flex max-w-[370px] items-center gap-4 rounded-[24px] border border-slate-900/10 bg-white p-5 text-left">
          <img alt={employee.name} className="h-16 w-16 rounded-full object-cover" src={employee.avatar} />
          <div>
            <p className="text-[24px] font-bold text-slate-950">{employee.name}</p>
            <p className="mt-1 text-[15px] text-slate-500">Mã NV: {employee.code}</p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button className="motion-button h-12 rounded-2xl px-7 text-sm font-semibold text-slate-700" onClick={onClose} type="button">
            Hủy
          </button>
          <button
            className="motion-button flex h-12 items-center gap-2 rounded-2xl bg-red-600 px-7 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(220,38,38,0.24)] hover:bg-red-700"
            onClick={() => onConfirm(employee.id)}
            type="button"
          >
            <Icon className="text-[18px]" name="delete" />
            Xóa nhân viên
          </button>
        </div>
      </div>

      <div className="border-t border-slate-900/12 px-8 py-5 text-center text-[15px] text-slate-600">
        Tài khoản này sẽ bị thu hồi quyền truy cập ngay lập tức.
      </div>
    </ModalShell>
  )
}

function AddEmployeeModal({
  form,
  formError,
  onClose,
  onAvatarUpload,
  onSubmit,
  onValueChange,
}) {
  const employeeSelectTriggerClass = '!h-12 !rounded-full !border-slate-300 !bg-white !text-slate-800 !shadow-none'

  return (
    <ModalShell ariaLabel="Thêm nhân viên mới" maxWidth="max-w-[640px]" onClose={onClose}>
      <div className="flex items-start justify-between border-b border-slate-900/12 px-6 py-6 sm:px-7">
        <div>
          <h2 className="text-[22px] font-bold text-slate-950">Thêm nhân viên mới</h2>
          <p className="mt-2 text-[15px] text-slate-500">Cung cấp thông tin chi tiết để tạo tài khoản nhân sự.</p>
        </div>
        <button className="motion-button modal-close-button-inline" onClick={onClose} type="button">
          <Icon className="text-[26px]" name="close" />
        </button>
      </div>

      <form className="flex min-h-0 flex-col" onSubmit={onSubmit}>
        <div className="space-y-6 px-6 py-7 pb-10 sm:px-7 sm:pb-12">
          <label className="motion-button flex cursor-pointer flex-col items-center bg-white px-6 py-8 text-center">
            <span className="relative block h-28 w-28">
              <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400">
                {form.avatar ? (
                  <img alt="Ảnh đại diện nhân viên mới" className="h-full w-full object-cover" src={form.avatar} />
                ) : (
                  <Icon className="text-[42px]" name="person_add" />
                )}
              </span>
              <span className="absolute bottom-0 right-0 z-10 flex h-10 w-10 translate-x-1 translate-y-1 items-center justify-center rounded-full border-4 border-white bg-blue-700 text-white shadow-[0_12px_22px_rgba(37,99,235,0.28)]">
                <Icon className="text-[18px]" name="photo_camera" />
              </span>
            </span>
            <span className="mt-5 block text-[15px] font-semibold text-slate-700">Tải lên ảnh đại diện</span>
            <span className="mt-1.5 block text-sm text-slate-400">
              {form.avatar ? 'Bấm để thay đổi ảnh đại diện.' : 'Hỗ trợ JPG, PNG, WEBP (tối đa 5MB)'}
            </span>
            <input accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onAvatarUpload} type="file" />
          </label>

          <div>
            <label className="mb-3 block text-[15px] font-medium text-slate-800" htmlFor="staff-name">
              Họ và tên
            </label>
            <input
              className="h-12 w-full rounded-full border border-slate-300 bg-white px-4 text-[15px] text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              id="staff-name"
              onChange={(event) => onValueChange('name', event.target.value)}
              placeholder="Nhập tên đầy đủ của nhân viên"
              type="text"
              value={form.name}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-3 block text-[15px] font-medium text-slate-800" htmlFor="staff-email">
                Email
              </label>
              <input
                className="h-12 w-full rounded-full border border-slate-300 bg-white px-4 text-[15px] text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                id="staff-email"
                onChange={(event) => onValueChange('email', event.target.value)}
                placeholder="example@vp.com"
                type="email"
                value={form.email}
              />
            </div>

            <div>
              <label className="mb-3 block text-[15px] font-medium text-slate-800" htmlFor="staff-phone">
                Số điện thoại
              </label>
              <input
                className="h-12 w-full rounded-full border border-slate-300 bg-white px-4 text-[15px] text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                id="staff-phone"
                onChange={(event) => onValueChange('phone', event.target.value)}
                placeholder="09xx xxx xxx"
                type="text"
                value={form.phone}
              />
            </div>

            <div>
              <label className="mb-3 block text-[15px] font-medium text-slate-800" htmlFor="staff-id-card">
                Số CMND/CCCD
              </label>
              <input
                className="h-12 w-full rounded-full border border-slate-300 bg-white px-4 text-[15px] text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                id="staff-id-card"
                onChange={(event) => onValueChange('identityNumber', event.target.value)}
                placeholder="Nhập số định danh"
                type="text"
                value={form.identityNumber}
              />
            </div>

            <div>
              <p className="mb-3 block text-[15px] font-medium text-slate-800">Giới tính</p>
              <div className="flex h-12 flex-wrap items-center gap-6">
                {['Nam', 'Nữ', 'Khác'].map((option) => (
                  <label className="flex items-center gap-2 text-[15px] text-slate-700" key={option}>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        form.gender === option ? 'border-blue-700 text-blue-700' : 'border-slate-400 text-transparent'
                      }`}
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-current" />
                    </span>
                    <input
                      checked={form.gender === option}
                      className="sr-only"
                      name="gender"
                      onChange={() => onValueChange('gender', option)}
                      type="radio"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-3 block text-[15px] font-medium text-slate-800">Chức vụ</label>
            <DropdownSelect
              onChange={(value) => onValueChange('role', value)}
              options={roleOptions.map((option) => ({ label: option, value: option }))}
              placement="top"
              triggerClassName={employeeSelectTriggerClass}
              value={form.role}
            />
          </div>

          <div>
            <label className="mb-3 block text-[15px] font-medium text-slate-800" htmlFor="staff-shift">
              Ca làm
            </label>
            <DropdownSelect
              onChange={(value) => onValueChange('shift', value)}
              options={shiftOptions.map((option) => ({ label: option, value: option }))}
              placeholder="Chọn ca làm"
              triggerClassName={employeeSelectTriggerClass}
              value={form.shift}
            />
          </div>

          {formError ? <p className="text-sm font-semibold text-red-600">{formError}</p> : null}
        </div>

        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-4 border-t border-slate-900/12 bg-white/96 px-6 py-5 backdrop-blur-md sm:px-7">
          <button className="motion-button h-11 rounded-2xl border border-slate-300 px-7 text-sm font-semibold text-slate-700" onClick={onClose} type="button">
            Hủy
          </button>
          <button
            className="motion-button flex h-11 items-center gap-2 rounded-2xl bg-blue-600 px-7 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(59,130,246,0.26)] hover:bg-blue-700"
            type="submit"
          >
            <Icon className="text-[18px]" name="person_add" />
            Thêm nhân viên
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function LeaveRequestModal({ canDecide = true, leave, onClose, onDecision }) {
  const [managerNote, setManagerNote] = useState(leave.note)
  const isPending = leave.status === 'Chờ duyệt'

  useEffect(() => {
    setManagerNote(leave.note)
  }, [leave.id, leave.note])

  return (
    <ModalShell ariaLabel={`Chi tiết đơn nghỉ phép ${leave.code}`} maxWidth="max-w-[680px]" onClose={onClose}>
      <button
        className="motion-button modal-close-button"
        onClick={onClose}
        type="button"
      >
        <Icon name="close" />
      </button>

      <div className="border-b border-slate-900/12 px-8 py-6">
        <h2 className="text-[24px] font-bold text-slate-950">Chi tiết đơn nghỉ phép</h2>
        <p className="mt-2 text-[15px] text-slate-500">
          Mã đơn: {leave.code} • Ngày tạo: {leave.createdAt}
        </p>
      </div>

      <div className="space-y-6 px-8 py-6">
        <section className="rounded-[24px] border border-slate-900/8 bg-white p-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex items-center gap-4">
              <img alt={leave.name} className="h-14 w-14 rounded-full object-cover" src={leave.avatar} />
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Nhân viên</p>
                <p className="mt-1 text-[18px] font-bold text-slate-950">{leave.name}</p>
              </div>
            </div>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Mã NV / Chức vụ</p>
              <p className="mt-1 text-[18px] font-bold text-slate-950">{leave.role}</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Loại đơn</p>
            <p className="mt-2 text-[18px] font-bold text-slate-950">{leave.type}</p>
          </div>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Thời gian</p>
            <p className="mt-2 text-[18px] font-bold text-slate-950">{leave.time}</p>
          </div>
        </section>

        <section>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Lý do chi tiết</p>
          <div className="mt-3 rounded-[20px] border border-slate-900/8 bg-white p-4 text-[15px] leading-7 text-slate-700">
            {leave.reason}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Tài liệu đính kèm</p>
            <button className="motion-button mt-3 flex items-center gap-3 rounded-[18px] border border-slate-900/8 bg-white px-3 py-3 text-blue-700 hover:bg-blue-50/70" type="button">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
                <Icon className="text-[18px]" name="description" />
              </span>
              <span className="text-sm font-semibold">{leave.attachment}</span>
            </button>
          </div>

          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Thông tin quỹ phép</p>
            <div className="mt-3 space-y-2 text-[15px]">
              <div className="flex items-center justify-between border-b border-slate-900/8 pb-2 text-slate-600">
                <span>Tổng cộng:</span>
                <span className="font-semibold text-slate-950">{leave.leaveBalance.total}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900/8 pb-2 text-slate-600">
                <span>Đã sử dụng:</span>
                <span className="font-semibold text-slate-950">{leave.leaveBalance.used}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Còn lại:</span>
                <span className="font-semibold text-emerald-600">{leave.leaveBalance.remain}</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Ghi chú của quản lý</p>
          <textarea
            className="mt-3 min-h-24 w-full rounded-[20px] border border-slate-900/8 bg-white p-4 text-[15px] text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 disabled:bg-slate-50 disabled:text-slate-500"
            disabled={!canDecide}
            onChange={(event) => setManagerNote(event.target.value)}
            placeholder="Nhập ghi chú xử lý đơn nghỉ"
            value={managerNote}
          />
        </section>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-900/12 px-8 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-[15px] text-slate-600">
          <span>Trạng thái:</span>
          <StatusPill className={leave.statusClass}>{leave.status}</StatusPill>
        </div>
        {canDecide ? (
          <div className="flex items-center gap-3">
            <button
              className="motion-button h-11 rounded-2xl border border-slate-300 px-6 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!isPending}
              onClick={() => onDecision(leave, 'rejected', managerNote)}
              type="button"
            >
              Từ chối
            </button>
            <button
              className="motion-button h-11 rounded-2xl bg-blue-700 px-6 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)] hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
              disabled={!isPending}
              onClick={() => onDecision(leave, 'approved', managerNote)}
              type="button"
            >
              Phê duyệt
            </button>
          </div>
        ) : (
          <button
            className="motion-button h-11 rounded-2xl bg-blue-700 px-6 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)] hover:bg-blue-800"
            onClick={onClose}
            type="button"
          >
            Đóng
          </button>
        )}
      </div>
    </ModalShell>
  )
}

function CreateLeaveRequestModal({ onClose, onSubmit, showToast, staff }) {
  const [type, setType] = useState('Nghỉ phép năm')
  const [time, setTime] = useState('1 ngày (22/10)')
  const [reason, setReason] = useState('')
  const [attachmentFile, setAttachmentFile] = useState(null)
  const [formError, setFormError] = useState('')

  function handleAttachmentChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    const allowedExtensions = /\.(pdf|jpe?g|png|webp)$/i.test(file.name)

    if (!allowedTypes.includes(file.type) && !allowedExtensions) {
      setFormError('Tệp đính kèm chỉ hỗ trợ PDF, JPG, PNG hoặc WEBP.')
      showToast?.({ message: 'Tệp đính kèm chỉ hỗ trợ PDF, JPG, PNG hoặc WEBP.', title: 'Tệp không hợp lệ', tone: 'error' })
      event.target.value = ''
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setFormError('Tệp đính kèm không được vượt quá 10MB.')
      showToast?.({ message: 'Dung lượng tệp đính kèm vượt quá 10MB.', title: 'Tệp quá lớn', tone: 'error' })
      event.target.value = ''
      return
    }

    setAttachmentFile(file)
    setFormError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!time.trim()) {
      setFormError('Cần nhập thời gian nghỉ.')
      showToast?.({ message: 'Vui lòng nhập thời gian nghỉ trước khi gửi đơn.', title: 'Thiếu thời gian nghỉ', tone: 'error' })
      return
    }

    if (!reason.trim()) {
      setFormError('Cần nhập lý do nghỉ phép.')
      showToast?.({ message: 'Vui lòng nhập lý do nghỉ phép trước khi gửi đơn.', title: 'Thiếu lý do nghỉ', tone: 'error' })
      return
    }

    setFormError('')
    onSubmit({
      attachment: attachmentFile?.name ?? 'Không có tệp đính kèm',
      reason: reason.trim(),
      time: time.trim(),
      type,
    })
  }

  return (
    <ModalShell ariaLabel={`Tạo đơn nghỉ phép cho ${staff.name}`} maxWidth="max-w-[620px]" onClose={onClose}>
      <div className="flex items-start justify-between border-b border-slate-900/12 px-6 py-6 sm:px-7">
        <div>
          <h2 className="text-[22px] font-bold text-slate-950">Tạo đơn nghỉ phép</h2>
          <p className="mt-2 text-[15px] text-slate-500">{staff.name} · {staff.code}</p>
        </div>
        <button className="motion-button modal-close-button-inline" onClick={onClose} type="button">
          <Icon className="text-[26px]" name="close" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-6 py-6 sm:px-7">
          <div>
            <p className="mb-3 text-[15px] font-medium text-slate-800">Loại đơn</p>
            <DropdownSelect
              onChange={setType}
              options={['Nghỉ phép năm', 'Nghỉ bệnh', 'Việc riêng'].map((option) => ({ label: option, value: option }))}
              value={type}
            />
          </div>

          <label className="block">
            <span className="mb-3 block text-[15px] font-medium text-slate-800">Thời gian nghỉ</span>
            <input
              className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-[15px] text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              onChange={(event) => setTime(event.target.value)}
              placeholder="Ví dụ: 1 ngày (22/10)"
              type="text"
              value={time}
            />
          </label>

          <label className="block">
            <span className="mb-3 block text-[15px] font-medium text-slate-800">Lý do chi tiết</span>
            <textarea
              className="min-h-28 w-full rounded-[20px] border border-slate-300 bg-white p-4 text-[15px] leading-7 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
              onChange={(event) => setReason(event.target.value)}
              placeholder="Nhập lý do nghỉ phép"
              value={reason}
            />
          </label>

          <div>
            <span className="mb-3 block text-[15px] font-medium text-slate-800">Tệp đính kèm</span>
            <label className="motion-button flex cursor-pointer items-center gap-4 rounded-[20px] border border-dashed border-slate-300 bg-white p-4 hover:border-blue-300 hover:bg-blue-50/50">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Icon className="text-[22px]" name={attachmentFile ? 'description' : 'upload_file'} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-900">
                  {attachmentFile ? attachmentFile.name : 'Chọn tệp đính kèm'}
                </span>
                <span className="mt-1 block text-xs text-slate-500">PDF, JPG, PNG hoặc WEBP, tối đa 10MB.</span>
              </span>
              <span className="hidden rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm sm:inline-flex">
                {attachmentFile ? 'Đổi tệp' : 'Tải lên'}
              </span>
              <input
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={handleAttachmentChange}
                type="file"
              />
            </label>
            {attachmentFile ? (
              <button
                className="motion-button mt-3 text-sm font-semibold text-red-600 hover:text-red-700"
                onClick={() => setAttachmentFile(null)}
                type="button"
              >
                Xóa tệp đã chọn
              </button>
            ) : null}
          </div>

          {formError ? <p className="text-sm font-semibold text-red-600">{formError}</p> : null}
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-slate-900/12 px-6 py-5 sm:px-7">
          <button className="motion-button h-11 rounded-2xl border border-slate-300 px-6 text-sm font-semibold text-slate-700" onClick={onClose} type="button">
            Hủy
          </button>
          <button className="motion-button h-11 rounded-2xl bg-blue-700 px-6 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)] hover:bg-blue-800" type="submit">
            Gửi đơn
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

function EmployeeDetailPage({
  canManage = true,
  embedded = false,
  leaveRows,
  onBack,
  onCreateLeave,
  onDelete,
  onSave,
  onOpenLeave,
  showBack = true,
  showToast,
  staff,
}) {
  const [draft, setDraft] = useState(staff)
  const [saveError, setSaveError] = useState('')
  const [saveLabel, setSaveLabel] = useState('Lưu thay đổi')
  const [leaveHistoryPage, setLeaveHistoryPage] = useState(1)
  const [chartMode, setChartMode] = useState('current')
  const staffLeaves = leaveRows.filter((leave) => leave.staffId === staff.id)
  const leaveHistoryPerPage = 5
  const visibleLeaveHistory = staffLeaves.slice((leaveHistoryPage - 1) * leaveHistoryPerPage, leaveHistoryPage * leaveHistoryPerPage)
  const chartData = chartMode === 'previous' ? draft.previousWorkload : draft.workload
  const chartLabels = chartData.map((_, index) => `Ngày ${index + 1}`)
  const chartTone =
    chartMode === 'previous'
      ? {
          fillMiddle: 'rgba(100, 116, 139, 0.08)',
          fillTop: 'rgba(71, 85, 105, 0.22)',
          line: '#475569',
        }
      : {
          fillMiddle: 'rgba(96, 165, 250, 0.08)',
          fillTop: 'rgba(37, 99, 235, 0.22)',
          line: '#2563eb',
        }
  const detailInputClass =
    'mt-3 h-11 w-full rounded-2xl border border-white/70 bg-white/65 px-4 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(42,76,130,0.08)] outline-none transition focus:border-slate-900/70 focus:bg-white focus:ring-2 focus:ring-slate-900/8'
  const detailStaticFieldClass =
    'mt-3 flex h-11 items-center rounded-2xl border border-white/70 bg-white/65 px-4 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(42,76,130,0.08)]'
  const performanceChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Đơn xử lý',
        data: chartData,
        borderColor: chartTone.line,
        borderWidth: 3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: chartTone.line,
        pointBorderWidth: 2,
        pointHoverBackgroundColor: chartTone.line,
        pointHoverBorderColor: '#ffffff',
        pointHoverRadius: 7,
        pointRadius: chartMode === 'previous' ? 2 : 4,
        fill: true,
        tension: 0.42,
        backgroundColor: (context) => {
          const chart = context.chart
          const { chartArea, ctx } = chart

          if (!chartArea) {
            return 'rgba(37, 99, 235, 0.12)'
          }

          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, chartTone.fillTop)
          gradient.addColorStop(0.65, chartTone.fillMiddle)
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
          return gradient
        },
      },
    ],
  }
  const performanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 650,
      easing: 'easeOutQuart',
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255,255,255,0.14)',
        borderWidth: 1,
        cornerRadius: 14,
        displayColors: false,
        padding: 12,
        titleColor: '#cbd5e1',
        callbacks: {
          label: (context) => `${context.parsed.y} đơn`,
        },
      },
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: true,
          color: '#64748b',
          font: {
            size: 12,
            weight: 600,
          },
          maxRotation: 0,
          callback: function tickLabel(value, index) {
            if (chartMode === 'previous') {
              return [0, 9, 19, 29].includes(index) ? `Ngày ${index + 1}` : ''
            }

            return index === 0 || index === Math.floor(chartData.length / 2) || index === chartData.length - 1
              ? index === chartData.length - 1
                ? 'Hôm nay'
                : `Ngày ${index + 1}`
              : ''
          },
        },
      },
      y: {
        border: {
          display: false,
        },
        grid: {
          color: 'rgba(15, 23, 42, 0.08)',
          drawTicks: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            weight: 600,
          },
          padding: 12,
        },
      },
    },
  }

  useEffect(() => {
    setDraft(staff)
    setSaveError('')
    setSaveLabel('Lưu thay đổi')
    setLeaveHistoryPage(1)
  }, [staff])

  function updateDraft(field, value) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }))
    setSaveError('')
    setSaveLabel('Lưu thay đổi')
  }

  function handleSave() {
    if (!draft.name.trim()) {
      setSaveError('Cần nhập họ và tên nhân viên.')
      showToast?.({ message: 'Vui lòng nhập họ và tên nhân viên trước khi lưu.', title: 'Thiếu họ tên', tone: 'error' })
      return
    }

    if (!isValidEmail(draft.email)) {
      setSaveError('Email chưa đúng định dạng.')
      showToast?.({ message: 'Email liên hệ chưa đúng định dạng.', title: 'Email không hợp lệ', tone: 'error' })
      return
    }

    if (!isValidPhone(draft.phone)) {
      setSaveError('Số điện thoại chưa đúng định dạng.')
      showToast?.({ message: 'Số điện thoại phải có từ 9 đến 20 ký tự hợp lệ.', title: 'Số điện thoại không hợp lệ', tone: 'error' })
      return
    }

    if (!draft.shift && draft.role !== 'Quản lý kho') {
      setSaveError('Cần chọn ca làm việc cho nhân viên.')
      showToast?.({ message: 'Vui lòng chọn ca làm việc cho nhân viên.', title: 'Thiếu ca làm việc', tone: 'error' })
      return
    }

    setSaveError('')
    onSave(draft)
    setSaveLabel('Đã lưu')
    showToast?.({
      message: `Thông tin của ${draft.name} đã được cập nhật.`,
      title: 'Lưu nhân viên thành công',
      tone: 'success',
    })
  }

  return (
    <div className={embedded ? 'space-y-6' : 'dashboard-page page-scroll-pad-sm space-y-6'}>
      {showBack ? (
        <button
          className="motion-button inline-flex h-10 items-center gap-2 rounded-full bg-white/70 px-5 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(42,76,130,0.08)]"
          onClick={onBack}
          type="button"
        >
          <Icon className="text-[18px]" name="arrow_back" />
          Quay lại
        </button>
      ) : null}

      <section className="glass-panel rounded-[34px] p-6 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative">
              <div className="rounded-full bg-white p-1 shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
                <img alt={draft.name} className="h-24 w-24 rounded-full object-cover" src={draft.avatar} />
              </div>
            </div>

            <div className="space-y-4">
              <input
                className="w-full bg-transparent text-[36px] font-semibold leading-none tracking-[-0.03em] text-slate-950 outline-none sm:text-[42px]"
                onChange={(event) => updateDraft('name', event.target.value)}
                type="text"
                value={draft.name}
              />
              <div className="flex flex-wrap items-center gap-3">
                <DropdownSelect
                  className="w-[168px]"
                  onChange={(value) => updateDraft('role', value)}
                  options={roleOptions.map((option) => ({ label: option, value: option }))}
                  value={draft.role}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="motion-button h-11 rounded-2xl bg-blue-700 px-6 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)] hover:bg-blue-800"
              onClick={handleSave}
              type="button"
            >
              {saveLabel}
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Email liên hệ</p>
            <input
              className={detailInputClass}
              onChange={(event) => updateDraft('email', event.target.value)}
              type="email"
              value={draft.email}
            />
          </div>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Số điện thoại</p>
            <input
              className={detailInputClass}
              onChange={(event) => updateDraft('phone', event.target.value)}
              type="text"
              value={draft.phone}
            />
          </div>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Bộ phận / kho</p>
            <DropdownSelect
              className="mt-3"
              onChange={(value) => updateDraft('department', value)}
              options={departmentOptions.map((option) => ({ label: option, value: option }))}
              value={draft.department}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Ca làm việc</p>
            <DropdownSelect
              className="mt-3"
              onChange={(value) => updateDraft('shift', value)}
              options={shiftOptions.map((option) => ({ label: option, value: option }))}
              value={draft.shift}
            />
          </div>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Ngày gia nhập</p>
            <div className={detailStaticFieldClass}>
              <div className="flex w-full items-center gap-3">
                <Icon className="text-[18px] text-slate-400" name="calendar_today" />
                <input
                  className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none"
                  onChange={(event) => updateDraft('joinedAt', event.target.value)}
                  type="text"
                  value={draft.joinedAt}
                />
              </div>
            </div>
          </div>
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Mã nhân viên</p>
            <div className={detailStaticFieldClass}>
              <Icon className="text-[18px] text-slate-400" name="badge" />
              {draft.code}
            </div>
          </div>
        </div>

        {saveError ? <p className="mt-6 text-sm font-semibold text-red-600">{saveError}</p> : null}
      </section>

      <section className="glass-panel rounded-[34px] p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[24px] font-semibold text-slate-950">Biểu đồ hiệu suất 30 ngày</h2>
            <p className="mt-2 text-[15px] text-slate-500">Theo dõi hiệu suất hằng ngày.</p>
          </div>
          <div className="inline-flex rounded-2xl border border-slate-900/10 bg-slate-100/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
            <button
              aria-pressed={chartMode === 'current'}
              className={`motion-button h-10 rounded-xl px-5 text-sm font-semibold ${
                chartMode === 'current'
                  ? 'bg-blue-700 text-white shadow-[0_10px_22px_rgba(37,99,235,0.24)]'
                  : 'bg-white/55 text-slate-600 hover:bg-white hover:text-blue-700'
              }`}
              onClick={() => setChartMode('current')}
              type="button"
            >
              Tháng này
            </button>
            <button
              aria-pressed={chartMode === 'previous'}
              className={`motion-button h-10 rounded-xl px-5 text-sm font-semibold ${
                chartMode === 'previous'
                  ? 'bg-slate-800 text-white shadow-[0_10px_22px_rgba(15,23,42,0.20)]'
                  : 'bg-white/55 text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
              onClick={() => setChartMode('previous')}
              type="button"
            >
              Tháng trước
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="relative h-[340px] overflow-hidden rounded-[28px] border border-white/30 bg-transparent px-2 py-2">
            <Line data={performanceChartData} options={performanceChartOptions} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.02fr_1fr]">
        <section className="glass-panel rounded-[34px] p-6 sm:p-8">
          <h2 className="text-[24px] font-semibold text-slate-950">Thông tin nghỉ phép</h2>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-white/45 p-5">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Ngày phép còn lại</p>
              <p className="mt-3 text-[26px] font-bold text-blue-800">{String(draft.leaveRemaining).padStart(2, '0')} ngày</p>
            </div>
            <div className="rounded-[24px] bg-white/45 p-5">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Đã sử dụng</p>
              <p className="mt-3 text-[26px] font-bold text-slate-700">{String(draft.leaveUsed).padStart(2, '0')} ngày</p>
            </div>
            <div className="rounded-[24px] bg-white/45 p-5">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Vắng có phép</p>
              <p className="mt-3 text-[26px] font-bold text-emerald-700">{String(draft.leaveWithPermission).padStart(2, '0')} ngày</p>
            </div>
            <div className="rounded-[24px] bg-white/45 p-5">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Vắng không phép</p>
              <p className="mt-3 text-[26px] font-bold text-rose-700">{String(draft.leaveWithoutPermission)} ngày</p>
            </div>
          </div>

        </section>

        <section className="glass-panel rounded-[34px] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[24px] font-semibold text-slate-950">Chi tiết hiệu suất</h2>
            <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">↗ {draft.ordersDelta} so với tháng trước</span>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Tỷ lệ chính xác</p>
              <p className="text-[20px] font-bold text-blue-800">{draft.accuracy}</p>
            </div>
            <div className="mt-4 h-2 rounded-full bg-blue-100">
              <div className="h-2 rounded-full bg-blue-800" style={{ width: draft.accuracy }} />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Đơn hàng / giờ</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-[30px] font-bold leading-none text-slate-950">{draft.ordersPerHour}</span>
                <span className="text-sm font-semibold text-emerald-600">▲ {draft.ordersDelta}</span>
              </div>
            </div>

            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Tỷ lệ đóng gói lỗi</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-[30px] font-bold leading-none text-slate-950">{draft.errorRate}</span>
                <span className="text-sm font-semibold text-emerald-600">▼ {draft.errorDelta}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-900/12 pt-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500">Phân bổ thời gian</p>
            <div className="mt-5 h-4 overflow-hidden rounded-full bg-blue-100">
              <div className="flex h-full">
                <div className="bg-blue-800" style={{ width: `${draft.performanceSplit[0]}%` }} />
                <div className="bg-blue-400" style={{ width: `${draft.performanceSplit[1]}%` }} />
                <div className="bg-blue-200" style={{ width: `${draft.performanceSplit[2]}%` }} />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-6 text-sm font-medium text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-800" />
                Đóng gói
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-400" />
                Kiểm hàng
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-200" />
                Dán nhãn
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className="glass-panel rounded-[34px] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[24px] font-semibold text-slate-950">Lịch sử yêu cầu nghỉ phép</h2>
            <p className="mt-2 text-[15px] text-slate-500">Theo dõi các yêu cầu nghỉ phép của nhân viên.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {onCreateLeave ? (
              <button
                className="motion-button flex h-11 items-center gap-2 rounded-2xl bg-blue-700 px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)] hover:bg-blue-800"
                onClick={onCreateLeave}
                type="button"
              >
                <Icon className="text-[18px]" name="add" />
                Tạo đơn nghỉ phép
              </button>
            ) : null}
            <span className="inline-flex rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-slate-600">
              {staffLeaves.length} yêu cầu
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {visibleLeaveHistory.map((leave) => (
            <article className="rounded-[22px] bg-white/45 px-5 py-4" key={leave.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[15px] font-semibold text-slate-900">{leave.type}</p>
                  <p className="mt-1 text-sm text-slate-500">{leave.time}</p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <StatusPill className={leave.statusClass}>{leave.status}</StatusPill>
                  <button
                    className="motion-button text-sm font-semibold text-blue-700 hover:text-blue-800"
                    onClick={() => onOpenLeave(leave)}
                    type="button"
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <Pagination
          currentPage={leaveHistoryPage}
          itemLabel="yêu cầu"
          itemsPerPage={leaveHistoryPerPage}
          onPageChange={setLeaveHistoryPage}
          totalItems={staffLeaves.length}
          totalPages={Math.ceil(staffLeaves.length / leaveHistoryPerPage)}
        />
      </section>
    </div>
  )
}

export function StaffPage({ onProfileChange, profile, showToast, staffTarget }) {
  const [staffRows, setStaffRows] = useState(initialStaffRows)
  const [leaveRows, setLeaveRows] = useState(initialLeaveRows)
  const [staffViewMode, setStaffViewMode] = useState('manager')
  const [staffSearch, setStaffSearch] = useState('')
  const [selectedLeaveId, setSelectedLeaveId] = useState(null)
  const [selectedStaffId, setSelectedStaffId] = useState(null)
  const [leaveCreateTarget, setLeaveCreateTarget] = useState(null)
  const [staffPage, setStaffPage] = useState(1)
  const [leavePage, setLeavePage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [employeeForm, setEmployeeForm] = useState(emptyEmployeeForm)
  const [employeeFormError, setEmployeeFormError] = useState('')

  const staffPerPage = 10
  const leavePerPage = 2
  const selectedLeave = useMemo(() => leaveRows.find((leave) => leave.id === selectedLeaveId) ?? null, [leaveRows, selectedLeaveId])
  const visibleLeaveRows = leaveRows.slice((leavePage - 1) * leavePerPage, leavePage * leavePerPage)
  const normalizedStaffSearch = staffSearch.trim().toLowerCase()
  const filteredStaffRows = useMemo(() => {
    if (!normalizedStaffSearch) {
      return staffRows
    }

    return staffRows.filter((staff) =>
      [staff.name, staff.email, staff.code, staff.role, staff.shift].some((value) => value.toLowerCase().includes(normalizedStaffSearch))
    )
  }, [normalizedStaffSearch, staffRows])
  const visibleStaffRows = filteredStaffRows.slice((staffPage - 1) * staffPerPage, staffPage * staffPerPage)
  const employeeSelf = useMemo(() => {
    const profileRole = roleOptions.includes(profile?.title) ? profile.title : 'Quản lý kho'
    const profileDepartment = departmentOptions.includes(profile?.department) ? profile.department : 'Kho vận - HCM'

    return {
      id: 'profile-self',
      code: 'QL-0001',
      name: profile?.name ?? 'Quản lý',
      role: profileRole,
      shift: 'Cả ngày',
      status: 'active',
      department: profileDepartment,
      joinedAt: '12/03/2022',
      email: profile?.email ?? '',
      phone: profile?.phone ?? '',
      avatar: profile?.avatar ?? '',
      gender: 'Nam',
      identityNumber: '100000001',
      leaveRemaining: 12,
      leaveUsed: 3,
      leaveWithPermission: 5,
      leaveWithoutPermission: 0,
      ...buildPerformanceProfile(88),
    }
  }, [profile])
  const selectedStaff = useMemo(() => {
    if (selectedStaffId === employeeSelf.id) {
      return employeeSelf
    }

    return staffRows.find((staff) => staff.id === selectedStaffId) ?? null
  }, [employeeSelf, selectedStaffId, staffRows])
  const isSelfProfileSelected = selectedStaff?.id === employeeSelf.id

  useEffect(() => {
    if (!selectedStaffId) {
      return
    }

    if (selectedStaffId === employeeSelf.id) {
      return
    }

    const stillExists = staffRows.some((staff) => staff.id === selectedStaffId)

    if (!stillExists) {
      setSelectedStaffId(null)
    }
  }, [employeeSelf.id, selectedStaffId, staffRows])

  useEffect(() => {
    setStaffPage(1)
  }, [normalizedStaffSearch])

  useEffect(() => {
    const nextTotalPages = Math.max(1, Math.ceil(filteredStaffRows.length / staffPerPage))

    if (staffPage > nextTotalPages) {
      setStaffPage(nextTotalPages)
    }
  }, [filteredStaffRows.length, staffPage])

  useEffect(() => {
    if (!staffTarget) {
      return
    }

    setSelectedStaffId(staffTarget.id === 'self' ? employeeSelf.id : null)
    setSelectedLeaveId(null)
    setLeaveCreateTarget(null)
    setStaffViewMode('manager')
  }, [employeeSelf.id, staffTarget])

  function openEmployeeDetail(staff) {
    setSelectedStaffId(staff.id)
  }

  function updateEmployeeForm(field, value) {
    setEmployeeForm((current) => {
      const nextForm = {
        ...current,
        [field]: value,
      }

      if (field === 'role' && value === 'Quản lý kho') {
        nextForm.shift = 'Cả ngày'
      }

      if (field === 'role' && current.role === 'Quản lý kho' && value !== 'Quản lý kho') {
        nextForm.shift = ''
      }

      return nextForm
    })
    setEmployeeFormError('')
  }

  function handleEmployeeAvatarUpload(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setEmployeeFormError('Ảnh đại diện chỉ hỗ trợ JPG, PNG hoặc WEBP.')
      showToast?.({
        message: 'Ảnh đại diện chỉ hỗ trợ JPG, PNG hoặc WEBP.',
        title: 'Ảnh không hợp lệ',
        tone: 'error',
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setEmployeeFormError('Ảnh đại diện không được vượt quá 5MB.')
      showToast?.({
        message: 'Dung lượng ảnh đại diện vượt quá 5MB.',
        title: 'Ảnh quá lớn',
        tone: 'error',
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setEmployeeForm((current) => ({
        ...current,
        avatar: typeof reader.result === 'string' ? reader.result : '',
      }))
      setEmployeeFormError('')
    }
    reader.readAsDataURL(file)
  }

  function handleAddEmployee(event) {
    event.preventDefault()

    const normalizedName = employeeForm.name.trim()
    const normalizedEmail = employeeForm.email.trim()
    const normalizedPhone = employeeForm.phone.trim()
    const normalizedIdentity = employeeForm.identityNumber.trim()

    if (!normalizedName) {
      setEmployeeFormError('Cần nhập họ và tên nhân viên.')
      showToast?.({ message: 'Vui lòng nhập họ và tên nhân viên.', title: 'Thiếu họ tên', tone: 'error' })
      return
    }

    if (!isValidEmail(normalizedEmail)) {
      setEmployeeFormError('Email chưa đúng định dạng.')
      showToast?.({ message: 'Email nhân viên chưa đúng định dạng.', title: 'Email không hợp lệ', tone: 'error' })
      return
    }

    if (!isValidPhone(normalizedPhone)) {
      setEmployeeFormError('Số điện thoại chưa đúng định dạng.')
      showToast?.({ message: 'Số điện thoại phải có từ 9 đến 20 ký tự hợp lệ.', title: 'Số điện thoại không hợp lệ', tone: 'error' })
      return
    }

    if (!isValidIdentityNumber(normalizedIdentity)) {
      setEmployeeFormError('CMND/CCCD phải gồm 9 đến 12 chữ số.')
      showToast?.({ message: 'CMND/CCCD phải gồm 9 đến 12 chữ số.', title: 'Số định danh không hợp lệ', tone: 'error' })
      return
    }

    const nextIndex = staffRows.length + 1
    const role = employeeForm.role || 'Nhân viên kho'
    const performanceProfile = buildPerformanceProfile(nextIndex + 30)
    const nextStaff = {
      id: `staff-${Date.now()}`,
      code: `NV-${String(480 + nextIndex).padStart(4, '0')}`,
      name: normalizedName,
      role,
      shift: role === 'Quản lý kho' ? 'Cả ngày' : employeeForm.shift || shiftOptions[0],
      status: 'pending',
      department: 'Kho vận - HCM',
      joinedAt: '20/05/2026',
      email: normalizedEmail,
      phone: normalizedPhone,
      avatar: employeeForm.avatar || 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=200&q=80',
      gender: employeeForm.gender,
      identityNumber: normalizedIdentity,
      leaveRemaining: 12,
      leaveUsed: 0,
      leaveWithPermission: 1,
      leaveWithoutPermission: 0,
      ...performanceProfile,
    }

    setStaffRows((current) => [nextStaff, ...current])
    setStaffPage(1)
    setEmployeeForm(emptyEmployeeForm)
    setEmployeeFormError('')
    setIsAddModalOpen(false)
    showToast?.({
      message: `${nextStaff.name} đã được thêm vào danh sách nhân viên.`,
      title: 'Thêm nhân viên thành công',
      tone: 'success',
    })
  }

  function handleDeleteEmployee(employeeId) {
    const deletedStaff = staffRows.find((staff) => staff.id === employeeId)
    setStaffRows((current) => current.filter((staff) => staff.id !== employeeId))
    setDeleteTarget(null)
    setSelectedStaffId((current) => (current === employeeId ? null : current))
    showToast?.({
      message: deletedStaff ? `${deletedStaff.name} đã bị xóa khỏi hệ thống.` : 'Nhân viên đã bị xóa khỏi hệ thống.',
      title: 'Xóa nhân viên thành công',
      tone: 'success',
    })
  }

  function handleSaveEmployee(updatedStaff) {
    if (updatedStaff.id === employeeSelf.id) {
      onProfileChange?.((current) => ({
        ...current,
        avatar: updatedStaff.avatar,
        department: updatedStaff.department,
        email: updatedStaff.email,
        name: updatedStaff.name,
        phone: updatedStaff.phone,
        title: updatedStaff.role,
      }))
      return
    }

    setStaffRows((current) => current.map((staff) => (staff.id === updatedStaff.id ? { ...staff, ...updatedStaff } : staff)))
  }

  function handleCreateLeaveRequest(payload) {
    if (!leaveCreateTarget) {
      return
    }

    const totalLeaveDays = leaveCreateTarget.leaveRemaining + leaveCreateTarget.leaveUsed
    const nextLeave = {
      id: `leave-${Date.now()}`,
      code: `#LREQ-2026-${String(leaveRows.length + 43).padStart(4, '0')}`,
      createdAt: formatDate(new Date()),
      role: `${leaveCreateTarget.code} • ${leaveCreateTarget.role}`,
      name: leaveCreateTarget.name,
      avatar: leaveCreateTarget.avatar,
      staffId: leaveCreateTarget.id,
      type: payload.type,
      time: payload.time,
      status: 'Chờ duyệt',
      statusClass: 'bg-amber-100 text-amber-700',
      reason: payload.reason,
      attachment: payload.attachment,
      leaveBalance: {
        total: `${totalLeaveDays} ngày`,
        used: `${leaveCreateTarget.leaveUsed} ngày`,
        remain: `${leaveCreateTarget.leaveRemaining} ngày`,
      },
      note: 'Đơn mới tạo, đang chờ quản lý xử lý.',
    }

    setLeaveRows((current) => [nextLeave, ...current])
    setLeaveCreateTarget(null)
    showToast?.({
      message: `Đơn nghỉ phép ${nextLeave.code} của ${leaveCreateTarget.name} đã được gửi.`,
      title: 'Tạo đơn nghỉ phép thành công',
      tone: 'success',
    })
  }

  function handleLeaveDecision(leave, decision, note) {
    const nextDecision = leaveDecisionStyles[decision]

    setLeaveRows((current) =>
      current.map((item) =>
        item.id === leave.id
          ? {
              ...item,
              note: note.trim() || item.note,
              status: nextDecision.label,
              statusClass: nextDecision.className,
            }
          : item
      )
    )

    if (decision === 'approved') {
      const leaveDays = getLeaveDurationDays(leave.time)

      setStaffRows((current) =>
        current.map((staff) =>
          staff.id === leave.staffId
            ? {
                ...staff,
                leaveRemaining: Math.max(staff.leaveRemaining - leaveDays, 0),
                leaveUsed: staff.leaveUsed + leaveDays,
                leaveWithPermission: staff.leaveWithPermission + leaveDays,
                status: 'leave',
              }
            : staff
        )
      )
    }

    setSelectedLeaveId(null)
    showToast?.({
      message: `Đơn nghỉ của ${leave.name} đã được ${nextDecision.label.toLowerCase()}.`,
      title: decision === 'approved' ? 'Đã phê duyệt đơn nghỉ' : 'Đã từ chối đơn nghỉ',
      tone: decision === 'approved' ? 'success' : 'warning',
    })
  }

  if (staffViewMode === 'manager' && selectedStaff) {
    return (
      <>
        <EmployeeDetailPage
          canManage={!isSelfProfileSelected}
          leaveRows={leaveRows}
          onBack={() => setSelectedStaffId(null)}
          onCreateLeave={isSelfProfileSelected ? () => setLeaveCreateTarget(employeeSelf) : undefined}
          onDelete={setDeleteTarget}
          onOpenLeave={(leave) => setSelectedLeaveId(leave.id)}
          onSave={handleSaveEmployee}
          showToast={showToast}
          staff={selectedStaff}
        />

        {selectedLeave ? (
          <LeaveRequestModal
            canDecide={!isSelfProfileSelected}
            leave={selectedLeave}
            onClose={() => setSelectedLeaveId(null)}
            onDecision={handleLeaveDecision}
          />
        ) : null}
        {leaveCreateTarget ? (
          <CreateLeaveRequestModal
            onClose={() => setLeaveCreateTarget(null)}
            onSubmit={handleCreateLeaveRequest}
            showToast={showToast}
            staff={leaveCreateTarget}
          />
        ) : null}
        {deleteTarget ? <DeleteEmployeeModal employee={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteEmployee} /> : null}
      </>
    )
  }

  return (
    <>
      <div className="dashboard-page page-scroll-pad-sm space-y-5">
        <section className="glass-panel flex flex-col gap-4 rounded-[24px] p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="page-header-title">{staffViewMode === 'manager' ? 'Quản lý Nhân viên' : 'Thông tin nhân viên'}</h1>
            <p className="page-header-subtitle">
              {staffViewMode === 'manager'
                ? 'Xem và quản lý danh sách nhân viên đóng gói, trạng thái và hiệu suất.'
                : 'Nhân viên chỉ xem thông tin cá nhân, ca làm và lịch sử nghỉ của mình.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-full bg-white/55 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
              {[
                ['manager', 'Quản lý'],
                ['employee', 'Nhân viên'],
              ].map(([mode, label]) => (
                <button
                  className={`motion-button h-10 rounded-full px-4 text-sm font-semibold ${
                    staffViewMode === mode ? 'bg-blue-700 text-white shadow-[0_10px_22px_rgba(37,99,235,0.22)]' : 'text-slate-700 hover:bg-white/70'
                  }`}
                  key={mode}
                  onClick={() => {
                    setStaffViewMode(mode)
                    setSelectedStaffId(null)
                    setSelectedLeaveId(null)
                  }}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>

            {staffViewMode === 'manager' ? (
              <button
                className="motion-button flex h-11 items-center justify-center gap-2 self-start rounded-2xl bg-blue-700 px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)] hover:bg-blue-800 lg:self-auto"
                onClick={() => setIsAddModalOpen(true)}
                type="button"
              >
                <Icon className="text-base" name="add" />
                Thêm nhân viên mới
              </button>
            ) : null}
          </div>
        </section>

        {staffViewMode === 'employee' ? (
          <EmployeeDetailPage
            canManage={false}
            embedded
            leaveRows={leaveRows}
            onBack={() => null}
            onCreateLeave={() => setLeaveCreateTarget(employeeSelf)}
            onDelete={setDeleteTarget}
            onOpenLeave={(leave) => setSelectedLeaveId(leave.id)}
            onSave={handleSaveEmployee}
            showBack={false}
            showToast={showToast}
            staff={employeeSelf}
          />
        ) : (
          <>
        <section className="flex flex-col gap-4 xl:flex-row">
          <label className="glass-card flex h-13 flex-1 items-center rounded-full px-5">
            <input
              className="w-full bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400"
              id="staff-search"
              onChange={(event) => setStaffSearch(event.target.value)}
              placeholder="Nhập tên nhân viên, email, mã NV..."
              type="text"
              value={staffSearch}
            />
          </label>
        </section>

        <section className="glass-card rounded-[24px] p-4 sm:p-6">
          <div className="space-y-3 md:hidden">
            {visibleStaffRows.map((staff) => {
              const statusMeta = statusStyles[staff.status]

              return (
                <article
                  className="cursor-pointer rounded-[20px] bg-white/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition hover:bg-white/50"
                  key={staff.id}
                  onClick={() => openEmployeeDetail(staff)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <img alt={staff.name} className="h-10 w-10 rounded-full object-cover shadow-sm" src={staff.avatar} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">{staff.name}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{staff.code}</p>
                      </div>
                    </div>
                    <button
                      aria-label={`Xóa nhân viên ${staff.name}`}
                      className="motion-button flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 hover:bg-red-100"
                      onClick={(event) => {
                        event.stopPropagation()
                        setDeleteTarget(staff)
                      }}
                      type="button"
                    >
                      <Icon className="text-[18px]" name="delete" />
                    </button>
                  </div>
                  <div className="mt-4"><StatusPill className={statusMeta.className}>{statusMeta.label}</StatusPill></div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Thông tin</p>
                      <p className="mt-1 text-slate-600">{staff.email}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Chức vụ</p>
                      <p className="mt-1 font-semibold text-blue-700">{staff.role}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Ca làm</p>
                      <p className="mt-1 text-slate-600">{staff.shift}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[920px] border-collapse">
              <thead>
                <tr className="text-left text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
                  <th className="px-4 pb-5">Tên nhân viên</th>
                  <th className="px-4 pb-5">Thông tin</th>
                  <th className="px-4 pb-5">Trạng thái</th>
                  <th className="px-4 pb-5">Chức vụ</th>
                  <th className="px-4 pb-5">Ca làm</th>
                  <th className="px-4 pb-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {visibleStaffRows.map((staff, index) => {
                  const statusMeta = statusStyles[staff.status]

                  return (
                    <tr
                      className={`${index < visibleStaffRows.length - 1 ? 'border-b border-slate-900/12' : ''} cursor-pointer transition hover:bg-white/38`}
                      key={staff.id}
                      onClick={() => openEmployeeDetail(staff)}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3 rounded-2xl px-2 py-1 text-left">
                          <img alt={staff.name} className="h-10 w-10 rounded-full object-cover shadow-sm" src={staff.avatar} />
                          <div className="min-w-0">
                            <p className="whitespace-nowrap text-sm font-bold text-slate-900">{staff.name}</p>
                            <p className="mt-1 text-xs text-slate-500">{staff.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">{staff.email}</td>
                      <td className="px-4 py-4">
                        <StatusPill className={statusMeta.className}>{statusMeta.label}</StatusPill>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-blue-700">{staff.role}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{staff.shift}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            className="motion-button flex h-9 w-9 items-center justify-center rounded-2xl bg-red-50 text-red-600 hover:bg-red-100"
                            onClick={(event) => {
                              event.stopPropagation()
                              setDeleteTarget(staff)
                            }}
                            type="button"
                          >
                            <Icon className="text-[18px]" name="delete" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {!visibleStaffRows.length ? (
            <div className="rounded-[20px] px-5 py-10 text-center">
              <p className="text-base font-semibold text-slate-900">Không tìm thấy nhân viên phù hợp</p>
              <p className="mt-2 text-sm text-slate-600">Thử lại với tên, email, mã nhân viên hoặc ca làm khác.</p>
            </div>
          ) : null}

          <Pagination
            currentPage={staffPage}
            itemLabel="nhân viên"
            itemsPerPage={staffPerPage}
            onPageChange={setStaffPage}
            totalItems={filteredStaffRows.length}
            totalPages={Math.ceil(filteredStaffRows.length / staffPerPage)}
          />
        </section>

        <section className="glass-card rounded-[24px] p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="text-[24px] font-bold text-slate-950">Danh sách đơn nghỉ phép</h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">Xem và phê duyệt các yêu cầu nghỉ phép của nhân viên.</p>
          </div>

          <div className="space-y-3 md:hidden">
            {visibleLeaveRows.map((leave) => (
              <article className="rounded-[20px] bg-white/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" key={`${leave.id}-mobile`}>
                <div className="flex items-start justify-between gap-3">
                  <ClickablePersonCell avatar={leave.avatar} name={leave.name} onClick={() => setSelectedStaffId(leave.staffId)} />
                  <StatusPill className={leave.statusClass}>{leave.status}</StatusPill>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Loại đơn</p>
                    <p className="mt-1 text-slate-600">{leave.type}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Thời gian</p>
                    <p className="mt-1 text-slate-600">{leave.time}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <DetailButton onClick={() => setSelectedLeaveId(leave.id)} />
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[820px] border-collapse">
              <thead>
                <tr className="text-left text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
                  <th className="px-4 pb-5">Nhân viên</th>
                  <th className="px-4 pb-5">Loại đơn</th>
                  <th className="px-4 pb-5">Thời gian</th>
                  <th className="px-4 pb-5">Trạng thái</th>
                  <th className="px-4 pb-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {visibleLeaveRows.map((leave, index) => (
                  <tr className={index < visibleLeaveRows.length - 1 ? 'border-b border-slate-900/12' : ''} key={leave.id}>
                    <td className="px-4 py-4">
                      <ClickablePersonCell avatar={leave.avatar} name={leave.name} onClick={() => setSelectedStaffId(leave.staffId)} />
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{leave.type}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{leave.time}</td>
                    <td className="px-4 py-4">
                      <StatusPill className={leave.statusClass}>{leave.status}</StatusPill>
                    </td>
                    <td className="px-4 py-4">
                      <DetailButton onClick={() => setSelectedLeaveId(leave.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={leavePage}
            itemLabel="đơn nghỉ"
            itemsPerPage={leavePerPage}
            onPageChange={setLeavePage}
            totalItems={leaveRows.length}
            totalPages={Math.ceil(leaveRows.length / leavePerPage)}
          />
        </section>
          </>
        )}
      </div>

      {selectedLeave ? (
        <LeaveRequestModal
          canDecide={staffViewMode === 'manager'}
          leave={selectedLeave}
          onClose={() => setSelectedLeaveId(null)}
          onDecision={handleLeaveDecision}
        />
      ) : null}
      {leaveCreateTarget ? (
        <CreateLeaveRequestModal
          onClose={() => setLeaveCreateTarget(null)}
          onSubmit={handleCreateLeaveRequest}
          showToast={showToast}
          staff={leaveCreateTarget}
        />
      ) : null}
      {deleteTarget ? <DeleteEmployeeModal employee={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteEmployee} /> : null}
      {isAddModalOpen ? (
        <AddEmployeeModal
          form={employeeForm}
          formError={employeeFormError}
          onClose={() => {
            setIsAddModalOpen(false)
            setEmployeeFormError('')
          }}
          onAvatarUpload={handleEmployeeAvatarUpload}
          onSubmit={handleAddEmployee}
          onValueChange={updateEmployeeForm}
        />
      ) : null}
    </>
  )
}
