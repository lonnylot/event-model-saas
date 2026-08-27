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
- Edit: in-memory document, dirty flag. Undo of New Slice and of Command → Event is [features/canvas.md](./features/canvas.md). Undo of move, delete, and Add stays later. Nothing is written until Save.
- Save: `PUT` with `{ version, document }`. If D1 version matches: validate schema, write R2 current object, increment version, return the new version. If not: **409** with the current version; client keeps local edits until the person reloads (discarding them) or copies them aside. A failed R2 or D1 write does not increment version.
- Export: download the current R2 JSON as `{title}.eventmodel`.
- R2 key for the current body: `models/{id}.eventmodel`. No `models/{id}/v/{n}` objects in v1.

Two people (or two tabs) on the same model take turns via the version check. There is no lock, presence, or live overlay.

## Editor (Mac parity)

Port the Mac `DocumentEditorView` structure: **slice sidebar | timeline canvas**, plus **inspector**.

Must match the Mac app’s editing behavior:

- New Slice (⇧⌘N / toolbar)
- Add actors, commands, events, read models, automations (toolbar, dashed Add on a lane, keyboard equivalents of ⌥⌘1–5). Click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane`, and selected-Slice targeting for ⌥⌘1 / ⌥⌘3–5, stay later
- Inspect a Slice, Actor, Command, Event, Read Model, or Automation; edit Name. Description, Fields, and Slice type picker stay later
- Move slices (⌥⌘←). ⌥⌘→ and sidebar drag-reorder stay later
- Drag Actor between slices on the same lane. Drag of Command / Event / Read Model / Automation between slices stays later
- Connect by dragging a **Port** (command → event, event → read model). Highlighting legal targets, snap-back, reason on the source, and Event → Command are [features/connection-feedback.md](./features/connection-feedback.md). Other illegal pairs stay later
- Delete the selected Slice (Backspace/Delete). Delete of a block or Connection stays later
- Zoom / pan (toolbar zoom, scroll to pan, pinch zoom). Pinch pan and ⌘+/⌘-/⌘0 stay later
- Undo New Slice and undo Command → Event. Undo of move, delete, and Add stays later

Mac-only chrome is not ported: `NSDocument`, native menus as macOS menus, AppKit welcome window. The web shell is: team name, model title, dirty indicator, Save, Export, sign out.

The JSON Schema stays `format: "eventmodel"`, `schemaVersion: 1`, compatible with the Mac app. The schema file is copied into this repo when persistence is implemented; it does not diverge without a spec change.

## Error handling

| Case | Behavior |
|------|----------|
| Unknown email at login | Same success copy as a valid request. Site admin emailed. Rate limited. |
| Expired / used magic link | Message + path to request a new link. No session. |
| Session missing / expired | Login page. In-memory editor state is lost (warn if dirty before navigating away; not across a dead session). |
| Save version mismatch | 409. Keep local edits. Person must reload to get the latest, which discards local, or copy local aside. |
| Illegal connection | Command → Read Model: no edge; the Command listitem shows `A command can't write a read model.` Event → Command: no edge; the Event Happened listitem shows `An event can't trigger a command.` Other illegal pairs stay later. Highlighting legal targets and snap-back are [features/connection-feedback.md](./features/connection-feedback.md). Undo of a Connection is [features/canvas.md](./features/canvas.md). |
| Import invalid JSON / schema | Reject; no D1 row; no R2 object. |
| Not a team member | 404 on model routes. |
| Write failure (R2 or D1) | 500. Version unchanged. Client keeps dirty document and may retry Save. |

## Testing

- **Unit** at the document module: schema validation, legal edges, mutations (add slice and blocks). This is the web counterpart of `EventModelTests`. Move Slice, drag Actor between Slices, and delete Slice are Playwright in [features/canvas.md](./features/canvas.md).
- **Unit** at API seams with fake D1, R2, and email: invite-only gate, `SITE_ADMIN_EMAIL` bootstrap, unknown-email notify, magic-link consume, version match vs 409, failed write does not bump version.
- **Playwright**: request login (test email adapter, never live mail), land on the team page model list, open the Event Model, New Slice, click New Slice, fill Name with Checkout, Save, reload still lists Checkout, Add Command, click Command, fill Name with Place Order, Save, reload still lists Place Order, Add Event, drag Command port onto Event Happened port, Save, reload still shows `Command → Event Happened`, second session Save → 409 UI, two New Slice then ⌥⌘← reorders, drag Actor onto the first Slice, Backspace deletes the first Slice, scroll pans, ⌘Z undoes New Slice and undoes Command → Event, ctrl+wheel on Timeline sets a `scale(` whose factor is not the unzoomed pan `1`, `Add Command on lane` on the first of two Slices, ⌥⌘2 adds a Command. Playwright `workers` is `1` because the `TEST_MAIL` memory adapter is process-global. Highlighting legal targets, snap-back, reason on the source, and Event → Command are [features/connection-feedback.md](./features/connection-feedback.md). Pinch pan, ⌥⌘→, sidebar drag-reorder, click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane`, selected-Slice keys other than ⌥⌘2, other illegal pairs, Description, Fields, and Slice type picker stay later.
