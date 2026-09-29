import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ListTodo, Clock, CheckCircle2, LogOut } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tasks', label: 'All Tasks', icon: ListTodo },
  { to: '/tasks/pending', label: 'Pending', icon: Clock },
  { to: '/tasks/completed', label: 'Completed', icon: CheckCircle2 },
]

export default function Sidebar({ user }) {
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <aside className="w-64 min-h-screen bg-zinc-950 border-r border-white/10 flex flex-col justify-between px-4 py-6">
      <div>
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">T</div>
          <span className="font-bold text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">T-Management</span>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold" >{user?.email[0].toUpperCase()}</div>
          <div>
            <p className="text-sm font-medium">{user?.full_name || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-gray-500 hover:text-white">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  )
}