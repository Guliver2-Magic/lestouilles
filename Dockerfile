# Multi-stage Dockerfile for Les Touillés Production Deployment
# Stage 1: Build the application
FROM node:22-alpine AS builder
# Install pnpm
RUN npm install -g pnpm
# Set working directory
WORKDIR /app
# Build arguments for Vite (needed at build time)
ARG VITE_APP_TITLE
ARG VITE_APP_LOGO
ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG VITE_OAUTH_PORTAL_URL
ARG VITE_APP_ID
ARG VITE_FRONTEND_FORGE_API_URL
ARG VITE_FRONTEND_FORGE_API_KEY
ARG VITE_ANALYTICS_ENDPOINT
ARG VITE_ANALYTICS_WEBSITE_ID
# Set them as environment variables for the build
ENV VITE_APP_TITLE=$VITE_APP_TITLE
ENV VITE_APP_LOGO=$VITE_APP_LOGO
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY
ENV VITE_OAUTH_PORTAL_URL=$VITE_OAUTH_PORTAL_URL
ENV VITE_APP_ID=$VITE_APP_ID
ENV VITE_FRONTEND_FORGE_API_URL=$VITE_FRONTEND_FORGE_API_URL
ENV VITE_FRONTEND_FORGE_API_KEY=$VITE_FRONTEND_FORGE_API_KEY
ENV VITE_ANALYTICS_ENDPOINT=$VITE_ANALYTICS_ENDPOINT
ENV VITE_ANALYTICS_WEBSITE_ID=$VITE_ANALYTICS_WEBSITE_ID
# Copy package files and patches
COPY package.json ./
COPY pnpm-lock.yaml* ./
COPY patches ./patches
# Install dependencies
RUN pnpm install --no-frozen-lockfile
# Copy source code
COPY . .
# Build the application
RUN pnpm run build
# Stage 2: Production image
FROM node:22-alpine AS runner
# Install pnpm
RUN npm install -g pnpm
# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
# Set working directory
WORKDIR /app
# Copy package files and patches
COPY package.json ./
COPY pnpm-lock.yaml* ./
COPY patches ./patches
# Install ALL dependencies
RUN pnpm install --no-frozen-lockfile
# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/server ./server
COPY --from=builder --chown=nodejs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nodejs:nodejs /app/shared ./shared
COPY --from=builder --chown=nodejs:nodejs /app/dist/public ./client/dist
COPY --from=builder --chown=nodejs:nodejs /app/vite.config.ts ./vite.config.ts
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
# Switch to non-root user
USER nodejs
# Expose port
EXPOSE 3000
# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
# Start the application
CMD ["node", "dist/index.js"]
