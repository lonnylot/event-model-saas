# Spec catalog

Source of truth for the product. Code implements these files. `AGENTS.md` and `.agents/skills/` say how to keep this tree current.

System specs (architecture, business, testing, design, observability) are optional. Add a row here when the product creates that file.

| Spec | Path | Status |
|------|------|--------|
| Architecture | [architecture.md](./architecture.md) | draft |
| Product | [product.md](./product.md) | draft |

Feature specs live in `features/`. Use [features/_TEMPLATE.md](./features/_TEMPLATE.md). List each feature here when created:

| Feature | Path | Status |
|---------|------|--------|
| Hosted app | [features/hosted-app.md](./features/hosted-app.md) | released |
| Magic-link auth | [features/magic-link-auth.md](./features/magic-link-auth.md) | released |
| Teams and invites | [features/teams-and-invites.md](./features/teams-and-invites.md) | released |

Status: `draft` → `validated` → `released`.
