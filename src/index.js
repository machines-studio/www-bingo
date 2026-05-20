import { bootstrap } from '/core/Barba'
import mediaReady from '/utils/media-ready'

;(async () => {
  bootstrap({
    views: [
      await import('/views/default')
    ],

    components: {
      // Outside barba wrapper
      global: [
        await import('/components/Menu')
      ],

      // Inside barba wrapper
      local: [
        await import('/components/Gallery'),
        await import('/components/Playground')
      ]
    },

    afterEnter: async next => {
      // Update manually as Barba payload does not include <header>
      document.title = next.container.dataset.title

      // Flag native lazy loading so that we can animate in CSS
      Promise.all(Array.from(next.container.querySelectorAll('video, [loading="lazy"]')).map(async el => {
        await mediaReady(el)
        el.classList.add('is-loaded')
      }))

      // Update favicon color
      const color = window.getComputedStyle(next.container).getPropertyValue('--color-page')
      document.head.querySelector('link[rel="icon"]').href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-1 -1 2 2%22><circle r=%221%22 fill=%22%23${encodeURI(color.substr(1))}%22 /></svg>`

      // Reset scroll position, handling url hash
      if (next?.url.hash) next.container.querySelector('#' + next.url.hash)?.scrollIntoView()
      else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  })
})()
