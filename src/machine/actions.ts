import {GameAction, GameContext, PlayerColor} from "../types";
import {currentPlayer, freePosition, winningPositions} from "../func/game";
import {GameModel} from "./GameMachine";

export const joinGameAction: GameAction<'join'> = (context, event) => ({
  players: [...context.players, {id: event.playerId, name: event.name}]
})

export const leaveGameAction: GameAction<'leave'> = (context, event) => ({
  players: context.players.filter(p => p.id !== event.playerId)
})

export const chooseColorAction: GameAction<'chooseColor'> = (context, event) => ({
  players: context.players.map(p => {
    if (p.id === event.playerId) {
      return {...p, color: event.color}
    }

    return p
  })
})

export const dropTokenAction: GameAction<'dropToken'> = (
  { grid, players },
  { x: eventX, playerId }
) => {
  const playerColor = players.find(p => playerId === p.id)!.color!
  const eventY = freePosition(grid, eventX);
  const newGrid = grid.map((row, y) => {
    return row.map((v, x) => x === eventX && y === eventY ? playerColor : v)
  })

  return { grid: newGrid }
}

export const switchPlayerAction = (context: GameContext) => ({
  currentPlayer: context.players.find(p => p.id !== context.currentPlayer)!.id
})

export const saveWinningPosition: GameAction<'dropToken'> = (context, event) => ({
  winningPositions: winningPositions(
    context.grid,
    currentPlayer(context).color!,
    event.x,
    context.rowLength
  )
})

export const restartAction: GameAction<'restart'> = (context, event) => ({
  winningPositions: [],
  grid: GameModel.initialContext.grid,
  currentPlayer: null
})

export const setCurrentPlayerAction = (context: GameContext): Partial<GameContext> => ({
  currentPlayer: context.players.find(p => p.color === PlayerColor.YELLOW)!.id
})