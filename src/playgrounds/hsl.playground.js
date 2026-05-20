import Color from '/core/Color'

export function hydrate (element, console) {
  const h = element.querySelector('input[name="h"]')
  const s = element.querySelector('input[name="s"]')
  const l = element.querySelector('input[name="l"]')

  ;[h, s, l].forEach(input => {
    input.addEventListener('input', () => {
      Color.set([h.value, s.value, l.value], { instant: true })
    })
  })

  Color.$hsl.subscribe(update)

  return {
    destroy: () => Color.$hsl.unsubscribe(update)
  }

  function update () {
    h.value = Color.$h
    s.value = Color.$s
    l.value = Color.$l
  }
}
