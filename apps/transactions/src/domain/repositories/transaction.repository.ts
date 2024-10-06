
import { getRepository, Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

export interface TransactionRepository {
    save(transaction: Transaction): Promise<Transaction>;
    findById(id: string): Promise<Transaction | null>;
    findAll(): Promise<Transaction[]>;
}

export class TransactionRepositoryImpl implements TransactionRepository {
    private readonly repository: Repository<Transaction>;

    constructor() {
        this.repository = getRepository(Transaction);
    }

    async save(transaction: Transaction): Promise<Transaction> {
        return await this.repository.save(transaction);
    }

    async findById(id: string): Promise<Transaction | null> {
        return await this.repository.findOne({ where: { id } }) || null;
    }

    async findAll(): Promise<Transaction[]> {
        return await this.repository.find();
    }
}
