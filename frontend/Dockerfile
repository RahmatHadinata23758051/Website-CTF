# Base Node image
FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy source code files
COPY . .

# Expose Vite dev server default port
EXPOSE 5173

# Run Vite dev server, binding to all interfaces for access from host machine
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
