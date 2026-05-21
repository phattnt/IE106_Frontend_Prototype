import { useCallback, useState } from 'react'
import './App.css'
import { AppToastContainer } from './components/AppToast.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { Topbar } from './components/Topbar.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { OrderArchivePage } from './pages/OrderArchivePage.jsx'
import { ProfilePage } from './pages/ProfilePage.jsx'
import { ProductPage } from './pages/ProductPage.jsx'
import { SettingsPage } from './pages/SettingsPage.jsx'
import { StaffPage } from './pages/StaffPage.jsx'
import { StudioPage } from './pages/StudioPage.jsx'

function App() {
  const [activePage, setActivePage] = useState('orders')
  const [settingsScrollTarget, setSettingsScrollTarget] = useState(null)
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
    daysRemaining: 18,
    renewalDate: '07/06/2026',
  })

  const closeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(({ duration = 3600, message = '', title, tone = 'info', icon }) => {
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
    dashboard: <DashboardPage onNavigate={handleNavigate} showToast={showToast} />,
    orders: <OrderArchivePage showToast={showToast} />,
    staff: <StaffPage showToast={showToast} />,
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

    setActivePage(page)
  }

  return (
    <div className="dashboard-shell min-h-screen text-slate-950">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <Topbar activePage={activePage} onNavigate={handleNavigate} profile={profile} subscriptionTier={subscription.tier} />
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
