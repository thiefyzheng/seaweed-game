import React, { useReducer, createContext } from 'react';

interface GameState {
  money: number;
  seaweeds: Array<{
    id: number;
    age: number;
    marketPriceAtPlanting: number;
    type: string;
  }>;
  marketPrice: number;
  eventMessage: string;
  passiveIncomeRate: number;
  selectedSeaweedType: string;
  harvestedCounts: Record<string, number>;
  gameWon: boolean;
}

type GameAction =
  | { type: 'PLANT_SEAWEED' }
  | { type: 'HARVEST_SEAWEED'; payload: number }
  | { type: 'UPDATE_GROWTH' }
  | { type: 'UPDATE_MARKET' }
  | { type: 'APPLY_EVENT'; payload: GameState; message: string }
  | { type: 'CLEAR_MESSAGE' }
  | { type: 'UPDATE_PASSIVE_INCOME' }
  | { type: 'SELECT_SEAWEED_TYPE'; payload: string }
  | { type: 'CORRECT_ANSWER'; payload: { reward: number; type: 'seaweed' | 'money' } }
  | { type: 'INCORRECT_ANSWER'; payload: { reward: number; type: 'seaweed' | 'money' } };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'PLANT_SEAWEED':
      return state;
    case 'HARVEST_SEAWEED':
      return state;
    case 'UPDATE_GROWTH':
      return state;
    case 'UPDATE_MARKET':
      return state;
    case 'APPLY_EVENT':
      return state;
    case 'CLEAR_MESSAGE':
      return state;
    case 'UPDATE_PASSIVE_INCOME':
      return state;
    case 'SELECT_SEAWEED_TYPE':
      return state;
    case 'CORRECT_ANSWER':
      return state;
    case 'INCORRECT_ANSWER':
      return state;
    default:
      return state;
  }
};

export const GameStateContext = createContext<any>(null);

export const useGameState = (initialState: GameState) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  return { gameState, dispatch };
};
