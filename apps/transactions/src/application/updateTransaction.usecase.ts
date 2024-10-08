import { UpdatedData } from "../domain/dtos/updatedTransaction.dto";
import { Transaction } from "../domain/entities/transaction.entity";
import { TransactionRepository } from '../domain/repositories/transaction.repository';


export class UpdateTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) { }

    async execute(id: string, updatedData: UpdatedData): Promise<Transaction> {
        const transaction = await this.transactionRepository.findById(id)
        if (!transaction) {
            throw new Error('Transaction not found')
        }
        transaction.status = updatedData.transactionStatus.name
        transaction.transferTypeId = updatedData.transactionType.name
        await this.transactionRepository.update(id, { status: transaction.status, transferTypeId: transaction.transferTypeId })
        return transaction
    }
}