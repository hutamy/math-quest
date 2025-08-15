import { ID, ProblemWithOptions } from "../domain/entities";
import { ProblemRepository } from "../domain/ports";
import { prisma } from "../config/prisma";
import { TransactionContext } from "../domain/transaction";
import { PrismaTransactionContext } from "./TransactionManager";

export default class ProblemRepositoryPrisma implements ProblemRepository {
  private getPrismaClient(tx?: TransactionContext) {
    if (tx && tx instanceof PrismaTransactionContext) {
      return tx.tx;
    }
    return prisma;
  }

  async findByLessonIDWithOptions(
    lessonID: ID,
    tx?: TransactionContext,
  ): Promise<ProblemWithOptions[]> {
    const client = this.getPrismaClient(tx);
    const problems = await client.problem.findMany({
      where: { lesson_id: lessonID },
      include: { options: true },
    });

    return problems.map((problem: any) => ({
      id: problem.id,
      lesson_id: problem.lesson_id,
      type: problem.type as "MULTIPLE_CHOICE" | "INPUT",
      question: problem.question,
      correct_answer: problem.correct_answer ?? undefined,
      xp: problem.xp,
      created_at: problem.created_at,
      updated_at: problem.updated_at,
      options: problem.options.map((option: any) => ({
        id: option.id,
        problem_id: option.problem_id,
        value: option.value,
        is_correct: option.is_correct,
        created_at: option.created_at,
      })),
    }));
  }
}
