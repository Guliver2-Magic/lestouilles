# Multi-stage Dockerfile for Les Touillés Production Deployment

# Stage 1: Build the application
FROM node:22-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files and patches
COPY package.json ./
COPY pnpm-lock.yaml* ./
COPY patches ./patches

# Install dependencies (use --no-frozen-lockfile if pnpm-lock.yaml is missing)
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

# Install ALL dependencies (vite is needed at runtime)
RUN pnpm install --no-frozen-lockfile

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/server ./server
COPY --from=builder --chown=nodejs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nodejs:nodejs /app/shared ./shared
COPY --from=builder --chown=nodejs:nodejs /app/client/dist ./client/dist

# Copy vite config (required by server)
COPY --from=builder --chown=nodejs:nodejs /app/vite.config.ts ./vite.config.ts

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server/_core/index.js"]
