import { useState } from 'react'
import { Icon } from '../components/Icon.jsx'

export function LoginPage({ defaultEmail, defaultPassword, error, isSubmitting, onLogin, onSwitch }) {
  const [form, setForm] = useState({
    email: defaultEmail,
    password: defaultPassword,
    remember: true,
  })
  const [localError, setLocalError] = useState('')
  const [forgotOpen, setForgotOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState(defaultEmail)
  const [resetSent, setResetSent] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setLocalError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.email.trim() || !form.password) {
      setLocalError('Vui lòng nhập email và mật khẩu.')
      return
    }

    onLogin({ email: form.email, password: form.password })
  }

  function submitForgotPassword(event) {
    event.preventDefault()
    if (!resetEmail.trim()) {
      setLocalError('Vui lòng nhập email để khôi phục mật khẩu.')
      return
    }
    setResetSent(true)
    setLocalError('')
  }

  const visibleError = localError || error

  return (
    <main className="auth-page px-4 py-8 sm:px-6 lg:px-8">
      <section className="auth-card motion-modal">
        <div className="auth-form-panel">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_14px_28px_rgba(15,23,42,0.22)]">
              <Icon className="filled" name="package_2" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none text-slate-950">Kurifuri</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">Logistics</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Welcome back</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Đăng nhập hệ thống</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Theo dõi tổng quan vận hành, đơn hàng và video đóng gói trong một bảng điều khiển.</p>
          </div>

          <div className="auth-tab mt-7">
            <button className="is-active" type="button">Đăng nhập</button>
            <button onClick={() => onSwitch('register')} type="button">Đăng ký</button>
          </div>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500" htmlFor="login-email">
                Email
              </label>
              <div className="relative">
                <input
                  className="auth-input pr-12"
                  id="login-email"
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="admin@kurifuri.vn"
                  type="email"
                  value={form.email}
                />
                <Icon className="absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-500" name="mail" />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500" htmlFor="login-password">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  className="auth-input pr-12"
                  id="login-password"
                  onChange={(event) => updateField('password', event.target.value)}
                  placeholder="Nhập mật khẩu"
                  type="password"
                  value={form.password}
                />
                <Icon className="absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-500" name="visibility" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 font-semibold text-slate-600">
                <input
                  checked={form.remember}
                  className="h-4 w-4 accent-blue-700"
                  onChange={(event) => updateField('remember', event.target.checked)}
                  type="checkbox"
                />
                Ghi nhớ đăng nhập
              </label>
              <button className="font-semibold text-blue-700 hover:text-blue-800" onClick={() => { setForgotOpen(true); setResetSent(false); setResetEmail(form.email || defaultEmail) }} type="button">Quên mật khẩu?</button>
            </div>

            {visibleError ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{visibleError}</p> : null}

            <button className="auth-submit motion-button" disabled={isSubmitting} type="submit">
              {isSubmitting ? <span className="auth-button-spinner" /> : null}
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {forgotOpen ? (
            <form className="mt-7 rounded-[28px] border border-blue-100 bg-white/85 p-5 shadow-[0_18px_46px_rgba(37,99,235,0.12)]" onSubmit={submitForgotPassword}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-bold text-slate-950">Khôi phục mật khẩu</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Nhập email tài khoản, hệ thống sẽ gửi liên kết đặt lại mật khẩu.</p>
                </div>
                <button className="motion-button flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100" onClick={() => setForgotOpen(false)} type="button">
                  <Icon className="text-[18px]" name="close" />
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input className="auth-input h-12 flex-1" onChange={(event) => setResetEmail(event.target.value)} placeholder="email@kurifuri.vn" type="email" value={resetEmail} />
                <button className="motion-button h-12 rounded-2xl bg-blue-700 px-5 text-sm font-bold text-white shadow-[0_14px_28px_rgba(37,99,235,0.22)] hover:bg-blue-800" type="submit">
                  Gửi liên kết
                </button>
              </div>
              {resetSent ? <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">Đã gửi hướng dẫn khôi phục đến {resetEmail}.</p> : null}
            </form>
          ) : null}

          <div className="mt-7 rounded-[24px] border border-blue-100 bg-blue-50/75 p-4 text-sm text-slate-700">
            <p className="font-bold text-slate-950">Tài khoản mặc định</p>
            <p className="mt-2 font-semibold">Email: {defaultEmail}</p>
            <p className="mt-1 font-semibold">Mật khẩu: {defaultPassword}</p>
          </div>
        </div>

        <aside className="auth-visual-panel">
          <div className="auth-blue-orb auth-blue-orb-one" />
          <div className="auth-blue-orb auth-blue-orb-two" />
          <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white lg:p-10">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-200" />
              Tổng quan realtime
            </div>

            <div>
              <h2 className="max-w-sm text-4xl font-bold leading-tight tracking-tight">Kiểm soát vận hành kho từ một màn hình duy nhất.</h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-blue-50/90">Dashboard ưu tiên tổng quan trước, giúp đội ngũ thấy nhanh trạng thái đơn hàng, nhân sự và tiến độ xử lý.</p>
            </div>

            <div className="auth-visual-footer">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Kurifuri Control Center</p>
              <p className="mt-2 text-sm text-white/85">Đăng nhập để tiếp tục vào trang Tổng quan.</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}
