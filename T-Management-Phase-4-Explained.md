# Phase 4 explained — the logic and the syntax

This note explains *why* the Phase 4 code works the way it does, and what each piece of syntax means. Read it next to `T-Management-Phase-4-Dashboard.md`.

---

## 1. The big picture

```
Browser (React)                        Server (Express)                 Postgres
─────────────────                      ────────────────                 ────────
DashboardPage
  loadDashboard() ── 4 requests ────►  getTasks / getStats  ── SQL ───► tasks table
        ▲                                     │                              │
        └────────── JSON responses ◄──────────┴──────── rows ◄───────────────┘
  setState(...) → React re-renders the sections
```

The whole feature rests on one idea: **the server does the filtering, the frontend just asks the right question.**

- "Today's tasks" is not a special endpoint. It's the same `GET /api/tasks` with `from` and `to` query params.
- "Priority tasks" is the same endpoint with `status=pending&priority=high`.
- "Stats" is the one exception: it has its own endpoint because it returns counts, not rows.

Reusing one flexible endpoint is why Phase 1 built `getTasks` with optional filters instead of one endpoint per page.

---

## 2. Backend: `getTasks` builds its SQL dynamically

```js
const { status, priority, search, from, to } = req.query
const conditions = ['user_id = $1']
const values = [req.userId]
```

### Destructuring
`const { status, priority } = req.query` is shorthand for:
```js
const status = req.query.status
const priority = req.query.priority
```
If the URL is `/api/tasks?status=pending`, then `status` is `'pending'` and every other variable is `undefined`.

### Two parallel arrays
The trick is keeping two arrays in sync:

| Array | Holds | Example |
|---|---|---|
| `conditions` | pieces of SQL text | `['user_id = $1', 'status = $2']` |
| `values` | the real values, in the same order | `[7, 'pending']` |

`$1`, `$2`... are **placeholders**. Postgres receives the SQL text and the values *separately* and slots them in itself. That's called a **parameterized query**, and it's what protects you from SQL injection. If you glued the values into the string yourself (`` `status = '${status}'` ``), a user could send `status=x'; DROP TABLE tasks;--` and it would run as SQL. With placeholders, that whole string is treated as plain data, never as code.

### The `$${...}` line
```js
conditions.push(`status = $${values.length + 1}`)
values.push(status)
```
This looks strange but it's two things stuck together inside a template literal:

- The first `$` is just a literal dollar sign character.
- `${values.length + 1}` is an interpolation, it evaluates to a number.

If `values` currently has 1 item, this produces the text `status = $2`. Then `values.push(status)` adds the matching value at position 2. Push the condition first and the value second, always, or the numbers will drift out of sync.

### Optional filters
```js
if (from) {
  conditions.push(`scheduled_start >= $${values.length + 1}`)
  values.push(from)
}
```
Each `if` only adds its condition when that query param was actually sent. No `from` in the URL means `from` is `undefined`, which is falsy, so the block is skipped.

### Building the final query
```js
`SELECT * FROM tasks WHERE ${conditions.join(' AND ')} ORDER BY ${orderBy}`
```
`conditions.join(' AND ')` glues the array into one string:
`user_id = $1 AND status = $2 AND scheduled_start >= $3`

Only the **condition text** (written by you) and `orderBy` (one of two strings you wrote) go into the SQL string. Nothing the user typed does. That's the rule that keeps this safe.

### Comparing to a date
`scheduled_start >= $3` compares a timestamp column to a string like `'2026-09-28T00:00:00'`. Postgres sees the placeholder is being compared to a timestamp column, so it converts the string to a timestamp for you.

- `from` is inclusive (`>=`) and `to` is exclusive (`<`). So "today" is `>= today 00:00` and `< tomorrow 00:00`. Using "exclusive end" means a task at 23:59 counts as today and one at exactly midnight tomorrow doesn't count twice.
- A task with no `scheduled_start` has `NULL` there. Any comparison with `NULL` is neither true nor false, so the row is excluded. That's why unscheduled tasks never show up in Today or Upcoming, without any extra code.

### The order
```js
const orderBy = from || to ? 'scheduled_start ASC' : 'created_at DESC'
```
This is a **ternary**: `condition ? valueIfTrue : valueIfFalse`. `from || to` is true if either exists. Date-filtered lists read best oldest-first (chronological), normal lists read best newest-first.

---

## 3. Date helpers (`lib/dates.js`)

### Why this file exists: local time vs UTC
`date.toISOString()` always gives **UTC** (e.g. `2026-09-28T08:00:00.000Z`). But when you pick "9:00" in the form, you mean 9:00 *on your wall clock*. If you sent UTC strings to the server while the database holds wall-clock values, "today" would be off by your timezone offset. So the helpers build the string from local parts instead.

### `padStart`
```js
const pad = (n) => String(n).padStart(2, '0')
```
`padStart(2, '0')` makes a string at least 2 characters long by adding zeros on the left. `pad(5)` gives `'05'`. Dates need this because `2026-9-8` isn't valid, it must be `2026-09-08`.

`(n) => ...` is an **arrow function**, a short way to write a function. With no `{}` after the arrow, whatever comes after is returned automatically.

### `toLocalParam`
```js
`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T...`
```
- `getMonth()` returns **0–11**, not 1–12 (January is 0). That's why there's a `+ 1`. This is one of the most famous JavaScript gotchas.
- `getFullYear()`, `getDate()`, `getHours()` are the *local* getters. (The UTC versions are named `getUTCHours()` etc.)
- The `T` between date and time is just the standard separator in this format.

### `toLocalInput`
```js
return toLocalParam(new Date(iso)).slice(0, 16)
```
An `<input type="datetime-local">` wants `YYYY-MM-DDTHH:mm` (16 characters, no seconds). `.slice(0, 16)` keeps the first 16 characters.

**The Phase 2 bug this fixes:** the API returns times as UTC strings like `2026-09-28T08:00:00.000Z`. The old code did `.slice(0, 16)` directly on that, which shows the UTC hour, not your local hour. In a UTC+1 timezone you'd see 08:00 when you originally chose 09:00, and saving would shift it again. Converting through `new Date(iso)` first, then reading local parts, fixes it.

### `startOfDay`
```js
const d = new Date()
d.setHours(0, 0, 0, 0)     // hours, minutes, seconds, ms → midnight
d.setDate(d.getDate() + offsetDays)
```
`setDate` handles overflow for you: on 30 September, `setDate(31 + 1)` correctly rolls into October. You never need to write month-length logic.

- `startOfDay(0)` is today at 00:00
- `startOfDay(1)` is tomorrow at 00:00
- `startOfDay(8)` is 8 days from now, which makes "upcoming = tomorrow up to (not including) day 8", i.e. the next 7 days after today.

### `formatTime` / `formatDay`
`toLocaleTimeString([], {...})` and `toLocaleDateString(undefined, {...})` format using the user's own language and region. The empty array / `undefined` means "use the browser default". The options object picks which parts to show (`weekday`, `day`, `month`, `hour`, `minute`).

---

## 4. Small components

### Props and destructuring
```jsx
export default function DashboardSection({ title, action, children }) {
```
A component receives one object of props. `{ title, action, children }` destructures it right in the parameter list.

### `children`
Whatever you put *between* the opening and closing tag becomes `children`:
```jsx
<DashboardSection title="Today's Tasks">
  <TaskList ... />        {/* this is `children` */}
</DashboardSection>
```
That makes `DashboardSection` a reusable frame: it draws the card and the title, and you decide what goes inside.

### `UpcomingTasks`: early return
```jsx
if (tasks.length === 0) {
  return <p>Nothing scheduled...</p>
}
```
A component can return early, like any function. The rest of the function only runs when there *are* tasks. This is cleaner than wrapping everything in one big ternary.

### `UpcomingTasks`: grouping with `reduce`
```js
const groups = tasks.reduce((acc, task) => {
  const day = formatDay(task.scheduled_start)
  ;(acc[day] ||= []).push(task)
  return acc
}, {})
```
`reduce` walks through an array while carrying an **accumulator** (`acc`) along. It starts as `{}` (the second argument). For each task:

1. Work out its day label, e.g. `"Tuesday, 29 Sep"`.
2. `acc[day] ||= []` means "if `acc[day]` doesn't exist yet, set it to a new empty array". (`||=` is *logical OR assignment*.)
3. `.push(task)` adds the task to that day's array.

After all tasks, `groups` looks like:
```js
{
  'Tuesday, 29 Sep': [taskC],
  'Thursday, 1 Oct': [taskD],
}
```
Because the server already sorted by `scheduled_start`, the keys are inserted in date order, and `Object.entries` returns them in that same order.

**Why the leading `;` in `;(acc[day] ||= [])`?** JavaScript lets you omit semicolons, but it guesses where lines end. The previous line is `const day = formatDay(...)` with no semicolon, and the next line starts with `(`. JS would read that as `formatDay(...)(acc[day] ...)`, a function call on the result. The `;` at the start forces a line break. It's a defensive habit when a line begins with `(` or `[`.

### Rendering an object as a list
```jsx
{Object.entries(groups).map(([day, dayTasks]) => (
  <div key={day}> ... </div>
))}
```
- `Object.entries(obj)` turns `{a: 1, b: 2}` into `[['a', 1], ['b', 2]]`.
- `([day, dayTasks])` destructures each pair straight into two variables.
- `key={day}` is required by React on every item in a mapped list, so it can track which item is which when the list changes. It must be unique among siblings.

### Conditional rendering
```jsx
{task.scheduled_start && (<p>...</p>)}
```
`a && b` returns `b` if `a` is truthy, otherwise `a`. React doesn't draw `null`/`undefined`/`false`, so the `<p>` only appears when the task has a time. Use `&&` for "show this or nothing" and a ternary (`cond ? A : B`) for "show this or that".

---

## 5. `DashboardPage`: the state and data flow

### State
```jsx
const [todayTasks, setTodayTasks] = useState([])
```
`useState` returns a pair: the current value and a function to change it. Calling `setTodayTasks(newArray)` doesn't just change the variable, it tells React "this changed, redraw the component". You never modify state directly (`todayTasks.push(...)` won't work).

The dashboard holds four lists, plus `user`, `stats`, and two pieces of modal state (`editingTask`, `showCreateForm`).

### `useCallback`
```jsx
const loadDashboard = useCallback(async () => { ... }, [])
```
Normally a component function creates a *new* copy of every inner function on every render. `useCallback` says "keep the same function between renders unless the dependency list changes". With `[]` it's created once.

That matters because `loadDashboard` is used inside a `useEffect` dependency list. Without `useCallback`, it would be a "new" function each render, the effect would re-run, which fetches data, which changes state, which re-renders, which re-runs the effect... an infinite loop. `useCallback` breaks that cycle.

### `async` / `await`
`await` pauses *this function* until a promise finishes, without freezing the page. It only works inside an `async` function. `apiRequest(...)` returns a promise because network calls take time.

### `Promise.all`
```js
const [statsData, priorityData, todayData, upcomingData] = await Promise.all([
  apiRequest('/tasks/stats'),
  apiRequest(...),
  apiRequest(...),
  apiRequest(...),
])
```
`Promise.all` takes an array of promises, starts them **all at once**, and finishes when the last one does, returning results in the same order you listed them. Four `await`s in a row would run them one after another, roughly four times slower. The left side uses array destructuring to name each result.

If any one request fails, `Promise.all` fails as a whole. That's the trade-off for the speed.

### `URLSearchParams`
```js
const query = (params) => `/tasks?${new URLSearchParams(params).toString()}`
query({ status: 'pending', priority: 'high' })
// → '/tasks?status=pending&priority=high'
```
It builds a query string from an object and **URL-encodes** special characters for you (the `:` in `2026-09-28T00:00:00` becomes `%3A`). Building that by hand with `+` and `&` is where subtle bugs come from.

### `useEffect`
```jsx
useEffect(() => {
  ...
}, [loadDashboard])
```
`useEffect` runs code *after* the component has drawn, which is where side effects like fetching belong. The array at the end is the **dependency list**: the effect re-runs only when something in it changes. Since `loadDashboard` never changes, this runs exactly once, when the page first loads.

Inside it:
1. No token in `localStorage`? Send the user to `/login` and stop (`return`).
2. Otherwise call `/auth/me`. If the token is expired or invalid, the `.catch` clears it and redirects.
3. Call `loadDashboard()` to fetch the four lists.

### Mutations reload everything
```jsx
const handleDelete = async (id) => {
  await apiRequest(`/tasks/${id}`, { method: 'DELETE' })
  loadDashboard()
}
```
After any change we simply re-fetch. Why not update the local arrays by hand?

Because one change affects several sections at once. Ticking off a high-priority task scheduled today changes Today's Tasks (it becomes struck through), Priority Tasks (it disappears), and the stats (Pending goes down). Patching each list manually is easy to get wrong. Re-fetching keeps **the database as the single source of truth** and the code short. (The trade-off is a few extra requests, which is fine at this size. `TasksPage` from Phase 3 updates local state instead, because it only has one list to worry about.)

### Callbacks as props
```jsx
<TaskForm onSaved={loadDashboard} onClose={() => setShowCreateForm(false)} />
```
`TaskForm` doesn't know anything about the dashboard. It only knows "when I finish saving, call the function I was given". The parent decides what that means. Passing functions down as props is how a child talks *up* to its parent in React.

`onClose={() => setShowCreateForm(false)}` uses an inline arrow function because it needs an argument. Writing `onClose={setShowCreateForm(false)}` would call it immediately during render instead of waiting for a click.

### Optional chaining
```jsx
user?.full_name?.split(' ')[0] || 'there'
```
- `user?.full_name` returns `undefined` instead of crashing if `user` is still `null`. That happens for the first moments before `/auth/me` responds.
- `.split(' ')[0]` takes the first word of the full name.
- `|| 'there'` is the fallback when everything before it is empty, giving "Hi there!" while loading.

### Modals shown by state
```jsx
{showCreateForm && (<TaskForm ... />)}
{editingTask && (<TaskForm task={editingTask} ... />)}
```
The two modals are always in the code but only *rendered* when their state is truthy. `showCreateForm` is a boolean. `editingTask` is either `null` (closed) or the task object being edited, which is exactly the data the form needs. One piece of state doing two jobs is a common React pattern.

---

## 6. Syntax cheat sheet

| Syntax | Meaning | Example |
|---|---|---|
| `const { a, b } = obj` | Pull properties out of an object | `const { status } = req.query` |
| `const [x, y] = arr` | Pull items out of an array | `const [user, setUser] = useState(null)` |
| `` `text ${expr}` `` | Template literal with interpolation | `` `/tasks/${id}` `` |
| `a ? b : c` | Ternary (inline if/else) | `status === 'done' ? 'line-through' : ''` |
| `a && b` | b only if a is truthy | `{error && <p>{error}</p>}` |
| `a \|\| b` | b if a is falsy | `priority \|\| 'medium'` |
| `a ||= b` | Set a to b only if a is falsy | `acc[day] \|\|= []` |
| `a?.b` | Read b only if a exists | `user?.email` |
| `(x) => x + 1` | Arrow function | `arr.map((t) => t.title)` |
| `arr.map(fn)` | Transform each item | render a list of components |
| `arr.filter(fn)` | Keep items where fn returns true | `tasks.filter(t => t.status === 'pending')` |
| `arr.reduce(fn, start)` | Fold an array into one value | group tasks by day |
| `async` / `await` | Wait for a promise | `const data = await apiRequest(...)` |
| `...obj` | Spread: copy properties in | `{ ...headers, Authorization: token }` |

---

## 7. Common mistakes to watch for

1. **Pushing to `values` in the wrong order.** The `$n` number and the position in `values` must match. Condition first, value second, every time.
2. **Forgetting `key` on mapped items.** React warns in the console, and list updates can behave strangely.
3. **Mutating state directly.** `tasks.push(x)` does nothing visible. Always call the setter with a new array.
4. **Calling a function instead of passing it.** `onClick={doThing()}` runs during render. Use `onClick={doThing}` or `onClick={() => doThing(id)}`.
5. **Mixing UTC and local time.** If "today" ever looks off by an hour or a day, check whether one side used `toISOString()` and the other used local time.
6. **`getMonth()` off by one.** It's zero-based. January is `0`.
7. **Forgetting the dependency array on `useEffect`.** With no array it re-runs after *every* render.

## 8. Rough edges you should know about

- `loadDashboard()` is called in the effect without a `.catch`. If the token is invalid, `/auth/me` redirects you, but the parallel `loadDashboard` requests also fail and log an unhandled error in the console. It's harmless here, but a good habit to add error handling around it later.
- Times only round-trip correctly because your server and browser share a timezone. For a deployed app, store times as `TIMESTAMPTZ`.
- The Upcoming window ("the next 7 days") is a hardcoded number in `startOfDay(8)`. If you want it configurable, that number is the one place to change.
