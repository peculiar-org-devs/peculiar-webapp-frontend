import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const P_LOGO_SRC = '/logo-purple.png'

export default function SplashScreenElegantUnveil({ onFinish, slideIndex }: { onFinish?: () => void, slideIndex?: number }) {
  const [show, setShow] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Restart animation when slideIndex changes and is 1
    if (slideIndex === 1) {
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
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key={animationKey}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center w-screen h-screen"
          style={{ backgroundColor: '#F7E6CA' }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -window.innerHeight }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo lockup */}
          <div className="flex items-center mb-2">
            <motion.img
              src={P_LOGO_SRC}
              alt="P logo"
              className="w-20 h-20 aspect-square object-contain"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            <motion.span
              className="ml-1 text-5xl font-satoshi font-bold"
              style={{ color: '#3A2256', overflow: 'hidden', display: 'inline-block' }}
              initial={{ opacity: 0, x: -30, maskPosition: '0%' }}
              animate={{ opacity: 1, x: -10, maskPosition: '100%' }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              eculiar
            </motion.span>
          </div>
          {/* Tagline */}
          <motion.p
            className="font-satoshi text-2xl mt-1"
            style={{ color: '#3A2256' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            Your Event, Perfected
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
