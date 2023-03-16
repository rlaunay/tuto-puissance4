import {createMachine, interpret, InterpreterFrom} from "xstate";
import {createModel} from "xstate/lib/model";
import {GameContext, GameStates, GridState, Player, PlayerColor} from "../types";
import {canDropGuard, canJoinGuard, canLeaveGuard} from "./guard";
import {dropTokenAction, joinGameAction, leaveGameAction, switchPlayerAction} from "./actions";

export const GameModel = createModel({
  players: [] as Player[],
  currentPlayer: null as null | Player['id'],
  rowLength: 4,
  grid: [
    ["E", "E", "E", "E", "E" ,"E", "E"],
    ["E", "E", "E", "E", "E" ,"E", "E"],
    ["E", "E", "E", "E", "E" ,"E", "E"],
    ["E", "E", "E", "E", "E" ,"E", "E"],
    ["E", "E", "E", "E", "E" ,"E", "E"],
    ["E", "E", "E", "E", "E" ,"E", "E"],
  ] as GridState
}, {
  events: {
    join: (playerId: Player['id'], name: Player['name']) => ({playerId, name}),
    leave: (playerId: Player['id']) => ({playerId}),
    chooseColor: (playerId: Player['id'], color: PlayerColor) => ({playerId, color}),
    start: (playerId: Player['id']) => ({playerId}),
    dropToken: (playerId: Player['id'], x: number) => ({playerId, x}),
    restart: (playerId: Player['id']) => ({playerId}),
  }
})

export const GameMachine = GameModel.createMachine({
  id: 'game',
  initial: GameStates.LOBBY,
  context: GameModel.initialContext,
  states: {
    [GameStates.LOBBY]: {
      on: {
        join: {
          cond: canJoinGuard,
          actions: [GameModel.assign(joinGameAction)],
          target: GameStates.LOBBY
        },
        leave: {
          cond: canLeaveGuard,
          actions: [GameModel.assign(leaveGameAction)],
          target: GameStates.LOBBY
        },
        chooseColor: {
          target: GameStates.LOBBY
        },
        start: {
          target: GameStates.PLAY
        }
      }
    },
    [GameStates.PLAY]: {
      on: {
        dropToken: {
          cond: canDropGuard,
          actions: [GameModel.assign(dropTokenAction), GameModel.assign(switchPlayerAction)],
          target: GameStates.PLAY
        }
      }
    },
    [GameStates.VICTORY]: {
      on: {
        restart: {
          target: GameStates.LOBBY
        }
      }
    },
    [GameStates.DRAW]: {
      on: {
        restart: {
          target: GameStates.LOBBY
        }
      }
    }
  }
})

export function makeGame(
  state: GameStates = GameStates.LOBBY,
  context: Partial<GameContext> = {}
): InterpreterFrom<typeof GameMachine> {
  const machine = interpret(
    GameMachine
      .withContext({
        ...GameModel.initialContext,
        ...context
      })
  ).start()
  machine.state.value = GameStates.PLAY
  return machine
}