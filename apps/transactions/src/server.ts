import express from 'express';
import transactionRoutes from './adapters/routes/transaction.routes';
import 'reflect-metadata';
import { initializeApp } from './infrastructure/startup';

const app = express();
const startServer = async () => {
    await initializeApp()
}

app.use(express.json());

app.use('/api/transactions', transactionRoutes);

startServer().catch((err) => {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
});

app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});

