FROM node:18-alpine
WORKDIR /app/apps/transactions

COPY apps/transactions/package*.json ./
RUN npm install --include=dev
COPY apps/transactions/.env ./
COPY apps/transactions/tsconfig.json ./

COPY apps/transactions ./
EXPOSE 3000

CMD ["npm", "run", "dev:transactions"]
