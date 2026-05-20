import Color from '/core/Color'

export function hydrate (element, console) {
  const btn = element.querySelector('button.generate')
  btn.addEventListener('click', Color.randomize)

  for (const el of element.querySelectorAll('.scenarios > g')) {
    const svg = el.closest('svg')
    el.addEventListener('click', e => {
      // Toggle ALL playgrounds SVG state, not only this one
      document.querySelectorAll(`svg.${svg.className.baseVal} .is-active`).forEach(el => el.classList.remove('is-active'))
      document.querySelectorAll(`svg.${svg.className.baseVal} #${el.id}`).forEach(el => el.classList.add('is-active'))
    })
  }

  return {}
}
