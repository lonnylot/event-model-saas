# Model inspector

Status: validated

## Problem

The editor heading shows the Event Model title, but clicking it does not open Inspector for the document, so Mac Model Info (title and Description on the Event Model itself) has no web counterpart.

## Acceptance criteria

- [x] GET `/app/teams/{id}/models/{mid}` as a member, clicking the heading whose accessible name is `Untitled` shows a textbox whose accessible name is `Name` in the Inspector region
- [x] GET `/app/teams/{id}/models/{mid}` as a member, clicking the heading whose accessible name is `Untitled` shows that `Name` textbox with the value `Untitled`
- [x] Filling the Inspector `Name` textbox with `Library Checkout` after clicking the `Untitled` heading sets the Event Model `title` to `Library Checkout`
- [ ] Filling the Inspector `Name` textbox with `Library Checkout` after clicking the `Untitled` heading shows a heading whose accessible name is `Library Checkout`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member, clicking the heading whose accessible name is `Untitled` shows a textbox whose accessible name is `Description` in the Inspector region
- [ ] Filling the Inspector `Description` textbox with `Library checkout blueprint` after clicking the `Untitled` heading sets the Event Model `description` to `Library checkout blueprint`
- [x] After a member creates a model, opens it, clicks the `Untitled` heading, fills `Name` with `Library Checkout`, and Saves, a reload of that page sets the Event Model `title` to `Library Checkout`
- [ ] After a member creates a model, opens it, clicks the `Untitled` heading, fills `Description` with `Library checkout blueprint`, and Saves, a reload of that page sets the Event Model `description` to `Library checkout blueprint`

## Domain terms

Event Model, Description, Team, Person, Version

## Seams

- `document` module — set Event Model `title` and `description` on an in-memory Event Model; the editor click and fill path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- The page heading is the Event Model `title` (create still uses `Untitled`). Clicking that heading selects the Event Model, not a Slice.
- Inspector `Name` is one control. Selecting a Slice after the Event Model updates that `Name` to the Slice title ([chrome.md](./chrome.md)).
- Description on the Event Model is this slice. Description on Slice / Actor / blocks is [inspect-description.md](./inspect-description.md) when that spec is present; until it is released those words stay later.
- Title and Description edits are in-memory until Save. Save still uses the version check from model-persistence. Reload proof reads `#event-model-document`.
- Mac ⇧⌘I Model Info is not ported as a menu. Clicking the heading is the web path.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

⇧⌘I, Slice / Actor / block Description, Fields, Slice type picker, inspecting a Connection, inspect after reload of the heading, Actor Name Unsaved changes, dashed Add on a lane, keyboard shortcuts, Mac window chrome.

## Restates

- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns model-level Title; this slice owns Event Model title and Description. Slice / block Description stays later unless [inspect-description.md](./inspect-description.md) is present.
- [chrome.md](./chrome.md) — Out of scope no longer owns model-level Title; this slice owns those.
- [product.md](../product.md) — The web shell model title is selectable; Inspector edits Event Model `title` and `description`. Playwright path for this slice adds: click Untitled, fill Name with Library Checkout, fill Description with Library checkout blueprint, Save, reload JSON title and description match.
