# Use the official Node.js 16 image as a base
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose the port the app will run on
EXPOSE 5000

# Start the application
CMD ["node", "src/server.js"]
