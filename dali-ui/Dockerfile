# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Add build argument for API URL with default value
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV NODE_ENV=production

# Install dependencies (including devDependencies)
COPY package*.json ./
RUN npm ci --include=dev

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

# Create a script to generate both config files at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.d/40-config.sh && \
    echo 'cat > /usr/share/nginx/html/env-config.js << EOF' >> /docker-entrypoint.d/40-config.sh && \
    echo 'window.env = {' >> /docker-entrypoint.d/40-config.sh && \
    echo '  REACT_APP_API_URL: "${REACT_APP_API_URL}"' >> /docker-entrypoint.d/40-config.sh && \
    echo '};' >> /docker-entrypoint.d/40-config.sh && \
    echo 'EOF' >> /docker-entrypoint.d/40-config.sh && \
    echo 'cp /usr/share/nginx/html/env-config.js /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/40-config.sh && \
    chmod +x /docker-entrypoint.d/40-config.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]