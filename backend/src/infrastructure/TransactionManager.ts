import { PrismaClient } from "@prisma/client";
import { TransactionManager, TransactionContext } from "../domain/transaction";
import { prisma } from "../config/prisma";

export class PrismaTransactionContext implements TransactionContext {
  constructor(public readonly tx: any) {}
}

export class PrismaTransactionManager implements TransactionManager {
  async executeInTransaction<T>(
    operation: (tx: TransactionContext) => Promise<T>,
  ): Promise<T> {
    return await prisma.$transaction(async (prismaTransaction) => {
      const txContext = new PrismaTransactionContext(prismaTransaction);
      return await operation(txContext);
    });
  }
}
