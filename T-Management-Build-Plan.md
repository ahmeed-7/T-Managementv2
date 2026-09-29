# T-Management — Build Plan

Ordered plan for the Dashboard, Tasks, Schedule, and Search features. Work through the phases top to bottom — later phases depend on earlier ones (the schema changes in Phase 0 are needed before the API in Phase 1, etc.).

## Phase 0 — Schema updates
Do this before touching any API code, since the endpoints depend on these fields existing.
- [x] Add `priority` column to `tasks` (e.g. `TEXT CHECK (priority IN ('low','medium','high')) DEFAULT 'medium'`)
- [x] Add `scheduled_start` and `scheduled_end` columns to `tasks` (nullable timestamps — not every task needs a time slot)
- [x] Decide if `status` stays just `pending`/`completed`, or expands (e.g. adds `in_progress`) — affects the UI toggle later

## Phase 1 — Task API
- [ ] `GET /api/tasks` — list, with optional query params: `?status=`, `?priority=`, `?search=`
- [ ] `POST /api/tasks` — create (title, priority, scheduled_start/end optional)
- [ ] `PATCH /api/tasks/:id` — update (title, status, priority, schedule — one endpoint handles all edits)
- [ ] `DELETE /api/tasks/:id`
- [ ] `GET /api/tasks/stats` — counts for the dashboard/stat cards
- [ ] All routes behind `requireAuth`, scoped to `req.userId`

## Phase 2 — Shared frontend pieces
- [ ] `TaskItem` — checkbox to toggle complete, title, priority badge, edit + delete actions
- [ ] `TaskForm` (modal or drawer) — used for both create and edit; fields: title, priority, optional scheduled start/end
- [ ] Shared `TaskList` layout used across every page that shows tasks

## Phase 3 — Tasks pages
- [ ] `/tasks` — stat cards (Total/Pending/Completed) + "what do you need to do?" input + full list
- [ ] `/tasks/pending` and `/tasks/completed` — same list/TaskItem, filtered by status
- [ ] Add a priority filter control (dropdown or chips) on these list pages
- [ ] Wire "Create New Task" (currently just an alert) to open `TaskForm`

## Phase 4 — Dashboard sections
- [ ] Keep: Welcome banner (done), Priority Tasks panel (done — connect to real high-priority tasks)
- [ ] Add: **Today's Tasks** section — tasks scheduled for today
- [ ] Add: **Upcoming Tasks** section — tasks scheduled in the next few days
- [ ] Decide: does **Statistics** (stat cards) belong on the Dashboard too, or stay only on `/tasks`? Either way, plug it in here

## Phase 5 — Schedule (weekly calendar)
- [ ] Replace hardcoded calendar data with real tasks (using `scheduled_start`/`scheduled_end`)
- [ ] Clicking an existing task block opens it in `TaskForm` for editing
- [ ] Clicking an empty time slot opens `TaskForm` pre-filled with that date/time

## Phase 6 — Search
- [ ] Wire the Topbar search input to `GET /api/tasks?search=`
- [ ] Add status filter control (if not already covered by Phase 3)
- [ ] Add priority filter control (shared with Phase 3, so build once, use in both places)

## Phase 7 — Polish
- [ ] Loading states while data fetches
- [ ] Empty states (matches the original "No tasks yet" screen)
- [ ] Responsiveness pass across all pages

---

**Already built (frontend):** Landing page, Login page, Register page, Dashboard shell (Sidebar, Topbar, HeroBanner, PriorityTasks, ScheduleCalendar — currently with hardcoded data).

**Already built (backend):** Express + Postgres connection, `users` and `tasks` tables (pre-Phase-0 shape), auth endpoints (`register`, `login`, `me`), JWT auth middleware.
