import { prisma } from "../config/prisma";
import { LessonProgressRepository } from "../domain/ports";
import { ID, LessonProgress } from "../domain/entities";
import { TransactionContext } from "../domain/transaction";
import { PrismaTransactionContext } from "./TransactionManager";

export class LessonProgressRepositoryPrisma
  implements LessonProgressRepository
{
  private getPrismaClient(tx?: TransactionContext) {
    if (tx && tx instanceof PrismaTransactionContext) {
      return tx.tx;
    }
    return prisma;
  }

  async findByUserAndLesson(
    userId: ID,
    lessonId: ID,
    tx?: TransactionContext,
  ): Promise<LessonProgress | null> {
    const client = this.getPrismaClient(tx);
    const progress = await client.lessonProgress.findUnique({
      where: {
        user_id_lesson_id: { user_id: userId, lesson_id: lessonId },
      },
    });

    if (!progress) return null;

    return {
      id: progress.id,
      user_id: progress.user_id,
      lesson_id: progress.lesson_id,
      is_completed: progress.is_completed,
      completed_at: progress.completed_at ?? undefined,
      total_problems: progress.total_problems,
      correct_answers: progress.correct_answers,
      progress_percent: progress.progress_percent,
      created_at: progress.created_at,
      updated_at: progress.updated_at,
    };
  }

  async upsert(
    userId: ID,
    lessonId: ID,
    updates: Partial<
      Omit<LessonProgress, "id" | "user_id" | "lesson_id" | "created_at">
    >,
    tx?: TransactionContext,
  ): Promise<void> {
    const client = this.getPrismaClient(tx);
    await client.lessonProgress.upsert({
      where: {
        user_id_lesson_id: { user_id: userId, lesson_id: lessonId },
      },
      update: {
        ...updates,
        updated_at: new Date(),
      },
      create: {
        user_id: userId,
        lesson_id: lessonId,
        is_completed: updates.is_completed || false,
        completed_at: updates.completed_at,
        total_problems: updates.total_problems || 0,
        correct_answers: updates.correct_answers || 0,
        progress_percent: updates.progress_percent || 0,
      },
    });
  }
}
