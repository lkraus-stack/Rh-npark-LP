# Migration Notes

## Task 0.1

- Converted the standalone root Vite app into a pnpm workspace managed by Turborepo.
- Moved the Rhön Park Luxury Line app into `apps/rhoenpark-luxury/`.
- Renamed the app package to `@franco/rhoenpark-luxury`.
- Replaced npm lockfile usage with `pnpm-lock.yaml`.
- Kept the existing React source, CSS, copy, image URLs, and Vite entry path unchanged.
- Added root TypeScript, ESLint, Prettier, and Turbo configuration for future packages and apps.
