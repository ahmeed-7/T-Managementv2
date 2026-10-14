import { Link, NavLink } from 'react-router-dom'
import Button from './Button'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#eeedf3] bg-[#ffffffed] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#302d43]">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#a99afa] to-[#7161df] text-base font-extrabold text-white shadow-sm">T</span>
          <span>T-Management</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <NavLink to="/login" className="px-1 py-2 text-sm font-semibold text-[#777487] transition hover:text-[#6555d2] sm:text-base">Log in</NavLink>
          <Link to="/register"><Button className="px-4 py-2.5 text-sm sm:px-5 sm:text-base">Get started</Button></Link>
        </div>
      </nav>
    </header>
  )
}
