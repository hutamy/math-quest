import { prisma } from "../config/prisma";
import { UserRepository } from "../domain/ports";
import { ID, UserProfile, User } from "../domain/entities";
import { TransactionContext } from "../domain/transaction";
import { PrismaTransactionContext } from "./TransactionManager";

export class UserRepositoryPrisma implements UserRepository {
  private getPrismaClient(tx?: TransactionContext) {
    if (tx && tx instanceof PrismaTransactionContext) {
      return tx.tx;
    }
    return prisma;
  }

  async getUserProfile(id: ID): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new Error("User not found");

    // Calculate progress
    const lessons = await prisma.lesson.findMany();
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        user_id: id,
        is_completed: true,
      },
    });
    const progressPercent =
      lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

    return {
      id: user.id,
      username: user.username,
      total_xp: user.total_xp,
      current_streak: user.current_streak,
      best_streak: user.best_streak,
      progress_percent: Math.round(progressPercent),
      last_active_date: user.last_active_date ?? undefined,
    };
  }

  async findByID(id: ID, tx?: TransactionContext): Promise<User | null> {
    const client = this.getPrismaClient(tx);
    const user = await client.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      total_xp: user.total_xp,
      current_streak: user.current_streak,
      best_streak: user.best_streak,
      last_active_date: user.last_active_date ?? undefined,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async updateStats(
    userID: ID,
    updates: {
      total_xp?: number;
      current_streak?: number;
      best_streak?: number;
      last_active_date?: Date;
    },
    tx?: TransactionContext,
  ): Promise<void> {
    const client = this.getPrismaClient(tx);
    await client.user.update({
      where: { id: userID },
      data: updates,
    });
  }
}
