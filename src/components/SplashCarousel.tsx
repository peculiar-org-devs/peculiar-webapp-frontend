import { useState, useEffect } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import SplashScreenPatternFocus from './SplashScreenPatternFocus'
import SplashScreen from './SplashScreen'
import SplashScreenElegantUnveil from './SplashScreenElegantUnveil'


export default function SplashCarousel() {
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
  })

  const slides = [
    SplashScreen,
    SplashScreenElegantUnveil,
    SplashScreenPatternFocus,
  ]

  // Track current slide index for animation restart
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    if (slider.current) {
      setCurrentSlide(slider.current.track.details.rel)
      const handler = () => {
        setCurrentSlide(slider.current ? slider.current.track.details.rel : 0)
      }
      const cleanup = slider.current.on('slideChanged', handler)
      return cleanup
    }
  }, [slider])

  return (
    <div className="relative">
      <div
        ref={sliderRef}
        className="keen-slider w-screen overflow-hidden"
        style={{ height: 'calc(100vh - 72px)' }}
      >
        {slides.map((SlideComponent, idx) => (
          <div
            className="keen-slider__slide flex items-center justify-center"
            key={idx}
          >
            {/* Pass slideIndex to each slide for animation restart */}
            <SlideComponent slideIndex={currentSlide} />
          </div>
        ))}
      </div>
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100 transition z-50"
        onClick={() => {
          slider.current?.prev()
          setCurrentSlide((prev: number) => (prev - 1 + slides.length) % slides.length)
        }}
        aria-label="Previous Slide"
      >
        &#8592;
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100 transition z-50"
        onClick={() => {
          slider.current?.next()
          setCurrentSlide((prev: number) => (prev + 1) % slides.length)
        }}
        aria-label="Next Slide"
      >
        &#8594;
      </button>
    </div>
  )
}
