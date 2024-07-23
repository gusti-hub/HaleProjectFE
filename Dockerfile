# Dockerfile for React App
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use serve to serve the app
CMD ["npx", "serve", "-s", "build"]

# Expose the port the app runs on
EXPOSE 5000
