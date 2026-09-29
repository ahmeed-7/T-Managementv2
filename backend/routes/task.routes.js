import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import { getTasks, createTask, updateTask, deleteTask, getStats } from '../controllers/task.controller.js'

const router = Router()
router.use(authenticateToken) // every task route requires a valid token

router.get('/', getTasks)
router.post('/',createTask)
router.get('/stats', getStats)
router.patch('/:id', updateTask)
router.delete('/:id', deleteTask)

export default router