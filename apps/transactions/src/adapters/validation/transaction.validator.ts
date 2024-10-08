import { CreateTransactionDTO } from '../../domain/dtos/createTransaction.dto';
import { UpdatedData } from '../../domain/dtos/updatedTransaction.dto';

export const validateCreateTransactionDto = (data: any): data is CreateTransactionDTO => {
    const { accountExternalIdDebit, accountExternalIdCredit, transferTypeId, value } = data;

    if (
        typeof accountExternalIdDebit !== 'string' ||
        typeof accountExternalIdCredit !== 'string' ||
        typeof transferTypeId !== 'number' ||
        ![1, 2, 3].includes(transferTypeId) ||
        typeof value !== 'number' ||
        value <= 0
    ) {
        return false;
    }

    return true;
};

export const validateUpdateTransactionBody = (data: any): data is UpdatedData => {
    const { transactionType, transactionStatus, value, createdAt } = data;

    if (
        typeof transactionType !== 'object' ||
        typeof transactionType.name !== 'number' ||
        typeof transactionStatus !== 'object' ||
        typeof transactionStatus.name !== 'string' ||
        typeof value !== 'number' ||
        value <= 0 ||
        !(createdAt instanceof Date)
    ) {
        return false;
    }

    return true;
}