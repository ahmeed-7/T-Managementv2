import { useCallback, useEffect, useState } from 'react'
import { apiRequest } from './api'

export default function useTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTasks = useCallback(async (isCurrent = () => true) => {
    try {
      const result = await apiRequest('/tasks')
      if (isCurrent()) setTasks(result.tasks)
    } catch (requestError) {
      if (isCurrent()) setError(requestError.message)
    } finally {
      if (isCurrent()) setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    Promise.resolve().then(() => loadTasks(() => active))
    return () => { active = false }
  }, [loadTasks])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    await loadTasks()
  }, [loadTasks])

  const saveTask = async (task) => {
    const isEditing = Boolean(task.id)
    const result = await apiRequest(isEditing ? `/tasks/${task.id}` : '/tasks', {
      method: isEditing ? 'PATCH' : 'POST',
      body: JSON.stringify(task),
    })
    const savedTask = result.task
    setTasks((current) => (
      isEditing
        ? current.map((item) => item.id === savedTask.id ? savedTask : item)
        : [savedTask, ...current]
    ))
    return savedTask
  }

  const deleteTask = async (id) => {
    await apiRequest(`/tasks/${id}`, { method: 'DELETE' })
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  return { tasks, loading, error, refresh, saveTask, deleteTask, setTasks }
}
