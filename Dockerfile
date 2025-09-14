# Use a slim Node.js image as base
FROM node:20-alpine

# Install docker CLI to execute docker command (for accessing host Docker)
# Also install bash for better scripting capabilities inside the container if needed
RUN apk add --no-cache docker-cli bash

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker layer caching
# This ensures npm install is re-run only if dependencies change
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application source code
COPY . .

# Set environment variables
ENV PORT=5000

# Create a temporary directory that will be used for mounting (if it doesn't exist on host)
# This command ensures the directory exists within the image,
# but the volume mount `./temp:/app/temp` will override it with the host's `./temp`
# if `./temp` exists on the host. If `./temp` doesn't exist on the host, Docker will create it.
RUN mkdir -p /app/temp

# Expose the port your Node.js application listens on
EXPOSE 5000 

# Command to run your application when the container starts
CMD ["npm", "run", "start"]


# # ------------------------
# # Stage 1: Build Stage
# # ------------------------
# FROM node:20-alpine AS builder

# # Set working directory
# WORKDIR /app

# # Copy only package files to install dependencies first (cache-friendly)
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the app source code
# COPY . .

# # ------------------------
# # Stage 2: Production Image
# # ------------------------
# FROM node:20-alpine AS production

# # Set working directory
# WORKDIR /app

# # Copy only the necessary files from builder
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./
# # COPY --from=builder /app/dist ./dist
# # COPY --from=builder /app/temp ./temp
# COPY --from=builder /app/views ./views
# COPY --from=builder /app/*.js ./
# COPY --form=builder /app/.git ./

# # Set environment variables
# ENV NODE_ENV=production
# ENV PORT=5000

# # Expose app port
# EXPOSE 5000

# # Start the application
# CMD ["node", "index.js"]