# Connections

Status: validated

## Problem

Members can put Commands, Events, and Read Models on a Slice, but they cannot connect them, so the timeline is still a pile of blocks instead of a model.

## Acceptance criteria

- [x] After clicking `New Slice` then `Add Command` on that page, the Command listitem shows a button whose accessible name is `Command port`
- [x] After clicking `New Slice` then `Add Event` on that page, the Event Happened listitem shows a button whose accessible name is `Event Happened port`
- [x] After clicking `New Slice` then `Add Read Model` on that page, the Read Model listitem shows a button whose accessible name is `Read Model port`
- [x] After clicking `New Slice` then `Add Actor` on that page, the Actor listitem does not show a button whose accessible name is `Actor port`
- [x] After clicking `New Slice` then `Add Automation` on that page, the Automation listitem does not show a button whose accessible name is `Automation port`
- [ ] Dragging from `Command port` onto `Event Happened port` appends a Connection whose `fromKind` is `COMMAND`
- [ ] Dragging from `Command port` onto `Event Happened port` appends a Connection whose `toKind` is `EVENT`
- [ ] Dragging from `Event Happened port` onto `Read Model port` appends a Connection whose `fromKind` is `EVENT`
- [ ] Dragging from `Event Happened port` onto `Read Model port` appends a Connection whose `toKind` is `READMODEL`
- [ ] Dragging from `Command port` onto `Read Model port` does not append a Connection
- [ ] Dragging from `Command port` onto `Read Model port` shows the text `A command can't write a read model.`
- [ ] After dragging from `Command port` onto `Event Happened port`, the Timeline region shows the text `Command → Event Happened`
- [ ] After a member creates a model, opens it, clicks `New Slice`, adds a Command and an Event, drags `Command port` onto `Event Happened port`, and Saves, a reload of that page shows the text `Command → Event Happened` in the Timeline region

## Domain terms

Event Model, Slice, Command, Event, Read Model, Actor, Automation, Connection, Team, Person, Version

## Seams

- `document` module — append Connection on an in-memory Event Model; the editor drag path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Connect is a drag from a Port onto a Port. Legal v1 edges are Command → Event and Event → Read Model, matching the Mac app.
- Empty Connection JSON is `{ "id": "{uuid}", "fromID": "{command or event uuid}", "fromKind": "COMMAND" | "EVENT", "toID": "{event or read model uuid}", "toKind": "EVENT" | "READMODEL" }`.
- Connections live on the Event Model `connections` array, not on the Slice.
- Add still targets the last Slice. There is no Slice selection in this slice.
- Connect is in-memory until Save. Save still uses the version check from model-persistence.

## Out of scope

Inspector fields, dashed Add on a lane, keyboard shortcuts, delete, drag blocks between Slices, undo, pan, moving Slices, highlighting legal targets, Mac window chrome, Actor or Automation as connection endpoints, duplicate-connection refusal, self-connection refusal, the other illegal-pair copy from the Mac app.

## Restates

- [blocks.md](./blocks.md) — Out of scope no longer owns connections; this slice owns Command → Event and Event → Read Model. Inspector fields, dashed Add, and keyboard stay later.
- [editor-shell.md](./editor-shell.md) — Out of scope no longer owns connections; this slice owns those.
- [model-persistence.md](./model-persistence.md) — Out of scope no longer owns connections; this slice owns those.
- [product.md](../product.md) — Playwright path for this slice is open Event Model, New Slice, Add Command, Add Event, drag Command port onto Event Happened port, Save, reload still shows `Command → Event Happened`; highlighting legal targets and the other illegal-pair copy stay later
