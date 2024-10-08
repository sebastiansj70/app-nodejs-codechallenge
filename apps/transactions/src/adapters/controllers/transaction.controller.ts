import { Request, Response } from 'express';
import { UpdateTransactionUseCase } from '../../application/updateTransaction.usecase';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { CreateTransactionUseCase } from '../../application/createTransaction.usecase';
import { CreateTransactionDTO } from '../../domain/dtos/createTransaction.dto';
import { validateCreateTransactionDto, validateUpdateTransactionBody } from '../validation/transaction.validator';


export class TransactionController {
    private transactionRepository: TransactionRepository;

    constructor(transactionRepository: TransactionRepository) {
        this.transactionRepository = transactionRepository
    }


    public createTransaction = async (req: Request, res: Response) => {
        try {

            if (!validateCreateTransactionDto(req.body)) {
                return res.status(400).json({ message: 'incorrect body' });
            }

            const { accountExternalIdDebit, accountExternalIdCredit, transferTypeId, value } = req.body;

            const createTransactionDto: CreateTransactionDTO = {
                accountExternalIdDebit,
                accountExternalIdCredit,
                transferTypeId,
                value
            };

            const createTransactionUseCase = new CreateTransactionUseCase(this.transactionRepository)
            const savedTransaction = await createTransactionUseCase.execute(createTransactionDto);

            return res.status(200).json(savedTransaction);
        } catch (error) {
            console.error('Error creating transaction:', error);
            return res.status(500).json({ message: 'Error creating transaction', error });
        }
    };

    public updateTransaction = async (req: Request, res: Response): Promise<Response | void> => {
        try {

            if (!validateUpdateTransactionBody(req.body)) {
                return res.status(400).json({ message: 'incorrect body' });
            }

            const { id } = req.params;
            const updatedData = req.body;

            const updateTransactionUseCase = new UpdateTransactionUseCase(this.transactionRepository);
            const updatedTransaction = await updateTransactionUseCase.execute(id, updatedData);

            return res.status(200).json(updatedTransaction);
        } catch (error: any) {
            if (error?.message === 'Transaction not found') {
                return res.status(404).json({ message: 'Transaction not found' });
            }
            console.error('Error updating transaction:', error);
            return res.status(500).json({ message: 'Error updating transaction', error });
        }
    };

}
