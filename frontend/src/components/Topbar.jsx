import { Search, Bell, Plus } from 'lucide-react'

export default function Topbar({ onCreateTask }) {
  return (
    <div className="flex items-center justify-between mb-8 gap-4">
      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 hover:text-white">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full" />
        </button>
        <button
          onClick={onCreateTask}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90"
        >
          <Plus size={16} /> Create New Task
        </button>
      </div>
    </div>
  )
}