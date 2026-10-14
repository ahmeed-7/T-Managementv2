import { useMemo, useState } from 'react'
import WorkspaceLayout from '../components/WorkspaceLayout'
import TaskEditor from '../components/TaskEditor'
import useTasks from '../lib/useTasks'
import { scheduledDate } from '../lib/taskDates'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function monthCells(month) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const startOffset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const count = Math.ceil((startOffset + daysInMonth) / 7) * 7
  return Array.from({ length: count }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index - startOffset + 1))
}

export default function CalendarPage() {
  const { tasks, loading, error, saveTask } = useTasks()
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [editingTask, setEditingTask] = useState(null)
  const [initialDate, setInitialDate] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [actionError, setActionError] = useState('')
  const cells = useMemo(() => monthCells(month), [month])
  const todayKey = dateKey(new Date())
  const title = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(month)

  const tasksByDate = useMemo(() => tasks.reduce((all, task) => {
    const taskDate = scheduledDate(task)
    if (!taskDate) return all
    const start = new Date(taskDate)
    const end = task.scheduled_end ? new Date(task.scheduled_end) : start
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return all
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate())
    const last = new Date(end.getFullYear(), end.getMonth(), end.getDate())
    while (date <= last) {
      const key = dateKey(date)
      all[key] ||= []
      all[key].push(task)
      date.setDate(date.getDate() + 1)
    }
    return all
  }, {}), [tasks])

  const changeMonth = (amount) => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1))
  const openNewTask = (day) => {
    setInitialDate(new Date(day.getFullYear(), day.getMonth(), day.getDate(), 9).toISOString())
    setEditingTask(null)
    setEditorOpen(true)
  }

  return (
    <WorkspaceLayout>
      <div className="mb-7 flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start max-sm:gap-3">
        <div><span className="text-xs font-bold tracking-[1.3px] text-[#9b99aa]">PLAN YOUR TIME</span><h1 className="my-2 text-[clamp(30px,3vw,42px)] font-bold leading-tight tracking-tight text-[#27243a]">Calendar</h1><p className="m-0 text-base leading-relaxed text-[#89879a]">See what’s scheduled and plan the days ahead.</p></div>
        <button className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#796be8] px-5 text-sm font-semibold text-white transition hover:bg-[#6b5cda]" onClick={() => openNewTask(new Date())}>＋ Schedule a task</button>
      </div>
      <section className="rounded-2xl border border-[#efedf4] bg-white p-6 shadow-[0_5px_20px_rgba(40,35,66,0.025)] max-sm:p-3">
        <div className="mb-5 flex items-center justify-between gap-4 max-sm:items-start">
          <div><h2 className="text-2xl font-bold tracking-tight text-[#302d43]">{title}</h2><p className="mt-1 text-sm text-[#9996a8]">Tasks with a scheduled start or end date appear here.</p></div>
          <div className="flex items-center gap-1"><button className="min-h-9 cursor-pointer rounded-lg border border-[#e9e8ef] bg-white px-3 text-xs font-semibold text-[#666478] hover:bg-[#f8f7fc]" onClick={() => setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}>Today</button><button className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-[#efedf4] bg-white text-xl text-[#777487] hover:bg-[#f8f7fc]" aria-label="Previous month" onClick={() => changeMonth(-1)}>‹</button><button className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-[#efedf4] bg-white text-xl text-[#777487] hover:bg-[#f8f7fc]" aria-label="Next month" onClick={() => changeMonth(1)}>›</button></div>
        </div>
        {error && <div className="my-3 rounded-xl border border-[#f7d0d2] bg-[#fff2f1] px-4 py-3 text-sm text-[#b44850]" role="alert">{error}</div>}
        {actionError && <div className="my-3 rounded-xl border border-[#f7d0d2] bg-[#fff2f1] px-4 py-3 text-sm text-[#b44850]" role="alert">{actionError}</div>}
        {loading ? <div className="flex min-h-[220px] items-center justify-center text-sm text-[#8d8a9c]">Loading scheduled tasks…</div> : (
          <div className="grid grid-cols-7 border-l border-t border-[#efedf4]">
            {weekDays.map((day) => <div className="grid min-h-11 place-items-center border-b border-r border-[#efedf4] bg-[#fbfaff] text-sm font-semibold text-[#777487]" key={day}>{day}</div>)}
            {cells.map((day) => {
              const key = dateKey(day)
              const dayTasks = tasksByDate[key] || []
              return (
                <div key={key} className={`min-h-[125px] overflow-hidden border-b border-r border-[#efedf4] p-2 max-sm:min-h-[78px] max-sm:p-1 ${day.getMonth() !== month.getMonth() ? 'bg-[#fcfcfe]' : 'bg-white'}`}>
                  <button className={`grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 text-sm ${key === todayKey ? 'bg-[#796be8] font-bold text-white' : day.getMonth() !== month.getMonth() ? 'bg-transparent text-[#c3c1cc]' : 'bg-transparent text-[#626074] hover:bg-[#f3f0ff] hover:text-[#6959d4]'}`} onClick={() => openNewTask(day)} aria-label={`Add task on ${day.toLocaleDateString()}`}>{day.getDate()}</button>
                  <div className="mt-1 flex flex-col gap-1">
                    {dayTasks.slice(0, 3).map((task) => <button key={task.id} className={`overflow-hidden cursor-pointer rounded border-0 border-l-[3px] px-2 py-1 text-left text-xs text-ellipsis whitespace-nowrap max-sm:px-1 max-sm:text-[9px] ${task.priority === 'high' ? 'border-[#e3858c] bg-[#fff0f0] text-[#a95159]' : task.priority === 'low' ? 'border-[#66b5a2] bg-[#eef9f5] text-[#387f70]' : 'border-[#e7b466] bg-[#fff7e9] text-[#9a7137]'}`} title={task.title} onClick={() => { setEditingTask(task); setInitialDate(null); setEditorOpen(true) }}>{task.title}</button>)}
                    {dayTasks.length > 3 && <span className="text-xs text-[#8f8b9f]">+{dayTasks.length - 3} more</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-2 pt-4 text-xs text-[#898697]"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#e3858c]" />High priority</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#e7b466]" />Medium priority</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#66b5a2]" />Low priority</span></div>
      </section>
      <section className="mt-5 rounded-2xl border border-[#efedf4] bg-white p-6 shadow-[0_5px_20px_rgba(40,35,66,0.025)]">
        <div className="mb-3"><h2 className="text-xl font-bold text-[#302d43]">Upcoming</h2><p className="mt-1 text-sm text-[#9996a8]">Next scheduled tasks, based on your actual dates.</p></div>
        {tasks.filter((task) => {
          const endDate = new Date(task.scheduled_end || scheduledDate(task))
          return scheduledDate(task) && task.status !== 'completed' && !Number.isNaN(endDate.getTime()) && endDate >= new Date(new Date().setHours(0, 0, 0, 0))
        }).sort((a, b) => new Date(scheduledDate(a)) - new Date(scheduledDate(b))).slice(0, 5).map((task) => (
          <button className="flex w-full cursor-pointer items-center gap-4 border-0 border-t border-[#f0eff4] bg-transparent px-1 py-4 text-left" key={task.id} onClick={() => { setEditingTask(task); setInitialDate(null); setEditorOpen(true) }}>
            <span className={`min-w-[58px] rounded-lg px-2 py-2 text-center text-xs font-bold ${task.priority === 'high' ? 'bg-[#ffeded] text-[#c6636c]' : task.priority === 'low' ? 'bg-[#e8f7f1] text-[#378a77]' : 'bg-[#fff3e1] text-[#b98238]'}`}>{new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(scheduledDate(task)))}</span>
            <span className="flex flex-1 flex-col gap-1"><strong className="text-sm text-[#48455b]">{task.title}</strong><small className="text-xs text-[#a09eae]">{new Intl.DateTimeFormat(undefined, { weekday: 'long', ...(task.scheduled_start ? { hour: 'numeric', minute: '2-digit' } : {}) }).format(new Date(scheduledDate(task)))}</small></span><span className={`rounded-md px-2 py-1 text-xs font-bold capitalize ${task.priority === 'high' ? 'bg-[#ffeded] text-[#c6636c]' : task.priority === 'low' ? 'bg-[#e8f7f1] text-[#378a77]' : 'bg-[#fff3e1] text-[#b98238]'}`}>{task.priority || 'medium'}</span>
          </button>
        ))}
        {!loading && !tasks.some((task) => scheduledDate(task) && task.status !== 'completed' && new Date(task.scheduled_end || scheduledDate(task)) >= new Date(new Date().setHours(0, 0, 0, 0))) && <div className="py-4 text-sm text-[#9895a7]">No upcoming tasks yet. Schedule one to see it here.</div>}
      </section>
      {editorOpen && <TaskEditor task={editingTask} initialDate={initialDate} onClose={() => setEditorOpen(false)} onSave={async (task) => { try { await saveTask(task); setActionError('') } catch (saveError) { setActionError(saveError.message); throw saveError } }} />}
    </WorkspaceLayout>
  )
}
