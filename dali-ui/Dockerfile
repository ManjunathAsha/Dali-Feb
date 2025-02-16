# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Add build argument for API URL
ARG REACT_APP_API_URL=http://185.84.140.118:8080/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the app with the environment variable explicitly set
RUN REACT_APP_API_URL=$REACT_APP_API_URL npm run build

# Production stage
FROM nginx:alpine

# Copy the build output
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a script to replace environment variables at runtime
RUN echo "window.REACT_APP_API_URL='$REACT_APP_API_URL';" > /usr/share/nginx/html/config.js

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]