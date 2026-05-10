import { $ } from '@tooooools/ui/state'
import logger from '/utils/logger'

export const selector = '.playground'

const Color = (() => {
  const PROP = '--color-page'
  let UPDATE = true
  let nextFrame

  const $h = $(0) // deg
  const $s = $(0) // %
  const $l = $(13) // %
  const $hsl = $([$h, $s, $l], ([h, s, l]) => `hsl(${$h}deg ${$s}% ${$l}%)`)
  $hsl.subscribe(update)

  return {
    $h,
    $s,
    $l,
    $hsl,

    update,
    set ([h, s, l], { instant = false } = {}) {
      UPDATE = false
      $h.value = h
      $s.value = s
      $l.value = l
      UPDATE = true
      update({ instant })
    },

    reset () {
      $h.reset()
      $s.reset()
      $l.reset()
      document.body.style.removeProperty(PROP)
    }
  }

  function update ({ instant = false } = {}) {
    if (!UPDATE) return
    cancelAnimationFrame(nextFrame)
    nextFrame = requestAnimationFrame(() => {
      if (instant) document.body.classList.add('no-transition')

      document.body.style.setProperty(PROP, $hsl.value)
      document.head.querySelector('link[rel="icon"]').href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-1 -1 2 2%22><circle r=%221%22 fill=%22${$hsl}%22 /></svg>`

      if (instant) {
        void document.body.offsetHeight // eslint-disable-line no-void
        document.body.classList.remove('no-transition')
      }
    })
  }
})()

window.Color = Color

export async function hydrate (element) {
  const slug = element.dataset.slug
  if (!slug) return

  const seed = [...slug].reduce((h, c) => Math.imul(31, h) + c.charCodeAt(0) | 0, 0) >>> 0
  const { log, warn, error } = logger(slug, 'black', `hsl(${Math.sin(seed) * 360}, 100%, 64%)`)

  let playground
  try {
    playground = await import(`/playgrounds/${slug}.js`)
    playground = await playground.hydrate(element, Color, { ...console, log, warn, error })
  } catch (err) {
    error(err)
  }

  // WIP reset color on mouseleave/scroll
  element.addEventListener('mouseleave', e => Color.reset())

  return {
    destroy: () => {
      Color.reset()
      playground?.destroy?.()
    }
  }
}
