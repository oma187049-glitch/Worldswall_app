# WorldWalls

A 4K wallpaper mobile app where users browse stunning photography from around the world, save wallpapers to their device, and set them as their background.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo (React Native) — `artifacts/worldwalls/`
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/worldwalls/` — Expo mobile app (WorldWalls)
- `artifacts/worldwalls/data/wallpapers.ts` — curated wallpaper catalog (Picsum-based)
- `artifacts/worldwalls/contexts/FavoritesContext.tsx` — favorites state with AsyncStorage
- `artifacts/worldwalls/contexts/AutoWallpaperContext.tsx` — auto-rotation settings
- `artifacts/worldwalls/constants/colors.ts` — dark theme design tokens
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)

## Architecture decisions

- Frontend-only Expo app using AsyncStorage for all local persistence (no backend needed for MVP)
- Wallpapers sourced from Picsum Photos (free, no API key needed) — curated 24 wallpapers across 6 world regions
- Dark theme (`userInterfaceStyle: "dark"`) — appropriate for a wallpaper browser
- "Set Wallpaper" uses expo-sharing so users can set via system share sheet; iOS must go through Photos
- Auto-wallpaper rotation is app-level (tracks state in AsyncStorage; no true background scheduling possible in Expo Go)

## Product

- Browse 24 curated 4K wallpapers from 6 world regions: Asia, Europe, Americas, Africa, Oceania, Arctic
- Filter by region with animated chip selector
- Full-screen wallpaper detail with Download, Set Wallpaper, and Favorite actions
- Favorites collection saved locally
- Auto-wallpaper rotation settings with daily/weekly/monthly intervals

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- expo-file-system, expo-media-library, expo-sharing must match Expo SDK 54 versions (~19.0.x, ~18.2.x, ~14.0.x)
- iOS cannot programmatically set wallpapers — users must go through Photos app via share sheet

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
