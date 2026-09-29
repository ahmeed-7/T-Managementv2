import { FileText, Clock, CheckCircle2 } from 'lucide-react'

export default function StatsCards({ stats }) {
  const cards = [
    { label: 'Total Tasks', value: stats?.total ?? 0, icon: FileText, color: 'bg-purple-500/20 text-purple-400' },
    { label: 'Pending', value: stats?.pending ?? 0, icon: Clock, color: 'bg-yellow-500/20 text-yellow-400' },
    { label: 'Completed', value: stats?.completed ?? 0, icon: CheckCircle2, color: 'bg-teal-500/20 text-teal-400' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}