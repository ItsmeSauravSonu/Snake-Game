import { getInputDirection } from './input.js'

export const BASE_SPEED = 5

let snakeBody = [{ x: 11, y: 11 }]
let newSegments = 0

export function update() {
  addSegments()
  const inputDirection = getInputDirection()
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] }
  }
  snakeBody[0].x += inputDirection.x
  snakeBody[0].y += inputDirection.y
}

export function draw(gameBoard) {
  snakeBody.forEach((segment, i) => {
    const el = document.createElement('div')
    el.style.gridRowStart = segment.y
    el.style.gridColumnStart = segment.x
    el.classList.add('snake')
    if (i === 0) el.classList.add('snake-head')
    gameBoard.appendChild(el)
  })
}

export function expandSnake(amount) { newSegments += amount }

export function onSnake(position, { ignoreHead = false } = {}) {
  return snakeBody.some((segment, index) => {
    if (ignoreHead && index === 0) return false
    return equalPositions(segment, position)
  })
}

export function getSnakeHead() { return snakeBody[0] }
export function getSnakeLength() { return snakeBody.length }
export function snakeIntersection() {
  return onSnake(snakeBody[0], { ignoreHead: true })
}

export function resetSnake() {
  snakeBody = [{ x: 11, y: 11 }]
  newSegments = 0
}

function equalPositions(a, b) { return a.x === b.x && a.y === b.y }

function addSegments() {
  for (let i = 0; i < newSegments; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
  }
  newSegments = 0
}