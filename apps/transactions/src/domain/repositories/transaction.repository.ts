
import { Repository, UpdateResult } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import AppDataSource from '../../infrastructure/database/transaction.ormconfig';


export interface TransactionRepository {
    save(transaction: Transaction): Promise<Transaction>;
    findById(id: string): Promise<Transaction | null>;
    findAll(): Promise<Transaction[]>;
    update(id: string, updatedTransaction: Partial<Transaction>): Promise<UpdateResult>
}

export class TransactionRepositoryImpl implements TransactionRepository {
    private readonly repository: Repository<Transaction>;

    constructor() {
        this.repository = AppDataSource.getRepository(Transaction);
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

    async update(id: string, updatedTransaction: Partial<Transaction>): Promise<UpdateResult> {
        return await this.repository.update(id, updatedTransaction);

    }
}
