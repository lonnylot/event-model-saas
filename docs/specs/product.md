# Event Model SaaS — product design

Status: draft

Locked v1 decisions and spec slices. Living stack/module facts belong in `docs/specs/architecture.md`. Feature work is split into the spec slices listed below; each slice gets its own `docs/specs/features/<slug>.md` and is implemented with `releasing-a-spec`.

## Problem

The Mac app is local-only: one person, one `.eventmodel` file, no accounts. Teams that event-model together currently pass files around. This product is the same Event Modeling canvas, hosted, with sign-in, teams, and turn-taking saves so more than one person can work on one model without silently overwriting each other.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Host | Cloudflare Worker + static assets at **event-model.lonnylot.com** |
| Metadata | **D1** (people, sessions, teams, memberships, invites, event-model rows) |
| Document body | **R2** — current `.eventmodel` JSON only; no version history |
| Auth | Invite-only. Magic link by email. `SITE_ADMIN_EMAIL` is the one exception (may sign in without an invite and becomes site admin). |
| Unknown login | Requester always sees the same “if you have access, check your inbox” copy. Site admin is emailed that address so they can invite. |
| Teams | Site admin creates teams and sends invites. Invited people cannot create teams. Everyone on a team may edit every Event Model on that team. No per-model ACLs. |
| Save conflicts | Optimistic **version check**. Explicit Save (⌘S), not autosave. Mismatch → 409; local edits kept until reload or discard. |
| Editor | **Full Mac parity** of editing behavior (not Mac window chrome). Same `.eventmodel` schema as the Mac app. Custom canvas, not a node-graph library. |
| Collab that is out | Live cursors, CRDTs, checkout locks, last-save-wins without a version check |
| Product that is out | Public signup, billing, user-created teams, per-model permissions, document history/restore |

## People, teams, models

- A **Person** is someone who can sign in. They are not an Actor (an Actor is a block on the canvas).
- A **Team** is created only by the site admin. An Event Model belongs to exactly one Team.
- A Person may belong to more than one Team (each invite adds a membership).
- **Site admin** is the Person whose email matches `SITE_ADMIN_EMAIL` (initially `lonny@lonnylot.com`). They create teams and invite emails onto a team.
- An **Invite** names a team and an email. If that Person does not exist yet, the invite creates them. The invite email contains a magic link (same one-time token as login). If they ignore it, they can still request a login later because the Person now exists. Membership is team-wide: any member may create, open, save, import, and export that team’s Event Models.
- There is no viewer role in v1.

## Sign-in flow

1. Login page: email field only.
2. If the email is `SITE_ADMIN_EMAIL` or belongs to an invited Person, send a one-time magic link (TTL 15 minutes, single use).
3. If the email is unknown: do **not** send a login link. Still show the same success copy. Email the site admin: `{address} tried to sign in and has no account`.
4. Rate limit: 5 login submissions per email per hour, and 20 per client IP per hour. Over limit: same success copy, no extra mail.
5. Consuming a valid link sets an httpOnly, Secure, SameSite=Lax session cookie (7 days). Invalid or used link: heading “This link is expired or already used.”
6. After login: if the Person has one team, open that team’s page. If several, show a team picker. Site admin with no teams creates a Team on `/app`. Site admin also sees a Teams admin screen (invite).

Outbound mail uses Cloudflare Email. Login links come from `auth@event-model.lonnylot.com`. Admin notifications go to `SITE_ADMIN_EMAIL`.

## Document flow

- Create: empty Event Model (valid schema, no slices) on the current team, then open the editor.
- Import: upload `.eventmodel` JSON; reject if it fails the schema; store the body in R2; metadata in D1 at version 1.
- Open: member-only. Non-members receive **404** (no existence leak). Body is the current R2 object.
- Edit: in-memory document, Mac-like undo, dirty flag. Nothing is written until Save.
- Save: `PUT` with `{ version, document }`. If D1 version matches: validate schema, write R2 current object, increment version, return the new version. If not: **409** with the current version; client keeps local edits until the person reloads (discarding them) or copies them aside. A failed R2 or D1 write does not increment version.
- Export: download the current R2 JSON as `{title}.eventmodel`.
- R2 key for the current body: `models/{id}.eventmodel`. No `models/{id}/v/{n}` objects in v1.

Two people (or two tabs) on the same model take turns via the version check. There is no lock, presence, or live overlay.

## Editor (Mac parity)

Port the Mac `DocumentEditorView` structure: **slice sidebar | timeline canvas**, plus **inspector**.

Must match the Mac app’s editing behavior:

- New Slice (⇧⌘N / toolbar)
- Add actors, commands, events, read models, automations (toolbar, dashed Add on a lane, keyboard equivalents of ⌥⌘1–5)
- Inspect a slice or block; edit name, description, and fields
- Move slices (sidebar or canvas; ⌥⌘← / ⌥⌘→)
- Drag blocks between slices on the same lane
- Connect by dragging a **Port**; legal targets highlight; illegal drop snaps back and shows the reason on the source (command → event, event → read model only)
- Delete selection (Backspace/Delete)
- Zoom / pan (pinch, ⌘+/⌘-/⌘0, toolbar zoom, scroll to pan)
- Undo structural edits, including connections

Mac-only chrome is not ported: `NSDocument`, native menus as macOS menus, AppKit welcome window. The web shell is: team name, model title, dirty indicator, Save, Export, sign out.

The JSON Schema stays `format: "eventmodel"`, `schemaVersion: 1`, compatible with the Mac app. The schema file is copied into this repo when persistence is implemented; it does not diverge without a spec change.

## Error handling

| Case | Behavior |
|------|----------|
| Unknown email at login | Same success copy as a valid request. Site admin emailed. Rate limited. |
| Expired / used magic link | Message + path to request a new link. No session. |
| Session missing / expired | Login page. In-memory editor state is lost (warn if dirty before navigating away; not across a dead session). |
| Save version mismatch | 409. Keep local edits. Person must reload to get the latest, which discards local, or copy local aside. |
| Illegal connection | No edge created. Reason on the source. Undo stack unchanged except the failed gesture does not commit. |
| Import invalid JSON / schema | Reject; no D1 row; no R2 object. |
| Not a team member | 404 on model routes. |
| Write failure (R2 or D1) | 500. Version unchanged. Client keeps dirty document and may retry Save. |

## Testing

- **Unit** at the document module: schema validation, legal edges, mutations (add/move/delete slice and blocks). This is the web counterpart of `EventModelTests`.
- **Unit** at API seams with fake D1, R2, and email: invite-only gate, `SITE_ADMIN_EMAIL` bootstrap, unknown-email notify, magic-link consume, version match vs 409, failed write does not bump version.
- **Playwright**: request login (test email adapter, never live mail), land on that Team's page, open editor, add a slice, Save, second session Save → 409 UI.
- **CI**: GitHub Actions on pull request and on `main` — typecheck, unit, e2e. Wrangler/Miniflare for the Worker. No live Cloudflare and no live inbox in CI.

## Spec slices (implementation order)

Each slice is its own feature spec, branch, and PR. Do not implement a later slice on an earlier branch.

1. **hosted-app** — Worker, static assets, `event-model.lonnylot.com`, CI. A reachable login (or placeholder) page. **released**
2. **magic-link-auth** — People, sessions, magic links, unknown-email notify, `SITE_ADMIN_EMAIL` bootstrap, rate limits. **released**
3. **teams-and-invites** — Site admin creates teams, invites emails, membership, team picker / empty team page. **released**
4. **model-persistence** — Create / list / open / import / export / versioned Save. R2 current JSON + D1 metadata. Thin open/save UI is enough; the full canvas is the next slices.
5. **editor-shell** — Sidebar \| canvas \| inspector, empty timeline, New Slice.
6. **editor-blocks** — Add/edit/delete actors, commands, events, read models, automations, fields.
7. **editor-connections** — Port drag, legal edges, snap-back, refusal reason.
8. **editor-chrome** — Undo, zoom/pan, move slices and blocks, remaining keyboard shortcuts, dirty/Save/Export in the web shell.

Next slice: **model-persistence** via `releasing-a-spec`.

## Architecture sketch

```
Browser SPA  --HTTPS-->  Worker (event-model-saas)
                           |-- static assets (SPA)
                           |-- /api/*  (auth, teams, models)
                           |-- D1      (metadata + version)
                           |-- R2      (models/{id}.eventmodel)
                           |-- Email   (magic link, invite, unknown-login notify)
```

Custom domain route: `event-model.lonnylot.com` on zone `lonnylot.com` (same Cloudflare account as fdfl.ai). Session cookie is first-party on that host.

## Open questions

None that block magic-link-auth. Feature specs pin copy, exact API paths, and UI labels when those slices are written.
