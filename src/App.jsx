import { useState } from 'react'
import './App.css'
import { Sidebar } from './components/Sidebar.jsx'
import { Topbar } from './components/Topbar.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { OrderArchivePage } from './pages/OrderArchivePage.jsx'
import { ProductPage } from './pages/ProductPage.jsx'
import { SettingsPage } from './pages/SettingsPage.jsx'
import { StaffPage } from './pages/StaffPage.jsx'

function App() {
  const [activePage, setActivePage] = useState('orders')
  const [subscription, setSubscription] = useState({
    tier: 'pro',
    daysRemaining: 18,
    renewalDate: '07/06/2026',
  })

  const pageProps = {
    settings: {
      subscription,
      onSubscriptionChange: setSubscription,
    },
  }

  const renderedPages = {
    dashboard: <DashboardPage />,
    orders: <OrderArchivePage />,
    staff: <StaffPage />,
    products: <ProductPage />,
    settings: <SettingsPage {...pageProps.settings} />,
  }

  return (
    <div className="dashboard-shell min-h-screen text-slate-950">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <Topbar activePage={activePage} subscriptionTier={subscription.tier} />

      <main className="box-border min-h-screen p-4 pt-[118px] lg:ml-80 lg:mr-6 lg:w-[calc(100%-20rem-1.5rem)] lg:px-0 lg:pb-0 lg:pt-[116px]">
        <div className="page-transition" key={activePage}>
          {renderedPages[activePage]}
        </div>
      </main>
    </div>
  )
}

export default App
