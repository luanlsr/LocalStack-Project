FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache curl dos2unix

COPY package*.json ./
RUN npm install --production

COPY . .

RUN dos2unix /app/start.sh && chmod +x /app/start.sh

CMD ["sh", "/app/start.sh"]
