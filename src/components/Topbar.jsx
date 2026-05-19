import { Icon } from './Icon.jsx'

export function Topbar() {
  return (
    <header className="glass-panel fixed left-4 right-4 top-4 z-40 flex min-h-16 items-center justify-between rounded-3xl px-4 py-3 lg:left-80 lg:right-6 lg:top-5 lg:justify-end lg:rounded-full lg:px-8">
      <div className="flex items-center gap-3 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white">
          <Icon name="package_2" className="filled" />
        </div>
        <div>
          <p className="font-bold leading-none">Kurifuri</p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-slate-500">Logistics</p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button className="relative text-slate-600 transition hover:text-blue-700" type="button">
          <Icon name="notifications" />
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500 shadow-sm" />
        </button>
        <button className="hidden text-slate-600 transition hover:text-blue-700 sm:block" type="button">
          <Icon name="help_outline" />
        </button>
        <div className="hidden h-8 w-px bg-white/50 sm:block" />
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-none">Alex Rivera</p>
            <p className="mt-1 text-[11px] text-slate-600">Ops Manager</p>
          </div>
          <img
            alt="User profile"
            className="h-10 w-10 rounded-full object-cover shadow-sm"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqCERu0dE8OYuwtmS-Vc3OX0PtD4pxp83IU02pes-IOmN19K6ay6p9nc8ttnpDoUky5eyaokXJZqVO0998dwCp_vQ7p_l96hwRe0-hdouiKA4-2XoXQqH-T5ogff6XstbJnJodeKl4yrDM1yOKQa59g8GexZLz_4-kfDWN3ZG0HUzVv_YZDPHoaTnmh5lJ37v2d8jGCoski7AguuVQWVV6gp5jb5hvpon4ZQvYcIiR9LcwNJ3Fm_kPe8cxH_OkenY51mbMAbkHcrYP"
          />
        </div>
      </div>
    </header>
  )
}
