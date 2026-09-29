const priorityTasks = [
  {
    date: 'Monday, 8 August',
    tasks: [
      { title: 'Finish landing page copy', time: '08:00 - 09:00 AM', color: 'bg-purple-500/20 border-purple-500' },
      { title: 'Client review call', time: '10:00 - 10:15 AM', color: 'bg-pink-500/20 border-pink-500' },
    ],
  },
  {
    date: 'Tuesday, 9 August',
    tasks: [
      { title: 'Design system audit', time: '07:00 - 07:30 AM', color: 'bg-teal-500/20 border-teal-500' },
      { title: 'Ship auth endpoints', time: '09:00 - 10:00 AM', color: 'bg-pink-500/20 border-pink-500' },
    ],
  },
]

export default function PriorityTasks() {
  return (
    <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">Priority Tasks</h3>
        <button className="text-sm text-purple-400 hover:underline">View All</button>
      </div>
      <div className="flex flex-col gap-5 max-h-[520px] overflow-y-auto pr-1">
        {priorityTasks.map((group) => (
          <div key={group.date}>
            <p className="text-xs text-gray-500 mb-2">{group.date}</p>
            <div className="flex flex-col gap-3">
              {group.tasks.map((task) => (
                <div key={task.title} className={`border-l-4 rounded-lg p-3 ${task.color}`}>
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{task.time}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}