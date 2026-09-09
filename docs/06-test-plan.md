# Test Plan & Coverage Thresholds

## Testing Strategy
- **Unit Tests**: Domain catalog queries, engine recommendation algorithms, cost calculation with custom overrides, redundancy detection matrix.
- **Component & Integration Tests**: Visual mapper component rendering, tool swapping interactions, cost view updates, shareable state export/import.
- **Coverage Target**: > 80% line coverage across `src/lib/` domain logic and core UI components.

## Test Suite Execution
Tests execute via `npx vitest run`.
