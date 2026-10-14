import pool from '../db.js'

export async function getTasks(req, res) {
  const { status, priority, search } = req.query
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

  const query = `SELECT * FROM tasks WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`
  const result = await pool.query(query, values)
  res.json({ tasks: result.rows })
}

export async function createTasks(req, res) {
  const { title, priority, status, scheduled_start, scheduled_end } = req.body
  if (!title?.trim()) return res.status(400).json({ error: 'A task title is required.' })
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'Priority must be low, medium, or high.' })
  }
  if (status && !['pending', 'in_progress', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Status must be pending, in progress, or completed.' })
  }
  if (scheduled_start && scheduled_end && new Date(scheduled_end) < new Date(scheduled_start)) {
    return res.status(400).json({ error: 'The end time must be after the start time.' })
  }

  const result = await pool.query(
    `INSERT INTO tasks (title, user_id, priority, status, scheduled_start, scheduled_end)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title.trim(), req.userId, priority || 'medium', status || 'pending', scheduled_start || null, scheduled_end || null],
  )
  res.status(201).json({ task: result.rows[0] })
}

export async function updateTasks(req, res) {
  const { title, status, priority, scheduled_start, scheduled_end } = req.body
  const fields = []
  const values = []

  if (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: 'Priority must be low, medium, or high.' })
  }
  if (status !== undefined && !['pending', 'in_progress', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Status must be pending, in progress, or completed.' })
  }
  if (title !== undefined) {
    if (!title.trim()) return res.status(400).json({ error: 'A task title is required.' })
    fields.push(`title = $${values.length + 1}`)
    values.push(title.trim())
  }
  if (status !== undefined) {
    fields.push(`status = $${values.length + 1}`)
    values.push(status)
    fields.push(`completed_at = $${values.length + 1}`)
    values.push(status === 'completed' ? new Date() : null)
  }
  if (priority !== undefined) {
    fields.push(`priority = $${values.length + 1}`)
    values.push(priority)
  }
  if (scheduled_start !== undefined) {
    fields.push(`scheduled_start = $${values.length + 1}`)
    values.push(scheduled_start)
  }
  if (scheduled_end !== undefined) {
    fields.push(`scheduled_end = $${values.length + 1}`)
    values.push(scheduled_end)
  }
  if (!fields.length) return res.status(400).json({ error: 'No fields to update.' })
  if (scheduled_start && scheduled_end && new Date(scheduled_end) < new Date(scheduled_start)) {
    return res.status(400).json({ error: 'The end time must be after the start time.' })
  }

  values.push(req.params.id, req.userId)
  const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${values.length - 1} AND user_id = $${values.length} RETURNING *`
  const result = await pool.query(query, values)
  if (!result.rows.length) return res.status(404).json({ error: 'Task not found.' })
  res.json({ task: result.rows[0] })
}

export async function deleteTask(req, res) {
  const result = await pool.query(
    'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
    [req.params.id, req.userId],
  )
  if (!result.rows.length) return res.status(404).json({ error: 'Task not found.' })
  res.status(204).send()
}

export async function getStats(req, res) {
  const result = await pool.query(
    `SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'pending') AS pending,
      COUNT(*) FILTER (WHERE status = 'completed') AS completed
    FROM tasks WHERE user_id = $1`,
    [req.userId],
  )
  const row = result.rows[0]
  res.json({
    total: Number(row.total),
    pending: Number(row.pending),
    completed: Number(row.completed),
  })
}
