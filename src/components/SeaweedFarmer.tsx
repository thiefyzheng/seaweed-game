"use client";

import React, { useReducer, useEffect, useCallback, useState } from 'react';
import { AlertCircle, Info, Trophy, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Quiz, { SeaweedType } from './Quiz';
import questions from '../lib/questions';

// Game constants
const INITIAL_ENERGY = 100;
const UPDATE_INTERVAL = 1000; // Faster updates for shorter game
const MARKET_UPDATE_CHANCE = 0.6;

const WIN_CONDITION = {
  EUCHEUMA: 5,
  GRACILARIA: 4,
  SARGASSUM: 3
};

const SEAWEED_TYPES = {
  EUCHEUMA: {
    name: 'Eucheuma',
    description: 'Cultivated for carrageenan production',
    energyCost: 15,
    color: 'bg-red-400',
    specialEffect: 'Faster growth in warm waters',
    // Add image paths for each growth stage
    images: {
      SEEDLING: '/images/eucheuma_seedling.png',
      GROWING: '/images/eucheuma_growing.png',
      MATURE: '/images/eucheuma_mature.png',
    }
  },
  GRACILARIA: {
    name: 'Gracilaria',
    description: 'High-quality agar source',
    energyCost: 25,
    color: 'bg-purple-400',
    specialEffect: 'Thrives in shrimp ponds',
    // Add image paths for each growth stage
    images: {
      SEEDLING: '/images/gracilaria_seedling.png',
      GROWING: '/images/gracilaria_growing.png',
      MATURE: '/images/gracilaria_mature.png',
    }
  },
  SARGASSUM: {
    name: 'Sargassum',
    description: 'Traditional medicinal uses',
    energyCost: 35,
    color: 'bg-green-400',
    specialEffect: 'Valuable for health benefits',
    // Add image paths for each growth stage
    images: {
      SEEDLING: '/images/sargassum_seedling.png',
      GROWING: '/images/sargassum_growing.png',
      MATURE: '/images/sargassum_mature.png',
    }
  }
} as const;

// For fallback when images aren't available yet
const PLACEHOLDER_IMAGES = {
  SEEDLING: '/api/placeholder/100/100',
  GROWING: '/api/placeholder/100/100',
  MATURE: '/api/placeholder/100/100'
};

const GROWTH_VALUE_SCALE = {
  MIN: 10, 
  MAX: 100
};

const GROWTH_STAGES = {
  SEEDLING: { name: 'Seedling', age: 0, energyReturn: 0, id: 'SEEDLING' },
  GROWING: { name: 'Growing', age: 2, energyReturn: 10, id: 'GROWING' },
  MATURE: { name: 'Mature', age: 4, energyReturn: 30, id: 'MATURE' },
};

// Game events with more variety
const RANDOM_EVENTS = [
  // Negative events (lower probability)
  {
    id: 'redTide',
    message: "🌊 Red tide alert! Some seaweed damaged!",
    probability: 0.04,
    effect: (state: GameState) => ({
      ...state,
      seaweeds: state.seaweeds.filter((_, index: number) => index % 2 === 0)
    })
  },
  {
    id: 'seaweedDisease',
    message: "🦠 Seaweed disease outbreak! Growth slowed!",
    probability: 0.04,
    effect: (state: GameState) => ({
      ...state,
      seaweeds: state.seaweeds.map(seaweed => ({
        ...seaweed,
        age: Math.max(0, seaweed.age - 2)
      }))
    })
  },
  {
    id: 'nutrientDrop',
    message: "📉 Nutrient levels drop! Growth potential decreases!",
    probability: 0.04,
    effect: (state: GameState) => ({
      ...state,
      growthValue: Math.max(GROWTH_VALUE_SCALE.MIN, state.growthValue * 0.7)
    })
  },
  {
    id: 'storm',
    message: "🌊 Storm damages some seaweed!",
    probability: 0.04,
    effect: (state: GameState) => ({
      ...state,
      seaweeds: state.seaweeds.filter(() => Math.random() > 0.3)
    })
  },

  // Positive events (higher probability)
  {
    id: 'perfectConditions',
    message: "🌡️ Perfect growing conditions!",
    probability: 0.15,
    effect: (state: GameState) => ({
      ...state,
      seaweeds: state.seaweeds.map(seaweed => ({
        ...seaweed,
        age: seaweed.age + 2
      }))
    })
  },
  {
    id: 'nutrientBloom',
    message: "🌿 Nutrient bloom accelerates growth!",
    probability: 0.15,
    effect: (state: GameState) => ({
      ...state,
      growthValue: Math.min(GROWTH_VALUE_SCALE.MAX, state.growthValue * 1.5),
      energy: state.energy + 20
    })
  },
  {
    id: 'sunnyDay',
    message: "☀️ Sunny day boosts your energy!",
    probability: 0.15,
    effect: (state: GameState) => ({
      ...state,
      energy: Math.min(150, state.energy + 30)
    })
  },
  {
    id: 'researchBreakthrough',
    message: "🔬 Research breakthrough! All seaweed grows faster!",
    probability: 0.12,
    effect: (state: GameState) => ({
      ...state,
      growthValue: Math.min(GROWTH_VALUE_SCALE.MAX, state.growthValue * 2)
    })
  },
  {
    id: 'carrageenanDemand',
    message: "🏭 Carrageenan demand spikes! Eucheuma thrives!",
    probability: 0.12,
    effect: (state: GameState) => ({
      ...state,
      seaweeds: state.seaweeds.map(seaweed => ({
        ...seaweed,
        age: seaweed.type === 'EUCHEUMA' ? seaweed.age + 4 : seaweed.age
      }))
    })
  },
  {
    id: 'agarResearch',
    message: "🧪 Agar research funding! Gracilaria flourishes!",
    probability: 0.12,
    effect: (state: GameState) => ({
      ...state,
      seaweeds: state.seaweeds.map(seaweed => ({
        ...seaweed,
        age: seaweed.type === 'GRACILARIA' ? seaweed.age + 4 : seaweed.age
      }))
    })
  },
  {
    id: 'medicinalDiscovery',
    message: "💊 New medicinal properties found! Sargassum in demand!",
    probability: 0.12,
    effect: (state: GameState) => ({
      ...state,
      seaweeds: state.seaweeds.map(seaweed => ({
        ...seaweed,
        age: seaweed.type === 'SARGASSUM' ? seaweed.age + 4 : seaweed.age
      }))
    })
  },
  {
    id: 'wildSeaweed',
    message: "🌱 Wild seaweed discovered!",
    probability: 0.1,
    effect: (state: GameState) => {
      const randomType = Object.keys(SEAWEED_TYPES)[Math.floor(Math.random() * Object.keys(SEAWEED_TYPES).length)] as keyof typeof SEAWEED_TYPES;
      return {
        ...state,
        seaweeds: [...state.seaweeds, {
          id: Date.now(),
          age: 0,
          type: randomType,
          growthValueAtPlanting: state.growthValue
        }]
      };
    }
  }
];

interface GameState {
  energy: number;
  seaweeds: Array<{
    id: number;
    age: number;
    growthValueAtPlanting: number;
    type: keyof typeof SEAWEED_TYPES;
  }>;
  growthValue: number;
  eventMessage: string;
  energyRegenRate: number;
  selectedSeaweedType: keyof typeof SEAWEED_TYPES;
  harvestedCounts: Record<keyof typeof SEAWEED_TYPES, number>;
  gameWon: boolean;
}


type GameAction =
  | { type: 'PLANT_SEAWEED' }
  | { type: 'HARVEST_SEAWEED'; payload: number }
  | { type: 'UPDATE_GROWTH' }
  | { type: 'UPDATE_GROWTH_VALUE' }
  | { type: 'APPLY_EVENT'; payload: GameState; message: string }
  | { type: 'CLEAR_MESSAGE' }
  | { type: 'REGENERATE_ENERGY' }
  | { type: 'SELECT_SEAWEED_TYPE'; payload: keyof typeof SEAWEED_TYPES }
  | { type: 'CORRECT_ANSWER'; payload: { reward: number; type: 'seaweed' | 'energy'; seaweedType?: SeaweedType } }
  | { type: 'INCORRECT_ANSWER'; payload: { penalty: number; type: 'seaweed' | 'energy' } };

const checkWinCondition = (counts: Record<keyof typeof SEAWEED_TYPES, number>): boolean => {
  return Object.entries(WIN_CONDITION).every(([type, required]) =>
    counts[type as keyof typeof SEAWEED_TYPES] >= required
  );
};

// Reducer for better state management
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'PLANT_SEAWEED':
      const energyCost = SEAWEED_TYPES[state.selectedSeaweedType].energyCost;
      if (state.energy < energyCost) {
        return {
          ...state,
          eventMessage: "Not enough energy to plant seaweed!"
        };
      }
      return {
        ...state,
        energy: state.energy - energyCost,
        seaweeds: [...state.seaweeds, {
          id: Date.now(),
          age: 0,
          type: state.selectedSeaweedType,
          growthValueAtPlanting: state.growthValue
        }]
      };

    case 'HARVEST_SEAWEED':
      const seaweed = state.seaweeds.find(s => s.id === action.payload);
      if (!seaweed) return state;

      const stage = Object.values(GROWTH_STAGES)
        .reverse()
        .find(stage => seaweed.age >= stage.age);

      if (!stage) return state;

      // Calculate energy return based on growth stage
      const energyReturn = Math.round(stage.energyReturn * (state.growthValue / 50));

      // Only count Mature harvests
      const newCounts = {
        ...state.harvestedCounts,
        [seaweed.type]: stage.name === 'Mature'
          ? state.harvestedCounts[seaweed.type] + 1
          : state.harvestedCounts[seaweed.type]
      };

      const gameWon = !state.gameWon && checkWinCondition(newCounts);

      return {
        ...state,
        energy: state.energy + energyReturn,
        seaweeds: state.seaweeds.filter(s => s.id !== action.payload),
        harvestedCounts: newCounts,
        gameWon,
        eventMessage: gameWon
          ? "🎉 Congratulations! You've mastered seaweed farming!"
          : `Harvested ${SEAWEED_TYPES[seaweed.type].name} for ${energyReturn} energy!`
      };

    case 'UPDATE_GROWTH':
      return {
        ...state,
        seaweeds: state.seaweeds.map(seaweed => ({
          ...seaweed,
          age: seaweed.age + 1
        }))
      };

    case 'UPDATE_GROWTH_VALUE':
      const valueChange = (Math.random() - 0.5) * 20;
      return {
        ...state,
        growthValue: Math.max(
          GROWTH_VALUE_SCALE.MIN,
          Math.min(GROWTH_VALUE_SCALE.MAX, state.growthValue + valueChange)
        )
      };

    case 'APPLY_EVENT':
      return {
        ...action.payload,
        eventMessage: action.message
      };

    case 'REGENERATE_ENERGY':
      return {
        ...state,
        energy: Math.min(150, state.energy + state.energyRegenRate),
      };

    case 'SELECT_SEAWEED_TYPE':
      return {
        ...state,
        selectedSeaweedType: action.payload
      };
    case 'CORRECT_ANSWER':
      if (action.payload.type === 'energy') {
        return {
          ...state,
          energy: state.energy + action.payload.reward,
        };
      } else {
        // Use the seaweed type from the payload or default to EUCHEUMA
        const seaweedType = action.payload.seaweedType || 'EUCHEUMA';
        return {
          ...state,
          seaweeds: [...state.seaweeds, {
            id: Date.now(),
            age: 0,
            type: seaweedType,
            growthValueAtPlanting: state.growthValue
          }],
          eventMessage: `Quiz reward: You earned a ${seaweedType} seaweed!`
        };
      }
    case 'INCORRECT_ANSWER':
      if (action.payload.type === 'energy') {
        return {
          ...state,
          energy: Math.max(0, state.energy - action.payload.penalty),
        };
      } else {
        return {
          ...state,
          seaweeds: state.seaweeds.slice(0, -1),
        };
      }

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
    energy: INITIAL_ENERGY,
    seaweeds: [],
    growthValue: 50,
    eventMessage: '',
    energyRegenRate: 2,
    selectedSeaweedType: 'EUCHEUMA',
    harvestedCounts: {
      EUCHEUMA: 0,
      GRACILARIA: 0,
      SARGASSUM: 0
    },
    gameWon: false
  });
  
  // State to track if the layout is in vertical mode
  const [isVertical, setIsVertical] = useState(true);
  // State to track viewport height
  const [viewportHeight, setViewportHeight] = useState(0);

  // Calculate viewport dimensions on mount and resize
  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setIsVertical(vw < 768); // Same breakpoint as Tailwind's md
      setViewportHeight(vh);
    };
    
    // Set initial values
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getGrowthStage = useCallback((age: number) => {
    return Object.values(GROWTH_STAGES)
      .reverse()
      .find(stage => age >= stage.age);
  }, []);

  // Get the image for a seaweed based on its type and growth stage
  const getSeaweedImage = useCallback((type: keyof typeof SEAWEED_TYPES, stageName: string) => {
    // Convert stage name to the corresponding ID in GROWTH_STAGES
    const stageId = Object.values(GROWTH_STAGES).find(stage => stage.name === stageName)?.id;
    
    if (!stageId) return PLACEHOLDER_IMAGES.SEEDLING;
    
    // Try to get the specific image for this seaweed type and growth stage
    // Fall back to placeholder if not found
    return SEAWEED_TYPES[type].images[stageId as keyof typeof PLACEHOLDER_IMAGES] || PLACEHOLDER_IMAGES[stageId as keyof typeof PLACEHOLDER_IMAGES];
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
      if (Math.random() < MARKET_UPDATE_CHANCE) dispatch({ type: 'UPDATE_GROWTH_VALUE' });
      handleRandomEvent();
    }, UPDATE_INTERVAL);

    const energyRegenInterval = setInterval(() => {
      dispatch({ type: 'REGENERATE_ENERGY' });
    }, 5000);

    return () => {
      clearInterval(gameInterval);
      clearInterval(energyRegenInterval);
    };
  }, [handleRandomEvent]);

  const handleCorrectAnswer = useCallback((reward: number, type: 'seaweed' | 'energy', seaweedType?: SeaweedType) => {
    dispatch({ 
      type: 'CORRECT_ANSWER', 
      payload: { reward, type, seaweedType } 
    });
  }, []);

  const handleIncorrectAnswer = useCallback((penalty: number, type: 'seaweed' | 'energy') => {
    dispatch({ 
      type: 'INCORRECT_ANSWER', 
      payload: { penalty, type } 
    });
  }, []);
  
  // Calculate heights for vertical mode
  const verticalTopHeight = isVertical ? `${Math.floor(viewportHeight * 0.5)}px` : 'auto';
  const verticalBottomHeight = isVertical ? `${Math.floor(viewportHeight * 0.5)}px` : 'auto';

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main game container with responsive layout */}
      <div className={`flex flex-col md:flex-row ${isVertical ? 'h-screen' : ''}`}>
        {/* Top section (Seaweed farm) in vertical mode */}
        <div 
          className="w-full md:w-1/2 md:order-1 flex flex-col space-y-2 p-2 overflow-auto" 
          style={{ height: isVertical ? verticalTopHeight : 'auto' }}
        >
          <Card className="border shadow-sm">
            <CardHeader className="py-2 px-4">
              <CardTitle className="text-xl font-bold text-center">
                🌱 Seaweed Farmer 🎮
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Leaf className="text-green-600 h-4 w-4" />
                  <span>Energy: {gameState.energy}</span>
                </div>
                <Tooltip>
                  <TooltipTrigger className="flex items-center justify-center space-x-2">
                    <Info className="text-blue-600 h-4 w-4" />
                    <span>Growth: {gameState.growthValue.toFixed(0)}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Growth potential affects harvest energy return</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <Trophy className={`h-5 w-5 ${gameState.gameWon ? 'text-yellow-500' : 'text-gray-400'}`} />
                <div className="flex space-x-3">
                  {Object.entries(WIN_CONDITION).map(([type, required]) => (
                    <div key={type} className="text-xs">
                      <span className="font-medium">{SEAWEED_TYPES[type as keyof typeof SEAWEED_TYPES].name}:</span>
                      <span className={gameState.harvestedCounts[type as keyof typeof SEAWEED_TYPES] >= required ? 'text-green-600' : ''}>
                        {' '}{gameState.harvestedCounts[type as keyof typeof SEAWEED_TYPES]}/{required}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-2">
            {Object.entries(SEAWEED_TYPES).map(([type, data]) => (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => dispatch({ type: 'SELECT_SEAWEED_TYPE', payload: type as keyof typeof SEAWEED_TYPES })}
                    className={`${data.color} text-white w-full border-2 text-xs h-8 ${
                      gameState.selectedSeaweedType === type
                        ? 'border-yellow-400 shadow-lg'
                        : 'border-transparent'
                    }`}
                  >
                    {data.name} ({data.energyCost})
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{data.description}</p>
                  <p>{data.specialEffect}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Scrollable seaweed container with dynamic height */}
          <div className="flex-grow overflow-y-auto min-h-32">
            <div className="grid grid-cols-3 gap-2">
              {gameState.seaweeds.map((seaweed) => {
                const stage = getGrowthStage(seaweed.age);
                if (!stage) return null;

                const energyReturn = Math.round(stage.energyReturn * (gameState.growthValue / 50));
                const displayValue = stage.energyReturn < 0 ? `-${Math.abs(energyReturn)}` : `+${energyReturn}`;
                const seaweedImage = getSeaweedImage(seaweed.type, stage.name);

                return (
                  <Tooltip key={seaweed.id}>
                    <TooltipTrigger>
                      <div
                        className={`h-16 relative rounded cursor-pointer transition-transform hover:scale-105 seaweed-plot overflow-hidden ${SEAWEED_TYPES[seaweed.type].color}`}
                        onClick={() => dispatch({
                          type: 'HARVEST_SEAWEED',
                          payload: seaweed.id
                        })}
                      >
                        <div className="relative h-full w-full flex items-center justify-center">
                          <img 
                            src={seaweedImage} 
                            alt={`${SEAWEED_TYPES[seaweed.type].name} in ${stage.name} stage`}
                            className="h-full w-auto object-contain z-0"
                          />
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center z-10">
                          {stage.name} {displayValue}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Type: {SEAWEED_TYPES[seaweed.type].name}</p>
                      <p>Age: {seaweed.age} days</p>
                      <p>Stage: {stage.name}</p>
                      <p>Energy Return: {displayValue}</p>
                      <p>{stage.name === 'Mature' ? '✨ Will count towards goal!' : 'Not ready to count yet'}</p>
                      <p>Click to harvest</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={() => dispatch({ type: 'PLANT_SEAWEED' })}
              size="sm"
              className="w-full bg-green-500 hover:bg-green-600 h-8"
            >
              Plant {SEAWEED_TYPES[gameState.selectedSeaweedType].name} ({SEAWEED_TYPES[gameState.selectedSeaweedType].energyCost} energy)
            </Button>

            {gameState.eventMessage && (
              <Alert variant="default" className="border shadow-sm py-1">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{gameState.eventMessage}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Bottom section (Quiz) in vertical mode */}
        <div 
          className="w-full md:w-1/2 md:order-2 p-2 overflow-auto" 
          style={{ height: isVertical ? verticalBottomHeight : 'auto' }}
        >
          <Quiz
            questions={questions}
            onCorrectAnswer={handleCorrectAnswer}
            onIncorrectAnswer={handleIncorrectAnswer}
          />
        </div>
      </div>

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
        
        /* Prevent body scrolling if the game components handle their own scrolling */
        body {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}