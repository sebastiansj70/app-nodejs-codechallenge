import { DataSource } from 'typeorm';
import { Transaction } from '../../domain/entities/transaction.entity';
import dotenv from 'dotenv';
import path from 'path';

let AppDataSource: DataSource
const envPath = path.resolve(__dirname, '../../../', '.env');
dotenv.config({ path: envPath });

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: path.resolve(__dirname, '../../../', '.env.test') });
    AppDataSource = new DataSource({
        type: process.env.DB_TYPE as 'sqlite',
        database: process.env.DB_HOST as string,
        synchronize: Boolean(process.env.DB_SYNCHRONIZE),
        logging: ['query', 'error'],
        entities: [Transaction],
    });
} else {
    AppDataSource = new DataSource({
        type: process.env.DB_TYPE as 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: Boolean(process.env.DB_SYNCHRONIZE),
        logging: Boolean(process.env.DB_LOGGING),
        entities: [Transaction],
    });
}

export default AppDataSource;
