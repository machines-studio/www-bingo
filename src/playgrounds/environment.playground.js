import Color from '/core/Color'

export function hydrate (element, console) {
  const btn = element.querySelector('button.generate')
  btn.addEventListener('click', Color.randomize)

  return {}
}
