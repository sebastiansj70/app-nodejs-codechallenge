import { Router, Request, Response } from 'express';
import { createTransaction, updateTransaction } from '../controllers/transaction.controller';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json({ message: "Hello, this is the transactions API!" });
});

router.post('/create', async (req: Request, res: Response) => {
    await createTransaction(req, res)
});

router.put('/:id', async (req: Request, res: Response) => {
    await updateTransaction(req, res)
})

export default router;
