import { Transaction } from "../../domain/entities/transaction.entity";
import { KafkaTransactionMessage } from "../../domain/dtos/kafkaTransactionMessage.dto";

export const mapTransactionToKafkaMessage = (transaction: Transaction): KafkaTransactionMessage => {
    return {
        transactionExternalId: transaction.id,
        transactionType: {
            name: transaction.transferTypeId,
        },
        transactionStatus: {
            name: transaction.status,
        },
        value: transaction.value,
        createdAt: transaction.createdAt,
    };
};