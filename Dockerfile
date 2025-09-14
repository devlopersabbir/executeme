# ------------------------
# Stage 1: Build Stage
# ------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package files to install dependencies first (cache-friendly)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app source code
COPY . .

# ------------------------
# Stage 2: Production Image
# ------------------------
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/temp ./temp
COPY --from=builder /app/views ./views
COPY --from=builder /app/*.js ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose app port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
