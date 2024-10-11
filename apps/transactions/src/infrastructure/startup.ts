import AppDataSource from "./database/transaction.ormconfig";
import { consumeTransactionMessages } from "../adapters/consumers/transactionConsumer";


export const initializeApp = async () => {
    try {
        AppDataSource.initialize()
            .then(() => {
                console.log('Conexión a la base de datos establecida');
            })
            .catch((error) => console.log('Error al conectar a la base de datos', error));

        await consumeTransactionMessages();
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        process.exit(1);
    }
}
