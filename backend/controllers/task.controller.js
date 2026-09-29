import pool from "../db.js"

// get task
export async function getTasks(req,res){
    const {
        status, priority, search
    }=req.query
    const conditions=['user_id=$1']
    const values=[req.userId]
    if(status){
        conditions.push(`status = $${values.length+1}`)
        values.push(status)
    }
    if(priority){
        conditions.push(`priority = $${values.length+1}`)
        values.push(priority)
    }
    if(search){
        conditions.push(`title ILIKE $${values.length+1}`)
        values.push(`%${search}%`)
    }

    const query=`SELECT * FROM tasks WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`
    const result = await pool.query(query, values)
    res.json({tasks:result.rows})
    
}

// create task

export async function createTask(req,res){
    const {title, priority, scheduled_start, scheduled_end}=req.body
    if(!title){
        return res.status(400).json({error:'Title is required'})
    }
    const result= await pool.query(
        `insert into tasks (title,user_id,priority,scheduled_start,scheduled_end)
        values ($1,$2,$3,$4,$5) 
        returning *`,
    [title,req.userId,priority || 'medium', scheduled_start || null, scheduled_end || null]
    )
    res.json({task:result.rows[0]})
}

export async function updateTask(req, res) {
  const { id } = req.params
  const { title, status, priority, scheduled_start, scheduled_end } = req.body

  const fields = []
  const values = []

  if (title !== undefined) { fields.push(`title = $${values.length + 1}`); values.push(title) }
  if (status !== undefined) {
    fields.push(`status = $${values.length + 1}`); values.push(status)
    fields.push(`completed_at = $${values.length + 1}`); values.push(status === 'completed' ? new Date() : null)
  }
  if (priority !== undefined) { fields.push(`priority = $${values.length + 1}`); values.push(priority) }
  if (scheduled_start !== undefined) { fields.push(`scheduled_start = $${values.length + 1}`); values.push(scheduled_start) }
  if (scheduled_end !== undefined) { fields.push(`scheduled_end = $${values.length + 1}`); values.push(scheduled_end) }

  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' })

  values.push(id, req.userId)
  const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${values.length - 1} AND user_id = $${values.length} RETURNING *`
  const result = await pool.query(query, values)

  if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' })
  res.json({ task: result.rows[0] })
}

export async function deleteTask(req, res) {
  const { id } = req.params
  const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id', [id, req.userId])
  if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' })
  res.status(204).send()
}

export async function getStats(req, res) {
  const result = await pool.query(
    `SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'pending') AS pending,
      COUNT(*) FILTER (WHERE status = 'completed') AS completed
     FROM tasks WHERE user_id = $1`,
    [req.userId]
  )
  const row = result.rows[0]
  res.json({
    total: Number(row.total),
    pending: Number(row.pending),
    completed: Number(row.completed),
  })
}

