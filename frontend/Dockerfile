# Use official Node.js Alpine image for a lightweight container
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy application source files
COPY . .

# Set default port and expose it
ENV PORT=3000
EXPOSE 3000

# Start React development server
CMD ["npm", "start"]
