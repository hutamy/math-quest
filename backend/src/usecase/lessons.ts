import {
  LessonRepository,
  SubmissionRepository,
  ProblemRepository,
  UserRepository,
  LessonProgressRepository,
} from "../domain/ports";
import {
  ID,
  LessonDetail,
  LessonWithProgress,
  ProblemForClient,
  SubmitAnswerResponse,
  SubmitAnswerRequest,
  ProblemWithOptions,
} from "../domain/entities";
import { TransactionManager } from "../domain/transaction";

export class LessonsUsecase {
  constructor(
    private lessonRepository: LessonRepository,
    private submissionRepository: SubmissionRepository,
    private problemRepository: ProblemRepository,
    private userRepository: UserRepository,
    private progressRepo: LessonProgressRepository,
    private transactionManager: TransactionManager,
  ) {}

  async list(userID: ID): Promise<LessonWithProgress[]> {
    return this.lessonRepository.findAllWithProgress(userID);
  }

  async detail(id: ID): Promise<LessonDetail | null> {
    const lesson = await this.lessonRepository.findByIDWithProblems(id);
    if (!lesson) {
      return null;
    }

    const problems: ProblemForClient[] = lesson.problems.map((p) => ({
      id: p.id,
      type: p.type,
      question: p.question,
      xp: p.xp,
      options: p.options.map((o) => ({
        id: o.id,
        value: o.value,
      })),
    }));

    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description ?? undefined,
      order: lesson.order,
      created_at: lesson.created_at,
      updated_at: lesson.updated_at,
      problems,
    };
  }

  async submitAnswers(
    userID: ID,
    lessonID: ID,
    req: SubmitAnswerRequest,
  ): Promise<SubmitAnswerResponse> {
    return await this.transactionManager.executeInTransaction(async (tx) => {
      // Validate if attemptId already exists
      const existingSubmissions =
        await this.submissionRepository.findByAttemptID(req.attempt_id, tx);
      if (existingSubmissions.length > 0) {
        throw new Error("This attempt_id was already processed");
      }

      // Validate userID
      const user = await this.userRepository.findByID(userID, tx);
      if (!user) {
        throw new Error("User not found");
      }

      // Validate lessonID
      const lesson = await this.lessonRepository.findByID(lessonID, tx);
      if (!lesson) {
        throw new Error("Lesson not found");
      }

      // Validate problemID
      const problems = await this.problemRepository.findByLessonIDWithOptions(
        lessonID,
        tx,
      );
      if (!problems || problems.length === 0) {
        throw new Error("No problems found for this lesson");
      }

      const problemDict: Record<ID, ProblemWithOptions> = {};
      for (const p of problems) {
        problemDict[p.id] = p;
      }
      const requestProblemIds = req.answers.map((a) => a.problem_id);
      for (const id of requestProblemIds) {
        if (!problemDict[id]) {
          throw new Error(`Problem ${id} not found in lesson ${lessonID}`);
        }
      }

      // Submit answer
      let xpAwarded = 0;
      let totalXp = user.total_xp;
      let correctAnswers = 0;
      let currentStreak = user.current_streak;
      let bestStreak = user.best_streak;
      let totalCorrectAnswer = 0;

      for (const answer of req.answers) {
        const problem = problemDict[answer.problem_id];
        if (!problem) {
          throw new Error(`Problem ${answer.problem_id} not found`);
        }

        let isCorrect = false;
        if (problem.type == "MULTIPLE_CHOICE") {
          const selectedOptions = problem.options.find(
            (o) => o.id == answer.option_id,
          );
          isCorrect = selectedOptions?.is_correct ?? false;
        } else {
          isCorrect = problem.correct_answer == answer.value;
        }

        let xp = 0;
        if (isCorrect) {
          // check if user already solve this problem
          const hasCorrectSubmission =
            await this.submissionRepository.hasCorrectSubmission(
              userID,
              problem.id,
              tx,
            );
          if (!hasCorrectSubmission) {
            xp += problem.xp;
            xpAwarded += problem.xp;
            totalXp += problem.xp;
            totalCorrectAnswer++;
          }
          correctAnswers++;
        }

        await this.submissionRepository.create(
          {
            attempt_id: req.attempt_id,
            user_id: userID,
            lesson_id: lessonID,
            problem_id: problem.id,
            answer:
              problem.type == "MULTIPLE_CHOICE"
                ? answer.option_id
                : answer.value,
            is_correct: isCorrect,
            xp_awarded: xp,
          },
          tx,
        );
      }

      if (xpAwarded > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Update streak
        const lastActiveDate = user.last_active_date;

        // Calculate the difference in days for streak
        if (lastActiveDate) {
          const lastActive = new Date(lastActiveDate);
          lastActive.setHours(0, 0, 0, 0);
          const diff = Math.floor(
            (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (diff == 1) {
            currentStreak++;
          } else if (diff > 1) {
            currentStreak = 1;
          }
        } else {
          currentStreak = 1;
        }

        await this.userRepository.updateStats(
          userID,
          {
            total_xp: user.total_xp + xpAwarded,
            current_streak: currentStreak,
            best_streak: Math.max(user.best_streak, currentStreak),
            last_active_date: today,
          },
          tx,
        );
        bestStreak = Math.max(user.best_streak, currentStreak);
      }

      // Lesson progress
      const totalProblems = problems.length;
      const currentProgress = await this.progressRepo.findByUserAndLesson(
        userID,
        lessonID,
        tx,
      );
      const finalCorrectAnswers =
        (currentProgress?.correct_answers || 0) + totalCorrectAnswer;
      const finalProgressPercent = (finalCorrectAnswers / totalProblems) * 100;
      const finalIsCompleted = finalCorrectAnswers === totalProblems;
      await this.progressRepo.upsert(
        userID,
        lessonID,
        {
          is_completed: finalIsCompleted,
          completed_at: finalIsCompleted ? new Date() : undefined,
          total_problems: totalProblems,
          correct_answers: finalCorrectAnswers,
          progress_percent: finalProgressPercent,
        },
        tx,
      );

      return {
        correct_count: correctAnswers,
        earned_xp: xpAwarded,
        new_total_xp: totalXp,
        streak: {
          current: currentStreak,
          best: bestStreak,
        },
        lesson_progress: finalProgressPercent,
      };
    });
  }
}
