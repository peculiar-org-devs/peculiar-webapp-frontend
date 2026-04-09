import { useState } from 'react'
import { Link } from '@tanstack/react-router'

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


const ArrowRightIcon =() => (
<svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.75 10.75L5.75 5.75L0.75 0.75" 
stroke="#424242" stroke-width="1.5" 
stroke-linecap="round" 
stroke-linejoin="round"/>
</svg>
)


// const ArrowRightIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
//     <path
//       d="M5 12H19M19 12L12 5M19 12L12 19"
//       stroke="white"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//   </svg>
// )


const NavLink = ({ label, children }: { label: string; children?: Array<{label: string, to: string}> }) => (

  <div className='relative group py-2'>
  <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition">
    <span>{label}</span>
     {children && <ChevronDownIcon />}
  </div>
  {/* Dropdown */}
  {children && (
    <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      <div className="w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-2 px-1">
          {children.map((item)=> (
            <Link key={item.to}
            to={item.to}
             className="flex items-center justify-between px-3 py-2 text-sm text-[#424242] hover:bg-gray-50 hover:text-black rounded-lg transition-colors cursor-pointer" >
                {item.label}
                <ArrowRightIcon />
            </Link>
          ))}
          
      </div>
    </div>
  )}
  </div>
)

const MobileNavLink = ({ label, children }: { label: string; children?: Array<{label: string, to: string}>}) => {
  const [isOpen, setIsOpen] = useState(false);

  return(
      <div className="flex flex-col border-b border-gray-50 pb-4">
        <div className="flex justify-between items-center cursor-pointer transition"
            onClick={() => children && setIsOpen(!isOpen)}>
            <div className="flex justify-between items-center cursor-pointer hover:opacity-80 transition">
              <span>{label}</span>
              {children && (
                <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                  <ChevronDownIcon />
                </div>
              )}
          </div>
        </div>
        {children && isOpen && (
          <div className="flex flex-col gap-4 mt-4 ml-4">
              {children.map((item) => (
              <Link key={item.to}
                to={item.to}
                className="text-[#666] text-base hover:text-black">
                {item.label}
              </Link>
              ))}
          </div>
        )}
      </div>      
  )
  
}

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false)

  const platformLinks = [
    {label:"How it Works", to: '/platform/how-it-works'}, 
    {label:"For Vendors", to: '/platform/for-vendors'}, 
    {label:"For Clients", to: '/platform/for-clients'}, 
    {label:"Privacy & Terms of Use", to: '/platform/privacy'},
  ]

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
          <NavLink label="Platform" children={platformLinks} />
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
              className={`block w-5 h-0.5 bg-black transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
            ></span>

            <span
              className={`block w-5 h-0.5 bg-black my-1 transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            ></span>

            <span
              className={`block w-5 h-0.5 bg-black transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-1.5' : ''
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
        className={`fixed top-0 left-0 right-0 mx-4 h-auto bg-white z-50 transform transition-transform duration-300 rounded-lg ${
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
          <MobileNavLink label="Platform" children={platformLinks} />
          <MobileNavLink label="Solutions" />
          <MobileNavLink label="Resources" />
          <MobileNavLink label="Pricing" />
        </div>
      </div>
    </div>
  )
}


