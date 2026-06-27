FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./
COPY frontend/ ./frontend/
RUN mkdir -p data
EXPOSE 3004
CMD ["node", "server.js"]
