import {
  update as updateSnake, draw as drawSnake, BASE_SPEED,
  getSnakeHead, snakeIntersection, resetSnake, getSnakeLength,
} from './snake.js'
import {
  update as updateFood, draw as drawFood,
  getScore, resetFood, isBoardFull,
} from './food.js'
import { outsideGrid } from './grid.js'
import { hasStarted, resetInput } from './input.js'

let lastRenderTime = 0
let gameOver = false
let won = false
let paused = false

const gameBoard = document.getElementById('game-board')
const scoreEl = document.getElementById('score')
const highEl = document.getElementById('high-score')
const overlay = document.getElementById('overlay')
const overlayText = document.getElementById('overlay-text')
const restartBtn = document.getElementById('restart')

let highScore = Number(localStorage.getItem('snakeHighScore') || 0)
highEl.textContent = highScore

// speed climbs from 5 to 15 as you grow
function currentSpeed() {
  return Math.min(BASE_SPEED + Math.floor(getScore() / 4), 15)
}

function main(currentTime) {
  window.requestAnimationFrame(main)
  if (gameOver || paused) return

  const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
  if (secondsSinceLastRender < 1 / currentSpeed()) return
  lastRenderTime = currentTime

  update()
  draw()
}

function update() {
  if (!hasStarted()) return
  updateSnake()
  updateFood()
  checkDeath()
}

function draw() {
  gameBoard.innerHTML = ''
  drawSnake(gameBoard)
  drawFood(gameBoard)
  scoreEl.textContent = getScore()
}

function checkDeath() {
  if (isBoardFull()) {
    won = true
    endGame()
    return
  }
  if (outsideGrid(getSnakeHead()) || snakeIntersection()) endGame()
}

function endGame() {
  gameOver = true
  if (getScore() > highScore) {
    highScore = getScore()
    localStorage.setItem('snakeHighScore', highScore)
    highEl.textContent = highScore
  }
  overlayText.textContent = won
    ? `You filled the board. Score: ${getScore()}`
    : `Game over — score ${getScore()}`
  overlay.classList.add('visible')
}

function restart() {
  resetSnake()
  resetInput()
  resetFood()
  gameOver = false
  won = false
  paused = false
  overlay.classList.remove('visible')
  draw()
}

restartBtn.addEventListener('click', restart)

window.addEventListener('keydown', e => {
  if (e.key === ' ') {
    e.preventDefault()
    if (!gameOver && hasStarted()) paused = !paused
  }
  if (gameOver && (e.key === 'Enter' || e.key === ' ')) restart()
})

window.requestAnimationFrame(main)
draw()