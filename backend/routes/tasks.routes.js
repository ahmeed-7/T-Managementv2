import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import { getTasks, createTasks, updateTasks, deleteTask, getStats } from '../controllers/auth.tasks.js'

const router = Router()
router.use(authenticateToken) // every task route requires a valid token

router.get('/', getTasks)
router.post('/',createTasks)
router.get('/stats', getStats)
router.patch('/:id', updateTasks)
router.delete('/:id', deleteTask)

export default router