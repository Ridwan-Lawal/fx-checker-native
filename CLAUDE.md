# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

This project uses **pnpm** (the Husky pre-commit hook calls `pnpm`/`pnpx` — do not use npm/yarn).

- `pnpm start` — start the Expo dev server (Metro)
- `pnpm android` / `pnpm ios` / `pnpm web` — start on a specific platform
- `pnpm lint` — run ESLint via `expo lint` (config: `eslint-config-expo`)
- `pnpx tsc --noEmit` — typecheck (TypeScript `strict` mode is on)

There is no test runner configured yet. Note the `.husky/pre-commit` hook runs `pnpm test`, `pnpx lint-staged`, and `pnpx tsc --noEmit` — the `pnpm test` line currently has no matching script, so add a `test` script before relying on the hook. `lint-staged` runs `eslint --fix` + `prettier --write` on staged JS/TS and `prettier --write` on JSON/MD.

## Architecture

Expo SDK 54 app (React Native 0.81, React 19.1) using **expo-router** (file-based routing) with the New Architecture, React Compiler, and typed routes all enabled (`app.json` `experiments` / `newArchEnabled`).

- **Routing is the file tree under `app/`.** `app/_layout.tsx` is the root `Stack` (headers hidden); `app/(tabs)/_layout.tsx` defines the five bottom tabs, each a file in `app/(tabs)/`: `index` (Convert), `compare`, `markets`, `faves` (Favourites), `log` (History). `app/+not-found.tsx` is the 404 route. Routes are typed — `expo-router` generates types in `.expo/types`.
- **Fonts load globally in the root layout.** `app/_layout.tsx` holds the splash screen via `SplashScreen.preventAutoHideAsync()` until JetBrains Mono (4 weights) finishes loading, then renders. The app is built around this monospace typeface.
- **Design system lives in `styles/tokens.ts`** — exported `const` objects for `colors` (a dark neutral palette plus lime/green/red accents), `fontSizes`, `lineHeight`, `letterSpacing`, `spacing`, and `radius`. Use these tokens rather than hardcoding values. `styles/global.css` exists but is currently empty.

### State of the codebase

This is an early-stage rebuild: the default Expo starter template was stripped out (its `components/`, `hooks/`, `constants/`, `app/modal.tsx`, and `app/(tabs)/explore.tsx` were deleted) in favor of a custom design system. The five tab screens are currently stubs (a `SafeAreaView` + placeholder `Text`) waiting to be built out into the FX-checker UI.

## Conventions

- **Path aliases** (`tsconfig.json`): `@/*` (repo root), `@/components/*`, `@/hooks/*`, `@/assets/*`.
- **Prettier** is configured with `prettier-plugin-organize-imports` and `prettier-plugin-tailwindcss` (`.prettierrc`).
- Per `AGENTS.md`, consult the versioned Expo docs at https://docs.expo.dev/versions/v54.0.0/ before writing Expo code — APIs differ from older SDKs.
