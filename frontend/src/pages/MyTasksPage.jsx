import { useMemo, useState } from 'react'
import WorkspaceLayout from '../components/WorkspaceLayout'
import TaskEditor from '../components/TaskEditor'
import TaskRow from '../components/TaskRow'
import useTasks from '../lib/useTasks'

export default function MyTasksPage() {
  const { tasks, loading, error, refresh, saveTask, deleteTask } = useTasks()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [editingTask, setEditingTask] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [actionError, setActionError] = useState('')

  const filteredTasks = useMemo(() => tasks.filter((task) => (
    task.title.toLowerCase().includes(search.trim().toLowerCase())
    && (statusFilter === 'all' || task.status === statusFilter)
    && (priorityFilter === 'all' || task.priority === priorityFilter)
  )), [tasks, search, statusFilter, priorityFilter])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return
    setActionError('')
    try {
      await deleteTask(id)
    } catch (deleteError) {
      setActionError(deleteError.message)
    }
  }

  const toggleTask = async (task) => {
    setActionError('')
    try {
      await saveTask({ ...task, status: task.status === 'completed' ? 'pending' : 'completed' })
    } catch (saveError) {
      setActionError(saveError.message)
    }
  }

  const openEditor = (task = null) => {
    setEditingTask(task)
    setEditorOpen(true)
  }

  return (
    <WorkspaceLayout>
      <div className="mb-7 flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-start max-sm:gap-3">
        <div><span className="text-xs font-bold tracking-[1.3px] text-[#9b99aa]">YOUR WORKSPACE</span><h1 className="my-2 text-[clamp(30px,3vw,42px)] font-bold leading-tight tracking-tight text-[#27243a]">My tasks</h1><p className="m-0 text-base leading-relaxed text-[#89879a]">Keep track of what matters and make progress one step at a time.</p></div>
        <button className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#796be8] px-5 text-sm font-semibold text-white transition hover:bg-[#6b5cda]" onClick={() => openEditor()}>＋ New task</button>
      </div>
      <section className="mb-5 grid grid-cols-3 gap-4 max-sm:gap-2">
        <div className="grid min-h-[140px] grid-cols-[44px_1fr] grid-rows-[auto_auto_auto] content-center gap-x-3 rounded-2xl border border-[#efedf4] bg-white p-5 max-sm:min-h-[110px] max-sm:grid-cols-[32px_1fr] max-sm:gap-x-2 max-sm:p-3"><span className="row-span-3 grid h-11 w-11 place-items-center rounded-xl bg-[#f0edff] text-lg text-[#7667df] max-sm:h-8 max-sm:w-8">▤</span><span className="text-sm text-[#8d8a9d] max-sm:text-xs">All tasks</span><strong className="text-2xl leading-tight text-[#2d2a40]">{tasks.length}</strong><small className="text-xs text-[#aaa8b5] max-sm:text-[10px]">in your workspace</small></div>
        <div className="grid min-h-[140px] grid-cols-[44px_1fr] grid-rows-[auto_auto_auto] content-center gap-x-3 rounded-2xl border border-[#efedf4] bg-white p-5 max-sm:min-h-[110px] max-sm:grid-cols-[32px_1fr] max-sm:gap-x-2 max-sm:p-3"><span className="row-span-3 grid h-11 w-11 place-items-center rounded-xl bg-[#fff4e4] text-lg text-[#d4984b] max-sm:h-8 max-sm:w-8">◷</span><span className="text-sm text-[#8d8a9d] max-sm:text-xs">To do</span><strong className="text-2xl leading-tight text-[#2d2a40]">{tasks.filter((task) => task.status !== 'completed').length}</strong><small className="text-xs text-[#aaa8b5] max-sm:text-[10px]">ready when you are</small></div>
        <div className="grid min-h-[140px] grid-cols-[44px_1fr] grid-rows-[auto_auto_auto] content-center gap-x-3 rounded-2xl border border-[#efedf4] bg-white p-5 max-sm:min-h-[110px] max-sm:grid-cols-[32px_1fr] max-sm:gap-x-2 max-sm:p-3"><span className="row-span-3 grid h-11 w-11 place-items-center rounded-xl bg-[#e8f7f1] text-lg text-[#42a58b] max-sm:h-8 max-sm:w-8">✓</span><span className="text-sm text-[#8d8a9d] max-sm:text-xs">Completed</span><strong className="text-2xl leading-tight text-[#2d2a40]">{tasks.filter((task) => task.status === 'completed').length}</strong><small className="text-xs text-[#aaa8b5] max-sm:text-[10px]">nice work</small></div>
      </section>
      <section className="min-w-0 rounded-2xl border border-[#efedf4] bg-white p-6 shadow-[0_5px_20px_rgba(40,35,66,0.025)] max-sm:p-4">
        <div className="mb-5 flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-[#302d43]">All tasks</h2><p className="mt-1 text-sm text-[#9996a8]">Search, filter, and update your list.</p></div><span className="whitespace-nowrap rounded-full bg-[#f1efff] px-3 py-1.5 text-xs font-semibold text-[#8175d6]">{filteredTasks.length} shown</span></div>
        <div className="mb-4 flex gap-3 max-sm:flex-wrap">
          <label className="flex min-h-11 flex-1 items-center gap-2 rounded-xl border border-[#eae9f0] bg-white px-3 text-[#9b99aa] focus-within:border-[#a69bec] focus-within:ring-4 focus-within:ring-[#796be814] max-sm:basis-full"><span className="text-xl">⌕</span><input className="w-full min-w-0 border-0 bg-transparent text-sm text-[#39364d] outline-none placeholder:text-[#aaa8b6]" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks…" aria-label="Search tasks" /></label>
          <select className="min-h-11 rounded-xl border border-[#eae9f0] bg-white py-0 pl-3 pr-8 text-sm text-[#726f84] outline-none focus:border-[#a69bec]" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter by status"><option value="all">All statuses</option><option value="pending">To do</option><option value="in_progress">In progress</option><option value="completed">Completed</option></select>
          <select className="min-h-11 rounded-xl border border-[#eae9f0] bg-white py-0 pl-3 pr-8 text-sm text-[#726f84] outline-none focus:border-[#a69bec]" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} aria-label="Filter by priority"><option value="all">All priorities</option><option value="high">High priority</option><option value="medium">Medium priority</option><option value="low">Low priority</option></select>
        </div>
        {error && <div className="my-3 flex items-center justify-between gap-3 rounded-xl border border-[#f7d0d2] bg-[#fff2f1] px-4 py-3 text-sm text-[#b44850]" role="alert">{error} <button className="cursor-pointer rounded bg-[#fce3e2] px-3 py-1 text-sm text-[#a43e49]" onClick={refresh}>Retry</button></div>}
        {actionError && <div className="my-3 rounded-xl border border-[#f7d0d2] bg-[#fff2f1] px-4 py-3 text-sm text-[#b44850]" role="alert">{actionError}</div>}
        {loading ? <div className="flex min-h-[220px] items-center justify-center text-sm text-[#8d8a9c]">Loading your tasks…</div> : filteredTasks.length ? (
          <div className="flex flex-col">
            {filteredTasks.map((task) => <TaskRow key={task.id} task={task} onEdit={openEditor} onDelete={handleDelete} onToggle={toggleTask} />)}
          </div>
        ) : <div className="flex min-h-[220px] flex-col items-center justify-center p-6 text-center text-[#8d8a9c]"><span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f0edff] text-xl text-[#796be8]">✓</span><strong className="mt-3 text-base text-[#48455a]">{search ? 'No matching tasks' : 'A clear slate'}</strong><p className="my-2 text-sm">{search ? 'Try a different search or filter.' : 'Create your first task to get started.'}</p></div>}
      </section>
      {editorOpen && <TaskEditor task={editingTask} onClose={() => setEditorOpen(false)} onSave={saveTask} />}
    </WorkspaceLayout>
  )
}
