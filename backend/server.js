import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pool from './db.js'
import authRoutes from './routes/auth.routes.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth',authRoutes);

app.get('/api/health', async (req, res) => {
  const result = await pool.query('SELECT NOW()')
  res.json({ status: 'ok', dbTime: result.rows[0].now })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))