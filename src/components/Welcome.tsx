import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Leaf, TreePine, Droplet, Globe, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Navigation } from "./Navigation";
import { UserData } from "../utils/userDataManager";

interface WelcomeProps {
  onStart: () => void;
  onAccountClick: () => void;
  hasCompletedSurvey: boolean;
  userData: UserData;
}

export function Welcome({ onStart, onAccountClick, hasCompletedSurvey, userData }: WelcomeProps) {
  const { preferences, totalQuizzes, averageScore, achievements } = userData;
  
  const getPersonalizedGreeting = () => {
    if (!preferences) return "";
    
    const name = preferences.name || "";
    const experienceLabels: Record<string, string> = {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Expert"
    };
    
    const greetings = name
      ? [
          `Welcome back, ${name}!`,
          `Hello ${name}, ready to learn more?`,
          `Great to see you again, ${name}!`
        ]
      : [
          `Welcome back, ${experienceLabels[preferences.experience] || ""}!`,
          `Continue your environmental learning journey!`,
          `Ready to challenge your environmental knowledge?`
        ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const recentAchievements = achievements.filter(a => a.unlocked).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navigation onAccountClick={onAccountClick} showAccount={hasCompletedSurvey} isAccountPage={false} />
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
        <Card className="max-w-3xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-full h-48 rounded-lg overflow-hidden mb-4">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBlbnZpcm9ubWVudCUyMGZvcmVzdHxlbnwxfHx8fDE3NjA2NDU2OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Natural Environment"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Droplet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <TreePine className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
              <Globe className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          <CardTitle className="text-3xl md:text-4xl">Environmental Knowledge Quiz</CardTitle>
          <CardDescription className="text-lg">
            {hasCompletedSurvey && preferences ? (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                {getPersonalizedGreeting()}
              </span>
            ) : (
              "Test your understanding of environmental protection and learn how to better protect our planet"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasCompletedSurvey && totalQuizzes > 0 && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-2 border-green-200 dark:border-green-800 rounded-lg">
              <h4 className="mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                Your Learning Progress
              </h4>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl mb-1">{totalQuizzes}</div>
                  <div className="text-sm text-muted-foreground">Quizzes Completed</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl mb-1">{averageScore}</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl mb-1">{achievements.filter(a => a.unlocked).length}</div>
                  <div className="text-sm text-muted-foreground">Achievements Unlocked</div>
                </div>
              </div>
              {recentAchievements.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Recent Achievements:</p>
                  <div className="flex flex-wrap gap-2">
                    {recentAchievements.map((achievement) => (
                      <Badge key={achievement.id} variant="secondary" className="px-3 py-1">
                        {achievement.icon} {achievement.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl mb-1">10</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl mb-1">5</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl mb-1">100</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm mb-2 text-blue-900 dark:text-blue-100">Quiz Instructions:</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• 10 multiple-choice questions in total</li>
              <li>• Each question has only one correct answer</li>
              {hasCompletedSurvey && preferences ? (
                <li>• ✨ Questions personalized based on your interests and experience level</li>
              ) : (
                <li>• Questions cover various environmental topics</li>
              )}
              <li>• After completion, your score and environmental tips will be displayed</li>
              <li>• You can retake the quiz at any time</li>
            </ul>
          </div>
          <Button 
            onClick={onStart} 
            size="lg" 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Start Quiz
          </Button>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}