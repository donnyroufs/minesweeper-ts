import * as Core from "../../core"

import { HTMLRendererImpl } from "./lib/HTMLRendererImpl"

function bootstrap() {
  const startBtn = document.querySelector('[role="start game"]')
  const boardEl = document.querySelector("#board")
  const flagCountEl = document.querySelector("#flagCount")

  if (!startBtn) {
    throw new Error("Missing start button")
  }

  if (!boardEl) {
    throw new Error("No board to mount on")
  }

  if (!flagCountEl) {
    throw new Error("Missing flag count element")
  }

  const BOMB_COUNT = 15
  const game = new Core.Minesweeper(
    new Core.BoardFactory().make({
      size: 10,
      bombCount: BOMB_COUNT,
    })
  )

  const renderer = new HTMLRendererImpl(boardEl, flagCountEl)

  startBtn.addEventListener("click", () => {
    game.start()
    startBtn.setAttribute("disabled", "true")
  })

  boardEl.addEventListener("click", (e) => {
    const el = e.target as HTMLElement

    if (!el.classList.contains("cell")) return
    const x = Number(el.getAttribute("data-x")!)
    const y = Number(el.getAttribute("data-y")!)

    const pos = new Core.Position(x, y)

    game.reveal(pos)
  })

  boardEl.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    const el = e.target as HTMLElement

    if (!el.classList.contains("cell")) return

    const x = Number(el.getAttribute("data-x")!)
    const y = Number(el.getAttribute("data-y")!)
    const pos = new Core.Position(x, y)

    game.flag(pos)
  })

  game.on("game-started", (data) => {
    renderer.render(data.grid)
    renderer.renderFlagCount(getFlagCount(data.grid), BOMB_COUNT)
  })

  game.on("cell-updated", (data) => {
    renderer.render(data.grid)
    renderer.renderFlagCount(getFlagCount(data.grid), BOMB_COUNT)
  })

  game.on("board-revealed", (data) => {
    renderer.render(data.grid)
  })
}

function getFlagCount(grid: Readonly<Core.Grid>) {
  return grid
    .flat()
    .reduce((acc, curr) => (curr.isFlagged() ? (acc += 1) : acc), 0)
}

bootstrap()
