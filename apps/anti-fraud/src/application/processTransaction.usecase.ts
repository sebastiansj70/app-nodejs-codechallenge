import { KafkaTransactionMessage } from '../adapters/types/kafkaTransactionMessage';
import { AntiFraudService } from '../domain/services/antiFraud.service';

export class ProcessTransactionUseCase {
    constructor(private antiFraudService: AntiFraudService) { }

    async execute(transactionData: KafkaTransactionMessage) {
        const result = this.antiFraudService.validateTransaction(transactionData);
        transactionData.transactionStatus.name = result
        return transactionData;
    }
}
