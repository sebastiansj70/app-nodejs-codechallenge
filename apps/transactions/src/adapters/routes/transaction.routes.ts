import { Router, Request, Response } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { TransactionRepositoryImpl } from '../../domain/repositories/transaction.repository';

const router = Router();
const transactionRepository = new TransactionRepositoryImpl();
const transactionController = new TransactionController(transactionRepository)


router.post('/create', async (req: Request, res: Response) => {
    await transactionController.createTransaction(req, res)
});

router.put('/:id', async (req: Request, res: Response) => {
    await transactionController.updateTransaction(req, res);
});

export default router;
