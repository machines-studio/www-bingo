import { randomInt } from 'missing-math'

const degreesDiff = (a, b) => Math.abs((((a - b) % 360) + 540) % 360 - 180)

export function hydrate (element, Color, console) {
  const groups = Array.from(element.querySelectorAll('ul li'))
  const btn = element.querySelector('button')

  Color.$hsl.subscribe(update)
  btn.addEventListener('click', randomize)

  return {}

  function randomize () {
    Color.$h.value = (Color.$h + randomInt(60, 180)) % 360
    Color.$s.value = randomInt(50, 100)
    Color.$l.value = randomInt(40, 60)
  }

  function update () {
    const closest = groups.reduce((best, current) => {
      return degreesDiff(current.dataset.h, Color.$h.value) < degreesDiff(best.dataset.h, Color.$h.value)
        ? current
        : best
    })

    groups.forEach(current => current.classList.toggle('is-active', current === closest))
  }
}
