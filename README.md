# Proyecto de Transacciones y Antifraude

## Descripción del Proyecto
Este proyecto consiste en dos microservicios que trabajan juntos para procesar transacciones y detectar fraudes. El servicio de transacciones permite a los usuarios crear transacciones financieras, mientras que el servicio de antifraude monitorea las transacciones y marca aquellas que puedan ser fraudulentas.

## Tecnologías Utilizadas
- **Node.js**
- **TypeScript**
- **Kafka** (para la comunicación entre microservicios)
- **PostgreSQL** (base de datos)
- **Docker** (para contenedorización de los servicios)
- **Jest** (para pruebas unitarias)

## Requisitos
- Tener Docker instalado y en funcionamiento.
- Tener `docker-compose` para manejar los contenedores.
- Opcional: Postman o cURL para realizar pruebas en la API.

## Instalación y Configuración
1. Clona el repositorio:
   ```bash
   git clone https://github.com/usuario/proyecto-transacciones-antifraude.git
   cd proyecto-transacciones-antifraude
   ```
2. configuracion:
    ## Configuración del Archivo .env

- Para configurar el archivo `.env` para el módulo de **Transacciones**, sigue estos pasos:

1. Navega a la carpeta `apps/transactions`.
2. Crea un archivo `.env` en la carpeta `apps/transactions`.
3. Copia el contenido del archivo `.env.example` y pégalo en el nuevo archivo `.env`.
4. Rellena los valores de las variables de entorno según sea necesario:

```bash
# Database Configuration
DB_TYPE=postgres
DB_HOST=your_database_host_here  # Ejemplo: postgres
DB_PORT=5432
DB_USERNAME=your_db_username_here  # Ejemplo: postgres
DB_PASSWORD=your_db_password_here  # Ejemplo: 123456
DB_DATABASE=your_db_name_here  # Ejemplo: postgres
DB_SYNCHRONIZE=true  # Cambiar a false en producción si no es necesario sincronizar
DB_LOGGING=false  # Cambiar a true si se necesita logging de consultas SQL

# Kafka Configuration
KAFKA_BROKER=your_kafka_broker_here  # Ejemplo: kafka:29092

# Kafka Topics
KAFKA_TOPIC_TRANSACTIONS=your_transactions_topic_here  # Ejemplo: transactions
KAFKA_TOPIC_UPDATE=your_update_topic_here  # Ejemplo: antifraud-transactions-status

# Transaction Module Configuration
KAFKA_CLIENT_ID_TRANSACTIONS=your_client_id_here  # Ejemplo: transactions-service
KAFKA_GROUP_ID_TRANSACTIONS=your_group_id_here  # Ejemplo: transactions-consumers
```

- Para configurar el archivo `.env` para el módulo de **Anti-Fraude**, sigue estos pasos:

1. Navega a la carpeta `apps/anti-fraud`.
2. Crea un archivo `.env` en la carpeta `apps/anti-fraud`.
3. Copia el contenido del archivo `.env.example` y pégalo en el nuevo archivo `.env`.
4. Rellena los valores de las variables de entorno según sea necesario:

```bash
# Kafka Configuration
KAFKA_BROKER=your_kafka_broker_here  # Ejemplo: kafka:29092

# Kafka Topics
KAFKA_TOPIC_TRANSACTIONS=your_transactions_topic_here  # Ejemplo: transactions
KAFKA_TOPIC_UPDATE=your_update_topic_here  # Ejemplo: antifraud-transactions-status

# Anti-Fraud Module Configuration
KAFKA_CLIENT_ID_ANTI_FRAUD=your_client_id_here  # Ejemplo: anti-fraud-service
KAFKA_GROUP_ID_ANTI_FRAUD=your_group_id_here  # Ejemplo: anti-fraud-consumers

```

3. Levanta los servicios utilizando Docker:
   ```bash
   docker-compose up --build
   ```

Esto levantará los siguientes contenedores:
- **PostgreSQL** en el puerto `5433`
- **Kafka** en el puerto `29092`
- **Microservicio de Transacciones** en el puerto `3000`
- **Microservicio de Antifraude**

## Uso de la API de Transacciones
Una vez que los contenedores estén en funcionamiento, puedes crear una transacción enviando una solicitud `POST` a la siguiente ruta:

`POST http://localhost:3000/api/transactions/create`

Con el siguiente cuerpo de ejemplo:
```json
{
    "accountExternalIdDebit": "Guid",
    "accountExternalIdCredit": "Guid",
    "transferTypeId": 1,
    "value": 3100
}
```

Puedes hacer la solicitud desde Postman o utilizando `cURL`:
```bash
curl -X POST http://localhost:3000/api/transactions/create \
   -H "Content-Type: application/json" \
   -d '{
    "accountExternalIdDebit": "Guid",
    "accountExternalIdCredit": "Guid",
    "transferTypeId": 1,
    "value": 3100
}'
```

## Ejecución de Pruebas
Cada microservicio tiene sus propias pruebas unitarias que puedes ejecutar de la siguiente manera:

### Pruebas del Servicio de Transacciones
```bash
cd apps/transactions
npm run test
```

### Pruebas del Servicio de Antifraude
```bash
cd apps/anti-fraud
npm run test
```

## Notas Adicionales
- El servicio de transacciones se conecta a una base de datos PostgreSQL, que está en un contenedor. Si deseas ver los datos almacenados, puedes usar `pgAdmin` configurando la conexión con el host `localhost` y el puerto `5433`.
- Kafka se usa para la comunicación entre los microservicios de transacciones y antifraude.



