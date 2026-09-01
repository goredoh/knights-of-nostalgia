# 🏰 Knights of Nostalgia

A **community-driven nostalgia archive and wish fulfillment platform** with seamless web and mobile experiences. Built as a monorepo using TypeScript, React, and modern full-stack technologies.

## 🎯 About

Knights of Nostalgia is a platform where communities can preserve and celebrate nostalgic memories while fulfilling each other's wishes. Whether you're looking to reconnect with classic experiences or help others relive their favorite moments, this platform brings people together through shared nostalgia.

## ⚠️ Legal Disclaimer & User Responsibilities

**By using this platform to gather, share, or contribute media (photos, videos, or other content), you agree to the following:**

1. **Property Rights & Trespassing**: You are solely responsible for ensuring you have proper authorization before capturing media on any property. Do not enter private property, restricted areas, or locations without explicit permission from the owner or authorized representative. Trespassing is illegal and we do not condone such activity.

2. **Respect for Privacy & Locations**: When visiting nostalgic sites or properties, obtain all necessary permits and permissions. Respect "No Trespassing" signs, private boundaries, and local regulations. Damage to property, disturbance of residents, or unauthorized access is your responsibility.

3. **No Liability**: Knights of Nostalgia and its operators assume **no responsibility** for:
   - Any legal consequences resulting from users' failure to obtain proper permissions
   - Trespassing, property damage, or disturbances caused by users
   - Violations of local, state, or federal laws
   - Any civil or criminal liability arising from media collection activities

4. **Content Contributors**: You warrant that you own or have legal rights to all media you upload and share. You alone are responsible for ensuring compliance with copyright, privacy, and property laws.

5. **User Conduct**: By participating, you commit to:
   - Following all applicable laws and regulations
   - Respecting private property and local ordinances
   - Obtaining necessary permissions and permits
   - Acting ethically and responsibly in all activities

**Violation of these terms may result in immediate account suspension and removal of content.**

---

## 📦 Architecture

This is a **pnpm monorepo** containing multiple packages organized as follows:

- **`artifacts/`** - Deployable applications and services
  - `api-server` - Express.js backend API
  - `web` - Web frontend (React + Vite)
  - `mobile` - Mobile app (Expo)
- **`lib/`** - Shared libraries and utilities
  - Core business logic, database schemas, API contracts, and integrations
- **`scripts/`** - Utility scripts for development and deployment

## ⚡ Key Features

- **Full-stack TypeScript** - Type-safe end-to-end development
- **Monorepo Architecture** - Shared code, single workspace
- **Web + Mobile** - Single codebase serving web and native mobile
- **API-First Design** - RESTful backend with Zod validation
- **Drizzle ORM** - Type-safe database queries
- **Modern Tooling** - Vite, React 19, Tailwind CSS, Framer Motion

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun**
- **pnpm** package manager (required for this monorepo)

> ⚠️ This workspace **only accepts pnpm**. Using npm or yarn will be rejected by the preinstall script.

### Installation

```bash
# Clone the repository
git clone https://github.com/goredoh/knights-of-nostalgia.git
cd knights-of-nostalgia

# Install dependencies using pnpm
pnpm install
```

### Development

```bash
# Build all packages
pnpm build

# Type-check the entire workspace
pnpm typecheck

# Run a specific package
pnpm -F @workspace/api-server run dev

# Run the hello script example
pnpm -F @workspace/scripts run hello
```

### Project Structure

```
.
├── artifacts/              # Deployable apps and services
│   ├── api-server/        # Express backend
│   ├── web/               # React web app
│   └── mobile/            # Expo mobile app
├── lib/                    # Shared libraries
│   ├── api-zod/          # API validation schemas
│   ├── db/               # Database configuration
│   └── integrations/     # Third-party integrations
├── scripts/               # Development scripts
├── package.json           # Root workspace config
└── pnpm-workspace.yaml    # Monorepo configuration
```

## 📚 Usage Examples

### Starting the API Server

```bash
pnpm -F @workspace/api-server run dev
```

This starts the development server on the configured port with hot-reloading.

### Building for Production

```bash
pnpm build
```

Runs TypeScript compilation and builds all packages in the correct order.

### Running Scripts

```bash
pnpm -F @workspace/scripts run hello
```

## 🔒 Security Features

- **Supply-chain protection**: Minimum 1-day release age for npm packages (configurable exclusions for trusted vendors)
- **Type safety**: Full TypeScript coverage across the workspace
- **Validated APIs**: Zod schemas for all API contracts

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Express.js, Pino logging |
| **Database** | Drizzle ORM |
| **Validation** | Zod |
| **Mobile** | Expo, React Native |
| **Build** | ESBuild, TypeScript |
| **Package Manager** | pnpm |

## 📝 Available Scripts

### Root Commands

- `pnpm build` - Build all packages with type-checking
- `pnpm typecheck` - Type-check entire workspace
- `pnpm typecheck:libs` - Type-check libraries only

### Per-Package Commands

Run package-specific scripts with:
```bash
pnpm -F @workspace/PACKAGE_NAME run SCRIPT_NAME
```

## 🤝 Contributing

This project is community-driven. Contributions are welcome! Please ensure:

1. All TypeScript code is properly typed
2. Changes pass type-checking: `pnpm typecheck`
3. Code follows the project's style guide (enforced by Prettier)

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Resources

- [Monorepo Setup Documentation](./replit.md)
- Repository: https://github.com/goredoh/knights-of-nostalgia

---

Built with ❤️ by the Knights of Nostalgia community
