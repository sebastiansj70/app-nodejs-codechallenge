import { consumeTransactionMessages } from "../../../src/adapters/consumers/antiFraudConsumer";
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

jest.mock("../../../src/adapters/producers/antiFraudProducer", () => {
    return {
        produceFraudResult: jest.fn().mockResolvedValue(undefined),
    };
});

describe('kafka consumer for antifraud', () => {
    let mockConsumer: any;

    beforeEach(() => {
        mockConsumer = new Kafka({ clientId: 'test-client', brokers: ['localhost:9092'] }).consumer({ groupId: 'test-group' });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should consume transaction messages, process them, and produce fraud results', async () => {
        const message: KafkaMessage = {
            key: null,
            value: Buffer.from(JSON.stringify({
                transactionExternalId: 'tx123',
                transactionType: { name: 1 },
                transactionStatus: { name: 'pending' },
                value: 1000,
                createdAt: "2024-10-11T05:27:20.745Z",
            })),
            headers: {},
            timestamp: "2024-10-11T05:27:20.745Z",
            offset: '0',
            attributes: 0,
        };

        mockConsumer.run.mockImplementation(async ({ eachMessage }: { eachMessage: (payload: EachMessagePayload) => Promise<void> }) => {
            await eachMessage({
                topic: 'transactions',
                partition: 0,
                message,
                heartbeat: jest.fn(),
                pause: jest.fn(),
            });
        });

        await mockConsumer.connect();
        await mockConsumer.subscribe({ topic: 'transactions', fromBeginning: true });


        await consumeTransactionMessages();

        expect(mockConsumer.run).toHaveBeenCalled();

        const { produceFraudResult } = require("../../../src/adapters/producers/antiFraudProducer");
        expect(produceFraudResult).toHaveBeenCalledWith({ "createdAt": "2024-10-11T05:27:20.745Z", "transactionExternalId": "tx123", "transactionStatus": { "name": "rejected" }, "transactionType": { "name": 1 }, "value": 1000 });

        expect(produceFraudResult).toHaveBeenCalledTimes(1);
    });

    it('should handle errors during transaction processing', async () => {
        const message: KafkaMessage = {
            key: null,
            value: Buffer.from(JSON.stringify({
                transactionExternalId: 'tx123',
                transactionType: { name: 1 },
                transactionStatus: { name: 'pending' },
                value: 1000,
                createdAt: new Date(),
            })),
            headers: {},
            timestamp: new Date().toISOString(),
            offset: '0',
            attributes: 0,
        };
    
        mockConsumer.run.mockImplementation(async ({ eachMessage }: { eachMessage: (payload: EachMessagePayload) => Promise<void> }) => {
            await eachMessage({
                topic: 'transactions',
                partition: 0,
                message,
                heartbeat: jest.fn(),
                pause: jest.fn(),
            });
        });
    
        const { produceFraudResult } = require("../../../src/adapters/producers/antiFraudProducer");
        produceFraudResult.mockRejectedValue(new Error('Kafka producer error'));
    
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
        await mockConsumer.connect();
        await mockConsumer.subscribe({ topic: 'transactions', fromBeginning: true });
    
        await consumeTransactionMessages();
    
        expect(mockConsumer.run).toHaveBeenCalled();
        expect(produceFraudResult).toHaveBeenCalled();
        expect(produceFraudResult).toHaveBeenCalledTimes(1);
    
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('Error al procesar la transacción'), 
            expect.any(Error) 
        );
    
        consoleErrorSpy.mockRestore();
    });
    
    
});
