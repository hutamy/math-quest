export type ID = number;

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

export interface LessonDetail extends Lesson {
  problems: ProblemForClient[];
}

export type ProblemType = "MULTIPLE_CHOICE" | "INPUT";

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

export interface UserProfile {
  id: ID;
  username: string;
  total_xp: number;
  current_streak: number;
  best_streak: number;
  progress_percent: number;
  last_active_date?: Date;
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

export interface LessonProgress {
  current_problem: number;
  total_problems: number;
  answers: {
    problem_id: ID;
    value?: number;
    option_id?: number;
  }[];
  time_started: number;
}