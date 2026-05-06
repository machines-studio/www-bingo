export function hydrate (element, console) {
  const button = element.querySelector('button')

  button.addEventListener('click', () => console.log('foo'))

  return {
    destroy: () => console.log('bye')
  }
}
