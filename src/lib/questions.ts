import { Question } from '@/components/Quiz';

const questions: Question[] = [
  {
    question: 'What is the capital of France?',
    options: ['London', 'Paris', 'Berlin', 'Rome'],
    correctAnswer: 'Paris',
    reward: 10,
    type: 'money',
  },
  {
    question: 'What is the highest mountain in the world?',
    options: ['Mount Everest', 'K2', 'Kangchenjunga', 'Lhotse'],
    correctAnswer: 'Mount Everest',
    reward: 5,
    type: 'seaweed',
  },
  {
    question: 'What is the largest country in the world?',
    options: ['Russia', 'Canada', 'China', 'United States'],
    correctAnswer: 'Russia',
    reward: 15,
    type: 'money',
  },
  {
    question: 'What is the optimal water temperature for seaweed growth?',
    options: ['10°C', '15°C', '20°C', '25°C'],
    correctAnswer: '20°C',
    reward: 7,
    type: 'seaweed',
  },
  {
    question: 'Which nutrient is most important for seaweed?',
    options: ['Nitrogen', 'Phosphorus', 'Potassium', 'Calcium'],
    correctAnswer: 'Nitrogen',
    reward: 12,
    type: 'money',
  },
  {
    question: 'What is the ideal salinity for growing seaweed?',
    options: ['10 ppt', '20 ppt', '30 ppt', '40 ppt'],
    correctAnswer: '30 ppt',
    reward: 8,
    type: 'seaweed',
  },
];

export default questions;
