import { useState } from 'react'

const ChevronDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 10L12 15L17 10"
      stroke="#424242"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const NavLink = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
    <span>{label}</span>
    <ChevronDownIcon />
  </div>
)

const MobileNavLink = ({ label }: { label: string }) => (
  <div className="flex justify-between items-center cursor-pointer hover:opacity-80 transition">
    <span>{label}</span>
    <ChevronDownIcon />
  </div>
)

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="w-full flex justify-center mt-4 px-4">
      <div className="w-full max-w-6xl bg-white rounded-lg px-6 py-3 flex items-center justify-between shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-[#3A2256]">
          <img src="/logo-purple.png" className="h-5" alt="Peculiar logo" />
          Peculiar
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#191919]">
          <NavLink label="Platform" />
          <NavLink label="Solutions" />
          <NavLink label="Resources" />
          <NavLink label="Pricing" />
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="hidden md:block text-sm text-[#3A2256] cursor-pointer hover:opacity-80 transition">
            Login
          </button>

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-md hover:bg-gray-100 transition"
          >
            <span
              className={`block w-5 h-[2px] bg-black transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-[6px]' : ''
              }`}
            ></span>

            <span
              className={`block w-5 h-[2px] bg-black my-1 transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            ></span>

            <span
              className={`block w-5 h-[2px] bg-black transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-[6px]' : ''
              }`}
            ></span>
          </button>

          <button className="hidden md:flex bg-black text-white px-4 py-3 rounded-lg text-sm hover:opacity-90 transition items-center justify-center gap-2" aria-label="Join Waitlist">
            Join Waitlist
            <ArrowRightIcon />
          </button>
        </div>
      </div>
      
      {/* MOBILE MENU (HALF SCREEN) */}
      <div
        className={`fixed top-0 left-0 right-0 mx-4 h-2/6 bg-white z-50 transform transition-transform duration-300 rounded-lg ${
          menuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        role="navigation"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {/* Top bar (same as navbar) */}
        <div className="flex items-center justify-between px-7 py-4 border-b">
          <div className="flex items-center gap-2 font-semibold text-[#3A2256]">
            <img src="/logo-purple.png" className="h-5" alt="Peculiar logo" />
            Peculiar
          </div>

          {/* Close (X) */}
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="hover:opacity-80 transition">
            <span className="text-2xl" aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Menu items */}
        <div className="flex flex-col px-6 py-6 gap-6 text-lg text-[#191919]">
          <MobileNavLink label="Platform" />
          <MobileNavLink label="Solutions" />
          <MobileNavLink label="Resources" />
          <MobileNavLink label="Pricing" />
        </div>
      </div>
    </div>
  )
}


