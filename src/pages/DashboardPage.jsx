import { useEffect, useMemo, useState } from 'react'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { createPortal } from 'react-dom'
import { Line } from 'react-chartjs-2'
import { Icon } from '../components/Icon.jsx'
import { staffStatusStyles } from '../data/staffStatus.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const weeklyChartData = [
  { label: 'T2', value: 42 },
  { label: 'T3', value: 50 },
  { label: 'T4', value: 66 },
  { label: 'T5', value: 39 },
  { label: 'T6', value: 68 },
  { label: 'T7', value: 34 },
  { label: 'CN', value: 43 },
]

const monthlyChartData = [
  { label: '01', value: 42 },
  { label: '02', value: 45 },
  { label: '03', value: 47 },
  { label: '04', value: 50 },
  { label: '05', value: 55 },
  { label: '06', value: 60 },
  { label: '07', value: 64 },
  { label: '08', value: 66 },
  { label: '09', value: 63 },
  { label: '10', value: 57 },
  { label: '11', value: 48 },
  { label: '12', value: 39 },
  { label: '13', value: 36 },
  { label: '14', value: 43 },
  { label: '15', value: 56 },
  { label: '16', value: 66 },
  { label: '17', value: 68 },
  { label: '18', value: 63 },
  { label: '19', value: 52 },
  { label: '20', value: 39 },
  { label: '21', value: 33 },
  { label: '22', value: 34 },
  { label: '23', value: 39 },
  { label: '24', value: 45 },
  { label: '25', value: 52 },
  { label: '26', value: 58 },
  { label: '27', value: 61 },
  { label: '28', value: 55 },
  { label: '29', value: 47 },
  { label: '30', value: 43 },
]

const progressRangeOptions = {
  week: {
    data: weeklyChartData,
    highlightIndex: 2,
    label: 'Tuần',
  },
  month: {
    data: monthlyChartData,
    highlightIndex: 14,
    label: '30 ngày',
  },
}

const staffProfiles = {
  an: {
    name: 'Nguyễn Văn An',
    role: 'Đóng gói chính',
    status: 'Đang làm việc',
    statusClass: staffStatusStyles.active.className,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  },
  binh: {
    name: 'Trần Thị B',
    role: 'Kiểm kho',
    status: 'Nghỉ phép',
    statusClass: staffStatusStyles.leave.className,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  },
  cuong: {
    name: 'Lê Văn C',
    role: 'Thực tập sinh',
    status: 'Nghỉ phép',
    statusClass: staffStatusStyles.leave.className,
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
  },
  dung: {
    name: 'Phạm Quốc Dũng',
    role: 'Điều phối ca',
    status: 'Đang làm việc',
    statusClass: staffStatusStyles.active.className,
    avatar:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=120&q=80',
  },
  hanh: {
    name: 'Mai Thu Hạnh',
    role: 'Kiểm hàng',
    status: 'Đang làm việc',
    statusClass: staffStatusStyles.active.className,
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
  khoa: {
    name: 'Đỗ Minh Khoa',
    role: 'Kho vận',
    status: 'Đang làm việc',
    statusClass: staffStatusStyles.active.className,
    avatar:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80',
  },
}

const scheduleDays = [
  { id: 't2', label: 'T2', date: '10' },
  { id: 't3', label: 'T3', date: '11' },
  { id: 't4', label: 'T4', date: '12' },
  { id: 't5', label: 'T5', date: '13' },
  { id: 't6', label: 'T6', date: '14' },
]

const scheduleRows = [
  { id: 'morning', label: 'Ca Sáng', time: '06:00 - 12:00' },
  { id: 'afternoon', label: 'Ca Chiều', time: '12:00 - 18:00' },
  { id: 'full-day', label: 'Cả Ngày', time: '06:00 - 18:00' },
]

const scheduleCells = {
  'morning-t2': ['an', 'binh'],
  'morning-t3': ['khoa'],
  'morning-t4': ['dung', 'hanh'],
  'morning-t6': ['cuong'],
  'afternoon-t2': ['an'],
  'afternoon-t3': ['an', 'binh', 'cuong'],
  'afternoon-t4': [],
  'afternoon-t5': ['cuong'],
  'afternoon-t6': ['dung', 'khoa', 'hanh'],
  'full-day-t2': [],
  'full-day-t3': ['cuong'],
  'full-day-t4': ['hanh', 'an'],
  'full-day-t5': [],
  'full-day-t6': ['cuong'],
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

function ProgressLineChart({ range }) {
  const activeRange = progressRangeOptions[range] ?? progressRangeOptions.month
  const chartData = activeRange.data

  const progressChartData = useMemo(() => {
    return {
      labels: chartData.map((item) => item.label),
      datasets: [
        {
          label: 'Tiến độ đóng gói',
          data: chartData.map((item) => item.value),
          borderColor: '#174ee9',
          borderWidth: 3,
          fill: true,
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#174ee9',
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#174ee9',
          pointHoverBorderColor: '#ffffff',
          pointHoverRadius: 7,
          pointRadius: 4,
          tension: 0.42,
          backgroundColor: (context) => {
            const chart = context.chart
            const { chartArea, ctx } = chart

            if (!chartArea) {
              return 'rgba(37, 99, 235, 0.14)'
            }

            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
            gradient.addColorStop(0, 'rgba(37, 99, 235, 0.24)')
            gradient.addColorStop(0.62, 'rgba(96, 165, 250, 0.08)')
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
            return gradient
          },
        },
      ],
    }
  }, [chartData])

  const progressChartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 720,
        easing: 'easeOutQuart',
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      layout: {
        padding: {
          left: 6,
          right: 14,
          top: 42,
        },
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
            label: (context) => `${context.parsed.y}% tiến độ`,
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
            color: '#0f172a',
            callback: (_, index) => {
              const day = chartData[index]?.label
              if (range === 'week') {
                return day
              }
              return ['01', '05', '10', '15', '20', '25', '30'].includes(day) ? `Ngày ${day}` : ''
            },
            font: {
              size: 12,
              weight: 600,
            },
            autoSkip: false,
            maxRotation: 0,
            padding: 10,
          },
        },
        y: {
          display: false,
          suggestedMax: 78,
          suggestedMin: 24,
        },
      },
    }
  }, [chartData, range])

  const highlightPlugin = useMemo(() => {
    return {
      id: 'dashboard-progress-highlight',
      afterDatasetsDraw(chart) {
        const point = chart.getDatasetMeta(0).data[activeRange.highlightIndex]

        if (!point) {
          return
        }

        const { x, y } = point.getProps(['x', 'y'], true)
        const ctx = chart.ctx
        const text = '2.5k'
        const boxHeight = 26
        const boxPaddingX = 11

        ctx.save()
        ctx.font = '700 12px Inter, sans-serif'
        const boxWidth = Math.ceil(ctx.measureText(text).width + boxPaddingX * 2)
        const boxX = x - boxWidth / 2
        const boxY = y - 42
        ctx.shadowBlur = 14
        ctx.shadowColor = 'rgba(15, 42, 115, 0.22)'
        ctx.fillStyle = '#102a73'
        drawRoundedRect(ctx, boxX, boxY, boxWidth, boxHeight, 7)
        ctx.fill()
        ctx.shadowBlur = 0
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, x, boxY + boxHeight / 2 + 0.5)
        ctx.restore()
      },
    }
  }, [activeRange.highlightIndex])

  return (
    <div className="relative h-[250px] w-full">
      <Line data={progressChartData} options={progressChartOptions} plugins={[highlightPlugin]} />
    </div>
  )
}

function CloudStorageCard({ onUpgrade }) {
  return (
    <aside className="glass-primary flex min-h-[306px] flex-col justify-between rounded-[28px] p-7 text-white">
      <div>
        <h3 className="text-[22px] font-semibold leading-tight">Giám sát lưu trữ đám mây</h3>
        <p className="mt-4 max-w-[250px] text-sm leading-relaxed text-white/80">
          Kiểm tra dung lượng để đảm bảo lưu trữ video không bị gián đoạn
        </p>
        <div className="mt-7">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-white/90">
            <span>Đã dùng 80/100 GB</span>
            <span>80%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/25">
            <div className="h-full w-[80%] rounded-full bg-white" />
          </div>
        </div>
      </div>
      <button
        className="motion-button mt-9 flex h-12 items-center justify-between rounded-full bg-white px-5 text-sm font-semibold text-blue-700 shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
        onClick={onUpgrade}
        type="button"
      >
        Nâng cấp ngay
        <Icon name="chevron_right" className="text-[20px]" />
      </button>
    </aside>
  )
}

function AvatarStack({ staffIds }) {
  const visibleStaff = staffIds.slice(0, 2).map((id) => staffProfiles[id])
  const remaining = staffIds.length - visibleStaff.length

  if (staffIds.length === 0) {
    return <span className="text-sm font-medium text-slate-400">Trống</span>
  }

  return (
    <div className="flex items-center justify-center">
      {visibleStaff.map((member, index) => (
        <img
          alt={member.name}
          className="-ml-2 h-8 w-8 rounded-full border-2 border-white object-cover shadow-sm first:ml-0"
          key={member.name}
          src={member.avatar}
          style={{ zIndex: 10 - index }}
        />
      ))}
      {remaining > 0 ? (
        <span className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-semibold text-slate-700 shadow-sm">
          +{remaining}
        </span>
      ) : null}
    </div>
  )
}

function ScheduleCell({ cell, day, isSelected, row, onOpen }) {
  const staffIds = scheduleCells[`${row.id}-${day.id}`] ?? []
  const hasStaff = staffIds.length > 0

  return (
    <button
      className={`motion-button relative flex min-h-[92px] items-center justify-center rounded-[20px] border px-4 transition ${
        isSelected
          ? 'border-blue-500 bg-white/48 shadow-[0_14px_28px_rgba(37,99,235,0.14)]'
          : 'border-transparent bg-white/42 hover:border-blue-200 hover:bg-white/58'
      } ${hasStaff ? 'cursor-pointer' : 'cursor-default hover:border-transparent hover:bg-white/42'
      }`}
      disabled={!hasStaff}
      onClick={() => {
        if (hasStaff) {
          onOpen({ day, row, staffIds })
        }
      }}
      type="button"
    >
      {isSelected ? (
        <span className="absolute -top-3 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.05em] text-blue-700 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          Đang diễn ra
        </span>
      ) : null}
      <AvatarStack staffIds={cell} />
    </button>
  )
}

function ScheduleTable({ onOpenDetail }) {
  const selectedShift = {
    day: scheduleDays[1],
    row: scheduleRows[1],
    staffIds: scheduleCells['afternoon-t3'],
  }

  return (
    <section className="glass-panel rounded-[28px] p-6 lg:p-7">
      <div className="mb-7 flex items-center justify-between gap-4">
        <h2 className="text-[24px] font-semibold leading-tight text-slate-950">Lịch ca làm việc</h2>

        <div className="flex items-center gap-3">
          <button
            className="motion-button flex h-10 w-10 items-center justify-center rounded-full bg-white/55 text-slate-700 shadow-sm hover:bg-white"
            type="button"
          >
            <Icon name="chevron_left" className="text-[20px]" />
          </button>
          <button
            className="motion-button flex h-10 w-10 items-center justify-center rounded-full bg-white/55 text-slate-700 shadow-sm hover:bg-white"
            type="button"
          >
            <Icon name="chevron_right" className="text-[20px]" />
          </button>
          <button
            className="motion-button rounded-full px-2 text-sm font-semibold text-blue-700 hover:text-blue-600"
            onClick={() => onOpenDetail(selectedShift)}
            type="button"
          >
            Chi tiết
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[920px]">
          <div className="grid grid-cols-[150px_repeat(5,minmax(128px,1fr))] gap-4">
            <div className="flex items-center px-3 text-base font-medium text-slate-600">Ca \ Ngày</div>
            {scheduleDays.map((day) => (
              <div
                className={`rounded-[20px] px-4 py-4 text-center ${
                  day.id === 't3'
                    ? 'border border-blue-300 bg-blue-50/70 text-blue-700 shadow-[inset_0_4px_0_#2563eb]'
                    : 'bg-white/36 text-slate-950'
                }`}
                key={day.id}
              >
                <p className={`text-sm font-semibold ${day.id === 't3' ? 'text-blue-700' : 'text-slate-500'}`}>{day.label}</p>
                <p className="mt-1 text-[24px] font-semibold leading-none text-slate-950">{day.date}</p>
              </div>
            ))}

            {scheduleRows.map((row) => (
              <div className="contents" key={row.id}>
                <div className="flex min-h-[92px] items-center rounded-[20px] bg-white/42 px-5">
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{row.label}</p>
                    <p className="mt-2 text-sm font-medium text-slate-600">{row.time}</p>
                  </div>
                </div>
                {scheduleDays.map((day) => {
                  const staffIds = scheduleCells[`${row.id}-${day.id}`] ?? []
                  return (
                    <ScheduleCell
                      cell={staffIds}
                      day={day}
                      isSelected={row.id === 'afternoon' && day.id === 't3'}
                      key={`${row.id}-${day.id}`}
                      onOpen={onOpenDetail}
                      row={row}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ShiftDetailModal({ detail, onClose }) {
  useEffect(() => {
    if (!detail) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [detail, onClose])

  if (!detail) {
    return null
  }

  const members = detail.staffIds.map((id) => staffProfiles[id])

  return createPortal(
    <div className="motion-overlay fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/38 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        aria-modal="true"
        className="motion-modal w-full max-w-[440px] rounded-[24px] bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.24)]"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-slate-950">
            Chi tiết nhân sự - {detail.day.label} - {detail.row.label}
          </h3>
          <button
            aria-label="Đóng"
            className="motion-button flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-950"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>

        <div className="space-y-3">
          {members.map((member) => (
            <div className="flex items-center justify-between gap-4 rounded-2xl p-2.5 transition hover:bg-slate-50" key={member.name}>
              <div className="flex min-w-0 items-center gap-3">
                <img alt={member.name} className="h-11 w-11 rounded-full object-cover" src={member.avatar} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">{member.name}</p>
                  <p className="truncate text-xs font-medium text-slate-500">{member.role}</p>
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase ${member.statusClass}`}>{member.status}</span>
            </div>
          ))}
        </div>

        <button
          className="motion-button mt-6 h-11 w-full rounded-full bg-blue-700 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.22)] hover:bg-blue-600"
          onClick={onClose}
          type="button"
        >
          Đóng
        </button>
      </div>
    </div>,
    document.body,
  )
}

export function DashboardPage({ onNavigate }) {
  const [selectedDetail, setSelectedDetail] = useState(null)
  const [progressRange, setProgressRange] = useState('month')
  const [rangeMenuOpen, setRangeMenuOpen] = useState(false)
  const activeProgressRange = progressRangeOptions[progressRange] ?? progressRangeOptions.month

  return (
    <div className="dashboard-page page-scroll-pad space-y-6">
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.36fr)]">
        <article className="glass-panel rounded-[30px] p-6 lg:p-7">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                <Icon name="inventory_2" className="text-[18px]" />
              </span>
              <h1 className="text-[22px] font-semibold text-slate-950">Tiến độ đóng gói</h1>
            </div>
            <div className="relative">
              <button
                className="motion-button flex h-10 items-center gap-2 rounded-full bg-white/55 px-4 text-sm font-semibold text-slate-700 shadow-sm"
                onClick={() => setRangeMenuOpen((current) => !current)}
                type="button"
              >
                {activeProgressRange.label}
                <Icon name="expand_more" className="text-[20px]" />
              </button>
              {rangeMenuOpen ? (
                <div className="motion-dropdown absolute right-0 top-[calc(100%+10px)] z-20 w-36 overflow-hidden rounded-2xl border border-white/80 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.16)]">
                  {Object.entries(progressRangeOptions).map(([key, option]) => (
                    <button
                      className={`motion-button flex w-full px-4 py-3 text-left text-sm font-semibold transition ${
                        progressRange === key ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                      key={key}
                      onClick={() => {
                        setProgressRange(key)
                        setRangeMenuOpen(false)
                      }}
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <ProgressLineChart range={progressRange} />

        </article>

        <CloudStorageCard
          onUpgrade={() => {
            onNavigate?.('settings', 'plans')
          }}
        />
      </section>

      <ScheduleTable onOpenDetail={setSelectedDetail} />
      <ShiftDetailModal detail={selectedDetail} onClose={() => setSelectedDetail(null)} />
    </div>
  )
}
