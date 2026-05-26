import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { AppToastContainer } from './components/AppToast.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { Topbar } from './components/Topbar.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { OrderArchivePage } from './pages/OrderArchivePage.jsx'
import { ProfilePage } from './pages/ProfilePage.jsx'
import { ProductPage } from './pages/ProductPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { SettingsPage } from './pages/SettingsPage.jsx'
import { StaffPage } from './pages/StaffPage.jsx'
import { StudioPage } from './pages/StudioPage.jsx'

const defaultAccount = {
  email: 'admin@kurifuri.vn',
  password: 'Kurifuri@2026',
  profile: {
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCqCERu0dE8OYuwtmS-Vc3OX0PtD4pxp83IU02pes-IOmN19K6ay6p9nc8ttnpDoUky5eyaokXJZqVO0998dwCp_vQ7p_l96hwRe0-hdouiKA4-2XoXQqH-T5ogff6XstbJnJodeKl4yrDM1yOKQa59g8GexZLz_4-kfDWN3ZG0HUzVv_YZDPHoaTnmh5lJ37v2d8jGCoski7AguuVQWVV6gp5jb5hvpon4ZQvYcIiR9LcwNJ3Fm_kPe8cxH_OkenY51mbMAbkHcrYP',
    department: 'Vận hành kho',
    email: 'admin@kurifuri.vn',
    name: 'Kurifuri Admin',
    phone: '+84 912 234 567',
    title: 'Ops Manager',
  },
}

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [accounts, setAccounts] = useState([defaultAccount])
  const [authError, setAuthError] = useState('')
  const [authScreen, setAuthScreen] = useState('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isBootLoading, setIsBootLoading] = useState(true)
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false)
  const [settingsScrollTarget, setSettingsScrollTarget] = useState(null)
  const [staffTarget, setStaffTarget] = useState(null)
  const [toasts, setToasts] = useState([])
  const [profile, setProfile] = useState({
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCqCERu0dE8OYuwtmS-Vc3OX0PtD4pxp83IU02pes-IOmN19K6ay6p9nc8ttnpDoUky5eyaokXJZqVO0998dwCp_vQ7p_l96hwRe0-hdouiKA4-2XoXQqH-T5ogff6XstbJnJodeKl4yrDM1yOKQa59g8GexZLz_4-kfDWN3ZG0HUzVv_YZDPHoaTnmh5lJ37v2d8jGCoski7AguuVQWVV6gp5jb5hvpon4ZQvYcIiR9LcwNJ3Fm_kPe8cxH_OkenY51mbMAbkHcrYP',
    department: 'Vận hành kho',
    email: 'alex.rivera@kurifuri.vn',
    name: 'Alex Rivera',
    phone: '+84 912 234 567',
    title: 'Ops Manager',
  })
  const [subscription, setSubscription] = useState({
    tier: 'pro',
    daysRemaining: 78,
    renewalDate: '06/08/2026',
  })

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBootLoading(false), 900)

    return () => window.clearTimeout(timer)
  }, [])

  const closeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(({ duration = 3600, message = '', title, tone = 'success', icon }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const nextToast = {
      icon,
      id,
      message,
      title,
      tone,
    }

    setToasts((current) => [nextToast, ...current].slice(0, 3))
    window.setTimeout(() => closeToast(id), duration)
  }, [closeToast])

  function switchAuthScreen(screen) {
    setAuthScreen(screen)
    setAuthError('')
  }

  function completeAuth(account, message) {
    setProfile(account.profile)
    setAuthError('')
    setActivePage('dashboard')
    setIsAuthenticated(true)
    showToast({ message, title: 'Chào mừng trở lại', tone: 'success' })
  }

  function handleLogin({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const matchedAccount = accounts.find((account) => account.email.toLowerCase() === normalizedEmail && account.password === password)

    if (!matchedAccount) {
      setAuthError('Email hoặc mật khẩu chưa đúng.')
      showToast({ message: 'Vui lòng kiểm tra lại tài khoản đăng nhập.', title: 'Đăng nhập thất bại', tone: 'error' })
      return
    }

    setIsSubmittingAuth(true)
    window.setTimeout(() => {
      completeAuth(matchedAccount, 'Bạn đang ở trang Tổng quan của hệ thống.')
      setIsSubmittingAuth(false)
    }, 700)
  }

  function handleRegister({ email, name, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const accountExists = accounts.some((account) => account.email.toLowerCase() === normalizedEmail)

    if (accountExists) {
      setAuthError('Email này đã có tài khoản.')
      showToast({ message: 'Hãy dùng email khác hoặc chuyển sang đăng nhập.', title: 'Email đã tồn tại', tone: 'error' })
      return
    }

    const newAccount = {
      email: normalizedEmail,
      password,
      profile: {
        ...defaultAccount.profile,
        email: normalizedEmail,
        name: name.trim(),
        title: 'Quản trị viên',
      },
    }

    setIsSubmittingAuth(true)
    window.setTimeout(() => {
      setAccounts((current) => [...current, newAccount])
      completeAuth(newAccount, 'Tài khoản mới đã được tạo và đăng nhập.')
      setIsSubmittingAuth(false)
    }, 700)
  }

  function handleLogout() {
    setIsAuthenticated(false)
    setAuthScreen('login')
    setAuthError('')
    setActivePage('dashboard')
    showToast({ message: 'Bạn đã đăng xuất khỏi hệ thống.', title: 'Đăng xuất thành công', tone: 'success' })
  }

  const pageProps = {
    settings: {
      showToast,
      scrollTarget: settingsScrollTarget,
      subscription,
      onSubscriptionChange: setSubscription,
    },
    profile: {
      showToast,
      onProfileChange: setProfile,
      profile,
    },
  }

  const renderedPages = {
    dashboard: <DashboardPage onNavigate={handleNavigate} />,
    orders: <OrderArchivePage showToast={showToast} />,
    staff: <StaffPage onProfileChange={setProfile} profile={profile} showToast={showToast} staffTarget={staffTarget} />,
    products: <ProductPage showToast={showToast} />,
    settings: <SettingsPage {...pageProps.settings} />,
    profile: <ProfilePage {...pageProps.profile} />,
    studio: <StudioPage showToast={showToast} />,
  }

  function handleNavigate(page, target) {
    if (page === 'settings' && target) {
      setSettingsScrollTarget({
        id: target,
        nonce: Date.now(),
      })
    } else {
      setSettingsScrollTarget(null)
    }

    if (page === 'staff') {
      setStaffTarget({
        id: target ?? 'managerList',
        nonce: Date.now(),
      })
    }

    setActivePage(page)
  }

  if (isBootLoading) {
    return (
      <div className="dashboard-shell auth-shell min-h-screen text-slate-950">
        <div className="auth-loader glass-panel">
          <div className="auth-loader-mark">
            <span className="material-symbols-outlined filled">package_2</span>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">Kurifuri Logistics</p>
          <h1 className="mt-3 text-2xl font-bold text-slate-950">Đang chuẩn bị bảng điều khiển</h1>
          <div className="auth-spinner mt-6" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    const authProps = {
      defaultEmail: defaultAccount.email,
      defaultPassword: defaultAccount.password,
      error: authError,
      isSubmitting: isSubmittingAuth,
      onSwitch: switchAuthScreen,
    }

    return (
      <div className="dashboard-shell auth-shell min-h-screen text-slate-950">
        {authScreen === 'register' ? (
          <RegisterPage {...authProps} onRegister={handleRegister} />
        ) : (
          <LoginPage {...authProps} onLogin={handleLogin} />
        )}
        <AppToastContainer onClose={closeToast} toasts={toasts} />
      </div>
    )
  }

  return (
    <div className="dashboard-shell min-h-screen text-slate-950">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <Topbar onLogout={handleLogout} onNavigate={handleNavigate} profile={profile} subscriptionTier={subscription.tier} />
      <AppToastContainer onClose={closeToast} toasts={toasts} />

      <main className="dashboard-main box-border min-h-screen p-4 pt-[118px] lg:ml-80 lg:mr-6 lg:w-[calc(100%-20rem-1.5rem)] lg:px-0 lg:pb-0 lg:pt-[116px]">
        <div className="page-transition" key={activePage}>
          {renderedPages[activePage]}
        </div>
      </main>
    </div>
  )
}

export default App
