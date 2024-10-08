import { Request, Response } from 'express';
import { TransactionController } from '../../../src/adapters/controllers/transaction.controller';
import { TransactionRepositoryImpl } from '../../../src/domain/repositories/transaction.repository';
import AppDataSource from '../../../src/infrastructure/database/transaction.ormconfig';



describe('Transaction Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let transactionController: TransactionController
    let transactionRepository: TransactionRepositoryImpl

    beforeAll(async () => {
        await AppDataSource.initialize();
    })

    beforeEach(() => {
        transactionRepository = new TransactionRepositoryImpl();
        transactionController = new TransactionController(transactionRepository)
        process.env.NODE_ENV = 'test'

        req = {
            params: { id: '1' },
            body: { status: 'completed' },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(async () => {
        await AppDataSource.manager.clear('transactions');
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await AppDataSource.destroy();

    })

    describe('create Transaction', () => {

        it('should create a transaction', async () => {

            req.body = {
                accountExternalIdCredit: 'acc1',
                accountExternalIdDebit: 'acc2',
                transferTypeId: 1,
                value: 100
            }

            await transactionController.createTransaction(req as Request, res as Response)

            const result = await transactionRepository.findAll()
            expect(result.length).toBe(1)
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(result[0]);

        });
        it('should return error when body is incorrect ', async () => {
            req.body = {}

            await transactionController.createTransaction(req as Request, res as Response)

            const result = await transactionRepository.findAll()
            expect(result.length).toBe(0)
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'incorrect body' });
        });

        it('should return 500 if there is an internal server error ', async () => {
            req.body = {
                accountExternalIdCredit: 'acc1',
                accountExternalIdDebit: 'acc2',
                transferTypeId: 1,
                value: 100
            }

            jest.spyOn(transactionRepository, 'save').mockRejectedValue(new Error('Error server'))

            await transactionController.createTransaction(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error creating transaction', error: new Error('Error server') });
        });
    });

    describe('update Transaction', () => {
        it('should update a transaction and return the updated transaction object', async () => {
            let result
            req.body = {
                accountExternalIdCredit: 'acc1',
                accountExternalIdDebit: 'acc2',
                transferTypeId: 1,
                value: 100
            }

            await transactionController.createTransaction(req as Request, res as Response)
            result = await transactionRepository.findAll()

            req.body = {
                transactionExternalId: result[0].id,
                transactionType: {
                    name: 2
                },
                transactionStatus: {
                    name: "approved"
                },
                value: 120,
                createdAt: new Date()
            }

            req.params = {
                id: result[0].id
            }

            await transactionController.updateTransaction(req as Request, res as Response)
            result = await transactionRepository.findAll()

            expect(result.length).toBe(1)
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(result[0]);
            expect(result[0].transferTypeId).toBe(2);
        });

        it('should  return error when body is incorrect ', async () => {
            req.body = {}

            await transactionController.updateTransaction(req as Request, res as Response)

            const result = await transactionRepository.findAll()
            expect(result.length).toBe(0)
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'incorrect body' });
        });

        it('should return 404 if trnsaction does not exist', async () => {
            req.params = {
                id: 'non-existent-id'
            }

            req.body = {
                transactionExternalId: 'non-existent-id',
                transactionType: { name: 2 },
                transactionStatus: { name: 'aprobado' },
                value: 120,
                createdAt: new Date()
            };

            await transactionController.updateTransaction(req as Request, res as Response)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ message: 'Transaction not found' })
        });

        it('should  return 500 if there is an internal server error', async () => {
            let result
            req.body = {
                accountExternalIdCredit: 'acc1',
                accountExternalIdDebit: 'acc2',
                transferTypeId: 1,
                value: 100
            }

            await transactionController.createTransaction(req as Request, res as Response)
            result = await transactionRepository.findAll()

            req.body = {
                "transactionExternalId": result[0].id,
                "transactionType": {
                    "name": 2
                },
                "transactionStatus": {
                    "name": "approved"
                },
                "value": 120,
                "createdAt": new Date()
            }

            req.params = {
                id: result[0].id
            }

            jest.spyOn(transactionRepository, 'update').mockRejectedValue(new Error('Error server'))

            await transactionController.updateTransaction(req as Request, res as Response);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error updating transaction', error: new Error('Error server') });

        });

    });
});
