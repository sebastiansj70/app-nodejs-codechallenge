export interface KafkaTransactionMessage {
    transactionExternalId: string;
    transactionType: {
        name: number;
    };
    transactionStatus: {
        name: string;
    };
    value: number;
    createdAt: Date;
}
