import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import { ProcessTransactionUseCase } from '../../application/processTransaction.usecase';
import { AntiFraudService } from '../../domain/services/antiFraud.service'
import { produceFraudResult } from '../producers/antiFraudProducer';

dotenv.config();

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID_ANTI_FRAUD,
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID_ANTI_FRAUD as string });
const antiFraudService = new AntiFraudService();
const processTransactionUseCase = new ProcessTransactionUseCase(antiFraudService);

export const consumeTransactionMessages = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_TRANSACTIONS || 'transactions', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const transactionData = JSON.parse(message.value?.toString() || '{}');
            console.log(`Mensaje recibido en el tópico ${topic} - Partición ${partition}:`, transactionData);

            try {
                const transacción = await processTransactionUseCase.execute(transactionData);
                await produceFraudResult(transacción);
            } catch (error) {
                console.error('Error al procesar la transacción:', error);
            }
        },
    });
};
