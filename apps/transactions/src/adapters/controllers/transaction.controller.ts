import { Request, Response } from 'express';
import { UpdateTransactionUseCase } from '../../application/updateTransaction.usecase';
import { TransactionRepositoryImpl } from '../../domain/repositories/transaction.repository';
import { CreateTransactionUseCase } from '../../application/createTransaction.usecase';
import { CreateTransactionDTO } from '../../domain/dtos/createTransaction.dto';

const transactionRepository = new TransactionRepositoryImpl();
const updateTransactionUseCase = new UpdateTransactionUseCase(transactionRepository);
const createTransactionUseCase = new CreateTransactionUseCase(transactionRepository);


export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { accountExternalIdDebit, accountExternalIdCredit, transferTypeId, value } = req.body;

        const createTransactionDto: CreateTransactionDTO = {
            accountExternalIdDebit,
            accountExternalIdCredit,
            transferTypeId,
            value
        };


        const savedTransaction = await createTransactionUseCase.execute(createTransactionDto);

        return res.status(200).json(savedTransaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        return res.status(500).json({ message: 'Error creating transaction', error });
    }
};


export const updateTransaction = async (req: Request, res: Response) => {

    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updateTransaction = await updateTransactionUseCase.execute(id, updatedData)

        return res.status(200).json(updateTransaction)
    } catch (error) {
        console.error('Error updating transaction:', error);
        return res.status(500).json({ message: 'Error updating transaction', error })
    }
}