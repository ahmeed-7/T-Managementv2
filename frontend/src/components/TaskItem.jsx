import { Pencil, Trash2 } from 'lucide-react'

const priorityStyles = {
  low: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
  medium: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  high: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const isCompleted = task.status === 'completed'

  return (
    <div className="flex items-center gap-3 bg-zinc-900/60 border border-white/10 rounded-xl px-4 py-3">
      <button
        onClick={() => onToggle(task)}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
          isCompleted ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-transparent' : 'border-gray-500'
        }`}
      >
        {isCompleted && <span className="w-2 h-2 bg-white rounded-full" />}
      </button>

      <p className={`flex-1 text-sm ${isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>
        {task.title}
      </p>

      <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityStyles[task.priority] || priorityStyles.medium}`}>
        {task.priority}
      </span>

      <button onClick={() => onEdit(task)} className="text-gray-500 hover:text-white">
        <Pencil size={16} />
      </button>
      <button onClick={() => onDelete(task.id)} className="text-gray-500 hover:text-red-400">
        <Trash2 size={16} />
      </button>
    </div>
  )
}