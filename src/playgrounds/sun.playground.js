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

    document.body.classList.add('no-transition')

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

    // // Mirror afternoon onto morning so dawn and dusk share the same curve
    // const nightHour = hour > 13.5 ? 24 - hour : hour

    // // 0 at night, 1 during day, with a smoothed ramp around the 6h boundary
    // const dayStrength = smooth(map(nightHour, 6 - NIGHT_TRANSITION_WIDTH, 6 + NIGHT_TRANSITION_WIDTH, 0, 1, true))

    // // At night: mix base color toward a warm Kelvin temperature
    // // At noon: dayStrength = 1, so nightStrength = 0 → base color unchanged
    // const nightStrength = (1 - dayStrength) * NIGHT_KELVIN_STRENGTH
    // const kelvin = map(nightHour, 0, 6, 2000, 6500, true)

    // const l = (Color.$l / 100) * map(dayStrength, 0, 1, NIGHT_LIGHTNESS, 1)

    // if (nightStrength > 0) {
    //   const mixed = chroma.mix(chroma.hsl(Color.$h, Color.$s / 100, Color.$l / 100), chroma.temperature(kelvin), nightStrength, 'lab')
    //   const h = mixed.get('hsl.h') || Color.$h
    //   const s = mixed.get('hsl.s')
    //   element.style.setProperty('--color-page-warmed', `hsl(${Number(h).toFixed(2)}deg ${(Number(s) * 100).toFixed(2)}% ${(Number(l) * 100).toFixed(2)}%)`)
    // } else {
    //   element.style.setProperty('--color-page-warmed', `hsl(${Color.$h}deg ${Color.$s}% ${Math.round(l * 100)}%)`)
    // }

    void document.body.offsetHeight // eslint-disable-line no-void
    document.body.classList.remove('no-transition')
  }
}
