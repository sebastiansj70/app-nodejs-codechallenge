import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import { KafkaTransactionMessage } from '../types/kafkaTransactionMessage';

dotenv.config();

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();

export const produceFraudResult = async (transactionData: KafkaTransactionMessage) => {
    await producer.connect();
    try {
        await producer.send({
            topic: process.env.KAFKA_TOPIC_UPDATE || 'antifraud-transactions-status',
            messages: [
                { value: JSON.stringify(transactionData) }
            ],
        });
        console.log('Transaction message sent:', transactionData);
    } catch (error) {
        console.error('Error sending transaction message:', error);
    } finally {
        await producer.disconnect();
    }
};
