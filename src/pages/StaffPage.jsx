import { Icon } from '../components/Icon.jsx'

const staffRows = [
  {
    name: 'Nguyễn Văn A',
    contact: 'nguyenvana@example.com',
    status: 'Đang làm việc',
    statusClass: 'bg-emerald-100 text-emerald-800',
    role: 'Giám sát kho',
    shift: '8:00 AM - 4:00 PM',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'Trần Thị B',
    contact: '0987 654 321',
    status: 'Nghỉ phép',
    statusClass: 'bg-rose-100 text-rose-700',
    role: 'Quản lí kho',
    shift: '1:00 PM - 9:00 PM',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'Lê Văn C',
    contact: 'levanc@example.com',
    status: 'Chờ',
    statusClass: 'bg-slate-200 text-slate-700',
    role: 'Nhân viên kho',
    shift: 'Chưa xếp ca',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'Phạm Thị D',
    contact: '0123 456 789',
    status: 'Đang làm việc',
    statusClass: 'bg-emerald-100 text-emerald-800',
    role: 'Nhân viên kho',
    shift: '8:00 AM - 4:00 PM',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80',
  },
]

const leaveRows = [
  {
    name: 'Nguyễn Văn A',
    type: 'Nghỉ bệnh',
    time: '2 ngày (15/10 - 16/10)',
    status: 'Chờ duyệt',
    statusClass: 'bg-amber-100 text-amber-700',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'Trần Thị B',
    type: 'Việc riêng',
    time: '1 ngày (18/10)',
    status: 'Đã duyệt',
    statusClass: 'bg-emerald-100 text-emerald-800',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  },
]

function PersonCell({ avatar, name }) {
  return (
    <div className="flex items-center gap-3">
      <img alt={name} className="h-10 w-10 rounded-full object-cover shadow-sm" src={avatar} />
      <span className="whitespace-nowrap text-sm font-bold text-slate-900">{name}</span>
    </div>
  )
}

function StatusPill({ children, className }) {
  return (
    <span className={`inline-flex rounded-lg px-3 py-1.5 text-sm font-semibold ${className}`}>{children}</span>
  )
}

function DetailButton() {
  return (
    <button
      className="ml-auto flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-blue-700 transition hover:text-blue-800"
      type="button"
    >
      <Icon name="visibility" className="text-[18px]" />
      Chi tiết
    </button>
  )
}

export function StaffPage() {
  return (
    <div className="dashboard-page space-y-5">
      <section className="glass-panel flex flex-col gap-4 rounded-[24px] p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-slate-950 sm:text-[32px]">Quản lý Nhân viên</h1>
          <p className="mt-2 max-w-2xl text-sm font-normal text-slate-600 sm:text-base">
            Xem và quản lý danh sách nhân viên đóng gói, trạng thái và hiệu suất.
          </p>
        </div>

        <button
          className="flex h-11 items-center justify-center gap-2 self-start rounded-2xl bg-blue-700 px-5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)] transition hover:bg-blue-800 lg:self-auto"
          type="button"
        >
          <Icon name="add" className="text-base" />
          Thêm nhân viên mới
        </button>
      </section>

      <section className="glass-card rounded-[24px] p-4 sm:p-6">
        <div className="space-y-3 md:hidden">
          {staffRows.map((staff) => (
            <article className="rounded-[20px] bg-white/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" key={staff.name}>
              <div className="flex items-start justify-between gap-3">
                <PersonCell avatar={staff.avatar} name={staff.name} />
                <StatusPill className={staff.statusClass}>{staff.status}</StatusPill>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Thông tin</p>
                  <p className="mt-1 text-slate-600">{staff.contact}</p>
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
              <div className="mt-4 flex justify-end">
                <DetailButton />
              </div>
            </article>
          ))}
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
              {staffRows.map((staff, index) => (
                <tr
                  className={index < staffRows.length - 1 ? 'border-b border-white/35' : ''}
                  key={staff.name}
                >
                  <td className="px-4 py-4">
                    <PersonCell avatar={staff.avatar} name={staff.name} />
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{staff.contact}</td>
                  <td className="px-4 py-4">
                    <StatusPill className={staff.statusClass}>{staff.status}</StatusPill>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-blue-700">{staff.role}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{staff.shift}</td>
                  <td className="px-4 py-4">
                    <DetailButton />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-col gap-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>Hiển thị 1 đến 4 của 24 nhân viên</p>
          <div className="flex items-center gap-2">
            <button className="pagination-button opacity-50" type="button">
              Trước
            </button>
            <button
              className="pagination-button bg-blue-700 text-white shadow-[0_10px_20px_rgba(37,99,235,0.24)]"
              type="button"
            >
              1
            </button>
            <button className="pagination-button" type="button">
              2
            </button>
            <button className="pagination-button" type="button">
              3
            </button>
            <button className="pagination-button px-5" type="button">
              Sau
            </button>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-[24px] p-4 sm:p-6">
        <div className="mb-5">
          <h2 className="text-[24px] font-bold text-slate-950">Danh sách đơn xin nghỉ</h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Xem và phê duyệt các yêu cầu nghỉ phép của nhân viên.
          </p>
        </div>

        <div className="space-y-3 md:hidden">
          {leaveRows.map((leave) => (
            <article
              className="rounded-[20px] bg-white/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
              key={`${leave.name}-${leave.type}-mobile`}
            >
              <div className="flex items-start justify-between gap-3">
                <PersonCell avatar={leave.avatar} name={leave.name} />
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
                <DetailButton />
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
              {leaveRows.map((leave, index) => (
                <tr
                  className={index < leaveRows.length - 1 ? 'border-b border-white/35' : ''}
                  key={`${leave.name}-${leave.type}`}
                >
                  <td className="px-4 py-4">
                    <PersonCell avatar={leave.avatar} name={leave.name} />
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{leave.type}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{leave.time}</td>
                  <td className="px-4 py-4">
                    <StatusPill className={leave.statusClass}>{leave.status}</StatusPill>
                  </td>
                  <td className="px-4 py-4">
                    <DetailButton />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
