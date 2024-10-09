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

            const transactionData = {
                transactionExternalId: result[0].id.toString(),
                transactionType: {
                    name: 2
                },
                transactionStatus: {
                    name: "approved"
                },
                value: 120,
                createdAt: "2024-10-09T00:37:07.504Z"
            }

            expect(result[0].transferTypeId).toBe(1)
            expect(result[0].status).toBe("pending")

            await transactionController.updateTransaction(transactionData)
            result = await transactionRepository.findAll()

            expect(result[0].transferTypeId).toBe(2)
            expect(result[0].status).toBe("approved")
            expect(result.length).toBe(1)
        });

        it('should  return error when body is incorrect ', async () => {
            const transactionData = JSON.parse('{}');
            await expect(transactionController.updateTransaction(transactionData)).rejects.toThrow(new Error('incorrect body'));

        });

        it('should return 404 if trnsaction does not exist', async () => {

            const transactionData = {
                transactionExternalId: 'non-existent-id',
                transactionType: {
                    name: 2
                },
                transactionStatus: {
                    name: "approved"
                },
                value: 120,
                createdAt: "2024-10-09T00:37:07.504Z"
            }

            await expect(transactionController.updateTransaction(transactionData)).rejects.toThrow(new Error('Transaction not found'));
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

            const transactionData = {
                transactionExternalId: result[0].id.toString(),
                transactionType: {
                    name: 2
                },
                transactionStatus: {
                    name: "approved"
                },
                value: 120,
                createdAt: "2024-10-09T00:37:07.504Z"
            }

            jest.spyOn(transactionRepository, 'update').mockRejectedValue(new Error('Error server'))

            await expect(transactionController.updateTransaction(transactionData)).rejects.toThrow(new Error('Error server'));

        });

    });
});
