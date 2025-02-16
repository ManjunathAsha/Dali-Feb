# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Add build argument for API URL with default value
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV NODE_ENV=production

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the build output
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a dynamic config script
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-config.sh && \
    echo 'echo "window.REACT_APP_API_URL=\"$REACT_APP_API_URL\";" > /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/40-config.sh && \
    chmod +x /docker-entrypoint.d/40-config.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]