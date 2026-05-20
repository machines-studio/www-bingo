import EmblaCarousel from 'embla-carousel'
import EmblaWheel from 'embla-carousel-wheel-gestures'

export const selector = '.gallery'

export function hydrate (element) {
  const embla = EmblaCarousel(element, {
    container: element.querySelector('ul'),
    dragFree: true,

    breakpoints: {
      '(max-width: 800px)': {
        active: false
      }
    }
  }, [
    EmblaWheel({ forceWheelAxis: 'x' }) // ??? y
  ])

  return {
    destroy: () => embla.destroy()
  }
}
