import { Request, Response } from 'express';
import AppDataSource from '../../infrastructure/database/transaction.ormconfig';
import { Transaction } from '../../domain/entities/transaction.entity';

const transactionRepository = AppDataSource.getRepository(Transaction);

export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { accountExternalIdDebit, accountExternalIdCredit, transferTypeId, value, transactionStatus } = req.body;

        const transaction = new Transaction(
            accountExternalIdDebit,
            accountExternalIdCredit,
            transferTypeId,
            value,
            transactionStatus,
        );

        const savedTransaction = await transactionRepository.save(transaction);

        return res.status(201).json(savedTransaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        return res.status(500).json({ message: 'Error creating transaction', error });
    }
};
