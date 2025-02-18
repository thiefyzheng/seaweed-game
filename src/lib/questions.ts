import { Question } from '@/components/Quiz';

const questions: Question[] = [
  {
    "question": "What is the primary species of seaweed cultivated in Sabah for carrageenan production?",
    "options": ["Gracilaria spp.", "Eucheuma/Kappaphycus", "Sargassum spp.", "Turbinaria spp."],
    "correctAnswer": "Eucheuma/Kappaphycus",
    "reward": 10,
    "type": "seaweed"
  },
  {
    question: "Which state in Malaysia is known for its commercial seaweed farming?",
    options: ["Sabah", "Kelantan", "Perak", "Johor"],
    correctAnswer: "Sabah",
    reward: 8,
    type: "money"
  },
  {
    question: "What is the main economic benefit of seaweed cultivation in Malaysia?",
    options: ["Generating export revenue", "Improving food security", "Creating jobs in coastal areas", "All of the above"],
    correctAnswer: "All of the above",
    reward: 12,
    type: "seaweed"
  },
  {
    question: "What challenge do seaweed farmers face due to inconsistent drying techniques?",
    options: ["Poor product quality", "Increased production costs", "Labor shortages", "All of the above"],
    correctAnswer: "Poor product quality",
    reward: 7,
    type: "money"
  },
  {
    question: "Which nutrient is most abundant in seaweed and contributes to its superfood status?",
    options: ["Proteins", "Vitamins", "Minerals", "All of the above"],
    correctAnswer: "All of the above",
    reward: 9,
    type: "seaweed"
  },
  {
    question: "What is the primary use of Glacilaria seaweed in Malaysia?",
    options: ["Extraction of carrageenan", "Food additive", "Traditional medicine", "All of the above"],
    correctAnswer: "All of the above",
    reward: 10,
    type: "money"
  },
  {
    question: "What traditional dish from Kelantan is made using seaweed?",
    options: ["Kerabu Sare", "Seaweed Salad", "Carrageenan Soup", "None of the above"],
    correctAnswer: "Kerabu Sare",
    reward: 6,
    type: "seaweed"
  },
  {
    question: "What is the main advantage of integrating seaweed farming with shrimp ponds?",
    options: ["Improving water quality", "Increasing production costs", "Reducing biodiversity"],
    correctAnswer: "Improving water quality",
    reward: 8,
    type: "money"
  },
  {
    question: "Which organization plays a significant role in promoting seaweed farming in Malaysia?",
    options: ["Department of Fisheries Malaysia (DoFM)", "Sabah Economic Development and Investment Authority", "University of Malaya"],
    correctAnswer: "All of the above",
    reward: 10,
    type: "seaweed"
  },
  {
    question: "What is the main threat to marine biodiversity from excessive seaweed harvesting?",
    options: ["Habitat destruction", "Pollution", "Overpopulation of certain species"],
    correctAnswer: "Habitat destruction",
    reward: 7,
    type: "money"
  }
];

export default questions;
