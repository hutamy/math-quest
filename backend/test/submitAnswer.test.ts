import { test } from "tap";
import { LessonsUsecase } from "../src/usecase/lessons";
import {
  UserRepository,
  LessonRepository,
  ProblemRepository,
  SubmissionRepository,
  LessonProgressRepository,
} from "../src/domain/ports";
import { ID, Submission, LessonProgress } from "../src/domain/entities";
import { TransactionManager, TransactionContext } from "../src/domain/transaction";

let submissions: Submission[] = [];
const mockUserRepo: UserRepository = {
  async findByID(id: ID, tx?: TransactionContext) {
    let streak = 5;
    let dateStreak = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

    return {
      id,
      username: "test_user",
      total_xp: 100,
      current_streak: streak,
      best_streak: 10,
      last_active_date: dateStreak,
      created_at: new Date(),
      updated_at: new Date(),
    };
  },
  async updateStats(
    userID: ID,
    updates: {
      total_xp?: number;
      current_streak?: number;
      best_streak?: number;
      last_active_date?: Date;
    },
    tx?: TransactionContext
  ) {
  },
  async getUserProfile(userID: ID) {
    return {
      id: 1,
      username: "demo_user",
      total_xp: 100,
      current_streak: 5,
      best_streak: 10,
      progress_percent: 33,
    };
  },
};

const mockLessonRepo: LessonRepository = {
  async findByID(id: ID, tx?: TransactionContext) {
    return {
      id,
      title: "Test Lesson",
      description: "Test Description",
      order: 1,
      created_at: new Date(),
      updated_at: new Date(),
    };
  },
  async findByIDWithProblems(id: ID) {
    return null;
  },
  async findAllWithProgress(userID: ID) {
    return [];
  },
};

const mockProblemRepo: ProblemRepository = {
  async findByLessonIDWithOptions(lessonID: ID, tx?: TransactionContext) {
    return [
      {
        id: 1,
        lesson_id: lessonID,
        type: "MULTIPLE_CHOICE" as const,
        question: "What is 2+2?",
        correct_answer: undefined, // Changed from null to undefined
        xp: 10,
        created_at: new Date(),
        updated_at: new Date(),
        options: [
          {
            id: 1,
            problem_id: 1,
            value: 3,
            is_correct: false,
            created_at: new Date(),
          },
          {
            id: 2,
            problem_id: 1,
            value: 4,
            is_correct: true,
            created_at: new Date(),
          },
          {
            id: 3,
            problem_id: 1,
            value: 5,
            is_correct: false,
            created_at: new Date(),
          },
        ],
      },
    ];
  },
};

const mockSubmissionRepo: SubmissionRepository = {
  async create(submission: Omit<Submission, "id" | "created_at">, tx?: TransactionContext) {
    const newSub = {
      ...submission,
      id: submissions.length + 1,
      created_at: new Date(),
    };
    submissions.push(newSub);
    return newSub;
  },
  async findByAttemptID(attemptID: string, tx?: TransactionContext) {
    return submissions.filter((s) => s.attempt_id === attemptID);
  },
  async hasCorrectSubmission(userID: ID, problemID: ID, tx?: TransactionContext) {
    return false;
  },
};

const mockProgressRepo: LessonProgressRepository = {
  async findByUserAndLesson(userID: ID, lessonID: ID, tx?: TransactionContext) {
    return null;
  },
  async upsert(
    userID: ID,
    lessonID: ID,
    updates: Partial<
      Omit<LessonProgress, "id" | "user_id" | "lesson_id" | "created_at">
    >,
    tx?: TransactionContext
  ) {},
};

const mockTransactionManager: TransactionManager = {
  async executeInTransaction<T>(
    operation: (tx: TransactionContext) => Promise<T>
  ): Promise<T> {
    const dummyTx: TransactionContext = {};
    return await operation(dummyTx);
  },
};

test("LessonsUsecase - Submit Answer Idempotency Test", async (t) => {
  const usecase = new LessonsUsecase(
    mockLessonRepo,
    mockSubmissionRepo,
    mockProblemRepo,
    mockUserRepo,
    mockProgressRepo,
    mockTransactionManager
  );

  const attemptId = "test-attempt-123";
  const request = {
    attempt_id: attemptId,
    answers: [{ problem_id: 1, option_id: 2 }],
  };

  // First submission
  const result1 = await usecase.submitAnswers(1, 1, request);
  t.equal(result1.earned_xp, 10, "Should award XP on first correct submission");

  // Second submission with same attemptId (idempotent)
  await t.rejects(
    usecase.submitAnswers(1, 1, request),
    /This attempt_id was already processed/,
    "Should throw error on duplicate attempt_id"
  );
});

test("LessonsUsecase - Submit Answer Streak Logic Test", async (t) => {
  submissions = [];
  const usecase = new LessonsUsecase(
    mockLessonRepo,
    mockSubmissionRepo,
    mockProblemRepo,
    mockUserRepo,
    mockProgressRepo,
    mockTransactionManager
  );

  const request = {
    attempt_id: "streak-test-456",
    answers: [{ problem_id: 1, option_id: 2 }], // Correct answer
  };

  const result = await usecase.submitAnswers(1, 1, request);

  t.equal(
    result.streak.current,
    6,
    "Should increment streak for next day activity"
  );
  t.ok(result.new_total_xp > 0, "Should award XP for correct answer");
});

