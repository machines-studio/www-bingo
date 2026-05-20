import Color from '/core/Color'
import { map, normalize } from 'missing-math'
import chroma from 'chroma-js'

const NIGHT_TRANSITION_WIDTH = 1 // hours
const smooth = t => t * t * (3 - 2 * t)

export function hydrate (element, console) {
  const input = element.querySelector('input[type="range"]')

  input.value = new Date().getHours()
  input.addEventListener('input', update)
  update()

  Color.$hsl.subscribe(update)

  return {
    destroy: () => Color.$hsl.unsubscribe(update)
  }

  function update () {
    const hour = +input.value
    const isNight = hour < 6 || hour > 21

    element.style.setProperty('--playground-sun-progress', hour / 24)
    element.classList.toggle('is-night', isNight)

    element.classList.add('no-transition')

    const sunProgress = normalize(hour, 6, 21, true)
    const sunHeight = 1 - Math.abs((sunProgress * 2) - 1)
    const nightProgress = hour > 12 ? normalize(hour, 21, 21 + NIGHT_TRANSITION_WIDTH) : normalize(hour, 6, 6 - NIGHT_TRANSITION_WIDTH)
    const kelvin = map(sunHeight, 0, 1, 2000, 6500, true)

    const [h, s, l] = chroma.mix(
      chroma.hsl(Color.$h, Color.$s / 100, Color.$l / 100),
      chroma.temperature(kelvin),
      smooth(map(sunHeight, 0, 1, 0.25, 0)),
      'lab'
    ).hsl()

    element.style.setProperty('--playground-sun-night-progress', nightProgress)
    element.style.setProperty('--playground-sun-hue', h.toFixed(2) + 'deg')
    element.style.setProperty('--playground-sun-saturation', (s * 100).toFixed(2) + '%')
    element.style.setProperty('--playground-sun-lightness', (l * 100).toFixed(2) + '%')
    element.style.setProperty('--playground-sun-color', `hsl(${h.toFixed(2)}deg ${(s * 100).toFixed(2)}% ${(l * 100).toFixed(2)}%)`)

    void document.body.offsetHeight // eslint-disable-line no-void
    element.classList.remove('no-transition')
  }
}
