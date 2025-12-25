import React from 'react';

export type QuestionType = 'multiple-choice' | 'fill-code' | 'text-input' | 'match-pairs' | 'order-list' | 'fill-blank-code';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Theme = 'dark' | 'light';
export type Language = 'en' | 'tr' | 'es' | 'pt';

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Pair {
  id: string;
  left: string;
  right: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  codeSnippet?: string;
  options?: Option[]; 
  pairs?: Pair[]; 
  items?: string[]; 
  correctOrder?: string[]; 
  expectedAnswer?: string; 
  explanation: string;
  concept: string; // Used to link to docs
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  totalXP: number;
  gems: number; // New: Gems reward
  isCompleted: boolean;
  isLocked: boolean;
  icon: string;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  color: string;
  lessons: Lesson[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  condition: (state: UserState) => boolean;
}

export interface Documentation {
  id: string;
  title: string;
  concept: string; // Links to Question.concept
  content: string;
  requiredLessonId: string;
}

export interface ShopItem {
    id: string;
    title: string;
    description: string;
    cost: number;
    icon: React.ReactNode;
    type: 'heart_refill' | 'streak_freeze' | 'theme_color';
}

export interface UserState {
  hearts: number;
  xp: number;
  gems: number; // New Currency
  streak: number;
  difficulty: Difficulty;
  theme: Theme;
  language: Language;
  lastCompletedDate: string | null;
  completedLessonIds: string[];
  currentUnitId: string;
  unlockedAchievements: string[];
  inventory: string[]; // Owned items
}
