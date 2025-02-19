import React, { useState } from 'react';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  reward: number;
  explanation?: string;
}

interface QuizProps {
  questions: Question[];
  onCorrectAnswer: (reward: number, type: 'seaweed' | 'energy') => void;
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

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      setFeedback('Please select an answer.');
      return;
    }

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setFeedback('Correct!');
      setExplanation(currentQuestion.explanation || '');
      onCorrectAnswer(currentQuestion.reward);
    } else {
      setFeedback('Incorrect!');
            setExplanation(currentQuestion.explanation || '');
      onIncorrectAnswer(currentQuestion.reward);
    }

    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setFeedback('');
      }, 2000);
    } else {
      setFeedback('Quiz completed!');
    }
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
        {explanation && (
          <div className="explanation mt-2">
            <p>Explanation: {explanation}</p>
            <p>Explanation: {explanation}</p>
            <p>Correct Answer: {currentQuestion.correctAnswer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export type { Question };
export default Quiz;
