import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WaitlistForm from '../components/WaitlistForm'
import WaitlistModal from '../components/WaitlistModal'

export default function Waitlist() {
  const [showModal, setShowModal] = useState(false)
  const tickerItems = Array.from({ length: 10 })
  return (
    <div className="min-h-screen flex flex-col bg-[#3c2356]">
      {/* TICKER */}
      <div className="bg-black text-white text-xs py-2 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee w-max">
          
          {/* FIRST SET */}
          {tickerItems.map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-2 cursor-pointer ml-10 shrink-0"
            >
              <h2 className="flex items-center gap-2">COMING SOON <img src="/sparkles.png" alt="sparkles icon" className="w-4 h-4"/></h2>
            </div>
          ))}

          {/* DUPLICATE SET (important for seamless loop) */}
          {tickerItems.map((_, index) => (
            <div
              key={`dup-${index}`}
              className="flex items-center gap-2 cursor-pointer ml-10 shrink-0"
            >
              <h2 className="flex items-center gap-2">COMING SOON <img src="/sparkles.png" alt="sparkles icon" className="w-4 h-4"/></h2>
            </div>
          ))}

        </div>
      </div>

      {/* NAVBAR */}
      <Navbar />
      <div className="relative">
        {/* HERO */}
        <div className="flex-1 bg-[#3c2356] mt-4 rounded-t-3xl px-6 py-16 flex flex-col items-center text-center relative overflow-visible">
          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
            Party Planning Just
            <span className="block mt-2 bg-black px-3 py-1 rounded-md w-fit mx-auto">
              Got Easier
            </span>
          </h1>

          {/* Sub */}
          <div className="flex items-center gap-3 mt-6 text-white text-sm flex-wrap justify-center">
            <img src="/lock.png" alt="" />
            <h1 className="text-white pr-2 py-1 font-bold text-xs border-r">
              100%
              <span className="block font-normal text-[#EBF2FC]">Secure</span>
            </h1>
            <span className="text-[#EBF2FC]">
              Turn your event dreams{' '}
              <span className="block">into a seamless reality.</span>
            </span>
          </div>

          {/* FORM */}
          <div 
            className="flex-1 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => window.location.href = 'https://tally.so/r/68OZkJ'}
          >
            <WaitlistForm onSuccess={() => setShowModal(true)} />
          </div>

          {/* Decorative Ribbon (light) */}
          <div className="absolute top-24 left-0 w-full text-xs opacity-20 rotate-[-10deg]">
            It-Pays-to-Plan ✦ It-Pays-to-Plan ✦ It-Pays-to-Plan
          </div>

          {/* Clouds */}
          <img
            src="/clouds.png"
            className="absolute left-0 w-full pointer-events-none z-20"
            style={{ bottom: '-40px' }}
          />
        </div>

        {/* FOOTER */}
        <Footer  />
      </div>
      {/* MODAL */}
      {showModal && <WaitlistModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
