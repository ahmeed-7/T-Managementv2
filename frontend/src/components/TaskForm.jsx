import { useState } from 'react'
import { X } from 'lucide-react'
import Input from './Input'
import Button from './Button'
import { apiRequest } from '../lib/api'

export default function TaskForm({ task, onClose, onSaved }) {
  const [title, setTitle] = useState(task?.title || '')
  const [priority, setPriority] = useState(task?.priority || 'medium')
  const [scheduledStart, setScheduledStart] = useState(task?.scheduled_start?.slice(0, 16) || '')
  const [scheduledEnd, setScheduledEnd] = useState(task?.scheduled_end?.slice(0, 16) || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isEditing = Boolean(task)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body = {
        title,
        priority,
        scheduled_start: scheduledStart || null,
        scheduled_end: scheduledEnd || null,
      }
      const data = isEditing
        ? await apiRequest(`/tasks/${task.id}`, { method: 'PATCH', body: JSON.stringify(body) })
        : await apiRequest('/tasks', { method: 'POST', body: JSON.stringify(body) })
      onSaved(data.task)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X size={18} />
        </button>
        <h2 className="text-lg font-bold text-white mb-4">{isEditing ? 'Edit Task' : 'New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <Input label="Start (optional)" type="datetime-local" value={scheduledStart} onChange={(e) => setScheduledStart(e.target.value)} />
          <Input label="End (optional)" type="datetime-local" value={scheduledEnd} onChange={(e) => setScheduledEnd(e.target.value)} />

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </form>
      </div>
    </div>
  )
}