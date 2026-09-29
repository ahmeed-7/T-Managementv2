import TaskItem from './TaskItem'

export default function TaskList({ tasks, onToggle, onEdit, onDelete, emptyMessage = 'No tasks yet' }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg font-semibold text-white mb-1">{emptyMessage}</p>
        <p className="text-sm">Add your first task above to get started!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}