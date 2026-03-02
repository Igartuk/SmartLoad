FROM node:22-slim AS deps
RUN apt-get update && apt-get install -y libc6 && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

FROM node:22-slim AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . . 

RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]