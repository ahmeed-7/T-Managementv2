import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pool from './db.js'
import authRoutes from "./routes/auth.routes.js"
import taskRoutes from "./routes/tasks.routes.js"
const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/auth",authRoutes)
app.use('/api/tasks',taskRoutes)
app.get('/api/health', async (req, res) => {
  const result = await pool.query('SELECT NOW()')
  res.json({ status: 'ok', dbTime: result.rows[0].now })
})

app.use((err, req, res, next) => {
  console.error(err)
  if (res.headersSent) return next(err)
  res.status(500).json({ error: 'Internal server error.' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`))