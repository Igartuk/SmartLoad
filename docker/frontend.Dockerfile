# Use Node 22 Slim for better compatibility with lightningcss and your dependencies
FROM node:22-slim AS deps
# Install libc6 to ensure native binaries work perfectly
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
# Next.js build
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
# Copy build output and necessary files
COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "start"]