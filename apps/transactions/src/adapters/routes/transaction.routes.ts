import { Router, Request, Response } from 'express';
import { createTransaction } from '../controllers/transaction.controller';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json({ message: "Hello, this is the transactions API!" });
});

router.post('/create', async (req: Request, res: Response) => {
    await createTransaction(req, res)
});
export default router;
