# Splash Screen Animation Pattern Plan

## Pattern Overview

This pattern ensures smooth intro and outro transitions for splash screens in a carousel or multi-step UI. It is based on:

- React state for animation control (`show`, `fadeOut`, `animationKey`)
- Timers for sequencing transitions
- A prop (e.g., `slideIndex`) to trigger animation resets and fade-outs
- Framer Motion's `AnimatePresence` and keyed root element for reliable animation cycles

## Steps

1. **State Setup**
   - `show`: Controls visibility of the splash screen
   - `fadeOut`: Triggers the fade-out animation
   - `animationKey`: Forces remounting for intro animation
   - Timer refs for fade-out and hide

2. **Animation Restart Logic**
   - Listen to `slideIndex` (or similar prop)
   - When `slideIndex` matches the splash screen's index:
     - Reset `show` and `fadeOut` to start intro
     - Increment `animationKey` to force remount
     - Start fade-out timer (e.g., 3.5s)
   - When `slideIndex` changes away:
     - Set `fadeOut` to true and hide after fade-out duration
     - Clear timers

3. **Framer Motion Usage**
   - Use `AnimatePresence` for exit transitions
   - Key the root `motion.div` with `animationKey` for fresh intro
   - Use `initial`, `animate`, and `exit` props for intro/outro

## Example Implementation

```tsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashScreenVariant({ slideIndex }) {
  const [show, setShow] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const fadeTimerRef = useRef(null)
  const hideTimerRef = useRef(null)

  useEffect(() => {
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
      }, 800)
      return () => {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      }
    }
  }, [fadeOut])

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key={animationKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Splash content here */}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

## Benefits
- Guarantees both intro and outro transitions play fully
- Works reliably with Framer Motion and React state
- Easily extendable for multiple splash variations

## Usage
- Pass `slideIndex` from carousel parent
- Use this pattern for all splash screen variations
- Adjust timers and animation props for desired effect
