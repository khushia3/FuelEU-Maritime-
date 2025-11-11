# REFLECTION.md

Decisions made:
- In-memory backend to simplify demonstration and allow immediate testing.
- Hexagonal layout folders present; core has pure logic.
- Frontend uses simple fetches to backend and demonstrates all 4 tabs.
- Greedy pool algorithm implemented in backend adapters/pools.ts.
Limitations:
- No real DB (Postgres) in this scaffold — replace in adapters/outbound with Prisma + Postgres for production.
- Tests are not fully implemented (placeholders for unit tests in next iteration).
