export interface TransactionManager {
  executeInTransaction<T>(
    operation: (tx: TransactionContext) => Promise<T>,
  ): Promise<T>;
}

export interface TransactionContext {}
