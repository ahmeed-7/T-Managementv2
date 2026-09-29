export default function HeroBanner({ name }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 p-8 mb-8">
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
      <div className="absolute -right-24 bottom-0 w-40 h-40 rounded-full bg-white/10" />
      <div className="relative z-10 max-w-md">
        <h2 className="text-2xl font-bold text-white mb-2">Hi {name}! 👋</h2>
        <p className="text-white/80 text-sm">
          Here's what's on your plate today. Stay focused and keep that streak going.
        </p>
      </div>
    </div>
  )
}