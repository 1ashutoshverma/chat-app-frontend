# STAGE 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy application source
# NOTE: .env-cmdrc must be present in this directory for the build to work!
COPY . .

# Build the Next.js application using env-cmd via the docker-specific script
RUN npm run build:docker

# STAGE 2: Run
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
