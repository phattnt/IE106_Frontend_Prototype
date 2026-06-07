import { useEffect, useState } from 'react'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPhone(value) {
  return /^[+\d\s.-]{9,20}$/.test(value.trim())
}

export function ProfilePage({ profile, onProfileChange, showToast }) {
  const [draft, setDraft] = useState(profile)
  const [saveLabel, setSaveLabel] = useState('Lưu thay đổi')
  const [error, setError] = useState('')

  useEffect(() => {
    setDraft(profile)
    setSaveLabel('Lưu thay đổi')
    setError('')
  }, [profile])

  function updateField(field, value) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }))
    setSaveLabel('Lưu thay đổi')
    setError('')
  }

  function handleSave() {
    if (!draft.name.trim()) {
      setError('Cần nhập họ và tên.')
      showToast?.({ message: 'Vui lòng nhập họ và tên trước khi lưu hồ sơ.', title: 'Thiếu họ tên', tone: 'error' })
      return
    }

    if (!isValidEmail(draft.email)) {
      setError('Email chưa đúng định dạng.')
      showToast?.({ message: 'Email hồ sơ chưa đúng định dạng.', title: 'Email không hợp lệ', tone: 'error' })
      return
    }

    if (!isValidPhone(draft.phone)) {
      setError('Số điện thoại chưa đúng định dạng.')
      showToast?.({ message: 'Số điện thoại hồ sơ chưa đúng định dạng.', title: 'Số điện thoại không hợp lệ', tone: 'error' })
      return
    }

    setError('')
    onProfileChange({
      ...draft,
      name: draft.name.trim(),
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      title: draft.title.trim(),
    })
    setSaveLabel('Đã lưu')
    showToast?.({
      message: 'Thông tin hồ sơ đã được cập nhật trên topbar.',
      title: 'Lưu hồ sơ thành công',
      tone: 'success',
    })
  }

  return (
    <div className="dashboard-page page-scroll-pad-sm space-y-6">
      <section className="glass-panel rounded-[32px] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="page-header-title">Chỉnh sửa hồ sơ</h1>
            <p className="page-header-subtitle">Cập nhật thông tin cá nhân hiển thị trên hệ thống quản trị.</p>
          </div>

          <button
            className="motion-button h-11 rounded-2xl bg-blue-700 px-6 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.24)] hover:bg-blue-800"
            onClick={handleSave}
            type="button"
          >
            {saveLabel}
          </button>
        </div>
      </section>

      <section className="glass-panel rounded-[34px] p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500" htmlFor="profile-name">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <input
              className="h-12 w-full rounded-2xl border border-white/70 bg-white/65 px-4 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(42,76,130,0.08)] outline-none transition focus:border-slate-900/70 focus:bg-white focus:ring-2 focus:ring-slate-900/8"
              id="profile-name"
              onChange={(event) => updateField('name', event.target.value)}
              required
              type="text"
              value={draft.name}
            />
          </div>

          <div>
            <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500" htmlFor="profile-title">
              Chức danh
            </label>
            <input
              className="h-12 w-full rounded-2xl border border-white/70 bg-white/65 px-4 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(42,76,130,0.08)] outline-none transition focus:border-slate-900/70 focus:bg-white focus:ring-2 focus:ring-slate-900/8"
              id="profile-title"
              onChange={(event) => updateField('title', event.target.value)}
              type="text"
              value={draft.title}
            />
          </div>

          <div>
            <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500" htmlFor="profile-department">
              Bộ phận
            </label>
            <input
              className="h-12 w-full rounded-2xl border border-white/70 bg-white/65 px-4 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(42,76,130,0.08)] outline-none transition focus:border-slate-900/70 focus:bg-white focus:ring-2 focus:ring-slate-900/8"
              id="profile-department"
              onChange={(event) => updateField('department', event.target.value)}
              type="text"
              value={draft.department}
            />
          </div>

          <div>
            <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500" htmlFor="profile-email">
              Email <span className="text-rose-500">*</span>
            </label>
            <input
              className="h-12 w-full rounded-2xl border border-white/70 bg-white/65 px-4 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(42,76,130,0.08)] outline-none transition focus:border-slate-900/70 focus:bg-white focus:ring-2 focus:ring-slate-900/8"
              id="profile-email"
              onChange={(event) => updateField('email', event.target.value)}
              required
              type="email"
              value={draft.email}
            />
          </div>

          <div>
            <label className="mb-3 block text-[12px] font-bold uppercase tracking-[0.12em] text-slate-500" htmlFor="profile-phone">
              Số điện thoại <span className="text-rose-500">*</span>
            </label>
            <input
              className="h-12 w-full rounded-2xl border border-white/70 bg-white/65 px-4 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(42,76,130,0.08)] outline-none transition focus:border-slate-900/70 focus:bg-white focus:ring-2 focus:ring-slate-900/8"
              id="profile-phone"
              onChange={(event) => updateField('phone', event.target.value)}
              required
              type="text"
              value={draft.phone}
            />
          </div>
        </div>

        {error ? <p className="mt-6 text-sm font-semibold text-red-600">{error}</p> : null}
      </section>
    </div>
  )
}
