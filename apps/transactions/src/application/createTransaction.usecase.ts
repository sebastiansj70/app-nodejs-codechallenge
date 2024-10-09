import { CreateTransactionDTO } from '../domain/dtos/createTransaction.dto';
import { Transaction } from '../domain/entities/transaction.entity';
import { TransactionRepository } from '../domain/repositories/transaction.repository';

export class CreateTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) { }

    async execute(dto: CreateTransactionDTO): Promise<Transaction> {
        const transaction = new Transaction(
            dto.accountExternalIdDebit,
            dto.accountExternalIdCredit,
            dto.transferTypeId,
            dto.value,
            'pending',
            new Date()
        );
        const savedTransaction = await this.transactionRepository.save(transaction);

        return savedTransaction;
    }
}
