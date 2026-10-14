import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Navbar from '../components/Navbar'

const features = [
  { icon: '✓', title: 'Tasks that feel manageable', desc: 'Keep your day clear with one calm, organized place for your next steps.' },
  { icon: '▦', title: 'A calendar that makes sense', desc: 'See real due dates and scheduled work at a glance, so you can plan ahead.' },
  { icon: '✦', title: 'Ideas with room to grow', desc: 'Collect notes, group projects, and make steady progress on what matters.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f7fb] text-[#262338]">
      <Navbar />
      <main>
        <section className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pb-16 pt-14 text-center sm:px-8 sm:pt-20 lg:pb-20 lg:pt-24">
          <div className="pointer-events-none absolute left-1/2 top-16 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#e9e4ff] opacity-70 blur-3xl sm:h-96 sm:w-96" />
          <span className="relative rounded-full border border-[#e9e5fb] bg-white/80 px-4 py-2 text-sm font-semibold text-[#7566d8] shadow-sm">
            A little more clarity, every day
          </span>
          <h1 className="relative mt-7 max-w-4xl text-4xl font-bold leading-[1.1] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Make room for
            <span className="block bg-gradient-to-r from-[#796be8] to-[#b29aed] bg-clip-text pb-2 text-transparent">your best work.</span>
          </h1>
          <p className="relative mt-4 max-w-2xl text-lg leading-8 text-[#858397] sm:text-xl">
            Tasks, notes, projects, and a calendar that keeps everything in view—so you can focus on what comes next.
          </p>
          <div className="relative mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Link to="/register"><Button className="w-full px-7 py-3.5 text-base sm:w-auto">Start for free <span aria-hidden="true">→</span></Button></Link>
            <Link to="/login"><Button variant="secondary" className="w-full px-7 py-3.5 text-base sm:w-auto">I already have an account</Button></Link>
          </div>
          <div className="relative mt-4 flex items-center gap-2 text-sm text-[#9996a8]">
            <span className="flex -space-x-2" aria-hidden="true"><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#f7f7fb] bg-[#e7e2ff] text-xs text-[#6e5ed1]">✓</span><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#f7f7fb] bg-[#e5f4ee] text-xs text-[#4b9d86]">✦</span><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#f7f7fb] bg-[#fff0de] text-xs text-[#c18745]">◷</span></span>
            Everything you need to get organized, all in one place
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 lg:pb-24">
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => (
              <article key={feature.title} className="rounded-2xl border border-[#efedf4] bg-white p-6 text-left shadow-[0_8px_24px_rgba(40,35,66,0.035)] transition hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(40,35,66,0.08)] sm:p-7">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${index === 0 ? 'bg-[#f0edff] text-[#796be8]' : index === 1 ? 'bg-[#fff4e4] text-[#d4984b]' : 'bg-[#e8f7f1] text-[#42a58b]'}`}>{feature.icon}</span>
                <h2 className="mt-5 text-lg font-bold tracking-tight text-[#373449]">{feature.title}</h2>
                <p className="mt-2 text-base leading-7 text-[#89879a]">{feature.desc}</p>
              </article>
            ))}
          </div>
          
        </section>
      </main>
      <footer className="border-t border-[#eeedf3] bg-white/70 px-5 py-6 text-center text-sm text-[#9693a5]">
        <span className="font-semibold text-[#6860ad]">T-Management</span><span className="mx-2">·</span>Make space for good work.
      </footer>
    </div>
  )
}
