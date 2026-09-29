import { Fragment } from 'react'

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const dates = [7, 8, 9, 10, 11, 12, 13]
const hours = ['07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM']

const scheduleTasks = [
  { day: 'WED', hour: '07:00 AM', title: 'Design review', color: 'bg-teal-500/20 border-teal-400 text-teal-100' },
  { day: 'MON', hour: '08:00 AM', title: 'Standup', color: 'bg-purple-500/20 border-purple-400 text-purple-100' },
  { day: 'THU', hour: '08:00 AM', title: 'Client demo', color: 'bg-purple-500/20 border-purple-400 text-purple-100' },
  { day: 'WED', hour: '09:00 AM', title: 'Sprint planning', color: 'bg-pink-500/20 border-pink-400 text-pink-100' },
  { day: 'MON', hour: '10:00 AM', title: 'Code review', color: 'bg-pink-500/20 border-pink-400 text-pink-100' },
  { day: 'FRI', hour: '10:00 AM', title: '1:1 with mentor', color: 'bg-purple-500/20 border-purple-400 text-purple-100' },
]

export default function ScheduleCalendar() {
  return (
    <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">Schedule</h3>
        <span className="text-sm text-gray-400">7 – 13 August</span>
      </div>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[70px_repeat(7,1fr)] min-w-[700px]">
          <div />
          {days.map((day, i) => (
            <div key={day} className="text-center pb-3">
              <p className={`text-xs font-medium ${day === 'MON' ? 'text-purple-400' : 'text-gray-500'}`}>{day}</p>
              <p className={`text-sm font-bold ${day === 'MON' ? 'text-purple-400' : 'text-white'}`}>{dates[i]}</p>
            </div>
          ))}
          {hours.map((hour) => (
            <Fragment key={hour}>
              <div className="text-xs text-gray-500 pt-3 pr-2 text-right">{hour}</div>
              {days.map((day) => {
                const task = scheduleTasks.find((t) => t.day === day && t.hour === hour)
                return (
                  <div key={day + hour} className="border-t border-white/5 min-h-[56px] px-1 py-1">
                    {task && (
                      <div className={`border-l-2 rounded px-2 py-1 text-xs ${task.color}`}>
                        {task.title}
                      </div>
                    )}
                  </div>
                )
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}