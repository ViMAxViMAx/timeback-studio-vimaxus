# Use Node.js LTS as base image
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev)
RUN npm install

# Copy all application files
COPY . .

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Set environment variable for Vite
ENV PORT=8080
ENV HOST=0.0.0.0

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]
