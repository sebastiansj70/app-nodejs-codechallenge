import { consumeTransactionMessages } from "./adapters/consumers/antiFraudConsumer";

async function startAntiFraudService() {
    console.log('Starting Anti-Fraud Service...');
    await consumeTransactionMessages();
    console.log('Anti-Fraud Service is running and consuming Kafka messages');
}

startAntiFraudService().catch((error) => {
    console.error('Error starting Anti-Fraud Service:', error);
    process.exit(1);
});