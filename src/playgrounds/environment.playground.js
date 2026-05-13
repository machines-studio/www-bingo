import { randomInt } from 'missing-math'
import Color from '/core/Color'

export function hydrate (element, console) {
  const btn = element.querySelector('button.generate')
  btn.addEventListener('click', randomize)

  return {}

  function randomize () {
    Color.$h.value = (Color.$h + randomInt(60, 180)) % 360
    Color.$s.value = randomInt(75, 100)
    Color.$l.value = randomInt(40, 60)
  }
}
