export type ID = number;

export interface User {
  id: ID;
  username: string;
  total_xp: number;
  current_streak: number;
  best_streak: number;
  last_active_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Lesson {
  id: ID;
  title: string;
  description?: string;
  order: number;
  created_at: Date;
  updated_at: Date;
}

export interface LessonWithProgress extends Lesson {
  is_completed: boolean;
  progress_percent: number;
  total_problems: number;
  correct_answers: number;
}

export type ProblemType = "MULTIPLE_CHOICE" | "INPUT";

export interface Problem {
  id: ID;
  lesson_id: ID;
  type: ProblemType;
  question: string;
  correct_answer?: number;
  xp: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProblemWithOptions extends Problem {
  options: ProblemOption[];
}

export interface ProblemOption {
  id: ID;
  problem_id: ID;
  value: number;
  is_correct: boolean;
  created_at: Date;
}

export interface Submission {
  id: ID;
  attempt_id: string;
  user_id: ID;
  lesson_id: ID;
  problem_id: ID;
  answer?: number;
  is_correct: boolean;
  xp_awarded: number;
  created_at: Date;
}

export interface LessonProgress {
  id: ID;
  user_id: ID;
  lesson_id: ID;
  is_completed: boolean;
  completed_at?: Date;
  total_problems: number;
  correct_answers: number;
  progress_percent: number;
  created_at: Date;
  updated_at: Date;
}

export interface SubmitAnswerRequest {
  attempt_id: string;
  answers: {
    problem_id: ID;
    value?: number;
    option_id?: number;
  }[];
}

export interface SubmitAnswerResponse {
  correct_count: number;
  earned_xp: number;
  new_total_xp: number;
  streak: {
    current: number;
    best: number;
  };
  lesson_progress: number;
}

export interface UserProfile {
  id: ID;
  username: string;
  total_xp: number;
  current_streak: number;
  best_streak: number;
  progress_percent: number;
  last_active_date?: Date;
}

export interface LessonDetail extends Lesson {
  problems: ProblemForClient[];
}

export interface ProblemForClient {
  id: ID;
  type: ProblemType;
  question: string;
  xp: number;
  options?: ProblemOptionForClient[];
}

export interface ProblemOptionForClient {
  id: ID;
  value: number;
}
