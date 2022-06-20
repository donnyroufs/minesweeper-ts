```ts
interface IRenderer {
  drawBoard(cells: Cell[]): void
}

const fileStorage = new FileStoreImpl()
const renderer = new HTMLRendererImpl()
const opts = new GameOptions({
  size: 100,
})

const game = new Minesweeper(opts, renderer, fileStorage)

game.subscribe((evt) => {
  if (evt.type === MinesweeperEvent.Reveal) {
    UI.appendMove(evt.data)
  }
})

game.start()
```
