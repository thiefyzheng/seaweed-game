interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  reward: number;
  type: 'seaweed';
  explanation?: string;
}

const questions: Question[] = [
  {
    "question": "What is the primary species of seaweed cultivated in Sabah for carrageenan production?",
    "options": ["Gracilaria spp.", "Eucheuma/Kappaphycus", "Sargassum spp.", "Turbinaria spp."],
    "correctAnswer": "Eucheuma/Kappaphycus",
    "reward": 10,
    "type": "seaweed",
    "explanation": "Eucheuma/Kappaphycus is the primary species cultivated in Sabah for carrageenan production."
  },
  {
    question: "Which state in Malaysia is known for its commercial seaweed farming?",
    options: ["Sabah", "Kelantan", "Perak", "Johor"],
    correctAnswer: "Sabah",
    reward: 8,
    type: "seaweed",
    "explanation": "Sabah is known for its extensive seaweed farming operations."
  },
  {
    question: "What is the main economic benefit of seaweed cultivation in Malaysia?",
    options: ["Generating export revenue", "Improving food security", "Creating jobs in coastal areas", "All of the above"],
    correctAnswer: "All of the above",
    reward: 12,
    type: "seaweed",
    "explanation": "Seaweed cultivation contributes to export revenue, food security, and job creation."
  },
  {
    question: "What challenge do seaweed farmers face due to inconsistent drying techniques?",
    options: ["Poor product quality", "Increased production costs", "Labor shortages", "All of the above"],
    correctAnswer: "Poor product quality",
    reward: 7,
    type: "seaweed",
    "explanation": "Inconsistent drying leads to reduced quality and market value."
  },
  {
    question: "Which nutrient is most abundant in seaweed and contributes to its superfood status?",
    options: ["Proteins", "Vitamins", "Minerals", "All of the above"],
    correctAnswer: "All of the above",
    reward: 9,
    type: "seaweed",
    "explanation": "Seaweed is rich in proteins, vitamins, and minerals, making it a nutritious food source."
  },
  {
    question: "What is the primary use of Glacilaria seaweed in Malaysia?",
    options: ["Extraction of carrageenan", "Food additive", "Traditional medicine", "All of the above"],
    correctAnswer: "All of the above",
    reward: 10,
    type: "seaweed",
    "explanation": "Glacilaria is used for carrageenan extraction, as a food additive, and in traditional medicine."
  },
  {
    question: "What traditional dish from Kelantan is made using seaweed?",
    options: ["Kerabu Sare", "Seaweed Salad", "Carrageenan Soup", "None of the above"],
    correctAnswer: "Kerabu Sare",
    reward: 6,
    type: "seaweed",
    "explanation": "Kerabu Sare is a traditional Kelantanese dish made with seaweed."
  },
  {
    question: "What is the main advantage of integrating seaweed farming with shrimp ponds?",
    options: ["Improving water quality", "Increasing production costs", "Reducing biodiversity"],
    correctAnswer: "Improving water quality",
    reward: 8,
    type: "seaweed",
    "explanation": "Seaweed helps to filter and improve water quality in shrimp ponds."
  },
  {
    question: "Which organization plays a significant role in promoting seaweed farming in Malaysia?",
    options: ["Department of Fisheries Malaysia (DoFM)", "Sabah Economic Development and Investment Authority", "University of Malaya"],
    correctAnswer: "All of the above",
    reward: 10,
    type: "seaweed",
    "explanation": "These organizations support and promote seaweed farming initiatives."
  },
  {
    question: "What is the main threat to marine biodiversity from excessive seaweed harvesting?",
    options: ["Habitat destruction", "Pollution", "Overpopulation of certain species"],
    correctAnswer: "Habitat destruction",
    reward: 7,
    type: "seaweed",
    "explanation": "Over-harvesting can lead to the destruction of marine habitats."
  }
];

export default questions;
