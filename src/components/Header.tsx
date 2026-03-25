import { Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Home, LogOut, Menu, X, Search, Store, Calendar, User, FileText } from 'lucide-react'
import { storage } from '../lib/storage'
import AuthModal from './AuthModal'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const navigate = useNavigate()
  
  // Basic check for logged in user to show appropriate buttons
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  useEffect(() => {
    // Check if user exists in storage
    const user = storage.getUser()
    if (user) {
      setIsLoggedIn(true)
    }
  }, [])

  function handleLogout() {
    storage.clearUser()
    setIsLoggedIn(false)
    navigate({ to: '/' })
  }

  return (
    <>
      <header className="p-4 flex flex-row items-center justify-between border-b shadow-sm sticky top-0 z-40 bg-white" style={{ borderColor: '#F7E6CA' }}>
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            style={{ color: '#3A2256' }}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-4 text-xl font-bold tracking-tight" style={{ color: '#3A2256' }}>
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/logo-purple.png"
                alt="Peculiar Logo"
                className="h-8 object-contain"
              />
              <span className="hidden sm:inline-block font-satoshi">Peculiar</span>
            </Link>
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            to="/marketplace"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: '#3A2256' }}
          >
            <Search size={16} />
            Marketplace
          </Link>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Log out"
              title="Log out"
              style={{ color: '#3A2256' }}
            >
              <LogOut size={20} />
            </button>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-6 py-2 rounded-full font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 font-satoshi"
              style={{
                 backgroundColor: '#F7E6CA',
                 color: '#3A2256'
              }}
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* Navigation Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#F7E6CA' }}>
          <div className="flex items-center gap-2">
            <img src="/logo-purple.png" alt="Peculiar Logo" className="h-8" />
            <span className="font-bold text-lg" style={{ color: '#3A2256' }}>Navigation</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors mb-2 text-gray-700"
            activeProps={{
              className: 'flex items-center gap-3 p-3 rounded-xl shadow-sm transition-colors mb-2 font-medium',
              style: { backgroundColor: '#F7E6CA', color: '#3A2256' }
            }}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link
            to="/marketplace"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors mb-2 text-gray-700"
            activeProps={{
              className: 'flex items-center gap-3 p-3 rounded-xl shadow-sm transition-colors mb-2 font-medium',
              style: { backgroundColor: '#F7E6CA', color: '#3A2256' }
            }}
          >
            <Search size={20} />
            <span>Marketplace</span>
          </Link>
          {isLoggedIn && (
            <>
              <Link
                to="/vendor/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors mb-2 text-gray-700"
                activeProps={{
                  className: 'flex items-center gap-3 p-3 rounded-xl shadow-sm transition-colors mb-2 font-medium',
                  style: { backgroundColor: '#F7E6CA', color: '#3A2256' }
                }}
              >
                <Store size={20} />
                <span>Vendor Dashboard</span>
              </Link>
              <Link
                to="/bookings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors mb-2 text-gray-700"
                activeProps={{
                  className: 'flex items-center gap-3 p-3 rounded-xl shadow-sm transition-colors mb-2 font-medium',
                  style: { backgroundColor: '#F7E6CA', color: '#3A2256' }
                }}
              >
                <Calendar size={20} />
                <span>My Bookings</span>
              </Link>
              <Link
                to="/events"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors mb-2 text-gray-700"
                activeProps={{
                  className: 'flex items-center gap-3 p-3 rounded-xl shadow-sm transition-colors mb-2 font-medium',
                  style: { backgroundColor: '#F7E6CA', color: '#3A2256' }
                }}
              >
                <FileText size={20} />
                <span>My Events</span>
              </Link>
              <Link
                to="/profile/edit"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors mb-2 text-gray-700"
                activeProps={{
                  className: 'flex items-center gap-3 p-3 rounded-xl shadow-sm transition-colors mb-2 font-medium',
                  style: { backgroundColor: '#F7E6CA', color: '#3A2256' }
                }}
              >
                <User size={20} />
                <span>Edit Profile</span>
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  )
}
