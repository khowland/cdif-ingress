# ==============================================================================
# @file Dockerfile
# @description Multi-stage build for deploying the React dashboard to Google Cloud Run.
# @author Mission Control Agent
# ==============================================================================

# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
# Copy package manifests for deterministic caching
COPY package*.json ./
RUN npm ci

# Copy project files and build
COPY . .
RUN npm run build

# Serve Stage
FROM nginx:alpine
# Copy compiled static assets to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Substitute the default conf to listen on the port injected by Cloud Run (default 8080)
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
