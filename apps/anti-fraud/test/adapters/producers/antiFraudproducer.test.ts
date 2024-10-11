import { produceFraudResult } from "../../../src/adapters/producers/antiFraudProducer";
import { Kafka, Producer } from "kafkajs";
import { KafkaTransactionMessage } from "../../../src/adapters/types/kafkaTransactionMessage";



jest.mock('kafkajs', () => {
    const mockProducer = {
        connect: jest.fn(),
        send: jest.fn(),
        disconnect: jest.fn(),
    };

    return {
        Kafka: jest.fn(() => ({
            producer: jest.fn(() => mockProducer),
        })),
    };
});

describe('kafka producer', () => {
    let producer: Producer;

    beforeEach(() => {
        const kafka = new Kafka({ clientId: 'test-client', brokers: ['localhost:9092'] });
        producer = kafka.producer();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should send a transaction message with correct data', async () => {
        const transactionData: KafkaTransactionMessage = {
            transactionExternalId: 'tx123',
            transactionType: { name: 1 },
            transactionStatus: { name: 'pending' },
            value: 100,
            createdAt: "2024-10-09T00:37:07.504Z",
        };

        await produceFraudResult(transactionData);

        expect(producer.connect).toHaveBeenCalled();
        expect(producer.send).toHaveBeenCalledWith({
            topic: process.env.KAFKA_TOPIC || 'antifraud-transactions-status',
            messages: [
                {
                    value: JSON.stringify(transactionData),
                },
            ],
        });
        expect(producer.disconnect).toHaveBeenCalled();
    });

    it('should handle errors when sending the message', async () => {
        const transactionData: KafkaTransactionMessage = {
            transactionExternalId: 'tx123',
            transactionType: { name: 1 },
            transactionStatus: { name: 'pending' },
            value: 100,
            createdAt:  "2024-10-09T00:37:07.504Z",
        };

        jest.spyOn(producer, 'send').mockRejectedValue(new Error('Kafka error'));

        await expect(produceFraudResult(transactionData)).rejects.toThrow('Kafka error');

        expect(producer.connect).toHaveBeenCalled();
        expect(producer.send).toHaveBeenCalled();
        expect(producer.disconnect).toHaveBeenCalled();
    });
});
