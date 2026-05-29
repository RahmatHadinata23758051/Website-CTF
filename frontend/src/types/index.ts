export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Insane';

export type Category = 
  | 'Web Exploitation' 
  | 'Reverse Engineering' 
  | 'Cryptography' 
  | 'Forensics' 
  | 'OSINT' 
  | 'Steganography' 
  | 'Miscellaneous' 
  | 'Pwn';

export interface Challenge {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  points: number;
  description: string;
  isSolved: boolean;
  solveCount: number;
  author: string;
  hint?: string;
  flag: string;
  attachmentName?: string;
  externalLink?: string;
  tags: string[];
}

export interface ScoreboardUser {
  rank: number;
  username: string;
  clan?: string;
  points: number;
  solves: number;
  lastSolveTime: string;
  isCurrentUser?: boolean;
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlockedAt?: string;
}

export interface UserStats {
  username: string;
  avatarSeed: string;
  points: number;
  globalRank: number;
  solvesCount: number;
  longestStreak: number;
  currentStreak: number;
  categoriesProgress: Record<Category, { solved: number; total: number }>;
  recentSolves: Array<{
    challengeTitle: string;
    points: number;
    timeAgo: string;
    category: Category;
  }>;
}

export type ArenaPage = 
  | 'home' 
  | 'challenges' 
  | 'scoreboard' 
  | 'profile' 
  | 'login' 
  | 'register';
