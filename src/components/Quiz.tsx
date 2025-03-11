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
  const [rewardSeaweed, setRewardSeaweed] = useState<SeaweedType | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const seaweedTypes: SeaweedType[] = ['EUCHEUMA', 'GRACILARIA', 'SARGASSUM'];

  const getRandomSeaweed = (): SeaweedType => {
    const randomIndex = Math.floor(Math.random() * seaweedTypes.length);
    return seaweedTypes[randomIndex];
  };

  const handleAnswerClick = (answer: string) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      setFeedback('Please select an answer.');
      return;
    }

    setIsAnswerSubmitted(true);
    
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
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
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setFeedback('');
      setExplanation('');
      setRewardSeaweed(null);
      setIsAnswerSubmitted(false);
    } else {
      // Reset quiz or show completion message
      setFeedback('Quiz completed!');
      // Optionally restart the quiz
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
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
            className={`option-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              selectedAnswer === option ? 'bg-blue-700' : ''
            } ${isAnswerSubmitted ? 'cursor-not-allowed opacity-75' : ''}`}
            onClick={() => handleAnswerClick(option)}
            disabled={isAnswerSubmitted}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="button-container mb-4">
        <button
          onClick={handleSubmitAnswer}
          disabled={!selectedAnswer || isAnswerSubmitted}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          Submit Answer
        </button>
      </div>

      {/* Custom Feedback Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="mb-4">
              <h3 className={`text-xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {isCorrect ? "Correct!" : "Incorrect!"}
              </h3>
              <p className="mt-2">{feedback}</p>
              
              {rewardSeaweed && (
                <div className="mt-4 flex items-center">
                  <span
                    className={`inline-block w-6 h-6 rounded-full ${
                      rewardSeaweed === 'EUCHEUMA' ? 'bg-red-400' :
                      rewardSeaweed === 'GRACILARIA' ? 'bg-purple-400' :
                      'bg-green-400'
                    } mr-2`}
                  ></span>
                  <span>{rewardSeaweed} added to your farm!</span>
                </div>
              )}
              
              {explanation && (
                <div className="mt-4 p-3 bg-gray-100 rounded">
                  <p className="font-semibold">Explanation:</p>
                  <p>{explanation}</p>
                  <p className="mt-2">
                    <span className="font-semibold">Correct Answer:</span> {currentQuestion.correctAnswer}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleDialogClose}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export type { Question, SeaweedType };
export default Quiz;