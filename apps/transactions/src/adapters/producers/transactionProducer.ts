import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../../', '.env');
dotenv.config({ path: envPath });

const kafka = new Kafka({
    clientId: 'transactions-service',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();


export const sendTransactionMessage = async (transactionData: any) => {
    await producer.connect();

    try {
        await producer.send({
            topic: process.env.KAFKA_TOPIC || 'transactions',
            messages: [
                {
                    value: JSON.stringify(transactionData),
                },
            ],
        });
        console.log('Transaction message sent:', transactionData);
    } catch (error) {
        console.error('Error sending transaction message:', error);
    } finally {
        await producer.disconnect();
    }
};

