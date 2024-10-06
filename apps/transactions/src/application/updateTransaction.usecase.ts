import { Transaction } from "../domain/entities/transaction.entity";
import { TransactionRepository } from '../domain/repositories/transaction.repository';

export class UpdateTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) { }

    async execute(id: string, updatedData: Partial<Transaction>): Promise<Transaction> {
        const transaction = await this.transactionRepository.findById(id)
        if (!transaction) {
            throw new Error('Transaction not found')
        }
        return await this.transactionRepository.update(id, updatedData)
    }
}