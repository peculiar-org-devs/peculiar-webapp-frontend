import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const P_LOGO_SRC = '/logo-purple.png'

export default function SplashScreenPatternFocus({ onFinish, slideIndex }: { onFinish?: () => void, slideIndex?: number }) {
  const [show, setShow] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Animation restart logic for variation 3
    if (slideIndex === 2) {
      setShow(true)
      setFadeOut(false)
      setAnimationKey((k) => k + 1)
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
      fadeTimerRef.current = setTimeout(() => setFadeOut(true), 3500)
    } else {
      setShow(false)
      setFadeOut(true)
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    }
  }, [slideIndex])

  useEffect(() => {
    if (fadeOut) {
      hideTimerRef.current = setTimeout(() => {
        setShow(false)
        onFinish?.()
      }, 800)
      return () => {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      }
    }
  }, [fadeOut, onFinish])

  return (
    <>
      {show && (
        <AnimatePresence mode="wait">
          <motion.div
            key={animationKey}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center w-screen h-screen"
            style={{ backgroundColor: '#3A2256' }}
            initial={{ opacity: 1 }}
            animate={{ opacity: fadeOut ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Pattern background */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: 'none' }}
              initial={{ opacity: 0.15, scale: 1, x: 0, y: 0 }}
              animate={{ opacity: 0.15, scale: 1.05, x: 40, y: 40 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 2 }}
            >
              {/* SVG pattern: repeating logo-champagne image diagonally */}
              <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="logoPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                    <image href="/logo-champagne.png" x="6" y="6" width="48" height="48" opacity="0.5" />
                  </pattern>
                </defs>
                <rect width="400" height="400" fill="url(#logoPattern)" />
              </svg>
            </motion.div>
            {/* Logo lockup */}
            <motion.div
              className="relative z-10 flex items-center mb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <motion.img
                src={P_LOGO_SRC}
                alt="P logo"
                className="w-20 h-20 aspect-square object-contain"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              />
              <motion.span
                className="ml-1 text-5xl font-satoshi font-bold"
                style={{ color: '#F7E6CA' }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: -10 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                eculiar
              </motion.span>
            </motion.div>
            {/* Tagline */}
            <motion.p
              className="font-satoshi text-2xl mt-1 relative z-10"
              style={{ color: '#F7E6CA' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
            >
              Your Event, Perfected
            </motion.p>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  )
}
