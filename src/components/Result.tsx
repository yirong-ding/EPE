import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Trophy, Leaf, CheckCircle, XCircle, RotateCcw, MessageSquare, Sparkles, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { UserData } from "../utils/userDataManager";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ResultProps {
  score: number;
  totalQuestions: number;
  answers: number[];
  questions: Question[];
  onRestart: () => void;
  onGoToForum: () => void;
  userData: UserData;
}

export function Result({ score, totalQuestions, answers, questions, onRestart, onGoToForum, userData }: ResultProps) {
  const percentage = (score / (totalQuestions * 10)) * 100;
  
  const getLevel = () => {
    if (percentage >= 90) return { title: "Environmental Expert", color: "bg-green-500", description: "You have excellent knowledge of environmental protection!" };
    if (percentage >= 70) return { title: "Environmental Guardian", color: "bg-blue-500", description: "You have great environmental awareness!" };
    if (percentage >= 50) return { title: "Environmental Learner", color: "bg-yellow-500", description: "Keep learning, you'll do better!" };
    return { title: "Environmental Beginner", color: "bg-orange-500", description: "Learn more about environmental protection and make a difference!" };
  };

  const level = getLevel();
  const correctCount = answers.filter((answer, index) => answer === questions[index].correctAnswer).length;

  // Personalized recommendations based on user preferences
  const getPersonalizedTips = () => {
    const tips: string[] = [];
    const preferences = userData.preferences;

    if (!preferences) {
      return [
        "Reduce the use of single-use plastic products",
        "Turn off lights when not in use to save energy",
        "Practice waste sorting starting today",
        "Use public transportation or cycling more often",
        "Conserve water and protect water resources",
      ];
    }

    // Provide recommendations based on areas of interest
    if (preferences.interests.includes("recycling")) {
      tips.push("Learn waste sorting standards in depth and properly dispose of various types of waste");
      tips.push("Explore ways to reuse recyclables, such as repurposing old clothes");
    }
    if (preferences.interests.includes("energy")) {
      tips.push("Use energy-efficient light bulbs and appliances to reduce energy consumption");
      tips.push("Learn about renewable energy, such as solar and wind power applications");
    }
    if (preferences.interests.includes("water")) {
      tips.push("Learn water-saving tips, such as reusing vegetable washing water");
      tips.push("Focus on water resource protection and learn about water pollution prevention");
    }
    if (preferences.interests.includes("biodiversity")) {
      tips.push("Protect wildlife and do not purchase wildlife products");
      tips.push("Learn about local ecosystems and participate in biodiversity conservation activities");
    }
    if (preferences.interests.includes("sustainable")) {
      tips.push("Practice a low-carbon lifestyle and reduce your carbon footprint");
      tips.push("Choose eco-friendly products and support sustainable development");
    }
    if (preferences.interests.includes("climate")) {
      tips.push("Understand the causes and impacts of climate change");
      tips.push("Participate in climate change mitigation actions, such as tree planting");
    }

    // Adjust recommendations based on knowledge level
    if (preferences.experience === "beginner") {
      tips.push("Start with small daily actions to develop environmental habits");
      tips.push("Read more environmental science articles to increase awareness");
    } else if (preferences.experience === "advanced") {
      tips.push("Participate in environmental volunteer activities and spread environmental concepts");
      tips.push("Study cutting-edge knowledge in the environmental field");
    }

    // Adjust recommendations based on learning goals
    if (preferences.goals.includes("practice")) {
      tips.push("Apply what you've learned to daily life");
      tips.push("Record your environmental practices and form good habits");
    }
    if (preferences.goals.includes("share")) {
      tips.push("Share your environmental experiences in the forum");
      tips.push("Motivate people around you to participate in environmental actions");
    }
    if (preferences.goals.includes("challenge")) {
      tips.push("Take more quizzes to challenge yourself and test your knowledge");
    }
    if (preferences.goals.includes("learn")) {
      tips.push("Explore additional environmental topics to broaden your knowledge");
    }

    // Provide recommendations based on quiz performance
    if (percentage < 70) {
      tips.push("Review the questions you got wrong in this quiz to consolidate weak knowledge points");
      tips.push("Focus on learning environmental topics you're interested in and gradually improve");
    }

    return tips.slice(0, 5);
  };

  // Get progress analysis
  const getProgressInsight = () => {
    if (userData.quizHistory.length < 2) {
      return "This is your first quiz, keep up the good work!";
    }

    const previousScore = userData.quizHistory[1].score; // Previous quiz score
    const scoreDiff = score - previousScore;

    if (scoreDiff > 0) {
      return `Great! You improved by ${scoreDiff} points compared to last time!`;
    } else if (scoreDiff < 0) {
      return `You scored ${Math.abs(scoreDiff)} points less than last time, keep trying!`;
    } else {
      return "Maintaining stability, keep it up!";
    }
  };

  // Get newly unlocked achievements
  const getNewlyUnlockedAchievements = () => {
    const lastQuizDate = new Date().getTime() - 60000; // Assume achievements unlocked within the last 1 minute are new
    return userData.achievements.filter(
      a => a.unlocked && a.unlockedDate && new Date(a.unlockedDate).getTime() > lastQuizDate
    );
  };

  const tips = getPersonalizedTips();
  const progressInsight = getProgressInsight();
  const newAchievements = getNewlyUnlockedAchievements();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="text-center">
          <CardHeader>
            <Badge variant="secondary" className="text-xs px-3 py-1 mb-3">
              🎯 Quiz Results & Feedback
            </Badge>
            <div className="mx-auto w-full max-w-md h-48 rounded-lg overflow-hidden mb-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aCUyMHBsYW5ldCUyMHN1c3RhaW5hYmlsaXR5fGVufDF8fHx8MTc2MDY0NTY5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Earth"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-center mb-4">
              <div className={`w-20 h-20 rounded-full ${level.color} flex items-center justify-center`}>
                <Trophy className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl mb-2">Quiz Complete!</CardTitle>
            <Badge className={`${level.color} text-white text-lg px-4 py-2`}>
              {level.title}
            </Badge>
            <p className="text-muted-foreground mt-2">{level.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-3xl mb-1">{score}</div>
                <div className="text-sm text-muted-foreground">Total Score</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-3xl mb-1">{correctCount}/{totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-3xl mb-1">{percentage.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={onRestart} 
                size="lg" 
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
              <Button 
                onClick={onGoToForum} 
                size="lg" 
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Join Forum Discussion
              </Button>
            </div>
          </CardContent>
        </Card>

        {newAchievements.length > 0 && (
          <Card className="border-2 border-yellow-400 dark:border-yellow-600 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                🎉 Congratulations! New Achievements Unlocked!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {newAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-yellow-300 dark:border-yellow-700"
                  >
                    <div className="text-4xl">{achievement.icon}</div>
                    <div>
                      <h4 className="mb-1">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {userData.quizHistory.length > 1 && (
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Progress Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                <Sparkles className="h-8 w-8 text-blue-600 shrink-0" />
                <div>
                  <p className="text-lg">{progressInsight}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Average Score: {userData.averageScore} | Best Score: {userData.bestScore}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Recommended Environmental Tips for You
              {userData.preferences && (
                <Badge variant="secondary" className="ml-2">Personalized</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Answer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="space-y-3 pb-6 border-b last:border-b-0">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="mb-2">
                        Question {index + 1}: {question.question}
                      </h4>
                      <div className="space-y-2">
                        <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'}`}>
                          <div className="text-sm text-muted-foreground mb-1">Your Answer:</div>
                          <div>{question.options[userAnswer]}</div>
                        </div>
                        {!isCorrect && (
                          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                            <div className="text-sm text-muted-foreground mb-1">Correct Answer:</div>
                            <div>{question.options[question.correctAnswer]}</div>
                          </div>
                        )}
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                          <div className="text-sm text-muted-foreground mb-1">Explanation:</div>
                          <div className="text-sm">{question.explanation}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onGoToForum}
                          className="mt-2 gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Discuss this question in the forum
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
