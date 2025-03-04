import React, { useState } from 'react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  reward: number;
  explanation?: string;
}

type SeaweedType = 'EUCHEUMA' | 'GRACILARIA' | 'SARGASSUM';

interface QuizProps {
  questions: Question[];
  onCorrectAnswer: (reward: number, type: 'seaweed' | 'energy', seaweedType?: SeaweedType) => void;
  onIncorrectAnswer: (penalty: number, type: 'seaweed' | 'energy') => void;
}

const Quiz: React.FC<QuizProps> = ({
  questions,
  onCorrectAnswer,
  onIncorrectAnswer
}: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [rewardSeaweed, setRewardSeaweed] = useState<SeaweedType | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const seaweedTypes: SeaweedType[] = ['EUCHEUMA', 'GRACILARIA', 'SARGASSUM'];

  const getRandomSeaweed = (): SeaweedType => {
    const randomIndex = Math.floor(Math.random() * seaweedTypes.length);
    return seaweedTypes[randomIndex];
  };

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      setFeedback('Please select an answer.');
      return;
    }

    setShowExplanation(false); // Hide explanation initially

    if (selectedAnswer === currentQuestion.correctAnswer) {
      const randomSeaweed = getRandomSeaweed();
      setRewardSeaweed(randomSeaweed);
      setFeedback(`Correct! You earned a ${randomSeaweed} seaweed!`);
      onCorrectAnswer(currentQuestion.reward, 'seaweed', randomSeaweed);
    } else {
      setRewardSeaweed(null);
      setFeedback('Incorrect!');
      onIncorrectAnswer(currentQuestion.reward, 'energy');
    }

    setExplanation(currentQuestion.explanation || '');
    setTimeout(() => {
      setShowExplanation(true); // Show explanation after feedback
    }, 1000); // 1-second delay before showing explanation

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setFeedback('');
        setRewardSeaweed(null);
        setShowExplanation(false);
        setSelectedAnswer(null);
      } else {
        setFeedback('Quiz completed!');
      }
    }, 2000); // 2-second delay before moving to next question
  };

  return (
    <div className="quiz-container bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Quiz</h2>
      <div className="question text-lg mb-4">{currentQuestion.question}</div>
      <div className="options grid grid-cols-2 gap-4 mb-4">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            className={`option-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${selectedAnswer === option ? 'bg-green-500' : ''}`}
            onClick={() => handleAnswerClick(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmitAnswer}
        disabled={!selectedAnswer}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        Submit Answer
      </button>
      <div className="feedback mt-4 text-center">
        {feedback}
        {rewardSeaweed && (
          <div className="seaweed-reward mt-2">
            <span
              className={`inline-block w-6 h-6 rounded-full ${
                rewardSeaweed === 'EUCHEUMA' ? 'bg-red-400' : 
                rewardSeaweed === 'GRACILARIA' ? 'bg-purple-400' : 
                'bg-green-400'
              } mr-2`}
            ></span>
            {rewardSeaweed}
          </div>
        )}
        {showExplanation && explanation && (
          <div className="explanation mt-2">
            <p>Explanation: {explanation}</p>
            <p>Correct Answer: {currentQuestion.correctAnswer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export type { Question, SeaweedType };
export default Quiz;