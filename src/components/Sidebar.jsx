import { navItems } from '../data/navigation.js'
import { Icon } from './Icon.jsx'

export function Sidebar({ activePage, onNavigate }) {
  const settingsActive = activePage === 'settings'

  return (
    <aside className="dashboard-sidebar glass-panel fixed left-6 top-6 z-50 hidden h-[calc(100vh-48px)] w-64 flex-col rounded-[24px] p-6 lg:flex">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-sm">
          <Icon name="package_2" className="filled" />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-none tracking-tight">Kurifuri</h1>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
            Enterprise Logistics
          </p>
        </div>
      </div>

      <nav className="mt-8 flex-1 space-y-2">
        {navItems.map((item) => {
          const active = activePage === item.id

          return (
            <button
              className={`motion-button flex w-full items-center gap-3 rounded-full px-4 py-2 text-left text-sm font-medium transition ${
                active ? 'bg-white/55 text-blue-800 shadow-sm' : 'text-slate-600 hover:bg-white/40'
              } ${item.disabled ? 'cursor-not-allowed opacity-70' : ''}`}
              disabled={item.disabled}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
            >
              <Icon name={item.icon} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-slate-900/12 pt-6">
        <button
          className={`motion-button flex w-full items-center gap-3 rounded-full px-4 py-2 text-sm font-medium transition ${
            settingsActive ? 'bg-white/55 text-blue-800 shadow-sm' : 'text-slate-600 hover:bg-white/40'
          }`}
          onClick={() => onNavigate('settings')}
          type="button"
        >
          <Icon name="settings" />
          Cài đặt
        </button>
      </div>
    </aside>
  )
}
