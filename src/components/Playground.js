import { raf } from '@internet/raf'
import Color from '/core/Color'
import logger from '/utils/logger'
import IS_MOBILE from '/utils/is-mobile'

export const selector = '.playground'

const CURSOR_SIZE = 40
const CURSOR_DOT_SIZE = 10
const CURSOR_LINE_WIDTH = 1
const CURSOR_MAX_LENGTH = CURSOR_SIZE
const CURSOR_TRAIL_EASING = 0.3
const CURSOR_BASE_COLOR = '#fafafa'
const CURSOR_OUTLINE_COLOR = '#222222'
const CURSOR_DPR = window.devicePixelRatio ?? 1
const CURSOR_RIPPLE_DECAY = 0.95
const CURSOR_RIPPLE_THRESHOLD = 0.01
const CURSOR_RIPPLE_SIZE_START = CURSOR_DOT_SIZE
const CURSOR_RIPPLE_SIZE_END = CURSOR_SIZE * 4
const CURSOR_RIPPLE_LINE_WIDTH = CURSOR_SIZE * 0.5

export async function hydrate (element) {
  // Load and hydrate playground code
  const playground = await (async () => {
    const slug = element.dataset.slug
    if (!slug) return
    const seed = [...slug].reduce((h, c) => Math.imul(31, h) + c.charCodeAt(0) | 0, 0) >>> 0
    const { log, warn, error } = logger(slug, 'black', `hsl(${Math.sin(seed) * 360}, 100%, 64%)`)
    try {
      const playground = await import(`./../playgrounds/${slug}.js`)
      return playground.hydrate(element, { ...console, log, warn, error })
    } catch (err) {
      error(err)
    }
  })()

  if (!playground) return

  // Init cursor rendering
  // TODO disable cursor on reduced motion
  const cursor = !IS_MOBILE && new Cursor(element)

  element.querySelector('.playground__reset')?.addEventListener('click', () => Color.reset())

  return {
    destroy: () => {
      Color.reset()
      cursor?.destroy?.()
      playground.destroy?.()
    }
  }
}

function Cursor (element) {
  const canvas = element.querySelector('canvas.playground__cursor')
  const ctx = canvas.getContext('2d')
  if (!canvas) return

  const Pointer = {
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    scrollX: window.scrollX,
    scrollY: window.scrollY
  }

  const ripples = []

  // Bind events
  // TODO disable raf on mobile
  element.addEventListener('pointerdown', handlePointerDown)
  element.addEventListener('pointerup', handlePointerUp)
  element.addEventListener('mouseenter', handleMouseEnter)
  element.addEventListener('mouseleave', handleMouseLeave)
  element.parentNode.addEventListener('animationend', handleResize)
  window.addEventListener('mousemove', handleMousemove)
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize)

  // Init
  raf.add(tick)
  handleResize()

  return {
    destroy: () => {
      Color.reset()
      raf.remove(tick)

      element.parentNode.removeEventListener('animationend', handleResize)
      window.removeEventListener('mousemove', handleMousemove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }

  function handleResize () {
    // Resize canvas
    canvas.width = element.offsetWidth * CURSOR_DPR
    canvas.height = element.offsetHeight * CURSOR_DPR
    canvas.style.width = (canvas.width / CURSOR_DPR) + 'px'
    canvas.style.height = (canvas.height / CURSOR_DPR) + 'px'

    // Bake DPR scale permanently so tick() never needs save/restore
    ctx.setTransform(CURSOR_DPR, 0, 0, CURSOR_DPR, 0, 0)

    // setTransform resets all canvas state, so lineCap must follow
    ctx.lineCap = 'round'

    // Flag canvas as needing to recompute positions
    canvas._dirty = true
  }

  function updateCanvasMemoizedPosition () {
    const { left, top } = canvas.getBoundingClientRect()
    canvas._left = left + Pointer.scrollX
    canvas._top = top + Pointer.scrollY
    canvas._dirty = false
  }

  function handleScroll () {
    Pointer.scrollX = window.scrollX
    Pointer.scrollY = window.scrollY
    canvas._dirty = true
  }

  function handlePointerDown () {
    Pointer.down = true
  }

  function handlePointerUp () {
    Pointer.down = false
    // Add a ripple
    requestAnimationFrame(() => {
      ripples.push({ x: Pointer.x - canvas._left + Pointer.scrollX, y: Pointer.y - canvas._top + Pointer.scrollY, color: Color.$hsl.value, progress: 1 })
    })
  }

  function handleMouseEnter () {
    element._hovered = true
  }

  function handleMouseLeave () {
    element._hovered = false
  }

  function handleMousemove (e) {
    Pointer.x = e.clientX
    Pointer.y = e.clientY
  }

  function tick (dt) {
    if (canvas._dirty) updateCanvasMemoizedPosition()
    ctx.clearRect(0, 0, canvas.width / CURSOR_DPR, canvas.height / CURSOR_DPR)

    // Compute cursor position
    const x = Pointer.x - canvas._left + Pointer.scrollX
    const y = Pointer.y - canvas._top + Pointer.scrollY
    const dx = x - Pointer.px
    const dy = y - Pointer.py
    const dist = Math.sqrt(dx * dx + dy * dy)
    const scale = dist > CURSOR_MAX_LENGTH ? CURSOR_MAX_LENGTH / dist : 1
    const trailAlpha = 1 - (1 - CURSOR_TRAIL_EASING) ** (dt / 16.667)
    Pointer.px += dx * trailAlpha
    Pointer.py += dy * trailAlpha
    const tx = x - dx * scale
    const ty = y - dy * scale

    // Decay and cull ripples
    const rippleDecay = CURSOR_RIPPLE_DECAY ** (dt / 16.667)
    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].progress *= rippleDecay
      if (ripples[i].progress < CURSOR_RIPPLE_THRESHOLD) ripples.splice(i, 1)
    }

    // Render cursor outline
    ctx.beginPath()
    ctx.moveTo(tx, ty)
    ctx.lineTo(x, y)
    ctx.strokeStyle = CURSOR_OUTLINE_COLOR
    ctx.lineWidth = CURSOR_SIZE + CURSOR_LINE_WIDTH * 2
    ctx.stroke()

    // Render cursor fill
    ctx.beginPath()
    ctx.moveTo(tx, ty)
    ctx.lineTo(x, y)
    ctx.strokeStyle = CURSOR_BASE_COLOR
    ctx.lineWidth = CURSOR_SIZE
    ctx.stroke()

    // Render color dot
    if (Pointer.down) {
      ctx.beginPath()
      ctx.moveTo(tx, ty)
      ctx.lineTo(tx, ty)
      ctx.strokeStyle = Color.$hsl.value
      ctx.lineWidth = CURSOR_DOT_SIZE
      ctx.stroke()
    }

    // Render ripples oldest first
    for (let i = 0; i < ripples.length; i++) {
      const ripple = ripples[i]
      const t = 1 - ripple.progress
      const size = CURSOR_RIPPLE_SIZE_START + (t * t) * (CURSOR_RIPPLE_SIZE_END - CURSOR_RIPPLE_SIZE_START)
      ctx.beginPath()
      ctx.arc(ripple.x, ripple.y, size / 2, 0, Math.PI * 2)
      ctx.strokeStyle = ripple.color
      ctx.lineWidth = CURSOR_RIPPLE_LINE_WIDTH * ripple.progress ** 3
      ctx.globalAlpha = 1 - ((1 - ripple.progress) ** 3)
      ctx.stroke()
      ctx.globalAlpha = 1
    }
  }
}
