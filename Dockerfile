# Use Node.js base image
FROM node:18-alpine

# Set the maintainer label
LABEL authors="Serguei"

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Build the app
RUN npm run build

# Expose the port and start the app
EXPOSE 3001
CMD ["node", "dist/main.js"]
