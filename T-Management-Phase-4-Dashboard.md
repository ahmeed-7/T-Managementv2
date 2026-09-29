# Phase 4 — Dashboard with real data

Goal: replace the hardcoded arrays on the Dashboard with real tasks from your API, and add the two sections from your feature list that don't exist yet: **Today's Tasks** and **Upcoming Tasks**.

## What you'll have at the end

- [ ] Statistics cards on the Dashboard (real numbers)
- [ ] Priority Tasks panel showing your real pending high-priority tasks
- [ ] Today's Tasks section (tasks scheduled today, with toggle / edit / delete)
- [ ] Upcoming Tasks section (pending tasks scheduled in the next 7 days, grouped by day)
- [ ] "Create New Task" on the Dashboard opens the real `TaskForm` (no more alert)

The weekly calendar stays hardcoded for now. That's Phase 5.

**Decision made for you:** Statistics appear on the Dashboard *and* on `/tasks`. Both use the same `StatsCards` component, so if you change your mind, delete one line.

---

## Step 1 — Backend: date filtering on `GET /api/tasks`

"Today" and "upcoming" need to filter by `scheduled_start`. Add two optional query params, `from` and `to`, in `server/controllers/task.controller.js`.

Replace the top of `getTasks` with:

```js
export async function getTasks(req, res) {
  const { status, priority, search, from, to } = req.query
  const conditions = ['user_id = $1']
  const values = [req.userId]

  if (status) {
    conditions.push(`status = $${values.length + 1}`)
    values.push(status)
  }
  if (priority) {
    conditions.push(`priority = $${values.length + 1}`)
    values.push(priority)
  }
  if (search) {
    conditions.push(`title ILIKE $${values.length + 1}`)
    values.push(`%${search}%`)
  }
  if (from) {
    conditions.push(`scheduled_start >= $${values.length + 1}`)
    values.push(from)
  }
  if (to) {
    conditions.push(`scheduled_start < $${values.length + 1}`)
    values.push(to)
  }

  // date-filtered lists read best in chronological order
  const orderBy = from || to ? 'scheduled_start ASC' : 'created_at DESC'

  const query = `SELECT * FROM tasks WHERE ${conditions.join(' AND ')} ORDER BY ${orderBy}`
  const result = await pool.query(query, values)
  res.json({ tasks: result.rows })
}
```

Tasks with no scheduled time are automatically excluded whenever `from`/`to` is used (a NULL never matches a comparison), which is exactly what you want here.

**Test it in Postman before touching the frontend** (dates below are for 28 Sept 2026, adjust to your day):

```
GET {{baseUrl}}/api/tasks?from=2026-09-28T00:00:00&to=2026-09-29T00:00:00
```

You should get only tasks whose `scheduled_start` falls today.

---

## Step 2 — Date helpers

`client/src/lib/dates.js`:

```js
const pad = (n) => String(n).padStart(2, '0')

// Local wall-clock string "YYYY-MM-DDTHH:mm:ss".
// Matches how TaskForm saves times, so comparisons in the DB line up.
export function toLocalParam(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

// Value for <input type="datetime-local"> from an ISO string the API returned
export function toLocalInput(iso) {
  if (!iso) return ''
  return toLocalParam(new Date(iso)).slice(0, 16)
}

// Midnight today, plus an optional day offset (1 = tomorrow, 8 = a week from tomorrow)
export function startOfDay(offsetDays = 0) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + offsetDays)
  return d
}

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDay(iso) {
  return new Date(iso).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })
}
```

### Fix a bug from Phase 2 while you're here

In `TaskForm.jsx`, the edit form pre-fills times with `task?.scheduled_start?.slice(0, 16)`. The API sends times as UTC, so if your timezone isn't UTC, editing a task shows (and re-saves) a shifted time. Use the helper instead:

```jsx
import { toLocalInput } from '../lib/dates'

const [scheduledStart, setScheduledStart] = useState(toLocalInput(task?.scheduled_start))
const [scheduledEnd, setScheduledEnd] = useState(toLocalInput(task?.scheduled_end))
```

> **Known limitation:** this round-trips correctly because your server and browser are on the same machine (same timezone). If you deploy the app later, change the columns to `TIMESTAMPTZ` so times are stored unambiguously.

---

## Step 3 — Small building blocks

### `client/src/components/DashboardSection.jsx`

A titled card wrapper so Today's / Upcoming share one look.

```jsx
export default function DashboardSection({ title, action, children }) {
  return (
    <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}
```

### `client/src/components/UpcomingTasks.jsx`

Compact read-only rows, grouped by day.

```jsx
import { formatDay, formatTime } from '../lib/dates'

export default function UpcomingTasks({ tasks }) {
  if (tasks.length === 0) {
    return <p className="text-sm text-gray-500">Nothing scheduled for the next 7 days.</p>
  }

  // tasks arrive sorted by scheduled_start, so groups stay in date order
  const groups = tasks.reduce((acc, task) => {
    const day = formatDay(task.scheduled_start)
    ;(acc[day] ||= []).push(task)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-5">
      {Object.entries(groups).map(([day, dayTasks]) => (
        <div key={day}>
          <p className="text-xs text-gray-500 mb-2">{day}</p>
          <div className="flex flex-col gap-2">
            {dayTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between bg-black/30 border border-white/5 rounded-lg px-3 py-2">
                <p className="text-sm text-white">{task.title}</p>
                <span className="text-xs text-gray-400">{formatTime(task.scheduled_start)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

### `client/src/components/PriorityTasks.jsx` (rewrite)

Now takes real tasks as a prop instead of a hardcoded array.

```jsx
import { Link } from 'react-router-dom'
import { formatDay, formatTime } from '../lib/dates'

export default function PriorityTasks({ tasks }) {
  return (
    <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">Priority Tasks</h3>
        <Link to="/tasks/pending" className="text-sm text-purple-400 hover:underline">View All</Link>
      </div>

      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500">No high-priority tasks pending.</p>
      ) : (
        <div className="flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1">
          {tasks.map((task) => (
            <div key={task.id} className="border-l-4 border-pink-500 bg-pink-500/20 rounded-lg p-3">
              <p className="text-sm font-medium text-white">{task.title}</p>
              {task.scheduled_start && (
                <p className="text-xs text-gray-400 mt-1">
                  {formatDay(task.scheduled_start)} · {formatTime(task.scheduled_start)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## Step 4 — Rewrite the Dashboard page

The whole page loads with one function, `loadDashboard`, that fetches everything in parallel. Every action (toggle, delete, save) just calls it again, which is simpler than juggling four separate lists in state.

`client/src/pages/DashboardPage.jsx`:

```jsx
import { useState, useEffect, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import HeroBanner from '../components/HeroBanner'
import StatsCards from '../components/StatsCards'
import DashboardSection from '../components/DashboardSection'
import TaskList from '../components/TaskList'
import UpcomingTasks from '../components/UpcomingTasks'
import PriorityTasks from '../components/PriorityTasks'
import ScheduleCalendar from '../components/ScheduleCalendar'
import TaskForm from '../components/TaskForm'
import { apiRequest } from '../lib/api'
import { toLocalParam, startOfDay } from '../lib/dates'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [priorityTasks, setPriorityTasks] = useState([])
  const [todayTasks, setTodayTasks] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const loadDashboard = useCallback(async () => {
    const todayStart = toLocalParam(startOfDay(0))
    const tomorrowStart = toLocalParam(startOfDay(1))
    const weekEnd = toLocalParam(startOfDay(8))

    const query = (params) => `/tasks?${new URLSearchParams(params).toString()}`

    const [statsData, priorityData, todayData, upcomingData] = await Promise.all([
      apiRequest('/tasks/stats'),
      apiRequest(query({ status: 'pending', priority: 'high' })),
      apiRequest(query({ from: todayStart, to: tomorrowStart })),
      apiRequest(query({ status: 'pending', from: tomorrowStart, to: weekEnd })),
    ])

    setStats(statsData)
    setPriorityTasks(priorityData.tasks)
    setTodayTasks(todayData.tasks)
    setUpcomingTasks(upcomingData.tasks)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }
    apiRequest('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('token')
        window.location.href = '/login'
      })
    loadDashboard()
  }, [loadDashboard])

  const handleToggle = async (task) => {
    const status = task.status === 'completed' ? 'pending' : 'completed'
    await apiRequest(`/tasks/${task.id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
    loadDashboard()
  }

  const handleDelete = async (id) => {
    await apiRequest(`/tasks/${id}`, { method: 'DELETE' })
    loadDashboard()
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar user={user} />
      <main className="flex-1 p-8">
        <Topbar onCreateTask={() => setShowCreateForm(true)} />
        <HeroBanner name={user?.full_name?.split(' ')[0] || 'there'} />
        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mb-6">
          <div className="flex flex-col gap-6">
            <DashboardSection title="Today's Tasks">
              {todayTasks.length === 0 ? (
                <p className="text-sm text-gray-500">Nothing scheduled for today.</p>
              ) : (
                <TaskList
                  tasks={todayTasks}
                  onToggle={handleToggle}
                  onEdit={setEditingTask}
                  onDelete={handleDelete}
                />
              )}
            </DashboardSection>

            <DashboardSection title="Upcoming Tasks">
              <UpcomingTasks tasks={upcomingTasks} />
            </DashboardSection>
          </div>

          <PriorityTasks tasks={priorityTasks} />
        </div>

        {/* still hardcoded, replaced with real data in Phase 5 */}
        <ScheduleCalendar />
      </main>

      {showCreateForm && (
        <TaskForm task={null} onClose={() => setShowCreateForm(false)} onSaved={loadDashboard} />
      )}
      {editingTask && (
        <TaskForm task={editingTask} onClose={() => setEditingTask(null)} onSaved={loadDashboard} />
      )}
    </div>
  )
}
```

Notes:
- The manual `Authorization` header from the old version is gone. `apiRequest` attaches the token itself since Phase 2.
- Priority Tasks = your **pending high-priority** tasks, scheduled or not.
- Today's Tasks includes completed ones (shown struck through), so ticking something off doesn't make it vanish. Upcoming only shows pending ones.

---

## Step 5 — Test it end to end

Create these through the "Create New Task" button on the Dashboard:

| Task | Priority | Start |
|---|---|---|
| Task A | medium | today, any time |
| Task B | high | today, any time |
| Task C | low | tomorrow |
| Task D | medium | 3 days from now |
| Task E | high | no time set |

Expected result:

- [ ] Stat cards show Total 5 / Pending 5 / Completed 0
- [ ] **Today's Tasks** shows A and B
- [ ] **Upcoming Tasks** shows C and D, under two different day headings
- [ ] **Priority Tasks** shows B and E (E has no time line, that's fine)
- [ ] Tick off B in Today's Tasks: it stays there struck through, disappears from Priority Tasks, and Pending drops to 4
- [ ] Edit a task's time via the pencil icon: the form shows the same time you originally chose (this confirms the timezone fix worked)
- [ ] Delete a task: every section and the stat cards update

## Phase 4 checklist (from the build plan)

- [x] Welcome banner
- [ ] Priority Tasks connected to real high-priority tasks
- [ ] Today's Tasks section
- [ ] Upcoming Tasks section
- [ ] Statistics on the Dashboard

Next: **Phase 5**, replacing the hardcoded weekly calendar with real scheduled tasks and click-to-create.
