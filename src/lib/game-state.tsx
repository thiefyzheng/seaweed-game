import { useReducer, createContext, Dispatch } from 'react';

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
  | { type: 'CORRECT_ANSWER'; payload: { reward: number } }
  | { type: 'INCORRECT_ANSWER'; payload: { reward: number } };

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
      return {
        ...state,
        seaweeds: [...state.seaweeds, {
          id: Date.now(),
          age: 0,
          marketPriceAtPlanting: state.marketPrice,
          type: 'seaweed', // Default seaweed type for now
        }]
      };
    case 'INCORRECT_ANSWER':
      return {
        ...state,
        seaweeds: state.seaweeds.slice(0, -1),
      };
    default:
      return state;
  }
};

interface GameStateContextType {
  gameState: GameState;
  dispatch: Dispatch<GameAction>;
}

export const GameStateContext = createContext<GameStateContextType | null>(null);

export const useGameState = (initialState: GameState) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  return { gameState, dispatch };
};
