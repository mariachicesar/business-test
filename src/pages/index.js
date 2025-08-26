import { Geist} from "next/font/google";
import { useState } from "react";
import { quizQuestions } from "../data/quizQuestions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    });
    // Show the correct answer immediately after selection
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowAnswer(false); // Reset answer visibility for next question
    } else {
      calculateScore();
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Check if the previous question was already answered to show its answer
      const prevQuestionId = quizQuestions[currentQuestion - 1].id;
      setShowAnswer(selectedAnswers[prevQuestionId] !== undefined);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quizQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.correct) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setShowAnswer(false);
    setScore(0);
  };

  const currentQ = quizQuestions[currentQuestion];
  const isAnswered = selectedAnswers[currentQ?.id] !== undefined;

  if (showResults) {
    return (
      <div className={`${geistSans.className} min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
              Quiz Complete! 🎉
            </h1>
            <div className="mb-8">
              <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {score}/{quizQuestions.length}
              </div>
              <div className="text-xl text-gray-600 dark:text-gray-300">
                {score === quizQuestions.length ? "Perfect Score!" :
                 score >= quizQuestions.length * 0.8 ? "Excellent!" :
                 score >= quizQuestions.length * 0.6 ? "Good Job!" :
                 "Keep Studying! Ponte las Pilas Albert"}
              </div>
            </div>
            <div className="mb-6">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
                <div 
                  className="bg-indigo-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${(score / quizQuestions.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {Math.round((score / quizQuestions.length) * 100)}% Correct
              </p>
            </div>
            <button
              onClick={resetQuiz}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${geistSans.className} min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Business Study Quiz
            </h1>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
            {currentQ.question}
          </h2>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQ.id] === index;
              const isCorrect = index === currentQ.correct;
              const showCorrectAnswer = showAnswer && isCorrect;
              const showWrongAnswer = showAnswer && isSelected && !isCorrect;
              
              return (
                <button
                  key={index}
                  onClick={() => !showAnswer && handleAnswerSelect(currentQ.id, index)}
                  disabled={showAnswer}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    showCorrectAnswer
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400'
                      : showWrongAnswer
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400'
                      : isSelected
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700'
                  } ${showAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        showCorrectAnswer
                          ? 'border-green-500 bg-green-500'
                          : showWrongAnswer
                          ? 'border-red-500 bg-red-500'
                          : isSelected
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-gray-300 dark:border-gray-500'
                      }`}>
                        {(isSelected || showCorrectAnswer) && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className={`${
                        showCorrectAnswer
                          ? 'text-green-700 dark:text-green-200'
                          : showWrongAnswer
                          ? 'text-red-700 dark:text-red-200'
                          : 'text-gray-700 dark:text-gray-200'
                      }`}>
                        {option}
                      </span>
                    </div>
                    
                    {/* Show icons for correct/incorrect answers */}
                    {showAnswer && (
                      <div className="ml-2">
                        {isCorrect && (
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        {showWrongAnswer && (
                          <div className="flex items-center text-red-600 dark:text-red-400">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Show explanation after answer is revealed */}
          {showAnswer && (
            <div className={`mt-4 p-4 rounded-lg ${
              selectedAnswers[currentQ.id] === currentQ.correct
                ? 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center mb-2">
                {selectedAnswers[currentQ.id] === currentQ.correct ? (
                  <>
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-green-700 dark:text-green-200">Correct!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-red-700 dark:text-red-200">Incorrect!</span>
                  </>
                )}
              </div>
              <p className={`text-sm ${
                selectedAnswers[currentQ.id] === currentQ.correct
                  ? 'text-green-600 dark:text-green-300'
                  : 'text-red-600 dark:text-red-300'
              }`}>
                The correct answer is: <strong>{currentQ.options[currentQ.correct]}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              currentQuestion === 0
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              !isAnswered
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
