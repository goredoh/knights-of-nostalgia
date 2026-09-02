# Multi-stage Dockerfile for knights-web (Vite static site)
FROM node:20-bullseye AS builder
WORKDIR /workspace

# Enable corepack/pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace manifests
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# Copy full repo so pnpm can resolve workspace packages
COPY . ./

# Install deps and build the knights-web package
RUN pnpm install --frozen-lockfile
RUN pnpm -F @workspace/knights-web run build

# Production image: serve static files with nginx
FROM nginx:stable-alpine AS runtime
COPY --from=builder /workspace/artifacts/knights-web/dist /usr/share/nginx/html

# Optional: copy a custom nginx.conf if you need rewrites or SPA fallback
# COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
