const options = [
  { value: '', label: 'All' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export default function PriorityFilter({ value, onChange }) {
  return (
    <div className="flex gap-2 mb-6">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-full text-sm border transition ${
            value === opt.value
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent text-white'
              : 'border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}