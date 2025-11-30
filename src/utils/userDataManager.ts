export interface UserPreferences {
  interests: string[];
  experience: string;
  goals: string[]; // Changed from 'goal' to support multiple learning goals
  age?: number;
  grade?: string;
  name?: string;
}

export interface QuizHistory {
  id: number;
  date: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number; // minutes
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  requirement: number;
  progress: number;
}

export interface UserData {
  preferences: UserPreferences | null;
  quizHistory: QuizHistory[];
  totalQuizzes: number;
  bestScore: number;
  averageScore: number;
  totalTimeSpent: number;
  joinDate: string;
  achievements: Achievement[];
}

const STORAGE_KEY = 'eco_quiz_user_data';

export const getDefaultAchievements = (): Achievement[] => [
  {
    id: 'first_quiz',
    title: 'First Step',
    description: 'Complete your first quiz',
    icon: '🌱',
    unlocked: false,
    requirement: 1,
    progress: 0
  },
  {
    id: 'five_quizzes',
    title: 'Dedicated Learner',
    description: 'Complete 5 quizzes',
    icon: '📚',
    unlocked: false,
    requirement: 5,
    progress: 0
  },
  {
    id: 'ten_quizzes',
    title: 'Environmental Guardian',
    description: 'Complete 10 quizzes',
    icon: '🛡️',
    unlocked: false,
    requirement: 10,
    progress: 0
  },
  {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Achieve a perfect score (100 points)',
    icon: '💯',
    unlocked: false,
    requirement: 1,
    progress: 0
  },
  {
    id: 'high_scorer',
    title: 'Outstanding Student',
    description: 'Score above 90 points',
    icon: '⭐',
    unlocked: false,
    requirement: 1,
    progress: 0
  },
  {
    id: 'consistent_learner',
    title: 'Persistent',
    description: 'Score above 70 points in 3 consecutive quizzes',
    icon: '🔥',
    unlocked: false,
    requirement: 3,
    progress: 0
  },
  {
    id: 'time_efficient',
    title: 'Speed Master',
    description: 'Complete a quiz within 3 minutes',
    icon: '⚡',
    unlocked: false,
    requirement: 1,
    progress: 0
  },
  {
    id: 'dedicated_learner',
    title: 'Learning Champion',
    description: 'Accumulate 60 minutes of learning time',
    icon: '📖',
    unlocked: false,
    requirement: 60,
    progress: 0
  },
  {
    id: 'eco_master',
    title: 'Eco Master',
    description: 'Complete 20 quizzes',
    icon: '🏆',
    unlocked: false,
    requirement: 20,
    progress: 0
  }
];

export const getDefaultUserData = (): UserData => ({
  preferences: null,
  quizHistory: [],
  totalQuizzes: 0,
  bestScore: 0,
  averageScore: 0,
  totalTimeSpent: 0,
  joinDate: new Date().toISOString(),
  achievements: getDefaultAchievements()
});

export const loadUserData = (): UserData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Ensure achievements exist, add defaults if old data doesn't have achievements
      if (!data.achievements) {
        data.achievements = getDefaultAchievements();
      }
      return data;
    }
  } catch (error) {
    console.error('Error loading user data:', error);
  }
  return getDefaultUserData();
};

export const saveUserData = (data: UserData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const savePreferences = (preferences: UserPreferences): UserData => {
  const userData = loadUserData();
  userData.preferences = preferences;
  saveUserData(userData);
  return userData;
};

const checkAndUnlockAchievements = (userData: UserData, score: number, timeSpent: number): void => {
  const achievements = userData.achievements;
  
  // First Step
  if (!achievements[0].unlocked && userData.totalQuizzes >= 1) {
    achievements[0].unlocked = true;
    achievements[0].unlockedDate = new Date().toISOString();
    achievements[0].progress = userData.totalQuizzes;
  }
  
  // Dedicated Learner - 5 quizzes
  if (!achievements[1].unlocked && userData.totalQuizzes >= 5) {
    achievements[1].unlocked = true;
    achievements[1].unlockedDate = new Date().toISOString();
  }
  achievements[1].progress = userData.totalQuizzes;
  
  // Environmental Guardian - 10 quizzes
  if (!achievements[2].unlocked && userData.totalQuizzes >= 10) {
    achievements[2].unlocked = true;
    achievements[2].unlockedDate = new Date().toISOString();
  }
  achievements[2].progress = userData.totalQuizzes;
  
  // Perfect Score
  if (!achievements[3].unlocked && score === 100) {
    achievements[3].unlocked = true;
    achievements[3].unlockedDate = new Date().toISOString();
    achievements[3].progress = 1;
  }
  
  // Outstanding Student - 90+ points
  if (!achievements[4].unlocked && score >= 90) {
    achievements[4].unlocked = true;
    achievements[4].unlockedDate = new Date().toISOString();
    achievements[4].progress = 1;
  }
  
  // Persistent - 3 consecutive quizzes with 70+ points
  const recentThree = userData.quizHistory.slice(0, 3);
  if (!achievements[5].unlocked && recentThree.length >= 3 && recentThree.every(h => h.score >= 70)) {
    achievements[5].unlocked = true;
    achievements[5].unlockedDate = new Date().toISOString();
    achievements[5].progress = 3;
  } else if (recentThree.length > 0) {
    const consecutiveCount = recentThree.findIndex(h => h.score < 70);
    achievements[5].progress = consecutiveCount === -1 ? recentThree.length : consecutiveCount;
  }
  
  // Speed Master - Complete within 3 minutes
  if (!achievements[6].unlocked && timeSpent <= 3) {
    achievements[6].unlocked = true;
    achievements[6].unlockedDate = new Date().toISOString();
    achievements[6].progress = 1;
  }
  
  // Learning Champion - 60 minutes learning time
  if (!achievements[7].unlocked && userData.totalTimeSpent >= 60) {
    achievements[7].unlocked = true;
    achievements[7].unlockedDate = new Date().toISOString();
  }
  achievements[7].progress = userData.totalTimeSpent;
  
  // Eco Master - 20 quizzes
  if (!achievements[8].unlocked && userData.totalQuizzes >= 20) {
    achievements[8].unlocked = true;
    achievements[8].unlockedDate = new Date().toISOString();
  }
  achievements[8].progress = userData.totalQuizzes;
};

export const addQuizResult = (score: number, totalQuestions: number, timeSpent: number): UserData => {
  const userData = loadUserData();
  const percentage = (score / (totalQuestions * 10)) * 100;
  
  const newHistory: QuizHistory = {
    id: Date.now(),
    date: new Date().toISOString(),
    score,
    totalQuestions,
    percentage,
    timeSpent
  };
  
  userData.quizHistory = [newHistory, ...userData.quizHistory];
  userData.totalQuizzes += 1;
  userData.bestScore = Math.max(userData.bestScore, score);
  userData.totalTimeSpent += timeSpent;
  
  // Calculate average score
  const totalScore = userData.quizHistory.reduce((sum, h) => sum + h.score, 0);
  userData.averageScore = Math.round(totalScore / userData.quizHistory.length);
  
  // Check and unlock achievements
  checkAndUnlockAchievements(userData, score, timeSpent);
  
  saveUserData(userData);
  return userData;
};

export const clearUserData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};