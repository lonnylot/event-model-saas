# Inspect get command

Status: released

## Problem

GET `/app/teams/{id}/models/{mid}` after two Commands, clicking `Place Order` (the first) shows Inspector Description `Cancel it` (the last Command) and does not show Field name `orderId`. Description and Field bind `commands.at(-1)`, so a member who reopens a model cannot inspect the first Command's Description or Field.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Command`, clicks the Timeline `Command` listitem, clicks `Add Field`, fills `Field name` with `orderId`, fills `Name` with `Place Order`, clicks `Add Command`, clicks the last Timeline `Command` listitem, fills `Name` with `Cancel Order`, fills `Description` with `Cancel it`, and Saves, a reload of that page, clicking the Timeline `Place Order` listitem shows the Inspector `Description` textbox whose value is the empty string
- [x] After a member creates a model, opens it, clicks `Add Command`, clicks the Timeline `Command` listitem, clicks `Add Field`, fills `Field name` with `orderId`, fills `Name` with `Place Order`, clicks `Add Command`, clicks the last Timeline `Command` listitem, fills `Name` with `Cancel Order`, fills `Description` with `Cancel it`, and Saves, a reload of that page, clicking the Timeline `Place Order` listitem shows Inspector `Field name` with the value `orderId`

## Domain terms

Event Model, Slice, Command, Field, Description, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — GET Command Description and Field bind by the clicked listitem
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Name of `Place Order` still opens Inspector Name ([inspect-after-reload.md](./inspect-after-reload.md)). GET Description of one Command stays [inspect-rest.md](./inspect-rest.md). In-session Command Description-by-id stays [name-binding-rest.md](./name-binding-rest.md). GET Description of the first of two Commands is this slice. Field name on the clicked Command of two in-session stays [inspect-fields-rest.md](./inspect-fields-rest.md). GET Field of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is this slice.
- Empty Description after reload is the Create default (no Description on `Place Order`). The last Command's Description `Cancel it` remaining on `Place Order` is leftover unused.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET Type of the first of two Slices stays [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices stays [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Description of the first of two Read Models is [inspect-get-read-model.md](./inspect-get-read-model.md). TIME click empty Inspector. GET Description of the first of two Actors is [inspect-get-actor.md](./inspect-get-actor.md). Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-rest.md](./inspect-rest.md) — GET Description of one Command still shows the saved value. GET Description of the first of two Commands is this slice. GET Field of one Command still shows the saved value. GET Field of the first of two Commands is this slice.
- [inspect-after-reload.md](./inspect-after-reload.md) — GET Name of `Place Order` still opens Inspector Name. GET Description of that listitem is this slice. GET Field of that listitem is this slice.
- [inspect-fields-rest.md](./inspect-fields-rest.md) — In-session Field name on the clicked Command of two stays that file. GET Field of the first of two Commands is this slice.
- [name-binding-rest.md](./name-binding-rest.md) — In-session Command Description-by-id stays that file. GET first-of-two Command Description is this slice.
- [editor-bind-split.md](./editor-bind-split.md) — `bindInspect` stays `public/editor-inspect.js`. GET Inspector for Command Description of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is this slice. GET Inspector for Command Field of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is this slice. GET Description of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Inspector for Event Description of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Inspector for Event Field of one Event stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is [inspect-get-read-model.md](./inspect-get-read-model.md). GET Description of the first of two Actors is [inspect-get-actor.md](./inspect-get-actor.md). GET Inspector for Read Model Description of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Inspector for Actor Description of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Inspector for Automation stays that file's Out of scope.
- [inspect-get-slice-description.md](./inspect-get-slice-description.md) — GET Command Description of the first of two Commands no longer stays that file's Out of scope. GET Description of the first of two Commands is this slice. GET Description of the first of two Slices stays that file.
- [inspect-get-slice-type.md](./inspect-get-slice-type.md) — GET Command Description of the first of two Commands no longer stays that file's Out of scope. GET Inspector for Command Description of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is this slice. GET Type of the first of two Slices stays that file.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. GET first-of-two Command Description is this slice. GET first-of-two Command Field is this slice.
- [editor-shell.md](./editor-shell.md) — Command Description after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is this slice. Command Field after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is this slice.
- [add-on-lane.md](./add-on-lane.md) — Command Description after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is this slice. Command Field after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is this slice.
- [blocks.md](./blocks.md) — Command Description after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is this slice. Command Field after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is this slice.
- [canvas.md](./canvas.md) — Command Description after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is this slice. Command Field after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is this slice.
- [chrome.md](./chrome.md) — Command Description after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is this slice. Command Field after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is this slice.
- [connection-feedback.md](./connection-feedback.md) — Command Description after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is this slice. Command Field after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is this slice.
- [connections.md](./connections.md) — Command Description after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is this slice. Command Field after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is this slice.
- [inspect-blocks.md](./inspect-blocks.md) — Command Description after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is this slice. Command Field after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is this slice.
- [inspect-connection.md](./inspect-connection.md) — Command Description after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is this slice. Command Field after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is this slice.
- [inspect-description.md](./inspect-description.md) — Command Description after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is this slice. Command Field after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is this slice.
- [inspect-fields.md](./inspect-fields.md) — Command Description after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is this slice. Command Field after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is this slice.
- [model-persistence.md](./model-persistence.md) — Command Description after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is this slice. Command Field after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is this slice.
- [slice-type.md](./slice-type.md) — Command Description after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is this slice. Command Field after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is this slice.
