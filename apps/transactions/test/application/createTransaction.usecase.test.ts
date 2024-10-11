import { consumeTransactionMessages } from "../../src/adapters/consumers/transactionConsumer";
import { TransactionRepositoryImpl } from "../../src/domain/repositories/transaction.repository";
import { Kafka, EachMessagePayload, KafkaMessage } from "kafkajs";

jest.mock('kafkajs', () => {
    const mockConsumer = {
        connect: jest.fn(),
        subscribe: jest.fn(),
        run: jest.fn(),
    };

    const mockProducer = {
        connect: jest.fn(),
        send: jest.fn(),
        disconnect: jest.fn(),
    };

    return {
        Kafka: jest.fn(() => ({
            consumer: jest.fn(() => mockConsumer),
            producer: jest.fn(() => mockProducer),
        })),
    };
});

jest.mock("../../src/adapters/controllers/transaction.controller", () => {
    const mockUpdateTransaction = jest.fn().mockResolvedValue(undefined);
    
    return {
        TransactionController: jest.fn().mockImplementation(() => ({
            updateTransaction: mockUpdateTransaction,
        })),
        mockUpdateTransaction,
    };
});

describe('kafka consumer', () => {
    let transactionController: any;
    let mockConsumer: any;
    let mockUpdateTransaction: jest.Mock;

    beforeEach(() => {
        const transactionRepository = new TransactionRepositoryImpl();
        transactionController = new (require("../../src/adapters/controllers/transaction.controller").TransactionController)(transactionRepository);
        mockUpdateTransaction = require("../../src/adapters/controllers/transaction.controller").mockUpdateTransaction;

        mockConsumer = new Kafka({ clientId: 'test-client', brokers: ['localhost:9092'] }).consumer({ groupId: 'test-group' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should consume transaction messages and process them', async () => {
        const message: KafkaMessage = {
            key: null,
            value: Buffer.from(JSON.stringify({
                transactionExternalId: 'tx123',
                transactionType: { name: 1 },
                transactionStatus: { name: 'completed' },
                value: 100,
                createdAt: new Date(),
            })),
            headers: {},
            timestamp: new Date().toISOString(),
            offset: '0',
            attributes: 0,
        };

        mockConsumer.run.mockImplementation(async ({ eachMessage }: { eachMessage: (payload: EachMessagePayload) => Promise<void> }) => {
            await eachMessage({
                topic: 'antifraud-transactions-status',
                partition: 0,
                message,
                heartbeat: jest.fn(),
                pause: jest.fn(),
            });
        });

        await mockConsumer.connect();
        await mockConsumer.subscribe({ topic: 'antifraud-transactions-status', fromBeginning: true });

        await consumeTransactionMessages();

        expect(mockConsumer.run).toHaveBeenCalled();

        expect(mockUpdateTransaction).toHaveBeenCalled();
        expect(mockUpdateTransaction).toHaveBeenCalledWith(expect.objectContaining({
            transactionExternalId: 'tx123',
            transactionStatus: { name: 'completed' },
            value: 100,
        }));

        expect(mockUpdateTransaction).toHaveBeenCalledTimes(1);
    });
});
