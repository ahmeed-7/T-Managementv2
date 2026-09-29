import { useState, useEffect, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import StatsCards from '../components/StatsCards'
import QuickAddTask from '../components/QuickAddTask'
import PriorityFilter from '../components/PriorityFilter'
import TaskList from '../components/TaskList'
import TaskForm from '../components/TaskForm'
import { apiRequest } from '../lib/api'

export default function TasksPage({ status, title, showStats = false }) {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState(null)
  const [priority, setPriority] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadTasks = useCallback(() => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (priority) params.set('priority', priority)
    setLoading(true)
    apiRequest(`/tasks?${params.toString()}`)
      .then((data) => setTasks(data.tasks))
      .finally(() => setLoading(false))
  }, [status, priority])

  const refreshStats = () => {
    if (showStats) apiRequest('/tasks/stats').then(setStats)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { window.location.href = '/login'; return }
    apiRequest('/auth/me').then((data) => setUser(data.user)).catch(() => {
      localStorage.removeItem('token')
      window.location.href = '/login'
    })
  }, [])

  useEffect(() => { loadTasks() }, [loadTasks])
  useEffect(refreshStats, [showStats, tasks.length])

  const handleToggle = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    const data = await apiRequest(`/tasks/${task.id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) })
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === task.id ? data.task : t))
      return status ? updated.filter((t) => t.status === status) : updated
    })
    refreshStats()
  }

  const handleDelete = async (id) => {
    await apiRequest(`/tasks/${id}`, { method: 'DELETE' })
    setTasks((prev) => prev.filter((t) => t.id !== id))
    refreshStats()
  }

  const handleSaved = (task) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id)
      const updated = exists ? prev.map((t) => (t.id === task.id ? task : t)) : [task, ...prev]
      return status ? updated.filter((t) => t.status === status) : updated
    })
    refreshStats()
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar user={user} />
      <main className="flex-1 p-8">
        <Topbar onCreateTask={() => setShowCreateForm(true)} />
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        <p className="text-gray-500 text-sm mb-6">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {showStats && <StatsCards stats={stats} />}
        <QuickAddTask onCreated={handleSaved} />
        <PriorityFilter value={priority} onChange={setPriority} />

        {loading ? (
          <p className="text-gray-500 text-sm">Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onEdit={setEditingTask}
            onDelete={handleDelete}
            emptyMessage={status === 'pending' ? 'No pending tasks' : status === 'completed' ? 'No completed tasks yet' : 'No tasks yet'}
          />
        )}
      </main>

      {showCreateForm && <TaskForm task={null} onClose={() => setShowCreateForm(false)} onSaved={handleSaved} />}
      {editingTask && <TaskForm task={editingTask} onClose={() => setEditingTask(null)} onSaved={handleSaved} />}
    </div>
  )
}