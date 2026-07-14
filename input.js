const DIRS = {
  ArrowUp:    { x: 0, y: -1 }, w: { x: 0, y: -1 },
  ArrowDown:  { x: 0, y: 1  }, s: { x: 0, y: 1  },
  ArrowLeft:  { x: -1, y: 0 }, a: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0  }, d: { x: 1, y: 0  },
}

let currentDirection = { x: 0, y: 0 }
const queue = []

function isOpposite(a, b) {
  return a.x === -b.x && a.y === -b.y && (a.x !== 0 || a.y !== 0)
}

function pushDirection(dir) {
  const last = queue.length ? queue[queue.length - 1] : currentDirection
  if (isOpposite(dir, last)) return
  if (dir.x === last.x && dir.y === last.y) return
  if (queue.length < 2) queue.push(dir)
}

window.addEventListener('keydown', e => {
  const dir = DIRS[e.key] || DIRS[e.key.toLowerCase()]
  if (dir) { e.preventDefault(); pushDirection(dir) }
})

// swipe support
let touchStart = null
window.addEventListener('touchstart', e => {
  touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }
}, { passive: true })

window.addEventListener('touchend', e => {
  if (!touchStart) return
  const dx = e.changedTouches[0].clientX - touchStart.x
  const dy = e.changedTouches[0].clientY - touchStart.y
  if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return
  pushDirection(
    Math.abs(dx) > Math.abs(dy)
      ? { x: Math.sign(dx), y: 0 }
      : { x: 0, y: Math.sign(dy) }
  )
  touchStart = null
}, { passive: true })

export function getInputDirection() {
  if (queue.length) currentDirection = queue.shift()
  return currentDirection
}

export function hasStarted() {
  return queue.length > 0 || currentDirection.x !== 0 || currentDirection.y !== 0
}

export function resetInput() {
  currentDirection = { x: 0, y: 0 }
  queue.length = 0
}