FROM node:20-alpine
WORKDIR /app

# Install deps first for better layer caching
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm i --omit=dev

# Copy application source
COPY index.js ./

ENV PORT=8000
EXPOSE 8000
CMD ["node", "index.js"]

