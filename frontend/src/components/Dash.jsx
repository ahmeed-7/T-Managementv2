import { useState } from 'react'
import { Link } from 'react-router-dom'
import TaskEditor from './TaskEditor'
import TaskRow from './TaskRow'
import useTasks from '../lib/useTasks'
import { readStorage, userStorageKey } from '../lib/browserStorage'
import { taskOccursOnDate } from '../lib/taskDates'

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function Dash({ userName }) {
  const { tasks, loading, error, saveTask, deleteTask } = useTasks()
  const [editingTask, setEditingTask] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [actionError, setActionError] = useState('')
  const projects = readStorage(userStorageKey('projects'), [])
  const today = new Date()
  const todayKey = dateKey(today)
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  const week = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(weekStart)
    day.setDate(day.getDate() + index)
    const key = dateKey(day)
    return { day, key, tasks: tasks.filter((task) => taskOccursOnDate(task, day)) }
  })
  const todayTasks = tasks.filter((task) => taskOccursOnDate(task, today))
  const openTasks = tasks.filter((task) => task.status !== 'completed').sort((first, second) => (
    (first.status === 'in_progress' ? -1 : 0) - (second.status === 'in_progress' ? -1 : 0)
    || ({ high: 0, medium: 1, low: 2 }[first.priority] ?? 1) - ({ high: 0, medium: 1, low: 2 }[second.priority] ?? 1)
  )).slice(0, 4)
  const name = (userName || 'there').split('@')[0].split(' ')[0]

  const save = async (task) => {
    try {
      await saveTask(task)
      setActionError('')
    } catch (saveError) {
      setActionError(saveError.message)
      throw saveError
    }
  }

  return (
    <div className="text-[#262338]">
      <div className="mb-3 text-sm text-[#8f8d9e]">{new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(today)}</div>
      <div className="mb-7 flex items-center justify-between gap-6 max-sm:items-start max-sm:gap-3">
        <div><span className="text-xs font-bold tracking-[1.3px] text-[#9b99aa]">YOUR DAY, YOUR WAY</span><h1 className="my-2 text-[clamp(32px,3.2vw,46px)] font-bold leading-tight tracking-[-1.5px] text-[#27243a]">Good {today.getHours() < 12 ? 'morning' : today.getHours() < 18 ? 'afternoon' : 'evening'}, {name} <span className="text-2xl text-[#b7aafa]">✦</span></h1><p className="m-0 text-base leading-relaxed text-[#89879a]">A little focus goes a long way. Here’s what’s happening in your workspace.</p></div>
        <Link className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#796be8] px-5 text-sm font-semibold text-white shadow-[0_5px_13px_rgba(121,107,232,0.18)] transition hover:-translate-y-0.5 hover:bg-[#6b5cda] max-sm:self-center" to="/tasks">＋ Add a task</Link>
      </div>
      <div className="mb-5 grid grid-cols-3 gap-4 max-sm:gap-2">
        <article className="flex min-h-[96px] items-center gap-3 rounded-2xl border border-[#efedf4] bg-white p-5 max-sm:gap-2 max-sm:p-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f0edff] text-lg text-[#7667df] max-sm:h-8 max-sm:w-8">✓</span><div className="flex flex-col gap-1"><small className="text-xs text-[#8f8c9d]">Open tasks</small><strong className="text-2xl text-[#2d2a40] max-sm:text-xl">{tasks.filter((task) => task.status !== 'completed').length}</strong></div><span className="ml-auto text-xs text-[#aaa7b5] max-sm:hidden">to keep moving</span></article>
        <article className="flex min-h-[96px] items-center gap-3 rounded-2xl border border-[#efedf4] bg-white p-5 max-sm:gap-2 max-sm:p-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#fff4e4] text-lg text-[#d4984b] max-sm:h-8 max-sm:w-8">◷</span><div className="flex flex-col gap-1"><small className="text-xs text-[#8f8c9d]">Due today</small><strong className="text-2xl text-[#2d2a40] max-sm:text-xl">{todayTasks.filter((task) => task.status !== 'completed').length}</strong></div><span className="ml-auto text-xs text-[#aaa7b5] max-sm:hidden">on your schedule</span></article>
        <article className="flex min-h-[96px] items-center gap-3 rounded-2xl border border-[#efedf4] bg-white p-5 max-sm:gap-2 max-sm:p-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e8f7f1] text-lg text-[#42a58b] max-sm:h-8 max-sm:w-8">✦</span><div className="flex flex-col gap-1"><small className="text-xs text-[#8f8c9d]">Projects</small><strong className="text-2xl text-[#2d2a40] max-sm:text-xl">{projects.length}</strong></div><span className="ml-auto text-xs text-[#aaa7b5] max-sm:hidden">ideas in motion</span></article>
      </div>
      {(error || actionError) && <div className="my-3 flex items-center justify-between gap-3 rounded-xl border border-[#f7d0d2] bg-[#fff2f1] px-4 py-3 text-sm text-[#b44850]" role="alert">{error || actionError}</div>}
      <div className="grid grid-cols-2 items-start gap-5 max-lg:gap-4 max-md:grid-cols-1">
        <section className="min-h-[320px] rounded-2xl border border-[#efedf4] bg-white p-6 shadow-[0_5px_20px_rgba(40,35,66,0.025)] max-sm:p-4">
          <div className="mb-5 flex items-center justify-between gap-3"><div><span className="text-xs font-bold tracking-[1.3px] text-[#9b99aa]">STAY ON TRACK</span><h2 className="mt-1 text-xl font-bold text-[#302d43]">My tasks</h2></div><Link to="/tasks" className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-bold text-[#7263dd] hover:text-[#5243c1]">View all <span>→</span></Link></div>
          <div className="flex items-center gap-2 rounded-lg bg-[#eff9f6] p-3 text-xs font-bold tracking-wide text-[#4a9c8a]"><span className="h-2 w-2 rounded-full bg-[#58b39c]" />OPEN TASKS <span className="ml-auto rounded-full bg-[#dff2eb] px-2 py-1 text-[#4a9c8a]">{tasks.filter((task) => task.status !== 'completed').length}</span></div>
          {loading ? <div className="py-5 text-sm text-[#9895a7]">Loading your tasks…</div> : openTasks.length ? <div className="flex flex-col">
            {openTasks.map((task) => <TaskRow key={task.id} task={task} onEdit={(item) => { setEditingTask(item); setEditorOpen(true) }} onDelete={async (id) => { if (window.confirm('Delete this task?')) { try { await deleteTask(id) } catch (deleteError) { setActionError(deleteError.message) } } }} onToggle={(item) => save({ ...item, status: item.status === 'completed' ? 'pending' : 'completed' })} />)}
          </div> : <div className="py-5 text-sm text-[#9895a7]">{tasks.length ? 'No open tasks right now. Nice and steady.' : 'Add your first task to get started.'}</div>}
          <Link to="/tasks" className="mt-4 inline-flex text-sm font-bold text-[#7465dc]">＋ Manage all tasks</Link>
        </section>
        <section className="min-h-[320px] rounded-2xl border border-[#efedf4] bg-white p-6 shadow-[0_5px_20px_rgba(40,35,66,0.025)] max-sm:p-4">
          <div className="mb-5 flex items-center justify-between gap-3"><div><span className="text-xs font-bold tracking-[1.3px] text-[#9b99aa]">MAKE PROGRESS</span><h2 className="mt-1 text-xl font-bold text-[#302d43]">Projects</h2></div><Link to="/projects" className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-bold text-[#7263dd] hover:text-[#5243c1]">See all <span>→</span></Link></div>
          {projects.slice(0, 4).map((project) => <Link to="/projects" className="flex items-center gap-3 border-b border-[#f0eff4] py-4" key={project.id}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white" style={{ backgroundColor: project.color || '#796ce6' }}>✦</span><span className="flex min-w-0 flex-1 flex-col gap-1"><strong className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#3a374d]">{project.name}</strong><small className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-[#9b99a9]">{project.description || (project.status === 'completed' ? 'Completed' : 'A project in progress')}</small></span><span className="text-base text-[#aaa7b5]">↗</span></Link>)}
          {!projects.length && <div className="flex flex-col items-center py-7"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f0edff] text-lg text-[#796be8]">◫</span><p className="my-3 text-sm text-[#9895a7]">Your projects will show up here.</p><Link to="/projects" className="text-sm font-bold text-[#7263dd]">Create a project →</Link></div>}
          <Link to="/projects" className="mt-4 inline-flex text-sm font-bold text-[#7465dc]">＋ Create new project</Link>
        </section>
        <section className="rounded-2xl border border-[#efedf4] bg-white p-6 shadow-[0_5px_20px_rgba(40,35,66,0.025)] max-sm:p-4">
          <div className="mb-5 flex items-center justify-between gap-3"><div><span className="text-xs font-bold tracking-[1.3px] text-[#9b99aa]">YOUR WEEK AT A GLANCE</span><h2 className="mt-1 text-xl font-bold text-[#302d43]">Calendar <span className="ml-1 text-sm font-medium text-[#aaa7b5]">{new Intl.DateTimeFormat(undefined, { month: 'long' }).format(today)}</span></h2></div><Link to="/calendar" className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-bold text-[#7263dd] hover:text-[#5243c1]">Open calendar <span>→</span></Link></div>
          <div className="grid grid-cols-7 gap-2 py-2 sm:gap-3">{week.map(({ day, key, tasks: dayTasks }) => <Link to="/calendar" key={key} className="flex flex-col items-center gap-2 rounded-xl py-2"><span className={`text-xs ${key === todayKey ? 'font-bold text-[#7566dc]' : 'text-[#a3a1af]'}`}>{new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(day)}</span><strong className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-semibold ${key === todayKey ? 'bg-[#796be8] text-white' : 'text-[#4d4a60]'}`}>{day.getDate()}</strong><i className={`h-1.5 w-1.5 rounded-full ${dayTasks.length ? 'bg-[#e59a60]' : 'bg-transparent'}`} /></Link>)}</div>
          <div className="border-t border-[#f0eff4] pt-4"><div className="mb-2 flex items-center justify-between"><strong className="text-sm text-[#48455b]">Today’s schedule</strong><span className="text-xs text-[#aaa7b5]">{todayTasks.length} {todayTasks.length === 1 ? 'task' : 'tasks'}</span></div>
            {todayTasks.slice(0, 3).map((task) => <button className="flex w-full cursor-pointer items-center gap-3 border-0 border-b border-[#f5f4f7] bg-white px-1 py-3 text-left" key={task.id} onClick={() => { setEditingTask(task); setEditorOpen(true) }}><span className={`h-8 w-1 shrink-0 rounded-full ${task.priority === 'high' ? 'bg-[#e57e84]' : task.priority === 'low' ? 'bg-[#59b39c]' : 'bg-[#eab766]'}`} /><span className="flex min-w-0 flex-1 flex-col gap-1"><strong className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-[#49465b]">{task.title}</strong><small className="text-xs text-[#aaa7b5]">{task.scheduled_start ? new Date(task.scheduled_start).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'Due'}{task.scheduled_start && task.scheduled_end ? ` – ${new Date(task.scheduled_end).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : ''}</small></span><span className={`rounded-md px-2 py-1 text-[11px] font-bold capitalize ${task.priority === 'high' ? 'bg-[#ffeded] text-[#c6636c]' : task.priority === 'low' ? 'bg-[#e8f7f1] text-[#378a77]' : 'bg-[#fff3e1] text-[#b98238]'}`}>{task.priority || 'medium'}</span></button>)}
            {!todayTasks.length && <div className="py-4 text-sm text-[#9895a7]">Nothing scheduled for today yet.</div>}
          </div>
        </section>
        <section className="flex min-h-[280px] items-center gap-6 overflow-hidden rounded-2xl border border-[#efedf4] bg-gradient-to-br from-white to-[#faf8ff] p-7 max-sm:min-h-[210px] max-sm:gap-4 max-sm:p-4">
          <div className="relative grid h-40 w-32 shrink-0 place-items-center rounded-[45%] bg-[#f4f0ff] text-4xl text-[#8272e5] max-sm:h-28 max-sm:w-20"><span>✦</span><span className="absolute right-2 top-4 text-2xl text-[#e2ab70]">✧</span><span className="absolute bottom-3 left-3 text-xl text-[#83c5ae]">✳</span></div><div><span className="text-xs font-bold tracking-[1.3px] text-[#9b99aa]">A GENTLE REMINDER</span><h2 className="my-2 text-xl font-bold text-[#37344a]">Small steps count.</h2><p className="mb-4 max-w-[280px] text-sm leading-relaxed text-[#9290a1]">Pick one thing, give it your attention, and let the rest wait its turn.</p><Link to="/notes" className="inline-flex items-center gap-1 text-sm font-bold text-[#7263dd]">Open your notes <span>→</span></Link></div>
        </section>
      </div>
      {editorOpen && <TaskEditor task={editingTask} onClose={() => setEditorOpen(false)} onSave={save} />}
    </div>
  )
}
