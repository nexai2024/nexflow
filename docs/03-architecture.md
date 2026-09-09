# Architecture Specification

## Stack Architecture (Pinned Versions)
- **Framework**: Next.js 16.0.1 (App Router)
- **UI Library**: React 19.2.0, React DOM 19.2.0
- **Styling & Components**: Tailwind CSS 4, Radix UI primitives, Lucide React 0.552.0, Class Variance Authority
- **State & Domain Logic**: TypeScript 5, Zod 3.25.76
- **Test Framework**: Vitest 3.x, React Testing Library, jsdom
- **Linter & Formatter**: Biome 2.2.0

## Directory & File Layout
```
/src
  /app
    layout.tsx
    page.tsx
    globals.css
  /components
    /ui/ (shadcn radix primitives)
    workflow-builder.tsx
    visual-mapper.tsx
    cost-calculator-view.tsx
    redundancy-alert.tsx
    stack-export-modal.tsx
    presets-library.tsx
  /lib
    types.ts
    catalog.ts
    engine.ts
    cost-calculator.ts
    redundancy.ts
    export.ts
    utils.ts
/tests
  catalog.test.ts
  engine.test.ts
  visual-mapper.test.tsx
  cost-calculator.test.ts
  app.test.tsx
```

## System Data Flow & State Management
1. **Catalog Domain Knowledge Base**: Pre-seeded rich database of software tools (names, categories, pricing, common integrations, capability flags, tags).
2. **Recommendation Engine**: Takes user goal + existing tools list -> filters/scores compatible tools -> builds ordered multi-step workflow.
3. **Redundancy Analysis Engine**: Compares existing tool capability categories against recommended tools -> identifies functional overlaps and cost savings.
4. **Cost Engine**: Computes monthly/annual per-tool and aggregate costs with custom pricing overrides.
5. **Client Export & State Serialization**: Serializes workflow stack to JSON or base64 URL parameter for instant sharing.

## Concurrency & Transaction Strategy (LAW 29)
State is deterministic and client-side reactive with immutable state transitions. State updates (tool swaps, price overrides, custom step additions) follow predictable functional reducer patterns preventing race conditions.
