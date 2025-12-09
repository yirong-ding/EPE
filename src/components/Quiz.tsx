import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { ChevronRight, ChevronLeft, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { Navigation } from "./Navigation";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizProps {
  questions: Question[];
  onComplete: (score: number, answers: number[]) => void;
  onAccountClick: () => void;
}

export function Quiz({ questions, onComplete, onAccountClick }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];
  const hasAnswered = selectedAnswers[currentQuestion] !== null;

  const handleOptionChange = (value: string) => {
    if (hasAnswered) return; // Can't change answer once submitted
    
    setSelectedOption(value);
    const answerIndex = parseInt(value);
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      const nextAnswer = selectedAnswers[currentQuestion + 1];
      setSelectedOption(nextAnswer !== null ? nextAnswer.toString() : "");
      setShowExplanation(selectedAnswers[currentQuestion + 1] !== null);
    } else {
      // Last question, submit answers
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevAnswer = selectedAnswers[currentQuestion - 1];
      setSelectedOption(prevAnswer !== null ? prevAnswer.toString() : "");
      setShowExplanation(selectedAnswers[currentQuestion - 1] !== null);
    }
  };

  const handleQuestionClick = (index: number) => {
    // Only allow navigation to answered questions or adjacent questions
    if (selectedAnswers[index] !== null || Math.abs(index - currentQuestion) <= 1) {
      setCurrentQuestion(index);
      const answer = selectedAnswers[index];
      setSelectedOption(answer !== null ? answer.toString() : "");
      setShowExplanation(selectedAnswers[index] !== null);
    }
  };

  const handleSubmit = () => {
    const score = selectedAnswers.reduce((total, answer, index) => {
      if (answer === questions[index].correctAnswer) {
        return total + 10;
      }
      return total;
    }, 0);
    onComplete(score, selectedAnswers as number[]);
  };

  const isCorrect = hasAnswered && selectedAnswers[currentQuestion] === question.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navigation onAccountClick={onAccountClick} showAccount={true} isAccountPage={false} />
      <div className="flex items-center justify-center p-4 py-8">
        <Card className="max-w-3xl w-full">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">
                Question {currentQuestion + 1} of {questions.length}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {selectedAnswers.filter(a => a !== null).length}/{questions.length} Answered
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg">{question.question}</h3>
            <RadioGroup value={selectedOption} onValueChange={handleOptionChange}>
              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = selectedOption === index.toString();
                  const isCorrectOption = index === question.correctAnswer;
                  const showCorrect = showExplanation && isCorrectOption;
                  const showWrong = showExplanation && isSelected && !isCorrectOption;

                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors ${
                        hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'
                      } ${
                        showCorrect
                          ? "border-green-500 bg-green-50 dark:bg-green-950"
                          : showWrong
                          ? "border-red-500 bg-red-50 dark:bg-red-950"
                          : isSelected
                          ? "border-green-500 bg-green-50 dark:bg-green-950"
                          : "border-border hover:border-green-300"
                      }`}
                      onClick={() => !hasAnswered && handleOptionChange(index.toString())}
                    >
                      <RadioGroupItem 
                        value={index.toString()} 
                        id={`option-${index}`}
                        disabled={hasAnswered}
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className={`flex-1 ${hasAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {option}
                      </Label>
                      {showCorrect && (
                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                      )}
                      {showWrong && (
                        <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {showExplanation && (
            <div className={`p-4 rounded-lg border-2 ${
              isCorrect 
                ? 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-800'
                : 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-800'
            }`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <Lightbulb className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="mb-2">
                    {isCorrect ? 'Correct Answer!' : 'Correct answer is: ' + question.options[question.correctAnswer]}
                  </h4>
                  <p className="text-sm">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous Question
            </Button>
            <Button
              onClick={handleNext}
              disabled={!hasAnswered}
              className="bg-green-600 hover:bg-green-700"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Click on any answered question to navigate:
            </div>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, index) => {
                const isAnswered = selectedAnswers[index] !== null;
                const isClickable = isAnswered || Math.abs(index - currentQuestion) <= 1;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(index)}
                    disabled={!isClickable}
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                      index === currentQuestion
                        ? "border-green-500 bg-green-500 text-white scale-110"
                        : isAnswered
                        ? selectedAnswers[index] === questions[index].correctAnswer
                          ? "border-green-500 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:scale-105 cursor-pointer"
                          : "border-red-500 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:scale-105 cursor-pointer"
                        : isClickable
                        ? "border-border hover:border-green-300 cursor-pointer"
                        : "border-border opacity-50 cursor-not-allowed"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
