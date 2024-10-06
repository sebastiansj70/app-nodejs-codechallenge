import { DataSource } from 'typeorm';
import { Transaction } from '../../domain/entities/transaction.entity';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    synchronize: true,
    logging: true,
    entities: [Transaction],
});

export default AppDataSource;
