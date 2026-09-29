import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import HeroBanner from '../components/HeroBanner'
import PriorityTasks from '../components/PriorityTasks'
import ScheduleCalendar from '../components/ScheduleCalendar'
import TaskForm from '../components/TaskForm'
import { apiRequest } from '../lib/api'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }
    apiRequest('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('token')
        window.location.href = '/login'
      })
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar user={user} />
      <main className="flex-1 p-8">
        <Topbar onCreateTask={() => setShowCreateForm(true)} />
        <HeroBanner name={user?.full_name?.split(' ')[0] || user?.email?.split('@')[0]} />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <ScheduleCalendar />
          <PriorityTasks />
        </div>
      </main>

      {showCreateForm && (
        <TaskForm
          task={null}
          onClose={() => setShowCreateForm(false)}
          onSaved={() => setShowCreateForm(false)}
        />
      )}
    </div>
  )
}