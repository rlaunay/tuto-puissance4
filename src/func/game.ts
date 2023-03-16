import {GridState, PlayerColor} from "../types";

export function freePosition(grid: GridState, x: number): number {
  for (let y = grid.length - 1; y >= 0; y--) {
    if (grid[y][x] === 'E') {
      return y
    }
  }

  return -1
}

export function winningPositions(grid: GridState, color: PlayerColor, x: number, size: number) {
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1]
  ]

  const position = {
    y: freePosition(grid, x),
    x
  }

  for (let direction of directions) {

  }

}