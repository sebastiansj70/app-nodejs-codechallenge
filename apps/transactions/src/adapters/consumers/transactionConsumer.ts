import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import { TransactionRepositoryImpl } from '../../domain/repositories/transaction.repository';
import { TransactionController } from '../controllers/transaction.controller';
import path from 'path';

const envPath = path.resolve(__dirname, '../../../', '.env');
dotenv.config({ path: envPath });

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID_TRANSACTIONS,
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID_TRANSACTIONS as string });
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