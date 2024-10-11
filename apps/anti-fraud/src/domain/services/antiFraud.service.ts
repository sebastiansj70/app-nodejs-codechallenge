import { KafkaTransactionMessage } from "../../adapters/types/kafkaTransactionMessage";

export class AntiFraudService {
    validateTransaction(transactionData: KafkaTransactionMessage): string {
        const isValid = transactionData.value < 1000;
        return isValid ? 'approved' : 'rejected';
    }
}
