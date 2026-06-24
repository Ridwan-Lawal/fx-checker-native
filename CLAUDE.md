# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

This project uses **pnpm** (the Husky pre-commit hook calls `pnpm` — do not use npm/yarn).

- `pnpm start` — start the Expo dev server (Metro)
- `pnpm android` / `pnpm ios` / `pnpm web` — start on a specific platform
- `pnpm lint` — run ESLint via `expo lint` (`eslint-config-expo/flat`)
- `pnpm type-check` — typecheck via `tsc --noEmit` (TypeScript `strict` mode is on)

There is no test runner configured. The `.husky/pre-commit` hook runs **only** `pnpm type-check`, so a commit fails on type errors but nothing else — run `pnpm lint` yourself. `package.json` still defines a `lint-staged` block (prettier `--write` on staged JS/TS/JSON/MD), but the pre-commit hook does not currently invoke it.

## Architecture

Expo SDK 54 app (React Native 0.81, React 19.1) using **expo-router** (file-based routing) with the New Architecture, React Compiler, and typed routes all enabled (`app.json` `experiments` / `newArchEnabled`).

### Routing & root layout

- **Routing is the file tree under `app/`.** `app/(tabs)/_layout.tsx` defines five bottom tabs, each a file in `app/(tabs)/`: `index` (Convert), `compare`, `markets`, `faves` (Favourites), `log` (History). `app/+not-found.tsx` is the 404 route. Routes are typed — `expo-router` generates types in `.expo/types`.
- **`app/_layout.tsx` is the root `Stack`** (headers hidden) and the provider stack. Outer-to-inner: `GestureHandlerRootView` → `QueryClientProvider` (TanStack Query) → `BottomSheetModalProvider` (`@gorhom/bottom-sheet`) → `Stack`. It also loads **JetBrains Mono** (5 weights) and holds the splash screen via `SplashScreen.preventAutoHideAsync()` until fonts finish. The app is built around this monospace typeface.

### Data layer (server state)

The app fetches FX data from a **Frankfurter-style rates API**. The base URL comes from `EXPO_PUBLIC_API_URL` (`.env`); do not hardcode it.

- **`lib/axios.ts`** exports a single configured `api` axios instance.
- **`lib/services/`** holds the raw fetch functions: `rates.ts` (`getCurrencyRate`, `getCurrencyRatesPerBaseCurrency`, `getTimeSeriesRates`, `getMarketTimeSeries`) and `currencies.ts` (`getCurrencies`). Endpoints follow Frankfurter conventions: `/latest` with `base`/`symbols` params for spot rates, and `/{start}..{end}` (e.g. `/2024-01-01..2024-01-07`) for historical time series. Default base is EUR. Each service catches errors, calls the `devLog` helper (logs only when `__DEV__`), and re-throws a user-facing `Error`.
- **`hooks/`** wraps the services in TanStack Query: `useRates.ts` (`useGetRate`, `useGetRatesPerBaseCurrency`, `useGetTimeSeriesRates`, `useGetMarketRates`) and `useCurrency.ts` (`useGetCurrencies`). Convention: `staleTime` of one hour (`1000 * 60 * 60`), `enabled` guards on required params, and destructured returns renamed per-hook (e.g. `isFetchingRate`). Components consume these hooks, not the services directly.

### Client/persisted state

- **`store/`** holds Zustand stores persisted to `AsyncStorage` via the `persist` middleware: `useFaves.ts` (favourite currency pairs; `addFave` toggles add/remove) and `useLogStore.ts` (conversion history). Stores log their state in `__DEV__`.

### UI building blocks

- **`components/`** — reusable pieces: `Header`, `ConversionBlock`, `ConversionKeypad` (custom numeric keypad with `expo-haptics` feedback), `CurrencySheet` (bottom-sheet currency picker), `FXMarquee` (scrolling rates ticker via `@animatereactnative/marquee`), `AnimatedPressable` (Reanimated press feedback), and `ErrorState`.
- **Charts** use `react-native-wagmi-charts`; time-series API data is mapped to the `ChartPoint` (`{ timestamp, value }`) shape via helpers in `utils/chart.ts`.
- **`utils/`** — shared helpers and the central type file: `types.ts` (all shared types/interfaces — `RateType`, `TimeSeriesRateType`, `ChartPoint`, `Fave`, `Log`, etc.), `chart.ts` (`getDateRange`, chart mapping), `marquee.ts` (`toMarqueeItems`), `flags.ts`, and **`contants.ts`** (note the misspelled filename — `MARQUEE_BASE`, `MARQUEE_SYMBOLS`).

### Design system

- **`styles/tokens.ts`** — exported `const` objects for `colors` (a dark neutral palette plus lime/green/red accents), `fontSizes`, `lineHeight`, `letterSpacing`, `spacing`, and `radius`. Use these tokens rather than hardcoding values. `styles/global.css` exists but is currently empty.

## Conventions

- **Path aliases** (`tsconfig.json`): `@/*` (repo root), `@/assets/*`, `@/components/*`, `@/hooks/*`. Other dirs (`lib`, `store`, `utils`, `styles`) are imported via the root `@/*` alias (e.g. `@/lib/axios`, `@/utils/types`).
- Centralize shared types in `utils/types.ts`; keep API calls in `lib/services/` and expose them to UI through `hooks/`.
- Per `AGENTS.md`, consult the versioned Expo docs at https://docs.expo.dev/versions/v54.0.0/ before writing Expo code — APIs differ from older SDKs.
