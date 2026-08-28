# Model inspector

Status: released

## Problem

Clicking the editor heading does not open Inspector for the Event Model, so Mac Model Info (title and Description on the Event Model itself) has no web counterpart.

## Acceptance criteria

- [x] GET `/app/teams/{id}/models/{mid}` as a member, clicking the heading whose accessible name is `Untitled` shows a textbox whose accessible name is `Name` in the Inspector region
- [x] GET `/app/teams/{id}/models/{mid}` as a member, clicking the heading whose accessible name is `Untitled` shows that `Name` textbox with the value `Untitled`
- [x] Filling the Inspector `Name` textbox with `Library Checkout` after clicking the `Untitled` heading sets the Event Model `title` to `Library Checkout`
- [x] Filling the Inspector `Name` textbox with `Library Checkout` after clicking the `Untitled` heading shows a heading whose accessible name is `Library Checkout`
- [x] GET `/app/teams/{id}/models/{mid}` as a member, clicking the heading whose accessible name is `Untitled` shows a textbox whose accessible name is `Description` in the Inspector region
- [x] Filling the Inspector `Description` textbox with `Library checkout blueprint` after clicking the `Untitled` heading sets the Event Model `description` to `Library checkout blueprint`
- [x] After a member creates a model, opens it, clicks the `Untitled` heading, fills `Name` with `Library Checkout`, and Saves, a reload of that page sets `#event-model-document` `title` to `Library Checkout`
- [x] After a member creates a model, opens it, clicks the `Untitled` heading, fills `Description` with `Library checkout blueprint`, and Saves, a reload of that page sets the Event Model `description` to `Library checkout blueprint`

## Domain terms

Event Model, Description, Team, Person, Version

## Seams

- `document` module — set Event Model `title` and `description` on an in-memory Event Model; the editor click and fill path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- In-session, the page heading is the Event Model `title` (create still uses `Untitled`). Clicking that heading selects the Event Model, not a Slice.
- Inspector `Name` is one control. Selecting a Slice after the Event Model updates that `Name` to the Slice title ([chrome.md](./chrome.md)).
- Description on the Event Model is this slice. Description on Slice / Actor / blocks is [inspect-description.md](./inspect-description.md).
- Title and Description edits are in-memory until Save. Save still uses the version check from model-persistence. Reload proof reads `#event-model-document`.
- Mac ⇧⌘I Model Info is not ported as a menu. Clicking the heading is the web path.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

⇧⌘I, last-item Slice / Actor / block Description is [inspect-description.md](./inspect-description.md). Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are [name-binding-rest.md](./name-binding-rest.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). Inspecting a Connection is [inspect-connection.md](./inspect-connection.md). Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). ⇧⌘N is [new-slice-shortcut.md](./new-slice-shortcut.md). Mac window chrome. Actor Name Unsaved changes is [name-binding.md](./name-binding.md). Name inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md). Heading Name after reload and GET heading after JSON `title` change (the Event Model `title` on the model-page heading) are [inspect-rest.md](./inspect-rest.md). Team-list and Export filename stay the D1 create title until later.

## Restates

- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns model-level Title; this slice owns Event Model title and Description. Slice / Actor / block Description is [inspect-description.md](./inspect-description.md).
- [chrome.md](./chrome.md) — Out of scope no longer owns model-level Title; this slice owns those.
- [inspect-description.md](./inspect-description.md) — Out of scope no longer owns model-level Title or model-level Description; this slice owns those. Slice / Actor / block Description stays that slice.
- [inspect-fields.md](./inspect-fields.md) — Out of scope no longer owns model-level Title; this slice owns Event Model title and Description.
- [slice-type.md](./slice-type.md) — Out of scope no longer owns model-level Title; this slice owns Event Model title and Description.
- [inspect-after-reload.md](./inspect-after-reload.md) — Out of scope no longer owns model-level Title; this slice owns Event Model title and Description. Inspect after reload of the heading is [inspect-rest.md](./inspect-rest.md).
- [inspect-connection.md](./inspect-connection.md) — Out of scope no longer owns model-level Title; this slice owns Event Model title and Description.
- [product.md](../product.md) — In-session the Event Model heading is selectable; Inspector edits Event Model `title` and `description`. Playwright path for this slice adds: click Untitled, fill Name with Library Checkout, fill Description with Library checkout blueprint, Save, reload JSON title and description match. GET heading after JSON `title` change is the Event Model `title` ([inspect-rest.md](./inspect-rest.md)). Team-list and Export filename stay the D1 create title until later. Slice / Actor / block Description is [inspect-description.md](./inspect-description.md).
