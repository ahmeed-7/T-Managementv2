import { useEffect, useState } from 'react'

function toInputDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

export default function TaskEditor({ task, initialDate, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || '')
  const [priority, setPriority] = useState(task?.priority || 'medium')
  const [status, setStatus] = useState(task?.status || 'pending')
  const [start, setStart] = useState(toInputDate(task?.scheduled_start || initialDate))
  const [end, setEnd] = useState(toInputDate(task?.scheduled_end))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const onKeyDown = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave({
        ...(task?.id ? { id: task.id } : {}),
        title: title.trim(),
        priority,
        status,
        scheduled_start: start ? new Date(start).toISOString() : null,
        scheduled_end: end ? new Date(end).toISOString() : null,
      })
      onClose()
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center overflow-y-auto bg-[#29253c]/40 p-5 backdrop-blur-[3px]" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="max-h-[min(90vh,760px)] w-full max-w-[540px] overflow-y-auto rounded-2xl border border-[#efedf4] bg-white p-7 shadow-[0_24px_70px_rgba(33,29,58,0.18)] max-sm:p-5" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div className="mb-6 flex items-start justify-between">
          <div><span className="text-xs font-bold tracking-[1.3px] text-[#9b99aa]">TASK DETAILS</span><h2 id="task-modal-title" className="mt-1 text-2xl font-bold tracking-tight text-[#302d43]">{task ? 'Edit task' : 'Create a task'}</h2></div>
          <button className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-xl text-[#9996a9] hover:bg-[#f3f1ff] hover:text-[#6556ce]" type="button" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form onSubmit={submit}>
          <label className="mb-5 flex flex-1 flex-col gap-2 text-sm font-semibold text-[#605d73]">Task name
            <input className="min-h-11 w-full rounded-xl border border-[#e8e6ef] bg-white px-3 text-base text-[#373449] outline-none placeholder:text-[#b1afbb] focus:border-[#a69bec] focus:ring-4 focus:ring-[#796be814]" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What needs to get done?" required autoFocus />
          </label>
          <div className="flex gap-3 max-sm:gap-2">
            <label className="mb-5 flex flex-1 flex-col gap-2 text-sm font-semibold text-[#605d73]">Priority
              <select className="min-h-11 w-full rounded-xl border border-[#e8e6ef] bg-white px-3 text-base text-[#373449] outline-none focus:border-[#a69bec]" value={priority} onChange={(event) => setPriority(event.target.value)}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </label>
            <label className="mb-5 flex flex-1 flex-col gap-2 text-sm font-semibold text-[#605d73]">Status
              <select className="min-h-11 w-full rounded-xl border border-[#e8e6ef] bg-white px-3 text-base text-[#373449] outline-none focus:border-[#a69bec]" value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="pending">To do</option><option value="in_progress">In progress</option><option value="completed">Completed</option>
              </select>
            </label>
          </div>
          <div className="flex gap-3 max-sm:gap-2">
            <label className="mb-5 flex flex-1 flex-col gap-2 text-sm font-semibold text-[#605d73]">Starts
              <input className="min-h-11 w-full rounded-xl border border-[#e8e6ef] bg-white px-3 text-sm text-[#373449] outline-none focus:border-[#a69bec]" type="datetime-local" value={start} onChange={(event) => setStart(event.target.value)} />
            </label>
            <label className="mb-5 flex flex-1 flex-col gap-2 text-sm font-semibold text-[#605d73]">Ends
              <input className="min-h-11 w-full rounded-xl border border-[#e8e6ef] bg-white px-3 text-sm text-[#373449] outline-none focus:border-[#a69bec]" type="datetime-local" value={end} min={start || undefined} onChange={(event) => setEnd(event.target.value)} />
            </label>
          </div>
          {error && <p className="mb-3 text-sm text-[#c14852]" role="alert">{error}</p>}
          <div className="flex justify-end gap-2 pt-2"><button className="min-h-11 cursor-pointer rounded-xl border border-[#e9e8ef] bg-white px-4 text-sm font-semibold text-[#666478] hover:bg-[#f8f7fc]" type="button" onClick={onClose}>Cancel</button><button className="min-h-11 cursor-pointer rounded-xl bg-[#796be8] px-4 text-sm font-semibold text-white hover:bg-[#6b5cda] disabled:cursor-wait disabled:opacity-60" disabled={saving}>{saving ? 'Saving…' : task ? 'Save changes' : 'Create task'}</button></div>
        </form>
      </section>
    </div>
  )
}
