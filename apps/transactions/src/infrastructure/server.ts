import express from 'express';
import transactionRoutes from './routes/transaction.routes';

const app = express();

app.use(express.json());

app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Transaction service running on port ${PORT}`);
});
