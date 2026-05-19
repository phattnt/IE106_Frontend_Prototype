import { useState } from 'react'
import './App.css'
import { Sidebar } from './components/Sidebar.jsx'
import { Topbar } from './components/Topbar.jsx'
import { DashboardPage } from './pages/DashboardPage.jsx'
import { ProductPage } from './pages/ProductPage.jsx'
import { StaffPage } from './pages/StaffPage.jsx'

const pages = {
  dashboard: <DashboardPage />,
  staff: <StaffPage />,
  products: <ProductPage />,
}

function App() {
  const [activePage, setActivePage] = useState('staff')

  return (
    <div className="dashboard-shell min-h-screen text-slate-950">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <Topbar />

      <main className="box-border min-h-screen p-4 pt-[118px] lg:ml-80 lg:px-8 lg:pb-0 lg:pt-[116px]">
        {pages[activePage]}
      </main>
    </div>
  )
}

export default App
