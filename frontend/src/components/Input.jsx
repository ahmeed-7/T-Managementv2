export default function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm text-gray-300 mb-1">{label}</label>}
      <input
        className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        {...props}
      />
    </div>
  )
}