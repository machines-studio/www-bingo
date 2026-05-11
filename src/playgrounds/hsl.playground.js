import { $ } from '@tooooools/ui/state'
import Color from '/core/Color'

export function hydrate (element, console) {
  const [$h, $s, $l] = [
    [Color.$h, 'input[name="h"]'],
    [Color.$s, 'input[name="s"]'],
    [Color.$l, 'input[name="l"]']
  ].map(([$source, selector]) => {
    const input = element.querySelector(selector)
    const $signal = $(input.value)
    input.value = $source.value
    input.addEventListener('input', () => { $signal.value = input.value })
    $source.subscribe(v => {
      input.value = v
      $signal.value = v
    })
    $signal.subscribe(update)
    return $signal
  })

  return {}

  function update () {
    Color.set([+$h.value, +$s.value, +$l.value], { instant: true })
    element.style.setProperty('--playground-hsl-hue', Color.$h + 'deg')
    element.style.setProperty('--playground-hsl-saturation', Color.$s + '%')
    element.style.setProperty('--playground-hsl-lightness', Color.$l + '%')
  }
}
