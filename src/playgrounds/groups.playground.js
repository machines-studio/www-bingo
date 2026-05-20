import Color from '/core/Color'

const degreesDiff = (a, b, abs = true) => {
  const v = (((a - b) % 360) + 540) % 360 - 180
  return abs ? Math.abs(v) : v
}

export function hydrate (element, console) {
  const groups = Array.from(element.querySelectorAll('ul li'))
  const btn = element.querySelector('button.generate')

  Color.$hsl.subscribe(update)
  btn.addEventListener('click', Color.randomize)

  return {}

  function update () {
    let closest = groups.reduce((best, current) => {
      return degreesDiff(current.dataset.h, Color.$h.value) < degreesDiff(best.dataset.h, Color.$h.value)
        ? current
        : best
    })

    if (Color.$s < 10) closest = null

    groups.forEach(current => {
      current.classList.toggle('is-active', current === closest)
      if (current !== closest) return
      current.classList.toggle('is-after', degreesDiff(current.dataset.h, Color.$h.value, false) < 0)
    })
  }
}
