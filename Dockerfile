# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

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

# Install build dependencies (needed for native modules like bcrypt or utf-8-validate)
RUN apk add --no-cache python3 make g++

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
