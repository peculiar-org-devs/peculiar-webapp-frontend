import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Use the new purple logo asset
const P_LOGO_SRC = '/logo-purple.png'

export default function SplashScreen({
  onFinish,
  slideIndex,
}: {
  onFinish?: () => void
  slideIndex?: number
}) {
  const [show, setShow] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
    const [animationKey, setAnimationKey] = useState(0)
    const fadeTimerRef = useRef<NodeJS.Timeout | null>(null)
    const hideTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Remove initial mount timer, move logic to slideIndex effect
  }, [])

  // Restart animation when slideIndex changes and is 0
  useEffect(() => {
    // Animation restart logic
    if (slideIndex === 0) {
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
            {/* Logo lockup */}
            <div className="flex items-center mb-2">
              <motion.img
                src={P_LOGO_SRC}
                alt="P logo"
                className="w-20 h-20 aspect-square object-contain"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, duration: 0.7 }}
              />
              <motion.span
                className="ml-1 text-5xl font-satoshi font-bold"
                style={{ color: '#F7E6CA' }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: -10 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                eculiar
              </motion.span>
            </div>
            {/* Tagline */}
            <motion.p
              className="font-satoshi text-2xl mt-1"
              style={{ color: '#F7E6CA' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              Your Event, Perfected
            </motion.p>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  )
}
