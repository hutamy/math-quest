import {
  Lesson,
  ID,
  LessonWithProgress,
  ProblemWithOptions,
  UserProfile,
  Submission,
  User,
  LessonProgress,
} from "./entities";
import { TransactionContext } from "./transaction";

export interface LessonRepository {
  findAllWithProgress(userID: ID): Promise<LessonWithProgress[]>;
  findByIDWithProblems(
    id: ID,
  ): Promise<(Lesson & { problems: ProblemWithOptions[] }) | null>;
  findByID(id: ID, tx?: TransactionContext): Promise<Lesson | null>;
}

export interface UserRepository {
  getUserProfile(id: ID): Promise<UserProfile>;
  findByID(id: ID, tx?: TransactionContext): Promise<User | null>;
  updateStats(
    userID: ID,
    updates: {
      total_xp?: number;
      current_streak?: number;
      best_streak?: number;
      last_active_date?: Date;
    },
    tx?: TransactionContext,
  ): Promise<void>;
}

export interface SubmissionRepository {
  findByAttemptID(
    attemptID: string,
    tx?: TransactionContext,
  ): Promise<Submission[]>;
  create(
    submission: Omit<Submission, "id" | "created_at">,
    tx?: TransactionContext,
  ): Promise<Submission>;
  hasCorrectSubmission(
    userID: ID,
    problemID: ID,
    tx?: TransactionContext,
  ): Promise<boolean>;
}

export interface ProblemRepository {
  findByLessonIDWithOptions(
    lessonID: ID,
    tx?: TransactionContext,
  ): Promise<ProblemWithOptions[]>;
}

export interface LessonProgressRepository {
  findByUserAndLesson(
    userID: ID,
    lessonID: ID,
    tx?: TransactionContext,
  ): Promise<LessonProgress | null>;
  upsert(
    userID: ID,
    lessonID: ID,
    updates: Partial<
      Omit<LessonProgress, "id" | "user_id" | "lesson_id" | "created_at">
    >,
    tx?: TransactionContext,
  ): Promise<void>;
}
