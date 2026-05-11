import { raf } from '@internet/raf'
import logger from '/utils/logger'
import Color from '/core/Color'

export const selector = '.playground'

const CURSOR_SIZE = 50
const CURSOR_LINE_WIDTH = 1
const CURSOR_MAX_LENGTH = CURSOR_SIZE
const CURSOR_TRAIL_EASING = 0.3
const CURSOR_BASE_COLOR = '#fafafa'
const CURSOR_OUTLINE_COLOR = '#222222'
const CURSOR_DPR = window.devicePixelRatio ?? 1
const CURSOR_RIPPLE_DECAY = 0.92
const CURSOR_RIPPLE_THRESHOLD = 0.01
const CURSOR_RIPPLE_SIZE_START = 0
const CURSOR_RIPPLE_SIZE_END = CURSOR_SIZE * 1.5
const CURSOR_RIPPLE_LINE_WIDTH = CURSOR_SIZE

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

  const Cursor = { x: 0, y: 0, px: 0, py: 0, ripples: [] }
  let scrollX = window.scrollX
  let scrollY = window.scrollY

  // Bind events
  // TODO scroll oob
  Color.$hsl.subscribe(handleColorChange)
  element.addEventListener('mouseenter', handleMouseEnter)
  element.addEventListener('mouseleave', handleMouseLeave)
  window.addEventListener('mousemove', handleMousemove)
  window.addEventListener('scroll', handleScroll, { passive: true })
  element.parentNode.addEventListener('animationend', handleResize)
  window.addEventListener('resize', handleResize)
  raf.add(tick)

  // Init
  const canvas = element.querySelector('canvas.playground__cursor')
  const ctx = canvas.getContext('2d')
  handleResize()

  return {
    destroy: () => {
      raf.remove(tick)
      window.removeEventListener('mousemove', handleMousemove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)

      Color.reset()
      playground.destroy?.()
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

  function handleColorChange (hsl) {
    if (!element._hovered) return
    Cursor.ripples.push({ x: Cursor.x - canvas._left + scrollX, y: Cursor.y - canvas._top + scrollY, color: hsl, progress: 1 })
  }

  function updateCanvasMemoizedPosition () {
    const { left, top } = canvas.getBoundingClientRect()
    canvas._left = left + scrollX
    canvas._top = top + scrollY
    canvas._dirty = false
  }

  function handleScroll () {
    scrollX = window.scrollX
    scrollY = window.scrollY
    canvas._dirty = true
  }

  function handleMouseEnter () {
    element._hovered = true
  }

  function handleMouseLeave () {
    element._hovered = false
    Color.reset()
  }

  function handleMousemove (e) {
    Cursor.x = e.clientX
    Cursor.y = e.clientY
  }

  function tick (dt) {
    if (canvas._dirty) updateCanvasMemoizedPosition()

    const x = Cursor.x - canvas._left + scrollX
    const y = Cursor.y - canvas._top + scrollY

    if (x === Cursor.px && y === Cursor.py && Cursor.ripples.length === 0) return

    ctx.clearRect(0, 0, canvas.width / CURSOR_DPR, canvas.height / CURSOR_DPR)

    // Compute cursor position
    const dx = x - Cursor.px
    const dy = y - Cursor.py
    const dist = Math.sqrt(dx * dx + dy * dy)
    const scale = dist > CURSOR_MAX_LENGTH ? CURSOR_MAX_LENGTH / dist : 1
    const trailAlpha = 1 - (1 - CURSOR_TRAIL_EASING) ** (dt / 16.667)
    Cursor.px += dx * trailAlpha
    Cursor.py += dy * trailAlpha
    const tx = x - dx * scale
    const ty = y - dy * scale

    // Decay and cull ripples
    const rippleDecay = CURSOR_RIPPLE_DECAY ** (dt / 16.667)
    for (let i = Cursor.ripples.length - 1; i >= 0; i--) {
      Cursor.ripples[i].progress *= rippleDecay
      if (Cursor.ripples[i].progress < CURSOR_RIPPLE_THRESHOLD) Cursor.ripples.splice(i, 1)
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

    // Render ripples oldest first
    for (let i = 0; i < Cursor.ripples.length; i++) {
      const ripple = Cursor.ripples[i]
      const t = 1 - ripple.progress
      const size = CURSOR_RIPPLE_SIZE_START + (t * t) * (CURSOR_RIPPLE_SIZE_END - CURSOR_RIPPLE_SIZE_START)
      ctx.beginPath()
      ctx.arc(ripple.x, ripple.y, size / 2, 0, Math.PI * 2)
      ctx.strokeStyle = ripple.color
      ctx.lineWidth = CURSOR_RIPPLE_LINE_WIDTH * ripple.progress ** 0.5
      ctx.globalAlpha = ripple.progress ** 2
      ctx.stroke()
      ctx.globalAlpha = 1
    }
  }
}
