# Stage 1: Build the application
FROM node:14 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

RUN npm cache clean --force

# Install dependencies
RUN npm install

ENV PATH /app/node_modules/.bin:$PATH

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine

# Copy built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]