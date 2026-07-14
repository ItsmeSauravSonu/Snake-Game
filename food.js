import { onSnake, expandSnake } from './snake.js'
import { GRID_SIZE } from './grid.js'

const EXPANSION_RATE = 1
let food = getRandomFoodPosition()
let score = 0

export function update() {
  if (food && onSnake(food)) {
    expandSnake(EXPANSION_RATE)
    score++
    food = getRandomFoodPosition()
  }
}

export function draw(gameBoard) {
  if (!food) return
  const el = document.createElement('div')
  el.style.gridRowStart = food.y
  el.style.gridColumnStart = food.x
  el.classList.add('food')
  gameBoard.appendChild(el)
}

export function getScore() { return score }
export function isBoardFull() { return food === null }

export function resetFood() {
  score = 0
  food = getRandomFoodPosition()
}

function getRandomFoodPosition() {
  const free = []
  for (let x = 1; x <= GRID_SIZE; x++) {
    for (let y = 1; y <= GRID_SIZE; y++) {
      if (!onSnake({ x, y })) free.push({ x, y })
    }
  }
  if (free.length === 0) return null
  return free[Math.floor(Math.random() * free.length)]
}