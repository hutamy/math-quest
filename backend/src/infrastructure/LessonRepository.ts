import {
  ID,
  Lesson,
  LessonWithProgress,
  ProblemWithOptions,
} from "../domain/entities";
import { LessonRepository } from "../domain/ports";
import { prisma } from "../config/prisma";
import { TransactionContext } from "../domain/transaction";
import { PrismaTransactionContext } from "./TransactionManager";

export class LessonRepositoryPrisma implements LessonRepository {
  private getPrismaClient(tx?: TransactionContext) {
    if (tx && tx instanceof PrismaTransactionContext) {
      return tx.tx;
    }
    return prisma;
  }

  async findAllWithProgress(user_id: ID): Promise<LessonWithProgress[]> {
    const lessons = await prisma.lesson.findMany({
      include: {
        progresses: {
          where: { user_id },
          select: {
            is_completed: true,
            progress_percent: true,
            total_problems: true,
            correct_answers: true,
          },
        },
        problems: {
          select: { id: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return lessons.map((lesson) => {
      const progress = lesson.progresses[0] || {
        is_completed: false,
        progress_percent: 0,
        total_problems: lesson.problems.length,
        correct_answers: 0,
      };

      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description ?? undefined,
        order: lesson.order,
        created_at: lesson.created_at,
        updated_at: lesson.updated_at,
        is_completed: progress.is_completed,
        progress_percent: progress.progress_percent,
        total_problems: progress.total_problems,
        correct_answers: progress.correct_answers,
      };
    });
  }

  async findByIDWithProblems(
    id: ID,
  ): Promise<(Lesson & { problems: ProblemWithOptions[] }) | null> {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        problems: {
          include: {
            options: true,
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!lesson) return null;

    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description ?? undefined,
      order: lesson.order,
      created_at: lesson.created_at,
      updated_at: lesson.updated_at,
      problems: lesson.problems.map((problem) => ({
        id: problem.id,
        lesson_id: problem.lesson_id,
        type: problem.type as "MULTIPLE_CHOICE" | "INPUT",
        question: problem.question,
        correct_answer: problem.correct_answer ?? undefined,
        xp: problem.xp,
        created_at: problem.created_at,
        updated_at: problem.updated_at,
        options: problem.options.map((option) => ({
          id: option.id,
          problem_id: option.problem_id,
          value: option.value,
          is_correct: option.is_correct,
          created_at: option.created_at,
        })),
      })),
    };
  }

  async findByID(id: ID, tx?: TransactionContext): Promise<Lesson | null> {
    const client = this.getPrismaClient(tx);
    const lesson = await client.lesson.findUnique({
      where: { id },
    });

    if (!lesson) return null;

    return {
      ...lesson,
      description: lesson.description ?? undefined,
    };
  }
}
