import { SubmissionRepository } from "../domain/ports";
import { ID, Submission } from "../domain/entities";
import { prisma } from "../config/prisma";
import { TransactionContext } from "../domain/transaction";
import { PrismaTransactionContext } from "./TransactionManager";

export class SubmissionRepositoryPrisma implements SubmissionRepository {
  private getPrismaClient(tx?: TransactionContext) {
    if (tx && tx instanceof PrismaTransactionContext) {
      return tx.tx;
    }
    return prisma;
  }

  async findByAttemptID(
    attemptID: string,
    tx?: TransactionContext,
  ): Promise<Submission[]> {
    const client = this.getPrismaClient(tx);
    const submissions = await client.submission.findMany({
      where: {
        attempt_id: attemptID,
      },
    });

    return submissions;
  }

  async create(
    submission: Omit<Submission, "id" | "created_at">,
    tx?: TransactionContext,
  ): Promise<Submission> {
    const client = this.getPrismaClient(tx);
    const createdSubmission = await client.submission.create({
      data: {
        attempt_id: submission.attempt_id,
        user_id: submission.user_id,
        lesson_id: submission.lesson_id,
        problem_id: submission.problem_id,
        answer: submission.answer ? submission.answer : 0,
        is_correct: submission.is_correct,
        xp_awarded: submission.xp_awarded,
      },
    });

    return createdSubmission;
  }

  async hasCorrectSubmission(
    userID: ID,
    problemID: ID,
    tx?: TransactionContext,
  ): Promise<boolean> {
    const client = this.getPrismaClient(tx);
    const submission = await client.submission.findFirst({
      where: {
        user_id: userID,
        problem_id: problemID,
        is_correct: true,
      },
    });

    return !!submission;
  }
}
