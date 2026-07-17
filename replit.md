# Knights of Nostalgia

A community for people who miss places, things, and moments they can no longer reach. Post a wish, and a local Knight captures photos, videos, and sound clips to bring it back. Every fulfilled wish becomes part of a living archive of neighborhood history.

## Run & Operate

- `pnpm --filter @workspace/mobile run dev` — run the Expo mobile app (use Expo Go on a device, or the web preview)
- `pnpm --filter @workspace/knights-web run dev` — run the companion marketing website
- `pnpm --filter @workspace/api-server run dev` — run the shared API server (currently just health check)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: `DATABASE_URL` — Postgres connection string (currently unused by the first mobile build)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo 54 + React Native 0.81, Expo Router, React Native Reanimated
- Website: React + Vite + Tailwind CSS 4 + shadcn/ui components
- Shared API: Express 5 + Drizzle ORM (ready for future backend features)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec) — not yet used for mobile features
- Build: esbuild for API, Vite for web

## Where things live

- Mobile app: `artifacts/mobile/`
  - Screens: `app/(tabs)/` (Feed, Explore, Quests, Notifications, Profile), `app/wish/[id].tsx`, `app/create.tsx`
  - Shared state: `context/AppContext.tsx` (AsyncStorage-persisted)
  - UI components: `components/` (Avatar, WishCard, FulfillmentCard, TagChip, EmptyState)
  - Theme: `constants/colors.ts`
- Website: `artifacts/knights-web/`
  - Landing page: `src/pages/home.tsx`
  - Theme: `src/index.css`
  - Public assets: `public/assets/`
- Shared API: `artifacts/api-server/`
- API spec: `lib/api-spec/openapi.yaml` (currently only health check)

## Architecture decisions

- Mobile app is frontend-only in the first build: data lives in React Context + AsyncStorage. This lets the app feel complete immediately without needing a backend.
- Website is a companion landing page rather than a fully functional web app, so the first mobile build can ship quickly while the brand still has a public presence.
- Colors and brand identity are shared across mobile and web: deep midnight blue (`#0D0F1A`), warm torch gold (`#C9972A`), off-white (`#F0EDE6`), and dark card surfaces (`#161829`).

## Product

- **Wishes** — Users post what they miss, with a location, tags, and an optional tip.
- **Knights** — Users can switch to Knight mode and fulfill open wishes with photos, videos, and captions.
- **Community** — Comments and likes on fulfillments help people reconnect over shared memories.
- **Archive** — Explore and search wishes by place, era, and theme; every fulfillment adds to a historical record.
- **Profile** — Track points, wishes, and fulfillments; toggle between Wisher, Knight, or Both.

## User preferences

- Brand identity: cinematic, nostalgic, noble. Use gold accents like a lantern in the dark, not bright corporate highlights.
- No emojis in the UI; use icons and subtle color.

## Gotchas

- Mobile must be served by the managed Expo workflow; do not run `npx expo start` directly.
- Web public assets must reference `import.meta.env.BASE_URL` because the site is served under `/knights-web/`.
- After changing `lib/api-spec/openapi.yaml`, run `pnpm --filter @workspace/api-spec run codegen` and update both mobile and web clients.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
- See the `expo` skill for mobile app patterns and device permissions.
- See the `react-vite` skill for web frontend patterns.
