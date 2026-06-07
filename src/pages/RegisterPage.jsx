import { useState } from 'react'
import { Icon } from '../components/Icon.jsx'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function RegisterPage({ error, isSubmitting, onRegister, onSwitch }) {
  const [form, setForm] = useState({
    confirmPassword: '',
    email: '',
    name: '',
    password: '',
  })
  const [localError, setLocalError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setLocalError('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) {
      setLocalError('Vui lòng nhập đầy đủ thông tin đăng ký.')
      return
    }

    if (!isValidEmail(form.email.trim())) {
      setLocalError('Email chưa đúng định dạng.')
      return
    }

    if (form.password.length < 8) {
      setLocalError('Mật khẩu cần tối thiểu 8 ký tự.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setLocalError('Mật khẩu xác nhận chưa khớp.')
      return
    }

    onRegister({ email: form.email, name: form.name, password: form.password })
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
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Create workspace</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Tạo tài khoản mới</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Khởi tạo tài khoản quản trị để vào bảng tổng quan vận hành Kurifuri.</p>
          </div>

          <div className="auth-tab mt-7">
            <button onClick={() => onSwitch('login')} type="button">Đăng nhập</button>
            <button className="is-active" type="button">Đăng ký</button>
          </div>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500" htmlFor="register-name">
                Họ và tên
              </label>
              <div className="relative">
                <input
                  className="auth-input auth-input-with-action"
                  id="register-name"
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Nguyễn Minh Anh"
                  type="text"
                  value={form.name}
                />
                <Icon className="absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-500" name="person" />
              </div>
            </div>

            <div>
              <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500" htmlFor="register-email">
                Email
              </label>
              <div className="relative">
                <input
                  className="auth-input auth-input-with-action"
                  id="register-email"
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="you@kurifuri.vn"
                  type="email"
                  value={form.email}
                />
                <Icon className="absolute right-4 top-1/2 -translate-y-1/2 text-[20px] text-slate-500" name="mail" />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500" htmlFor="register-password">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    className="auth-input auth-input-with-action"
                    id="register-password"
                    onChange={(event) => updateField('password', event.target.value)}
                    placeholder="Nhập mật khẩu"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                  />
                  <button
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    className="auth-password-toggle motion-button"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    <Icon className="text-[20px]" name={showPassword ? 'visibility_off' : 'visibility'} />
                  </button>
                </div>
                <p className="mt-2 text-[11px] font-semibold text-slate-400">Yêu cầu: Tối thiểu 8 ký tự</p>
              </div>

              <div>
                <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500" htmlFor="register-confirm-password">
                  Xác nhận
                </label>
                <div className="relative">
                  <input
                    className="auth-input auth-input-with-action"
                    id="register-confirm-password"
                    onChange={(event) => updateField('confirmPassword', event.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                  />
                  <button
                    aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                    className="auth-password-toggle motion-button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    type="button"
                  >
                    <Icon className="text-[20px]" name={showConfirmPassword ? 'visibility_off' : 'visibility'} />
                  </button>
                </div>
              </div>
            </div>

            {visibleError ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{visibleError}</p> : null}

            <button className="auth-submit motion-button" disabled={isSubmitting} type="submit">
              {isSubmitting ? <span className="auth-button-spinner" /> : null}
              {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>
        </div>

        <aside className="auth-visual-panel auth-visual-panel-register">
          <div className="auth-blue-orb auth-blue-orb-one" />
          <div className="auth-blue-orb auth-blue-orb-two" />
          <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white lg:p-10">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-200" />
              Workspace mới
            </div>

            <div>
              <h2 className="max-w-sm text-4xl font-bold leading-tight tracking-tight">Bắt đầu với dashboard ưu tiên tổng quan.</h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-blue-50/90">Sau khi tạo tài khoản, hệ thống sẽ đưa bạn thẳng vào trang Tổng quan để xem trạng thái vận hành.</p>
            </div>

            <div className="auth-visual-footer">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">Secure mock session</p>
              <p className="mt-2 text-sm text-white/85">Luồng đăng ký hiện chạy nội bộ trên front-end.</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}
