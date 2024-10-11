import { AntiFraudService } from "../src/domain/services/antiFraud.service";
import { ProcessTransactionUseCase } from "../src/application/processTransaction.usecase";

describe('AntiFraudService', () => {
    let antiFraudService: AntiFraudService
    let processTransactionUseCase: ProcessTransactionUseCase

    beforeEach(() => {
        antiFraudService = new AntiFraudService()
        processTransactionUseCase = new ProcessTransactionUseCase(antiFraudService)
    })

    it('should process a valid transaction', async () => {
        const transactionData = {
            transactionExternalId: 'id',
            transactionType: {
                name: 2
            },
            transactionStatus: {
                name: "pending"
            },
            value: 120,
            createdAt: "2024-10-09T00:37:07.504Z"
        }

        const transaction = await processTransactionUseCase.execute(transactionData)

        expect(transaction.transactionStatus.name).toBe("approved");
    });

    it('should process a valid transaction', async () => {
        const transactionData = {
            transactionExternalId: 'id',
            transactionType: {
                name: 2
            },
            transactionStatus: {
                name: "pending"
            },
            value: 1200,
            createdAt: "2024-10-09T00:37:07.504Z"
        }

        const transaction = await processTransactionUseCase.execute(transactionData)

        expect(transaction.transactionStatus.name).toBe("rejected");
    });
});