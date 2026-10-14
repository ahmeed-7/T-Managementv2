import { scheduledDate } from '../lib/taskDates'

function dateLabel(value) {
  if (!value) return 'No date'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'No date'
  if (date.toDateString() === new Date().toDateString()) return 'Today'
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date)
}

export default function TaskRow({ task, onEdit, onDelete, onToggle }) {
  const done = task.status === 'completed'
  const date = scheduledDate(task)
  const priorityStyles = {
    high: 'bg-[#ffeded] text-[#c6636c]',
    medium: 'bg-[#fff3e1] text-[#b98238]',
    low: 'bg-[#e8f7f1] text-[#378a77]',
  }
  return (
    <article className="flex min-h-[76px] items-center gap-4 border-t border-[#f0eff4]">
      <button className={`grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded-md border-[1.5px] text-xs text-white transition ${done ? 'border-[#8273e6] bg-[#8273e6]' : 'border-[#d6d4e0] bg-white hover:border-[#8c7fe8]'}`} aria-label={done ? 'Mark as to do' : 'Mark completed'} onClick={() => onToggle(task)}>
        {done ? '✓' : ''}
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <strong className={`overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold ${done ? 'text-[#aaa8b3] line-through' : 'text-[#373449]'}`}>{task.title}</strong>
        <span className="text-xs text-[#a09eae]">{date ? new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' }).format(new Date(date)) : task.status === 'in_progress' ? 'In progress' : 'No scheduled date'}</span>
      </div>
      <span className={`w-max rounded-md px-2 py-1 text-[11px] font-bold capitalize ${priorityStyles[task.priority] || priorityStyles.medium}`}>{task.priority || 'medium'}</span>
      <span className="hidden w-[60px] text-right text-xs text-[#9997a8] sm:inline">{dateLabel(date)}</span>
      <div className="flex items-center gap-1">
        <button className="inline-grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-base text-[#9996a9] hover:bg-[#f3f1ff] hover:text-[#6556ce]" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}>✎</button>
        <button className="inline-grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-lg text-[#9996a9] hover:bg-[#fff0f0] hover:text-[#d65e69]" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task.id)}>×</button>
      </div>
    </article>
  )
}
