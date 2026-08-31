# This product (Event Model SaaS)

Load with `codebase-design`. Portable procedure is `SKILL.md` (spec-loop).

The Worker `fetch` (composition root) constructs the architecture adapters on the production path. Constructing them only behind a test flag is not a seam — it is a missing adapter.

Tests may inject a fake; production still constructs D1, Email, and R2 when the architecture names them. Injecting `env.documents` in a handler test is not proof `fetch` constructed `createR2Documents`.
