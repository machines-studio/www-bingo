import Color from '/core/Color'

export function hydrate (element, console) {
  const square = element.querySelector('.square')
  square.addEventListener('click', e => square.classList.toggle('is-huge'))

  const btn = element.querySelector('button.generate')
  btn.addEventListener('click', Color.randomize)

  return {}
}
