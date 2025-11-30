import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  User, 
  Award, 
  TrendingUp, 
  Clock, 
  Calendar,
  Target,
  Leaf,
  ArrowLeft,
  Trophy,
  CheckCircle,
  Lock,
  LineChart
} from "lucide-react";
import { UserData } from "../utils/userDataManager";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface AccountProps {
  userData: UserData;
  onBack: () => void;
}

export function Account({ userData, onBack }: AccountProps) {
  const { preferences, quizHistory, totalQuizzes, bestScore, averageScore, totalTimeSpent, joinDate, achievements } = userData;

  const getExperienceLabel = (exp: string) => {
    const labels: Record<string, string> = {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Expert"
    };
    return labels[exp] || exp;
  };

  const getGoalLabel = (goal: string) => {
    const labels: Record<string, string> = {
      learn: "Learn environmental knowledge",
      practice: "Find practical methods",
      share: "Share experiences with others",
      challenge: "Challenge my knowledge"
    };
    return labels[goal] || goal;
  };

  const getGradeLabel = (grade: string) => {
    const labels: Record<string, string> = {
      elementary: "Elementary School (Grades 1-6)",
      middle: "Middle School (Grades 7-9)",
      high: "High School (Grades 10-12)",
      college: "College/University",
      adult: "Adult Learner",
      other: "Other"
    };
    return labels[grade] || grade;
  };

  const getInterestLabel = (interest: string) => {
    const labels: Record<string, string> = {
      recycling: "Waste Sorting & Recycling",
      energy: "Energy Conservation",
      water: "Water Resource Protection",
      biodiversity: "Biodiversity",
      sustainable: "Sustainable Lifestyle",
      climate: "Climate Change"
    };
    return labels[interest] || interest;
  };

  const getDaysActive = () => {
    const join = new Date(joinDate);
    const now = new Date();
    const diff = now.getTime() - join.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const getLevel = () => {
    if (totalQuizzes >= 20) return { title: "Eco Master", color: "bg-purple-500", icon: "🏆" };
    if (totalQuizzes >= 10) return { title: "Environmental Expert", color: "bg-green-500", icon: "🌟" };
    if (totalQuizzes >= 5) return { title: "Environmental Guardian", color: "bg-blue-500", icon: "🛡️" };
    return { title: "Eco Beginner", color: "bg-orange-500", icon: "🌱" };
  };

  const level = getLevel();

  // Prepare chart data - Last 10 quizzes
  const chartData = quizHistory.slice(0, 10).reverse().map((history, index) => ({
    name: `Quiz ${index + 1}`,
    Score: history.score,
    Time: history.timeSpent
  }));

  // Aggregate data by date - For trend chart
  const trendData = quizHistory.slice(0, 20).reverse().map((history, index) => {
    const date = new Date(history.date);
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      Score: history.score,
      Accuracy: history.percentage.toFixed(0)
    };
  });

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="secondary" className="text-xs px-3 py-1 mb-2">
              👤 Personal Dashboard
            </Badge>
            <h1 className="text-3xl flex items-center gap-3">
              <User className="h-8 w-8" />
              My Account
            </h1>
            <p className="text-muted-foreground mt-1">Track your learning progress, achievements, and preferences</p>
          </div>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className={`w-24 h-24 rounded-full ${level.color} flex items-center justify-center text-4xl`}>
                  {level.icon}
                </div>
              </div>
              <div>
                <h3>{level.title}</h3>
                <p className="text-sm text-muted-foreground">Completed {totalQuizzes} quizzes</p>
              </div>
              <Progress 
                value={Math.min((totalQuizzes / 20) * 100, 100)} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {Math.max(0, getLevel().title === "Eco Beginner" ? 5 - totalQuizzes : getLevel().title === "Environmental Guardian" ? 10 - totalQuizzes : getLevel().title === "Environmental Expert" ? 20 - totalQuizzes : 0)} more quizzes to next level
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Learning Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-2xl">{bestScore}</div>
                      <div className="text-sm text-muted-foreground">Best Score</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-2xl">{averageScore}</div>
                      <div className="text-sm text-muted-foreground">Average Score</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-2xl">{totalTimeSpent}</div>
                      <div className="text-sm text-muted-foreground">Minutes Learned</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="text-2xl">{getDaysActive()}</div>
                      <div className="text-sm text-muted-foreground">Active Days</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {preferences && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(preferences.name || preferences.age) && (
                <div className="grid sm:grid-cols-2 gap-4 pb-4 border-b">
                  {preferences.name && (
                    <div>
                      <h4 className="mb-2 text-sm text-muted-foreground">Name</h4>
                      <p>{preferences.name}</p>
                    </div>
                  )}
                  {preferences.age && (
                    <div>
                      <h4 className="mb-2 text-sm text-muted-foreground">Age</h4>
                      <p>{preferences.age}</p>
                    </div>
                  )}
                </div>
              )}
              <div>
                <h4 className="mb-2">Areas of Interest</h4>
                <div className="flex flex-wrap gap-2">
                  {preferences.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {getInterestLabel(interest)}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-2">Knowledge Level</h4>
                  <Badge className="bg-blue-500 text-white">
                    {getExperienceLabel(preferences.experience)}
                  </Badge>
                </div>
                <div>
                  <h4 className="mb-2">Learning Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    {preferences.goals.map((goal, index) => (
                      <Badge key={index} className="bg-green-500 text-white">
                        {getGoalLabel(goal)}
                      </Badge>
                    ))}
                  </div>
                </div>
                {preferences.grade && (
                  <div>
                    <h4 className="mb-2">Grade Level</h4>
                    <Badge className="bg-purple-500 text-white">
                      {getGradeLabel(preferences.grade)}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="trends">Learning Trends</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {preferences && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    My Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2">Areas of Interest</h4>
                    <div className="flex flex-wrap gap-2">
                      {preferences.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {getInterestLabel(interest)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="mb-2">Knowledge Level</h4>
                      <Badge className="bg-blue-500 text-white">
                        {getExperienceLabel(preferences.experience)}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="mb-2">Learning Goals</h4>
                      <div className="flex flex-wrap gap-2">
                        {preferences.goals.map((goal, index) => (
                          <Badge key={index} className="bg-green-500 text-white">
                            {getGoalLabel(goal)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {preferences.grade && (
                      <div>
                        <h4 className="mb-2">Grade Level</h4>
                        <Badge className="bg-purple-500 text-white">
                          {getGradeLabel(preferences.grade)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  Recently Unlocked Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {unlockedAchievements.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No achievements unlocked yet</p>
                    <p className="text-sm mt-2">Complete quizzes to earn your first achievement!</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {unlockedAchievements.slice(0, 4).map((achievement) => {
                      const date = achievement.unlockedDate ? new Date(achievement.unlockedDate) : null;
                      return (
                        <div
                          key={achievement.id}
                          className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-lg"
                        >
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h4 className="mb-1">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground mb-1">
                              {achievement.description}
                            </p>
                            {date && (
                              <p className="text-xs text-green-600 dark:text-green-400">
                                {date.toLocaleDateString('en-US')}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-600" />
                  Achievement System
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Unlocked {unlockedAchievements.length} / {achievements.length} achievements
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {unlockedAchievements.length > 0 && (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Unlocked
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {unlockedAchievements.map((achievement) => {
                        const date = achievement.unlockedDate ? new Date(achievement.unlockedDate) : null;
                        return (
                          <div
                            key={achievement.id}
                            className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-lg"
                          >
                            <div className="text-4xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <h4 className="mb-1">{achievement.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {achievement.description}
                              </p>
                              {date && (
                                <p className="text-xs text-green-600 dark:text-green-400">
                                  Unlocked on {date.toLocaleDateString('en-US')}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {lockedAchievements.length > 0 && (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                      Locked
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {lockedAchievements.map((achievement) => {
                        const progressPercent = (achievement.progress / achievement.requirement) * 100;
                        return (
                          <div
                            key={achievement.id}
                            className="flex items-start gap-3 p-4 bg-muted border-2 border-border rounded-lg opacity-75"
                          >
                            <div className="text-4xl grayscale">{achievement.icon}</div>
                            <div className="flex-1">
                              <h4 className="mb-1">{achievement.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {achievement.description}
                              </p>
                              <div className="space-y-1">
                                <Progress value={progressPercent} className="h-2" />
                                <p className="text-xs text-muted-foreground">
                                  Progress: {achievement.progress} / {achievement.requirement}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-green-600" />
                  Learning Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {quizHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Not enough data to show trends</p>
                    <p className="text-sm mt-2">Complete more quizzes to see your progress!</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="mb-4">Score Trend (Last 20 Quizzes)</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsLineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="Score" stroke="#16a34a" strokeWidth={2} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <h4 className="mb-4">Accuracy Change (Last 20 Quizzes)</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsLineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="Accuracy" stroke="#2563eb" strokeWidth={2} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>

                    {chartData.length > 0 && (
                      <div>
                        <h4 className="mb-4">Score vs Time Comparison (Last 10 Quizzes)</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" stroke="#16a34a" />
                            <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="Score" fill="#16a34a" />
                            <Bar yAxisId="right" dataKey="Time" fill="#f59e0b" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-600" />
                  Quiz History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quizHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No quizzes completed yet</p>
                    <p className="text-sm mt-2">Start your first quiz!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {quizHistory.map((history, index) => {
                      const date = new Date(history.date);
                      const isGoodScore = history.percentage >= 70;
                      
                      return (
                        <div
                          key={history.id}
                          className="flex items-center justify-between p-4 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full ${isGoodScore ? 'bg-green-100 dark:bg-green-900' : 'bg-orange-100 dark:bg-orange-900'} flex items-center justify-center`}>
                              {isGoodScore ? (
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                              ) : (
                                <Leaf className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span>Quiz #{quizHistory.length - index}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {history.percentage.toFixed(0)}%
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {date.toLocaleDateString('en-US')} {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl">{history.score}</div>
                            <div className="text-xs text-muted-foreground">
                              {history.timeSpent} minutes
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}