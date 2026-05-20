import Barba from '@barba/core'

export const selector = '.menu'

export function hydrate (element) {
  const links = Array.from(element.querySelectorAll('a'))

  // Leave mobile menu
  const toggle = document.querySelector('#toggle-menu')
  Barba.hooks.beforeLeave(() => { toggle.checked = false })
  for (const link of links) {
    link.addEventListener('click', e => { toggle.checked = false })
  }

  // Act on page change
  Barba.hooks.enter((data) => {
    // Update links state
    for (const { url, a } of links.map(a => ({ a, url: new URL(a.href) }))) {
      a.classList.toggle('is-active', data.next.url.path.startsWith(url.pathname))
    }
  })
}
