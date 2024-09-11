# Stage 1: Build the application
FROM node:16-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install all dependencies, including devDependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application using Vite
RUN ./node_modules/.bin/vite build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
