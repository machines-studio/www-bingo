/**
 * Singleton for controlling page color
 */

import { $ } from '@tooooools/ui/state'
import { randomInt } from 'missing-math'

const PROP = '--color-page'
let UPDATE = true

let nextFrame

const $h = $(0) // deg
const $s = $(0) // %
const $l = $(13) // %
const $hsl = $([$h, $s, $l], ([h, s, l]) => `hsl(${$h}deg ${$s}% ${$l}%)`)

$hsl.subscribe(update)
document.body.style.setProperty('--playground-hue', $h + 'deg')
document.body.style.setProperty('--playground-saturation', $s + '%')
document.body.style.setProperty('--playground-lightness', $l + '%')

export default {
  $h,
  $s,
  $l,
  $hsl,

  update,
  set ([h, s, l], { instant = false } = {}) {
    UPDATE = false
    $h.value = +h
    $s.value = +s
    $l.value = +l
    UPDATE = true
    update({ instant })
  },

  reset () {
    $h.reset()
    $s.reset()
    $l.reset()
    setTimeout(() => document.body.style.removeProperty(PROP), 0)
  },

  randomize () {
    $h.value = ($h + randomInt(60, 180)) % 360
    $s.value = randomInt(75, 100)
    $l.value = randomInt(40, 60)
  }
}

function update ({ instant = false } = {}) {
  if (!UPDATE) return
  cancelAnimationFrame(nextFrame)
  nextFrame = requestAnimationFrame(() => {
    if (instant) document.body.classList.add('no-transition')

    document.body.style.setProperty(PROP, $hsl.value)
    document.body.style.setProperty('--playground-hue', $h + 'deg')
    document.body.style.setProperty('--playground-saturation', $s + '%')
    document.body.style.setProperty('--playground-lightness', $l + '%')
    document.head.querySelector('link[rel="icon"]').href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-1 -1 2 2%22><circle r=%221%22 fill=%22${$hsl.value}%22 /></svg>`

    if (instant) {
      void document.body.offsetHeight // eslint-disable-line no-void
      document.body.classList.remove('no-transition')
    }
  })
}
