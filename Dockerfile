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
ENV PORT=9091

# Create a temporary directory that will be used for mounting (if it doesn't exist on host)
# This command ensures the directory exists within the image,
# but the volume mount `./temp:/app/temp` will override it with the host's `./temp`
# if `./temp` exists on the host. If `./temp` doesn't exist on the host, Docker will create it.
RUN mkdir -p /app/temp

# Expose the port your Node.js application listens on
EXPOSE 9091

# Command to run your application when the container starts
CMD ["npm", "start"]