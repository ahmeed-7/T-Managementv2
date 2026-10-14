import { NavLink, useNavigate } from 'react-router-dom'

const navigation = [
  { to: '/dashboard', label: 'Home', icon: '⌂' },
  { to: '/tasks', label: 'My tasks', icon: '✓' },
  { to: '/calendar', label: 'Calendar', icon: '▦' },
  { to: '/notes', label: 'Notes', icon: '▤' },
  { to: '/projects', label: 'Projects', icon: '◫' },
]

export default function WorkspaceLayout({ children }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}') || {}
  const name = user.full_name?.trim() || user.email || 'My workspace'
  const initials = name.slice(0, 1).toUpperCase()

  const signOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb] text-[#262338]">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-[280px] flex-col border-r border-[#efeff4] bg-white px-5 pb-6 pt-8 md:flex">
        <NavLink to="/dashboard" className="inline-flex w-max items-center gap-3 px-2 text-xl font-extrabold tracking-tight text-[#2c2941]">
          <span className="inline-grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#a99afa] to-[#7161df] text-lg font-extrabold text-white">T</span>
          <span>taskflow</span>
        </NavLink>
        <div className="my-9 flex items-center gap-3 rounded-xl border border-[#f0eff5] p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edeaff] text-sm font-bold text-[#6859d0]">{initials}</span>
          <span className="flex min-w-0 flex-1 flex-col gap-1"><strong className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#39364d]">{name}</strong><small className="text-xs text-[#9693a6]">Personal workspace</small></span>
          <span className="text-lg text-[#9a97a7]">⌄</span>
        </div>
        <nav className="flex flex-col gap-1" aria-label="Main navigation">
          <span className="px-3 pb-3 text-xs font-bold tracking-widest text-[#9b99aa]">WORKSPACE</span>
          {navigation.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `flex min-h-12 cursor-pointer items-center gap-4 rounded-xl px-3 text-sm font-semibold transition ${isActive ? 'bg-[#f0edff] text-[#6454ce]' : 'text-[#757287] hover:bg-[#f7f6ff] hover:text-[#5145b2]'}`}>
              <span className="grid w-5 place-items-center text-lg">{icon}</span>{label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto">
          <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-[#8979ed] to-[#6d60d6] p-5 text-white">
            <span className="text-xl">✦</span>
            <strong className="text-sm">Make space for good work</strong>
            <span className="max-w-[190px] text-sm leading-relaxed text-[#e8e4ff]">Your tasks and ideas, all in one place.</span>
          </div>
          <button className="flex min-h-12 w-full cursor-pointer items-center gap-4 rounded-xl border-0 bg-transparent px-3 text-left text-sm font-semibold text-[#757287] transition hover:bg-[#f7f6ff] hover:text-[#5145b2]" onClick={signOut}><span className="grid w-5 place-items-center text-lg">↪</span>Sign out</button>
        </div>
      </aside>
      <main className="min-h-screen md:ml-[280px]">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#efedf4] bg-white/95 px-4 py-3 backdrop-blur-xl md:hidden">
          <NavLink to="/dashboard" className="inline-flex w-max items-center gap-2 text-base font-extrabold text-[#2c2941]"><span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#a99afa] to-[#7161df] text-sm text-white">T</span><span>taskflow</span></NavLink>
          <nav className="flex gap-1 overflow-x-auto">{navigation.map(({ to, label }) => <NavLink key={to} to={to} className={({ isActive }) => `whitespace-nowrap rounded-lg px-2 py-2 text-xs font-medium ${isActive ? 'bg-[#f0edff] text-[#6555d2]' : 'text-[#777487]'}`}>{label}</NavLink>)}</nav>
        </header>
        <div className="mx-auto max-w-[1680px] px-5 pb-16 pt-8 sm:px-8 lg:px-12 2xl:px-16">{children}</div>
      </main>
    </div>
  )
}
