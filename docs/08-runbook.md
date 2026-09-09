# Runbook & Operations

## Local Development
1. `npm install`
2. `npm run dev` (Runs Next.js dev server on http://localhost:3000)

## Verification & Testing
1. `npm run lint` (Runs Biome check and format verification)
2. `npx tsc --noEmit` (TypeScript typecheck)
3. `npx vitest run` (Executes full test suite)
4. `./verify` (Runs the automated release gate)

## Deployment
1. Standard Next.js Vercel/Node deployment: `npm run build` followed by `npm run start`.
