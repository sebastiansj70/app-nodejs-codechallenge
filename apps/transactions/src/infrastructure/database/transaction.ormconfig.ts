import { DataSource } from 'typeorm';
import { Transaction } from '../../domain/entities/transaction.entity';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123456',
    database: 'postgres',
    synchronize: true,
    logging: true,
    entities: [Transaction],
});

export default AppDataSource;
