# STAGE 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Define build arguments for Next.js environment variables
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_apiKey
ARG NEXT_PUBLIC_authDomain
ARG NEXT_PUBLIC_projectId
ARG NEXT_PUBLIC_storageBucket
ARG NEXT_PUBLIC_messagingSenderId
ARG NEXT_PUBLIC_appId

# Set them as environment variables so they are available during 'npm run build'
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_apiKey=$NEXT_PUBLIC_apiKey
ENV NEXT_PUBLIC_authDomain=$NEXT_PUBLIC_authDomain
ENV NEXT_PUBLIC_projectId=$NEXT_PUBLIC_projectId
ENV NEXT_PUBLIC_storageBucket=$NEXT_PUBLIC_storageBucket
ENV NEXT_PUBLIC_messagingSenderId=$NEXT_PUBLIC_messagingSenderId
ENV NEXT_PUBLIC_appId=$NEXT_PUBLIC_appId

# Build the Next.js application
RUN npm run build

# STAGE 2: Run
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy necessary files from the builder stage
# Standard Next.js standalone output copies
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application using the standalone server
CMD ["node", "server.js"]
