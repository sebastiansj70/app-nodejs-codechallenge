import express from 'express';
import transactionRoutes from './adapters/routes/transaction.routes';
import 'reflect-metadata';
import AppDataSource from './infrastructure/database/transaction.ormconfig';

const app = express();

app.use(express.json());

app.use('/api/transactions', transactionRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log('Conexión a la base de datos establecida');

        app.listen(3000, () => {
            console.log('Servidor ejecutándose en http://localhost:3000');
        });
    })
    .catch((error) => console.log('Error al conectar a la base de datos', error));

