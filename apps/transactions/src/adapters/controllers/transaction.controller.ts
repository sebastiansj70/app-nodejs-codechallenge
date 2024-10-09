import { Request, Response } from 'express';
import { UpdateTransactionUseCase } from '../../application/updateTransaction.usecase';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { CreateTransactionUseCase } from '../../application/createTransaction.usecase';
import { CreateTransactionDTO } from '../../domain/dtos/createTransaction.dto';
import { validateCreateTransactionDto, validateUpdateTransactionBody } from '../validation/transaction.validator';
import { sendTransactionMessage } from '../producers/transactionProducer';
import { mapTransactionToKafkaMessage } from '../mappers/transactionMapper';
import { UpdatedData } from '../../domain/dtos/updatedTransaction.dto';


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

            const message = mapTransactionToKafkaMessage(savedTransaction)
            await sendTransactionMessage(message);

            return res.status(200).json(savedTransaction);
        } catch (error) {
            console.error('Error creating transaction:', error);
            return res.status(500).json({ message: 'Error creating transaction', error });
        }
    };

    public updateTransaction = async (data: UpdatedData): Promise<void> => {
        try {
            if (!validateUpdateTransactionBody(data)) {
                throw new Error('incorrect body')
            }

            const id = data.transactionExternalId

            const updateTransactionUseCase = new UpdateTransactionUseCase(this.transactionRepository);
            await updateTransactionUseCase.execute(id, data);

        } catch (error: any) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    };

}
