import { Icon } from '../components/Icon.jsx'

const statusItems = [
  ['Video đóng gói hàng', 60, 'bg-blue-700'],
  ['Video gửi hàng', 30, 'bg-slate-500'],
  ['Video hàng trả về', 10, 'bg-slate-500'],
]

const weeklyData = [
  ['T2', '520', 25, false],
  ['T3', '1.5k', 75, false],
  ['T4', '890', 40, false],
  ['T5', '2.1k', 95, true],
  ['T6', '620', 30, false],
  ['T7', '1.7k', 80, false],
  ['CN', '310', 15, false],
]

const performers = [
  [
    'Marcus T.',
    'Station A4',
    '342',
    'bg-yellow-400 text-slate-900',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDoxoNgwQpCZgmf6AungFUoyclbGfH0EvBghdDPIYNALleGSq1I_sco9pWbPn0UGHlYarwIFQgHKu8D5VaalWjSYbykjUOf69LFGM4C0sz6b1SQ3H1iNK91Qc1v3hDyxxPEuUoujxtVur4oSiDpBXaZ-VE3tlfo83xNYLt2w0HihLxzWVnuU-6EzZp5jBYpgs2kklrrdrDiSjnMUX0ORCi3_qxF4a02jdRZ5ztvtl8guzbsGfozgpQbeIPIzAka1-FjwL-2MNt9WdOc',
  ],
  [
    'Sarah J.',
    'Station B2',
    '318',
    'bg-slate-200 text-slate-900',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDlszYc2a0o_y3zZtfWV6dyzusJ9a_Ehz-zAeLhXS7zMSj4yFPYUg8r_EghNfptv1fkNlqtzE67dJxXF4ObKCFoj4H4MNzWZtuqY7tgnFoR83pIR53XEZoR2ZZBH0wp0mG2dVg4J57hbgyatybirOD7lHhHMHNaD541BEJVnqtaraaF-gpx_v3lJXzTBzk4yNH_6AuKQwpYZuutVrgCKxfJ46Z4iftuH7fcgbXEvEYLsPwHs1UbamjuYv_41MpZJpJLVIYEm999oNnr',
  ],
  [
    'Elena R.',
    'Station A1',
    '295',
    'bg-orange-200 text-orange-800',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAci-52nJFImwEgkpH9jjjQvPYQDIDztrPixjqtftSmmHNACdOVxHsnoy2nY21WlkSZer2elVH0ceo-r7YEE1ELoeOve30DSroryYdAMF_DOzaWl-ECaur-GBtLQuj5J_3i1sOIKcE02FbY4CPTy8dPi_uhcseCStM2SYURkhlmpeeFS16swF9RscrNf2CzO1VqCa1T7GwNZC1Xr029sHxmPUhDtFC-h5Ax8CtBPrVDWbLeBAjnmPen9H4vTatBAk6_0IlF9ZDzpmBc',
  ],
]

const videos = [
  [
    'CAM 04',
    '02:14',
    'Order #99281-Z',
    '12:45 PM • Marcus T.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCYmVyjPmP6hQuoluNpmU7aB8HuU9WuEV2GUwnX8jBtQiNAn9npdfFefmyd1IBJmHyI3xX9xd961rvU-DvaBcfgL0KhUeSn98DpWCdct8G1WIWRmqeSffklKDf3J3XeToEIf1mbCvcKSRsQ47NKGfjYHkVyyvcChU_MAWqjvWn1D6cny-x1LGigSdKIwjTyYVlMnpd8Gj0HilY-UlzykA51Kov2wjO3kDnLH5ZKh3psEC4EZ1x8ZADi1BFiPYYVZLD0XHkUeN1j6twn',
  ],
  [
    'CAM 01',
    '01:45',
    'Order #99279-A',
    '12:38 PM • Sarah J.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCDJLDLeKqTjwnNr3hQfDw0mKdSts6SsEMK3avgSYHF54LjEJFn3vHQU9Tl1-W4xmfW4ncxznBik3L0b5LjvewZ1sz-09ymRZACs7Vh7krva0XtzmEkOwJ8YLl_cr7QNDBKyTtcZjb4R14QXKsrzaiUjuaHMDxlzCcrrmrpUeiTJ3ZgvJ2oqkzk7x_TyeThY0aBDGw_M2c1IDEXEYSkPduY_fS3uS_jkbuqt5LdAvwv5ecEiYde4RjLS8lShqZXkC9LCpqqC6LF2kTP',
  ],
  [
    'CAM 02',
    '03:02',
    'Order #99275-C',
    '12:30 PM • Elena R.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCZ19MOXDmkX1Z_aMOoC80VwEgSRAQKcIHw6wP_WxgurMjhq9K_5BUl5WFg3q0nPGwtqnd_8b6zpQBMk7i-ij19bRWGkXxKkPm4zNWx6NhqbW0axwbmE3u2ceo98tdB-D-6lUxfak3ab7a9eZao6Jpcy4KKhhdz7zJLhQxgrTS_RkI6nBVIkTdEMcjpQkS_VmKENT7_hAlkPwG4P6UXfBXJOOMUHamZ_tsAn_Z-1zIjk1kYc44XVguxXTHdPrtdwSDAyhYS6M4XxC6n',
  ],
  [
    'CAM 06',
    '00:58',
    'Order #99270-X',
    '12:25 PM • Marcus T.',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBJSYZOo7t6U_4eKXk3BeysPagdP8xyghUSXlcZAxlGCKfcQiUZTG5zEBj-7rKPco9k5JO0G4-a5XX7kfx4dvM30wDs9PmazpynejCKxY3BvJWPtX2V_6yCVnc7o8muCZ7knI7E7nHI5otPL6hWhmjTFhSeBkicxSEbjsEKAmEUKElKUhNUQN_mGaP_VRjS4PcGes-QIPeo0fbhYXzGT5GSefeNOaRolkn5hrlAw9gFDV6PVNvs3ise3XFOZtzCna4qyytBLXcdHu0O',
  ],
]

export function DashboardPage() {
  return (
    <div className="dashboard-page space-y-5">
      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <article className="glass-primary flex min-h-[220px] flex-col justify-between rounded-[24px] p-6 text-white">
          <div className="flex items-start justify-between">
            <span className="text-sm font-semibold uppercase tracking-wider text-white/90">Tổng đơn hàng</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Icon name="shopping_cart" />
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-bold leading-tight sm:text-[56px]">12,482</h1>
            <div className="mt-3 flex items-center gap-1 text-base font-semibold text-emerald-200">
              <Icon name="trending_up" className="text-sm" />
              12.5% so với tháng trước
            </div>
          </div>
        </article>

        <article className="glass-card flex min-h-[220px] flex-col rounded-[24px] p-5">
          <div className="flex items-start justify-between px-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-800">Lưu trữ đám mây</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-700">
              <Icon name="cloud_done" />
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="relative h-44 w-44">
              <svg className="h-full w-full -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="transparent" r="42" stroke="rgba(203, 213, 225, 0.45)" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="42"
                  stroke="#1d4ed8"
                  strokeDasharray="263.89"
                  strokeDashoffset="65.97"
                  strokeLinecap="round"
                  strokeWidth="10"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-slate-950">750 GB</span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  Lưu trữ
                  <br />
                  đám mây
                </span>
              </div>
            </div>
          </div>
        </article>

        <article className="glass-card rounded-[24px] p-6">
          <div className="mb-7 flex items-start justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-900">Trạng thái xử lý</span>
          </div>
          <div className="space-y-6">
            {statusItems.map(([label, value, color]) => (
              <div className="space-y-2.5" key={label}>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
                  <span>{label}</span>
                  <span className="text-[13px] text-slate-950">{value}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200/70 shadow-inner">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <article className="glass-card rounded-[24px] p-6 md:col-span-2">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Hiệu suất hàng tuần</h2>
              <p className="mt-1 text-sm font-normal text-slate-600">Số lượng đơn hàng được quay theo ngày</p>
            </div>
            <select className="w-fit rounded-2xl border-0 bg-white/55 py-2 pl-4 pr-9 text-sm font-medium text-slate-800 shadow-sm">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>
          <div className="relative h-44 px-2">
            <div className="absolute inset-0 flex items-end justify-between gap-4">
              {weeklyData.map(([day, value, height, active]) => (
                <div className="group relative flex flex-1 items-end justify-center" key={day} style={{ height: `${height}%` }}>
                  <div className={`h-full w-5 rounded-t-full transition ${active ? 'bg-blue-700 shadow-md' : 'bg-slate-500/20 hover:bg-blue-500/20'}`} />
                  <div
                    className={`absolute -top-11 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-slate-950/85 px-2.5 py-1.5 text-xs font-bold text-white shadow-md backdrop-blur-md transition ${
                      active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex justify-between px-4 text-xs font-semibold uppercase tracking-tight text-slate-600">
            {weeklyData.map(([day]) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </article>

        <article className="glass-card flex flex-col rounded-[24px] p-6">
          <h2 className="mb-4 text-2xl font-bold text-slate-950">Nhân viên xuất sắc</h2>
          <div className="flex-1 space-y-3">
            {performers.map(([name, station, count, badgeClass, avatar], index) => (
              <div className="-mx-2 flex cursor-default items-center justify-between rounded-xl p-2 transition hover:bg-white/40" key={name}>
                <div className="flex items-center gap-4">
                  <div className="relative rounded-full shadow-sm">
                    <img alt={`${name} avatar`} className="h-11 w-11 rounded-full object-cover" src={avatar} />
                    <div
                      className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold shadow-sm ${badgeClass}`}
                    >
                      {index + 1}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-950">{name}</p>
                    <p className="text-sm font-normal text-slate-600">{station}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-700">{count}</p>
                  <p className="text-[10px] font-bold uppercase text-slate-500">Sản phẩm</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full rounded-2xl bg-white/35 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white/55" type="button">
            Xem bảng xếp hạng chi tiết
          </button>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <div className="flex items-center justify-between md:col-span-4">
          <h2 className="text-2xl font-bold text-slate-950">Video đóng hàng gần đây</h2>
          <a className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline" href="#">
            Xem tất cả đơn hàng
          </a>
        </div>
        {videos.map(([camera, duration, order, meta, image]) => (
          <article className="glass-card group overflow-hidden rounded-[20px] shadow-md" key={order}>
            <div className="relative aspect-video">
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                <Icon name="play_circle" className="filled text-5xl text-white/90 drop-shadow-lg" />
              </div>
              <img alt={order} className="h-full w-full object-cover opacity-90 mix-blend-multiply" src={image} />
              <div className="absolute left-3 top-3 rounded-md bg-black/50 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                {camera}
              </div>
              <div className="absolute bottom-3 right-3 rounded-md bg-blue-700/85 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                {duration}
              </div>
            </div>
            <div className="bg-slate-800/10 p-4 backdrop-blur-sm">
              <p className="truncate text-sm font-bold text-slate-950">{order}</p>
              <p className="text-sm font-normal text-slate-700">{meta}</p>
            </div>
          </article>
        ))}
      </section>

      <button
        className="glass-primary fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full p-4 text-white shadow-xl transition hover:scale-105 active:scale-95"
        type="button"
      >
        <Icon name="videocam" className="filled" />
        <span className="hidden pr-2 text-sm font-semibold sm:inline">Bắt đầu quay</span>
      </button>
    </div>
  )
}
