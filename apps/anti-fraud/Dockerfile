
FROM node:18-alpine
WORKDIR /app/apps/anti-fraud

COPY apps/anti-fraud/package*.json ./
RUN npm install --include=dev
COPY apps/anti-fraud/.env ./
COPY apps/anti-fraud/tsconfig.json ./

COPY apps/anti-fraud ./
CMD ["npm", "run", "dev:anti-fraud"]
