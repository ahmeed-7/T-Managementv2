import '../App.css'
import { Link } from 'react-router-dom'

export default function AuthLayout({ children, title, subtitle, footer, className = '', promoClassName = '', showPromoMobile = false }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f7fb] px-4 py-10 text-[#262338] sm:px-8">
      <div className="pointer-events-none absolute -left-28 -top-32 h-96 w-96 rounded-full bg-[#e8e2ff] opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -right-28 h-96 w-96 rounded-full bg-[#f1eaff] opacity-80 blur-3xl" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#efedf4] bg-white shadow-[0_24px_80px_rgba(40,35,66,0.10)] md:grid-cols-[0.9fr_1.1fr]">
        <section className={`relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#786be2] to-[#9b8be9] p-7 text-white md:p-10 lg:p-12 ${showPromoMobile ? 'min-h-[260px]' : 'hidden md:flex'}`}>
          <div className="absolute -right-16 top-24 h-64 w-64 rounded-full border border-white/15" />
          <div className="absolute -right-3 top-36 h-40 w-40 rounded-full border border-white/15" />
          <Link to="/" className="relative flex w-max items-center gap-2.5 text-lg font-bold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 text-base font-extrabold">T</span>
            T-Management
          </Link>
          <div className={`relative ${promoClassName || 'mb-30'}`}>
            <span className="text-sm font-bold uppercase tracking-[0.17em] text-white/70">A calmer way to work</span>
            <h2 className="mt-4 max-w-sm text-4xl font-bold leading-tight tracking-[-0.04em] lg:text-5xl">Make space for good work.</h2>
            <p className="mt-5 max-w-sm text-lg leading-8 text-white/80">Bring your tasks, ideas, and plans together—and give your attention to what matters.</p>
          </div>
          
        </section>
        <section className={`flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14 ${className}`}>
          <Link to="/" className="mb-8 flex w-max items-center gap-2 text-sm font-semibold text-[#8270d9] transition hover:text-[#5f50c2] md:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-[#a99afa] to-[#7161df] font-extrabold text-white">T</span>
            T-Management
          </Link>
          <Link to="/" className="mb-7 hidden w-max items-center gap-2 text-sm font-semibold text-[#858397] transition hover:text-[#6555d2] md:inline-flex">
            <span aria-hidden="true">←</span> Back to home
          </Link>
          <div className="mb-7">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#8174d8]">YOUR WORKSPACE AWAITS</span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#302d43] sm:text-4xl">{title}</h1>
            <p className="mt-2 text-base leading-7 text-[#89879a]">{subtitle}</p>
          </div>
          {children}
          {footer && <p className="mt-7 text-center text-sm text-[#89879a] sm:text-base">{footer}</p>}
          <p className="mt-8 text-center text-xs text-[#aaa8b6]">A thoughtful place to plan, focus, and grow.</p>
        </section>
      </div>
    </main>
  )
}
