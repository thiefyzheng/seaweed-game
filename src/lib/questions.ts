import { Question } from '@/components/Quiz';

const questions: Question[] = [
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
  {
    question: "Which of the following species is NOT commonly found in Malaysian waters?",
    options: ["Gracilaria spp.", "Eucheuma/Kappaphycus", "Sargassum spp.", "Dictyota dichotoma"],
    correctAnswer: "Dictyota dichotoma",
    reward: 5,
    type: "seaweed",
  },
  {
    question: "What is the primary economic use of *Eucheuma/Kappaphycus* in Malaysia?",
    options: ["Production of agar", "Extraction of carrageenan", "Use as a food source", "Ornamental purposes"],
    correctAnswer: "Extraction of carrageenan",
    reward: 10,
    type: "money",
  },
  {
    question: "Which division of algae is known for being the dominant type in tropical seaweed flora, including species like *Gracilaria* and *Eucheuma/Kappaphycus*?",
    options: ["Chlorophyta", "Rhodophyta", "Phaeophyta", "Cyanophyta"],
    correctAnswer: "Rhodophyta",
    reward: 5,
    type: "seaweed",
  },
  {
    question: "Where is *Caulerpa spp.* commonly cultivated in Malaysia, alongside shrimp farming, to improve water quality?",
    options: ["Coral reefs", "Mangrove areas", "Shrimp ponds", "Deep ocean waters"],
    correctAnswer: "Shrimp ponds",
    reward: 10,
    type: "money",
  },
  {
    question: "What traditional use is associated with *Sargassum* among coastal communities in Malaysia?",
    options: ["Used as a food additive", "Sold in Chinese medicine shops for cooling effects", "Extracted for agar production", "Both A and B"],
    correctAnswer: "Both A and B",
    reward: 5,
    type: "seaweed",
  },
  {
    question: "Which of the following is NOT a threat to Malaysian seaweed resources?",
    options: ["Pollution from industrial effluents", "Overharvesting of natural populations", "Habitat destruction due to coastal development", "Introduction of marine protected areas"],
    correctAnswer: "Introduction of marine protected areas",
    reward: 10,
    type: "money",
  },
  {
    question: "What is one benefit of integrating *Caulerpa spp.* and shrimp farming in ponds?",
    options: ["Reducing water pollution by filtering excess nutrients", "Increasing the cost of production", "Decreasing biodiversity in the area", "Both A and C"],
    correctAnswer: "Reducing water pollution by filtering excess nutrients",
    reward: 5,
    type: "seaweed",
  },
  {
    question: "Which species is known for its role in calcification and contributing to reef ecosystems?",
    options: ["Gracilaria spp.", "Halimeda spp.", "Sargassum spp.", "Turbinaria spp."],
    correctAnswer: "Halimeda spp.",
    reward: 10,
    type: "money",
  },
  {
    question: "What is the primary use of *Turbinaria* in Malaysian culture?",
    options: ["Source of agar", "Used as a food source", "Sold as a cooling agent in traditional medicine", "All of the above"],
    correctAnswer: "All of the above",
    reward: 5,
    type: "seaweed",
  },
  {
    question: "Which of the following is NOT an industrial product derived from Malaysian seaweeds?",
    options: ["Carrageenan", "Agar", "Phlorotannins", "Lipids"],
    correctAnswer: "Lipids",
    reward: 10,
    type: "money",
  }
];

export default questions;
