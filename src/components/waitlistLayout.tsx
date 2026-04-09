import { Outlet, useRouterState } from '@tanstack/react-router'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const waitlistLayout = () => {
  const tickerItems = Array.from({ length: 10 })

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const isWaitlist = pathname === '/waitlist'

  return (
    <div className= {`min-h-screen flex flex-col ${isWaitlist ? 'bg-[#3c2356]': 'bg-white'} `}>
          {/* TICKER */}
          <div className="bg-black  text-white text-xs py-2 overflow-hidden whitespace-nowrap">
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
            
              {/* <div className="flex-1 bg-[#3c2356] mt-4 rounded-t-3xl px-6 py-16 flex flex-col items-center text-center relative overflow-visible"> */}
              
              <Outlet />

              <div className='relative mt-60'>

                   {/* Decorative Ribbon (light) */}
                <div className="absolute top-24 left-0 w-full text-xs opacity-20 rotate-[-10deg]">
                  It-Pays-to-Plan ✦ It-Pays-to-Plan ✦ It-Pays-to-Plan
                </div>

                {/* Clouds */}
                  <img
                    src="/clouds.png"
                    className="absolute bottom-0 left-0 w-full pointer-events-none z-20"
                    style={{ bottom: '-40px' }}
                  />

              </div>
    
            {/* FOOTER */}
            <Footer />

          </div>

        </div>
      )
}
