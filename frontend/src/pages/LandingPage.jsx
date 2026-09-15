import Button from '../components/Button'
import {Link} from "react-router-dom"
import Navbar from "../components/Navbar"

const stats = [
  { value: "10k+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "50k+", label: "Tasks Completed" },
]

const features = [
  { title: "Task Tracking", desc: "Organize and prioritize your daily tasks with ease." },
  { title: "Team Collaboration", desc: "Work together seamlessly with your team in real time." },
  { title: "Analytics & Insights", desc: "Monitor your progress with detailed productivity metrics." },
]

export default function LandingPage() {
  return (
    <div className="w-full bg-gradient-to-br from-[#10031f] to-[#121920] min-h-screen text-white">
      <Navbar />
      <section className="text-center px-4 pt-16 pb-20">
        <h1 className="text-5xl font-extrabold mb-4">
          Organize Your Work,<br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Amplify Your Focus
          </span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto mb-8">
          T-Management helps you stay on top of your tasks with a beautiful, intuitive interface.
        </p>
        <div className="flex justify-center gap-4 mb-16">
          <Link to="/register"><Button>Start For Free →</Button></Link>
          <Link to="/login"><Button variant="secondary">I Have an Account</Button></Link>
        </div>
        <div className="flex justify-center gap-12 mb-20">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="bg-zinc-900/60 border border-white/10 rounded-xl p-6 text-left">
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
        
      </section>
    </div>
  )
}