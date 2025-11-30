import { useState, useEffect } from "react";
import { Welcome } from "./components/Welcome";
import { PreferenceSurvey } from "./components/PreferenceSurvey";
import { Quiz } from "./components/Quiz";
import { Result } from "./components/Result";
import { Forum } from "./components/Forum";
import { Account } from "./components/Account";
import { Toaster } from "./components/ui/sonner";
import { questions } from "./data/questions";
import { selectPersonalizedQuestions } from "./utils/questionSelector";
import { 
  loadUserData, 
  savePreferences, 
  addQuizResult,
  UserData,
  UserPreferences
} from "./utils/userDataManager";
import { toast } from "sonner@2.0.3";

type Page = "welcome" | "survey" | "quiz" | "result" | "forum" | "account";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("welcome");
  const [userData, setUserData] = useState<UserData>(loadUserData());
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);
  const [selectedQuestions, setSelectedQuestions] = useState<typeof questions>([]);
  const [previousPage, setPreviousPage] = useState<Page>("welcome");

  useEffect(() => {
    // Check if preference survey has been completed
    if (!userData.preferences) {
      setCurrentPage("survey");
    }
  }, []);

  const handleSurveyComplete = (preferences: UserPreferences) => {
    const updatedData = savePreferences(preferences);
    setUserData(updatedData);
    setCurrentPage("welcome");
  };

  const handleStart = () => {
    // Select personalized questions based on user preferences
    const personalizedQuestions = selectPersonalizedQuestions(
      questions,
      userData.preferences,
      10
    );
    setSelectedQuestions(personalizedQuestions);
    setQuizStartTime(Date.now());
    setCurrentPage("quiz");
  };

  const handleComplete = (finalScore: number, answers: number[]) => {
    const timeSpent = Math.round((Date.now() - quizStartTime) / 60000); // Convert to minutes
    const oldAchievements = userData.achievements.filter(a => a.unlocked).length;
    const updatedData = addQuizResult(finalScore, selectedQuestions.length, Math.max(1, timeSpent));
    setUserData(updatedData);
    setScore(finalScore);
    setUserAnswers(answers);
    
    // Check if new achievements were unlocked
    const newAchievements = updatedData.achievements.filter(a => a.unlocked).length;
    if (newAchievements > oldAchievements) {
      const unlockedAchievements = updatedData.achievements.filter(
        a => a.unlocked && !userData.achievements.find(old => old.id === a.id && old.unlocked)
      );
      
      unlockedAchievements.forEach((achievement) => {
        toast.success(`🎉 New Achievement Unlocked: ${achievement.icon} ${achievement.title}`, {
          description: achievement.description,
          duration: 5000,
        });
      });
    }
    
    setCurrentPage("result");
  };

  const handleRestart = () => {
    setScore(0);
    setUserAnswers([]);
    setCurrentPage("welcome");
  };

  const handleGoToForum = () => {
    setPreviousPage(currentPage);
    setCurrentPage("forum");
  };

  const handleBackFromForum = () => {
    // Go back to the page user came from (either welcome or result)
    setCurrentPage(previousPage === "result" ? "result" : "welcome");
  };

  const handleGoToAccount = () => {
    setCurrentPage("account");
  };

  const handleBackFromAccount = () => {
    setCurrentPage("welcome");
  };

  return (
    <div className="min-h-screen">
      <Toaster />
      {currentPage === "survey" && (
        <PreferenceSurvey onComplete={handleSurveyComplete} />
      )}
      {currentPage === "welcome" && (
        <Welcome
          onStart={handleStart}
          onAccountClick={handleGoToAccount}
          onForumClick={handleGoToForum}
          hasCompletedSurvey={!!userData.preferences}
          userData={userData}
        />
      )}
      {currentPage === "quiz" && (
        <Quiz questions={selectedQuestions} onComplete={handleComplete} />
      )}
      {currentPage === "result" && (
        <Result
          score={score}
          totalQuestions={selectedQuestions.length}
          answers={userAnswers}
          questions={selectedQuestions}
          onRestart={handleRestart}
          onGoToForum={handleGoToForum}
          userData={userData}
        />
      )}
      {currentPage === "forum" && <Forum onBack={handleBackFromForum} userData={userData} />}
      {currentPage === "account" && (
        <Account userData={userData} onBack={handleBackFromAccount} />
      )}
    </div>
  );
}