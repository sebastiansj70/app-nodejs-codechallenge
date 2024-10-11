import { sendTransactionMessage } from "../../../src/adapters/producers/transactionProducer";
import { Kafka, Producer } from "kafkajs";
import { KafkaTransactionMessage } from "../../../src/domain/dtos/kafkaTransactionMessage.dto";

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
    let producer: Producer
    beforeEach(() => {
        const kafka = new Kafka({ clientId: 'test-client', brokers: ['localhost:9092'] });
        producer = kafka.producer();
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should send a transaction message with correct data', async () => {
        const transactionData: KafkaTransactionMessage = {
            transactionExternalId: 'tx123',
            transactionType: { name: 1 },
            transactionStatus: { name: 'pending' },
            value: 100,
            createdAt: new Date(),
        };

        await sendTransactionMessage(transactionData)

        expect(producer.connect).toHaveBeenCalled()
        expect(producer.send).toHaveBeenCalledWith({
            topic: process.env.KAFKA_TOPIC || 'transactions',
            messages: [
                {
                    value: JSON.stringify(transactionData),
                },
            ],
        })
        expect(producer.disconnect).toHaveBeenCalled();

    });

    it('should handle errors when sending the message', async () => {
        const transactionData: KafkaTransactionMessage = {
            transactionExternalId: 'tx123',
            transactionType: { name: 1 },
            transactionStatus: { name: 'pending' },
            value: 100,
            createdAt: new Date(),
        };
        jest.spyOn(producer, 'send').mockRejectedValue(new Error('Kafka error'))

        await sendTransactionMessage(transactionData);

        expect(producer.connect).toHaveBeenCalled();
        expect(producer.send).toHaveBeenCalled();
        expect(producer.disconnect).toHaveBeenCalled();
    });
});