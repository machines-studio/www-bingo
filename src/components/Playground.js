import logger from '/utils/logger'

export const selector = '.playground'

export async function hydrate (element) {
  const slug = element.dataset.slug
  if (!slug) return

  const seed = [...slug].reduce((h, c) => Math.imul(31, h) + c.charCodeAt(0) | 0, 0) >>> 0
  const { log, warn, error } = logger(slug, 'black', `hsl(${Math.sin(seed) * 360}, 100%, 64%)`)

  let playground
  try {
    playground = await import(`/playgrounds/${slug}.js`)
    playground = await playground.hydrate(element, { ...console, log, warn, error })
  } catch (err) {
    error(err)
  }

  return {
    destroy: () => {
      playground?.destroy?.()
    }
  }
}
