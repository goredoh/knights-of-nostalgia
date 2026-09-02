# Dockerfile for api-server (monorepo-aware, multi-stage)
# Location: artifacts/api-server/Dockerfile

FROM node:20-bullseye AS builder
WORKDIR /workspace

# Install pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace files needed for install and build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY pnpm-workspace.yaml ./

# Copy source tree (we intentionally copy the whole repo to let pnpm resolve workspace deps)
COPY . ./

# Install all dependencies and build the api-server
RUN pnpm install --frozen-lockfile
RUN pnpm -F @workspace/api-server run build

# Production image
FROM node:20-bullseye-slim AS runtime
WORKDIR /app

# Only copy the built output
COPY --from=builder /workspace/artifacts/api-server/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

# Run the compiled ESM entrypoint
CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
