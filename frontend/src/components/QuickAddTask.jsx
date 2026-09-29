import { useState } from 'react'
import { Plus } from 'lucide-react'
import { apiRequest } from '../lib/api'

export default function QuickAddTask({ onCreated }) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      const data = await apiRequest('/tasks', { method: 'POST', body: JSON.stringify({ title }) })
      onCreated(data.task)
      setTitle('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What do you need to do?"
        className="flex-1 px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 disabled:opacity-50"
      >
        <Plus size={18} /> Add Task
      </button>
    </form>
  )
}