import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import { TransactionRepositoryImpl } from '../../domain/repositories/transaction.repository';
import { TransactionController } from '../../adapters/controllers/transaction.controller';

dotenv.config();

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID as string });
const transactionRepository = new TransactionRepositoryImpl();
const transactionController = new TransactionController(transactionRepository)

export const consumeTransactionMessages = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC_UPDATE || 'antifraud-transactions-status', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const transactionData = JSON.parse(message.value?.toString() || '{}');
            console.log(`Mensaje recibido en el tópico ${topic} - Partición ${partition}:`, transactionData);

            try {
                await transactionController.updateTransaction(transactionData);
                console.log("mensaje procesado exitosamente");
            } catch (error) {
                console.error(`Error al procesar la transacción en el tópico ${topic} - message ${message}: `, error);
            }
        },
    });
};