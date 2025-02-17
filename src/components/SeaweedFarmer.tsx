"use client";

import React, { useReducer, useEffect, useCallback } from 'react';
import { AlertCircle, DollarSign, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Game constants
const INITIAL_MONEY = 1000;
const UPDATE_INTERVAL = 2000;

const SEAWEED_TYPES = {
  EUCHEUMA: {
    name: 'Eucheuma',
    description: 'Cultivated for carrageenan production',
    basePrice: 100,
    plantingCost: 15,
    color: 'bg-red-400',
    specialEffect: 'Faster growth in warm waters'
  },
  GRACILARIA: {
    name: 'Gracilaria',
    description: 'High-quality agar source',
    basePrice: 150,
    plantingCost: 20,
    color: 'bg-purple-400',
    specialEffect: 'Thrives in shrimp ponds'
  },
  SARGASSUM: {
    name: 'Sargassum',
    description: 'Traditional medicinal uses',
    basePrice: 200,
    plantingCost: 25,
    color: 'bg-green-400',
    specialEffect: 'Valuable for health benefits'
  }
} as const;

const MARKET_PRICE_RANGE = { MIN: 50, MAX: 200 };

const GROWTH_STAGES = {
  SEEDLING: { name: 'Seedling', age: 0, multiplier: 0.1 },
  GROWING: { name: 'Growing', age: 5, multiplier: 0.5 },
  MATURE: { name: 'Mature', age: 10, multiplier: 1.0 },
  OPTIMAL: { name: 'Optimal', age: 15, multiplier: 1.5 },
  OVERGROWN: { name: 'Overgrown', age: 20, multiplier: 0.3 }
};

// Game events with more variety
const RANDOM_EVENTS = [
  {
    id: 'redTide',
    message: "🌊 Red tide alert! Some seaweed damaged!",
    probability: 0.1,
    effect: (state: GameState) => ({
      ...state,
      seaweeds: state.seaweeds.filter((_, index: number) => index % 2 === 0)
    })
  },
  {
    id: 'perfectConditions',
    message: "🌡️ Perfect growing conditions!",
    probability: 0.3,
    effect: (state: GameState) => ({
      ...state,
      seaweeds: state.seaweeds.map((seaweed) => ({
        ...seaweed,
        age: seaweed.age + 2
      }))
    })
  },
  {
    id: 'marketBoom',
    message: "📈 Market demand surges!",
    probability: 0.2,
    effect: (state: GameState) => ({
      ...state,
      marketPrice: Math.min(MARKET_PRICE_RANGE.MAX, state.marketPrice * 1.5)
    })
  },
  {
    id: 'marketCrash',
    message: "📉 Market prices plummet!",
    probability: 0.1,
    effect: (state: GameState) => ({
      ...state,
      marketPrice: Math.max(MARKET_PRICE_RANGE.MIN, state.marketPrice * 0.7)
    })
  }
];

interface GameState {
  money: number;
  seaweeds: Array<{
    id: number;
    age: number;
    marketPriceAtPlanting: number;
    type: keyof typeof SEAWEED_TYPES;
  }>;
  marketPrice: number;
  eventMessage: string;
  passiveIncomeRate: number;
  selectedSeaweedType: keyof typeof SEAWEED_TYPES;
}

type GameAction = 
  | { type: 'PLANT_SEAWEED' }
  | { type: 'HARVEST_SEAWEED'; payload: number }
  | { type: 'UPDATE_GROWTH' }
  | { type: 'UPDATE_MARKET' }
  | { type: 'APPLY_EVENT'; payload: GameState; message: string }
  | { type: 'CLEAR_MESSAGE' }
  | { type: 'UPDATE_PASSIVE_INCOME' }
  | { type: 'SELECT_SEAWEED_TYPE'; payload: keyof typeof SEAWEED_TYPES };

// Reducer for better state management
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'PLANT_SEAWEED':
      const plantingCost = SEAWEED_TYPES[state.selectedSeaweedType].plantingCost;
      if (state.money < plantingCost) {
        return {
          ...state,
          eventMessage: "Not enough money to plant seaweed!"
        };
      }
      return {
        ...state,
        money: state.money - plantingCost,
        seaweeds: [...state.seaweeds, {
          id: Date.now(),
          age: 0,
          type: state.selectedSeaweedType,
          marketPriceAtPlanting: state.marketPrice
        }]
      };

    case 'HARVEST_SEAWEED':
      const seaweed = state.seaweeds.find(s => s.id === action.payload);
      if (!seaweed) return state;
      
      const stage = Object.values(GROWTH_STAGES)
        .reverse()
        .find(stage => seaweed.age >= stage.age);
      
      if (!stage) return state;
      
      const baseValue = SEAWEED_TYPES[seaweed.type].basePrice;
      const value = Math.round(baseValue * stage.multiplier);

      return {
        ...state,
        money: state.money + value,
        seaweeds: state.seaweeds.filter(s => s.id !== action.payload),
        eventMessage: `Harvested ${SEAWEED_TYPES[seaweed.type].name} for $${value}!`
      };

    case 'UPDATE_GROWTH':
      return {
        ...state,
        seaweeds: state.seaweeds.map(seaweed => ({
          ...seaweed,
          age: seaweed.age + 1
        }))
      };

    case 'UPDATE_MARKET':
      const priceChange = (Math.random() - 0.5) * 40;
      return {
        ...state,
        marketPrice: Math.max(
          MARKET_PRICE_RANGE.MIN,
          Math.min(MARKET_PRICE_RANGE.MAX, state.marketPrice + priceChange)
        )
      };

    case 'APPLY_EVENT':
      return {
        ...action.payload,
        eventMessage: action.message
      };

    case 'UPDATE_PASSIVE_INCOME':
      return {
        ...state,
        money: state.money + state.passiveIncomeRate,
      };

    case 'SELECT_SEAWEED_TYPE':
      return {
        ...state,
        selectedSeaweedType: action.payload
      };

    case 'CLEAR_MESSAGE':
      return {
        ...state,
        eventMessage: ''
      };

    default:
      return state;
  }
};

export default function SeaweedFarmer() {
  const [gameState, dispatch] = useReducer(gameReducer, {
    money: INITIAL_MONEY,
    seaweeds: [],
    marketPrice: 100,
    eventMessage: '',
    passiveIncomeRate: 1,
    selectedSeaweedType: 'EUCHEUMA'
  });

  const getGrowthStage = useCallback((age: number) => {
    return Object.values(GROWTH_STAGES)
      .reverse()
      .find(stage => age >= stage.age);
  }, []);

  const handleRandomEvent = useCallback(() => {
    const applicableEvents = RANDOM_EVENTS.filter(
      event => Math.random() < event.probability
    );
    
    if (applicableEvents.length > 0) {
      const event = applicableEvents[
        Math.floor(Math.random() * applicableEvents.length)
      ];
      
      dispatch({
        type: 'APPLY_EVENT',
        payload: event.effect(gameState),
        message: event.message
      });

      setTimeout(() => dispatch({ type: 'CLEAR_MESSAGE' }), 3000);
    }
  }, [gameState]);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      dispatch({ type: 'UPDATE_GROWTH' });
      if (Math.random() < 0.4) dispatch({ type: 'UPDATE_MARKET' });
      handleRandomEvent();
    }, UPDATE_INTERVAL);

    const passiveIncomeInterval = setInterval(() => {
      dispatch({ type: 'UPDATE_PASSIVE_INCOME' });
    }, 1000);

    return () => {
      clearInterval(gameInterval);
      clearInterval(passiveIncomeInterval);
    };
  }, [handleRandomEvent, gameState.passiveIncomeRate]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card className="border shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            🌱 Seaweed Farmer 🎮
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="flex items-center justify-center space-x-2">
              <DollarSign className="text-green-600" />
              <span>${gameState.money.toFixed(2)}</span>
            </div>
            <Tooltip>
              <TooltipTrigger className="flex items-center justify-center space-x-2">
                <Info className="text-blue-600" />
                <span>Market Price: ${gameState.marketPrice.toFixed(2)}/kg</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Market price affects harvest value</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {Object.entries(SEAWEED_TYPES).map(([type, data]) => (
          <Tooltip key={type}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => dispatch({ type: 'SELECT_SEAWEED_TYPE', payload: type as keyof typeof SEAWEED_TYPES })}
                className={`${data.color} text-white w-full border-2 ${
                  gameState.selectedSeaweedType === type 
                    ? 'border-yellow-400 shadow-lg' 
                    : 'border-transparent'
                }`}
              >
                {data.name} (${data.plantingCost})
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{data.description}</p>
              <p>{data.specialEffect}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {gameState.seaweeds.map((seaweed) => {
          const stage = getGrowthStage(seaweed.age);
          if (!stage) return null;
          
          const baseValue = SEAWEED_TYPES[seaweed.type].basePrice;
          const value = Math.round(baseValue * stage.multiplier);
          
          return (
            <Tooltip key={seaweed.id}>
              <TooltipTrigger>
                <div 
                  className={`h-20 ${SEAWEED_TYPES[seaweed.type].color} rounded cursor-pointer transition-transform hover:scale-105 seaweed-plot`}
                  onClick={() => dispatch({ 
                    type: 'HARVEST_SEAWEED', 
                    payload: seaweed.id 
                  })}
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center z-10">
                    {SEAWEED_TYPES[seaweed.type].name}
                    <br />
                    {stage.name}
                    <br />
                    ${value}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Type: {SEAWEED_TYPES[seaweed.type].name}</p>
                <p>Age: {seaweed.age} days</p>
                <p>Stage: {stage.name}</p>
                <p>Value: ${value}</p>
                <p>Click to harvest</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={() => dispatch({ type: 'PLANT_SEAWEED' })}
          size="lg"
          className="w-full bg-green-500 hover:bg-green-600"
        >
          Plant {SEAWEED_TYPES[gameState.selectedSeaweedType].name} (${SEAWEED_TYPES[gameState.selectedSeaweedType].plantingCost})
        </Button>
        
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <Info className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">
                {SEAWEED_TYPES[gameState.selectedSeaweedType].description}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {gameState.eventMessage && (
        <Alert variant="default" className="border shadow-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{gameState.eventMessage}</AlertDescription>
        </Alert>
      )}

      <style jsx global>{`
        @keyframes sway {
          0% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
          100% { transform: rotate(-1deg); }
        }
        
        .seaweed-plot {
          animation: sway 5s infinite ease-in-out;
          position: relative;
        }
      `}</style>
    </div>
  );
}
