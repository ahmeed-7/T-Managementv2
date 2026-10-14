export function scheduledDate(task) {
  return task.scheduled_start || task.scheduled_end || null
}

export function taskOccursOnDate(task, date) {
  const first = task.scheduled_start || task.scheduled_end
  const last = task.scheduled_end || task.scheduled_start
  if (!first || !last) return false
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const start = new Date(first)
  const end = new Date(last)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime()
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime()
  return day >= startDay && day <= endDay
}
