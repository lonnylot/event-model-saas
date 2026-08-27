# Inspect connection

Status: released

## Problem

Members can drag a legal Port onto a Port and see `Command → Event Happened` on the Timeline, but clicking that Connection does not open Inspector, so From and To cannot be read the way the Mac inspector shows them.

## Acceptance criteria

- [x] After dragging from `Command port` onto `Event Happened port`, clicking the Timeline text `Command → Event Happened` shows the text `Connection` in the Inspector region
- [x] After dragging from `Command port` onto `Event Happened port`, clicking the Timeline text `Command → Event Happened` shows the text `From Command` in the Inspector region
- [x] After dragging from `Command port` onto `Event Happened port`, clicking the Timeline text `Command → Event Happened` shows the text `To Event Happened` in the Inspector region

## Domain terms

Event Model, Slice, Command, Event, Connection, Team, Person, Version

## Seams

- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Connect is still a drag from a Port onto a Port ([connections.md](./connections.md)). Add still targets the last Slice.
- Connection selection is a click on the Timeline text `Command → Event Happened`.
- Inspect is a click on a click-created Connection. Inspect after reload of a Connection is [inspect-rest.md](./inspect-rest.md). Name inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md).
- Inspector From / To use the Command `title` and Event `title` (`Command` and `Event Happened` at Add defaults).
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Delete Connection is [delete-blocks.md](./delete-blocks.md). Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md). Slice type picker is [slice-type.md](./slice-type.md). Name inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md). Dashed Add on a lane, keyboard shortcuts, Mac window chrome. Event Model title and Description are [model-inspector.md](./model-inspector.md). Legal edges stay [connections.md](./connections.md). Event → Read Model inspect, inspect after reload of a Connection, Description after reload, Slice type after reload, Field after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md).

## Restates

- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns inspecting a Connection; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md). Slice type picker is [slice-type.md](./slice-type.md). Name inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md).
- [chrome.md](./chrome.md) — Out of scope no longer owns inspecting a Connection; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md). Slice type picker is [slice-type.md](./slice-type.md). Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md).
- [connections.md](./connections.md) — Inspecting a Connection is this slice. Delete Connection is [delete-blocks.md](./delete-blocks.md).
- [inspect-after-reload.md](./inspect-after-reload.md) — Out of scope no longer owns inspecting a Connection; this slice owns click-created Connection inspect. Inspect after reload of a Connection is [inspect-rest.md](./inspect-rest.md).
- [inspect-description.md](./inspect-description.md) — Out of scope no longer owns inspecting a Connection; this slice owns those.
- [inspect-fields.md](./inspect-fields.md) — Out of scope no longer owns inspecting a Connection; this slice owns those. Last-Command Add Field and last-Command Field name stay that spec. Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md).
- [slice-type.md](./slice-type.md) — Out of scope no longer owns inspecting a Connection; this slice owns those.
- [product.md](../product.md) — Inspect a Connection; show From and To. Delete of a Connection is [delete-blocks.md](./delete-blocks.md). Playwright path for this slice adds: drag Command port onto Event Happened port, click `Command → Event Happened`, Inspector shows Connection, From Command, To Event Happened.
