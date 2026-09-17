import { appendActor } from "./append-actor.js";
import { appendCommand } from "./append-command.js";
import { appendEvent } from "./append-event.js";
import { appendReadModel } from "./append-read-model.js";
import { appendAutomation } from "./append-automation.js";
import { appendConnection } from "./append-connection.js";
import { moveSliceLeft } from "./move-slice-left.js";
import { moveSliceRight } from "./move-slice-right.js";
import { deleteSlice } from "./delete-slice.js";
import { deleteCommand } from "./delete-command.js";
import { deleteConnection } from "./delete-connection.js";
import { deleteActor } from "./delete-actor.js";
import { deleteEvent } from "./delete-event.js";
import { deleteReadModel } from "./delete-read-model.js";
import { deleteAutomation } from "./delete-automation.js";
import { undoConnection } from "./undo-connection.js";
import { undoAddCommand } from "./undo-add-command.js";
import { undoActor } from "./undo-actor.js";
import { undoEvent } from "./undo-event.js";
import { undoReadModel } from "./undo-read-model.js";
import { undoAutomation } from "./undo-automation.js";
import { undoMoveSliceLeft } from "./undo-move-slice-left.js";
import { restoreSlice } from "./restore-slice.js";
import { restoreCommand } from "./restore-command.js";
import { restoreConnection } from "./restore-connection.js";
import { restoreActor } from "./restore-actor.js";
import { restoreEvent } from "./restore-event.js";
import { restoreReadModel } from "./restore-read-model.js";
import { restoreAutomation } from "./restore-automation.js";

export function bindKeyboard(root, ctx) {
  root.addEventListener("keydown", (event) => {
    if (
      event.shiftKey &&
      (event.metaKey || event.ctrlKey) &&
      !event.altKey &&
      (event.key === "n" || event.key === "N")
    ) {
      event.preventDefault();
      ctx.onNewSliceClick();
      return;
    }
    if (
      (event.metaKey || event.ctrlKey) &&
      !event.altKey &&
      !event.shiftKey &&
      (event.key === "s" || event.key === "S")
    ) {
      event.preventDefault();
      root.getElementById("save-model")?.requestSubmit();
      return;
    }
    if (
      event.altKey &&
      (event.metaKey || event.ctrlKey) &&
      event.key === "ArrowLeft"
    ) {
      const holder = root.getElementById("event-model-document");
      const sliceId = ctx.selectedSliceItem?.dataset?.id;
      if (holder && sliceId) {
        const model = JSON.parse(holder.textContent || "{}");
        const next = moveSliceLeft(model, sliceId);
        holder.textContent = JSON.stringify(next);
        if (next !== model) ctx.undoStack.push({ kind: "move", sliceId });
      }
      return;
    }
    if (
      event.altKey &&
      (event.metaKey || event.ctrlKey) &&
      event.key === "ArrowRight"
    ) {
      const holder = root.getElementById("event-model-document");
      const sliceId = ctx.selectedSliceItem?.dataset?.id;
      if (holder && sliceId) {
        holder.textContent = JSON.stringify(
          moveSliceRight(JSON.parse(holder.textContent || "{}"), sliceId),
        );
      }
      return;
    }
    if (
      (event.metaKey || event.ctrlKey) &&
      !event.altKey &&
      (event.key === "z" || event.key === "Z")
    ) {
      event.preventDefault();
      const holder = root.getElementById("event-model-document");
      if (!holder) return;
      if (event.shiftKey) {
        const entry = ctx.redoStack.pop();
        if (entry === "command") ctx.onAddCommandClick();
        if (entry === "actor") ctx.onAddActorClick();
        if (entry === "event") ctx.onAddEventClick();
        if (entry === "readmodel") ctx.onAddReadModelClick();
        if (entry === "automation") ctx.onAddAutomationClick();
        if (entry === "slice") ctx.onNewSliceClick();
        if (entry?.kind === "connection") {
          const model = JSON.parse(holder.textContent || "{}");
          if (entry.fromID && entry.toID) {
            holder.textContent = JSON.stringify(
              appendConnection(model, {
                fromID: entry.fromID,
                fromKind: "COMMAND",
                toID: entry.toID,
                toKind: "EVENT",
              }),
            );
            const board = ctx.boardMount();
            if (board) {
              const stored = JSON.parse(holder.textContent || "{}");
              const connection = (stored.connections ?? []).at(-1);
              const p = root.createElement("p");
              p.textContent = "Command → Event Happened";
              if (connection) p.dataset.id = connection.id;
              board.append(p);
            }
            ctx.undoStack.push("connection");
          }
        }
        if (entry?.kind === "move") {
          const sliceId = entry.sliceId;
          const model = JSON.parse(holder.textContent || "{}");
          const next = moveSliceLeft(model, sliceId);
          holder.textContent = JSON.stringify(next);
          if (next !== model) ctx.undoStack.push({ kind: "move", sliceId });
        }
        if (entry?.kind === "deleteSlice") {
          const sliceId = entry.slice?.id;
          const model = JSON.parse(holder.textContent || "{}");
          const index = (model.slices ?? []).findIndex(
            (slice) => slice.id === sliceId,
          );
          const slice = index >= 0 ? model.slices[index] : undefined;
          holder.textContent = JSON.stringify(deleteSlice(model, sliceId));
          const list = ctx.slicesList;
          const item = [...(list?.children ?? [])].find(
            (node) => node.getAttribute?.("data-id") === sliceId,
          );
          item?.remove();
          if (slice && index >= 0) {
            ctx.undoStack.push({ kind: "deleteSlice", slice, index });
          }
        }
        if (entry?.kind === "deleteCommand") {
          const commandId = entry.command?.id;
          const model = JSON.parse(holder.textContent || "{}");
          const slice = (model.slices ?? []).find((s) =>
            (s.commands ?? []).some((command) => command.id === commandId),
          );
          const index = slice
            ? (slice.commands ?? []).findIndex((c) => c.id === commandId)
            : -1;
          const command = index >= 0 ? slice.commands[index] : undefined;
          holder.textContent = JSON.stringify(deleteCommand(model, commandId));
          const list = ctx.timelineList;
          const item = [...(list?.querySelectorAll("li") ?? [])].find(
            (node) => node.getAttribute?.("data-id") === commandId,
          );
          item?.remove();
          if (command && slice && index >= 0) {
            ctx.undoStack.push({
              kind: "deleteCommand",
              command,
              sliceId: slice.id,
              index,
            });
          }
        }
        if (entry?.kind === "deleteConnection") {
          const connectionId = entry.connection?.id;
          const model = JSON.parse(holder.textContent || "{}");
          const index = (model.connections ?? []).findIndex(
            (connection) => connection.id === connectionId,
          );
          const connection = index >= 0 ? model.connections[index] : undefined;
          holder.textContent = JSON.stringify(
            deleteConnection(model, connectionId),
          );
          const timelineEl = root.querySelector('[aria-label="Timeline"]');
          const node = [...(timelineEl?.querySelectorAll("p") ?? [])].find(
            (p) => p.dataset.id === connectionId,
          );
          node?.remove();
          if (connection && index >= 0) {
            ctx.undoStack.push({ kind: "deleteConnection", connection, index });
          }
        }
        if (entry?.kind === "deleteActor") {
          const actorId = entry.actor?.id;
          const model = JSON.parse(holder.textContent || "{}");
          const slice = (model.slices ?? []).find((s) =>
            (s.actors ?? []).some((actor) => actor.id === actorId),
          );
          const index = slice
            ? (slice.actors ?? []).findIndex((actor) => actor.id === actorId)
            : -1;
          const actor = index >= 0 ? slice.actors[index] : undefined;
          holder.textContent = JSON.stringify(deleteActor(model, actorId));
          const list = ctx.timelineList;
          const item = [...(list?.querySelectorAll("li") ?? [])].find(
            (node) => node.getAttribute?.("data-id") === actorId,
          );
          item?.remove();
          if (actor && slice && index >= 0) {
            ctx.undoStack.push({
              kind: "deleteActor",
              actor,
              sliceId: slice.id,
              index,
            });
          }
        }
        if (entry?.kind === "deleteEvent") {
          const eventId = entry.event?.id;
          const model = JSON.parse(holder.textContent || "{}");
          const slice = (model.slices ?? []).find((s) =>
            (s.events ?? []).some((event) => event.id === eventId),
          );
          const index = slice
            ? (slice.events ?? []).findIndex((event) => event.id === eventId)
            : -1;
          const eventBlock = index >= 0 ? slice.events[index] : undefined;
          holder.textContent = JSON.stringify(deleteEvent(model, eventId));
          const list = ctx.timelineList;
          const item = [...(list?.querySelectorAll("li") ?? [])].find(
            (node) => node.getAttribute?.("data-id") === eventId,
          );
          item?.remove();
          if (eventBlock && slice && index >= 0) {
            ctx.undoStack.push({
              kind: "deleteEvent",
              event: eventBlock,
              sliceId: slice.id,
              index,
            });
          }
        }
        if (entry?.kind === "deleteReadModel") {
          const readModelId = entry.readModel?.id;
          const model = JSON.parse(holder.textContent || "{}");
          const slice = (model.slices ?? []).find((s) =>
            (s.readModels ?? []).some((readModel) => readModel.id === readModelId),
          );
          const index = slice
            ? (slice.readModels ?? []).findIndex(
                (readModel) => readModel.id === readModelId,
              )
            : -1;
          const readModel = index >= 0 ? slice.readModels[index] : undefined;
          holder.textContent = JSON.stringify(deleteReadModel(model, readModelId));
          const list = ctx.timelineList;
          const item = [...(list?.querySelectorAll("li") ?? [])].find(
            (node) => node.getAttribute?.("data-id") === readModelId,
          );
          item?.remove();
          if (readModel && slice && index >= 0) {
            ctx.undoStack.push({
              kind: "deleteReadModel",
              readModel,
              sliceId: slice.id,
              index,
            });
          }
        }
        if (entry?.kind === "deleteAutomation") {
          const automationId = entry.automation?.id;
          const model = JSON.parse(holder.textContent || "{}");
          const slice = (model.slices ?? []).find((s) =>
            (s.processors ?? []).some(
              (automation) => automation.id === automationId,
            ),
          );
          const index = slice
            ? (slice.processors ?? []).findIndex(
                (automation) => automation.id === automationId,
              )
            : -1;
          const automation = index >= 0 ? slice.processors[index] : undefined;
          holder.textContent = JSON.stringify(
            deleteAutomation(model, automationId),
          );
          const list = ctx.timelineList;
          const item = [...(list?.querySelectorAll("li") ?? [])].find(
            (node) => node.getAttribute?.("data-id") === automationId,
          );
          item?.remove();
          if (automation && slice && index >= 0) {
            ctx.undoStack.push({
              kind: "deleteAutomation",
              automation,
              sliceId: slice.id,
              index,
            });
          }
        }
        return;
      }
      const entry = ctx.undoStack.pop();
      const kind = typeof entry === "string" ? entry : entry?.kind;
      if (kind === "deleteAutomation") {
        holder.textContent = JSON.stringify(
          restoreAutomation(
            JSON.parse(holder.textContent || "{}"),
            entry.automation,
            entry.sliceId,
            entry.index,
          ),
        );
        const list = ctx.lastLaneList("automation");
        if (list && entry.automation) {
          const item = root.createElement("li");
          item.textContent = "Automation";
          item.setAttribute("aria-label", "Automation");
          item.dataset.kind = "automation";
          item.setAttribute("data-id", entry.automation.id);
          const before = list.children[entry.index];
          if (before) list.insertBefore(item, before);
          else list.append(item);
        }
        ctx.redoStack.push(entry);
        return;
      }
      if (kind === "deleteReadModel") {
        holder.textContent = JSON.stringify(
          restoreReadModel(
            JSON.parse(holder.textContent || "{}"),
            entry.readModel,
            entry.sliceId,
            entry.index,
          ),
        );
        const list = ctx.lastLaneList("readmodel");
        if (list && entry.readModel) {
          const item = root.createElement("li");
          item.textContent = "Read Model";
          item.setAttribute("aria-label", "Read Model");
          item.dataset.kind = "readmodel";
          item.setAttribute("data-id", entry.readModel.id);
          const port = root.createElement("button");
          port.type = "button";
          port.textContent = "Read Model port";
          port.dataset.id = entry.readModel.id;
          port.dataset.kind = "READMODEL";
          item.append(port);
          const before = list.children[entry.index];
          if (before) list.insertBefore(item, before);
          else list.append(item);
        }
        ctx.redoStack.push(entry);
        return;
      }
      if (kind === "deleteEvent") {
        holder.textContent = JSON.stringify(
          restoreEvent(
            JSON.parse(holder.textContent || "{}"),
            entry.event,
            entry.sliceId,
            entry.index,
          ),
        );
        const list = ctx.lastLaneList("event");
        if (list && entry.event) {
          const item = root.createElement("li");
          item.textContent = "Event Happened";
          item.setAttribute("aria-label", "Event Happened");
          item.dataset.kind = "event";
          item.setAttribute("data-id", entry.event.id);
          const port = root.createElement("button");
          port.type = "button";
          port.textContent = "Event Happened port";
          port.dataset.id = entry.event.id;
          port.dataset.kind = "EVENT";
          item.append(port);
          const before = list.children[entry.index];
          if (before) list.insertBefore(item, before);
          else list.append(item);
        }
        ctx.redoStack.push(entry);
        return;
      }
      if (kind === "deleteActor") {
        holder.textContent = JSON.stringify(
          restoreActor(
            JSON.parse(holder.textContent || "{}"),
            entry.actor,
            entry.sliceId,
            entry.index,
          ),
        );
        const list = ctx.lastLaneList("actor");
        if (list && entry.actor) {
          const item = root.createElement("li");
          item.textContent = "Actor";
          item.setAttribute("aria-label", "Actor");
          item.dataset.kind = "actor";
          item.setAttribute("data-id", entry.actor.id);
          const before = list.children[entry.index];
          if (before) list.insertBefore(item, before);
          else list.append(item);
        }
        ctx.redoStack.push(entry);
        return;
      }
      if (kind === "deleteConnection") {
        holder.textContent = JSON.stringify(
          restoreConnection(
            JSON.parse(holder.textContent || "{}"),
            entry.connection,
            entry.index,
          ),
        );
        const board = ctx.boardMount();
        if (board && entry.connection) {
          const p = root.createElement("p");
          p.textContent = "Command → Event Happened";
          p.setAttribute("data-kind", "connection");
          p.dataset.id = entry.connection.id;
          const before = [
            ...board.querySelectorAll('p[data-kind="connection"]'),
          ][entry.index];
          if (before) board.insertBefore(p, before);
          else board.append(p);
        }
        ctx.redoStack.push(entry);
        return;
      }
      if (kind === "deleteCommand") {
        holder.textContent = JSON.stringify(
          restoreCommand(
            JSON.parse(holder.textContent || "{}"),
            entry.command,
            entry.sliceId,
            entry.index,
          ),
        );
        const list = ctx.lastLaneList("command");
        if (list && entry.command) {
          const item = root.createElement("li");
          item.textContent = "Command";
          item.setAttribute("aria-label", "Command");
          item.dataset.kind = "command";
          item.setAttribute("data-id", entry.command.id);
          const port = root.createElement("button");
          port.type = "button";
          port.textContent = "Command port";
          port.dataset.id = entry.command.id;
          port.dataset.kind = "COMMAND";
          item.append(port);
          const before = list.children[entry.index];
          if (before) list.insertBefore(item, before);
          else list.append(item);
        }
        ctx.redoStack.push(entry);
        return;
      }
      if (kind === "command") {
        holder.textContent = JSON.stringify(
          undoAddCommand(JSON.parse(holder.textContent || "{}")),
        );
        const items = [
          ...(ctx.timelineList?.querySelectorAll("li") ??
            []),
        ];
        items
          .filter((item) => item.getAttribute("aria-label") === "Command")
          .at(-1)
          ?.remove();
        ctx.redoStack.push("command");
        return;
      }
      if (kind === "deleteSlice") {
        holder.textContent = JSON.stringify(
          restoreSlice(
            JSON.parse(holder.textContent || "{}"),
            entry.slice,
            entry.index,
          ),
        );
        const list = ctx.slicesList;
        if (list) {
          const item = root.createElement("li");
          item.textContent = "New Slice";
          item.setAttribute("aria-label", "New Slice");
          if (entry.slice?.id) item.setAttribute("data-id", entry.slice.id);
          const before = list.children[entry.index];
          if (before) list.insertBefore(item, before);
          else list.append(item);
        }
        ctx.redoStack.push(entry);
        return;
      }
      if (kind === "move") {
        holder.textContent = JSON.stringify(
          undoMoveSliceLeft(
            JSON.parse(holder.textContent || "{}"),
            entry.sliceId,
          ),
        );
        ctx.redoStack.push(entry);
        return;
      }
      if (kind === "automation") {
        holder.textContent = JSON.stringify(
          undoAutomation(JSON.parse(holder.textContent || "{}")),
        );
        const items = [
          ...(ctx.timelineList?.querySelectorAll("li") ??
            []),
        ];
        items
          .filter((item) => item.getAttribute("aria-label") === "Automation")
          .at(-1)
          ?.remove();
        ctx.redoStack.push("automation");
        return;
      }
      if (kind === "readmodel") {
        holder.textContent = JSON.stringify(
          undoReadModel(JSON.parse(holder.textContent || "{}")),
        );
        const items = [
          ...(ctx.timelineList?.querySelectorAll("li") ??
            []),
        ];
        items
          .filter((item) => item.getAttribute("aria-label") === "Read Model")
          .at(-1)
          ?.remove();
        ctx.redoStack.push("readmodel");
        return;
      }
      if (kind === "event") {
        holder.textContent = JSON.stringify(
          undoEvent(JSON.parse(holder.textContent || "{}")),
        );
        const items = [
          ...(ctx.timelineList?.querySelectorAll("li") ??
            []),
        ];
        items
          .filter((item) => item.getAttribute("aria-label") === "Event Happened")
          .at(-1)
          ?.remove();
        ctx.redoStack.push("event");
        return;
      }
      if (kind === "actor") {
        holder.textContent = JSON.stringify(
          undoActor(JSON.parse(holder.textContent || "{}")),
        );
        const items = [
          ...(ctx.timelineList?.querySelectorAll("li") ??
            []),
        ];
        items
          .filter((item) => item.getAttribute("aria-label") === "Actor")
          .at(-1)
          ?.remove();
        ctx.redoStack.push("actor");
        return;
      }
      if (kind === "connection") {
        const model = JSON.parse(holder.textContent || "{}");
        const connection = (model.connections ?? []).at(-1);
        holder.textContent = JSON.stringify(undoConnection(model));
        const timeline = root.querySelector('[aria-label="Timeline"]');
        for (const node of [...(timeline?.querySelectorAll("p") ?? [])]) {
          if (
            node.textContent === "Command → Event Happened" &&
            !(
              connection?.fromKind === "EVENT" &&
              connection?.toKind === "READMODEL"
            )
          ) {
            node.remove();
          }
          if (
            node.textContent === "Event Happened → Read Model" &&
            connection?.fromKind === "EVENT" &&
            connection?.toKind === "READMODEL"
          ) {
            node.remove();
          }
        }
        if (connection) {
          ctx.redoStack.push({
            kind: "connection",
            fromID: connection.fromID,
            toID: connection.toID,
          });
        }
        return;
      }
      if (kind !== "slice") return;
      const model = JSON.parse(holder.textContent || "{}");
      const last = model.slices?.at(-1);
      if (!last) return;
      holder.textContent = JSON.stringify(deleteSlice(model, last.id));
      ctx.slicesList?.lastElementChild?.remove();
      const cols = ctx.timelineList?.querySelectorAll(".slice-col");
      cols?.[cols.length - 1]?.remove();
      ctx.redoStack.push("slice");
      return;
    }
    if (
      (event.metaKey || event.ctrlKey) &&
      !event.altKey &&
      (event.key === "=" || event.key === "+")
    ) {
      event.preventDefault();
      ctx.scale = 1.25;
      ctx.applyTimelineTransform();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key === "-") {
      event.preventDefault();
      ctx.scale = 0.8;
      ctx.applyTimelineTransform();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key === "0") {
      event.preventDefault();
      ctx.scale = 1;
      ctx.applyTimelineTransform();
      return;
    }
    if (event.key !== "Backspace" && event.key !== "Delete") return;
    if (event.target instanceof HTMLInputElement) return;
    const holder = root.getElementById("event-model-document");
    if (holder && ctx.selected === "automation" && ctx.selectedAutomationItem) {
      const automationId = ctx.selectedAutomationItem.dataset.id;
      const model = JSON.parse(holder.textContent || "{}");
      const slice = (model.slices ?? []).find((s) =>
        (s.processors ?? []).some(
          (automation) => automation.id === automationId,
        ),
      );
      const index = slice
        ? (slice.processors ?? []).findIndex(
            (automation) => automation.id === automationId,
          )
        : -1;
      const automation = index >= 0 ? slice.processors[index] : undefined;
      holder.textContent = JSON.stringify(
        deleteAutomation(model, automationId),
      );
      ctx.selectedAutomationItem.remove();
      if (automation && slice && index >= 0) {
        ctx.undoStack.push({
          kind: "deleteAutomation",
          automation,
          sliceId: slice.id,
          index,
        });
      }
      ctx.selectedAutomationItem = null;
      ctx.selected = null;
      return;
    }
    if (holder && ctx.selected === "readmodel" && ctx.selectedReadModelItem) {
      const readModelId =
        ctx.selectedReadModelItem.dataset.id ||
        ctx.selectedReadModelItem.querySelector("[data-id]")?.dataset.id;
      const model = JSON.parse(holder.textContent || "{}");
      const slice = (model.slices ?? []).find((s) =>
        (s.readModels ?? []).some((readModel) => readModel.id === readModelId),
      );
      const index = slice
        ? (slice.readModels ?? []).findIndex(
            (readModel) => readModel.id === readModelId,
          )
        : -1;
      const readModel = index >= 0 ? slice.readModels[index] : undefined;
      holder.textContent = JSON.stringify(deleteReadModel(model, readModelId));
      ctx.selectedReadModelItem.remove();
      if (readModel && slice && index >= 0) {
        ctx.undoStack.push({
          kind: "deleteReadModel",
          readModel,
          sliceId: slice.id,
          index,
        });
      }
      ctx.selectedReadModelItem = null;
      ctx.selected = null;
      return;
    }
    if (holder && ctx.selected === "event" && ctx.selectedEventItem) {
      const eventId =
        ctx.selectedEventItem.dataset.id ||
        ctx.selectedEventItem.querySelector("[data-id]")?.dataset.id;
      const model = JSON.parse(holder.textContent || "{}");
      const slice = (model.slices ?? []).find((s) =>
        (s.events ?? []).some((event) => event.id === eventId),
      );
      const index = slice
        ? (slice.events ?? []).findIndex((event) => event.id === eventId)
        : -1;
      const eventBlock = index >= 0 ? slice.events[index] : undefined;
      holder.textContent = JSON.stringify(deleteEvent(model, eventId));
      ctx.selectedEventItem.remove();
      if (eventBlock && slice && index >= 0) {
        ctx.undoStack.push({
          kind: "deleteEvent",
          event: eventBlock,
          sliceId: slice.id,
          index,
        });
      }
      ctx.selectedEventItem = null;
      ctx.selected = null;
      return;
    }
    if (holder && ctx.selected === "actor" && ctx.selectedActorItem) {
      const actorId = ctx.selectedActorItem.dataset.id;
      const model = JSON.parse(holder.textContent || "{}");
      const slice = (model.slices ?? []).find((s) =>
        (s.actors ?? []).some((actor) => actor.id === actorId),
      );
      const index = slice
        ? (slice.actors ?? []).findIndex((actor) => actor.id === actorId)
        : -1;
      const actor = index >= 0 ? slice.actors[index] : undefined;
      holder.textContent = JSON.stringify(deleteActor(model, actorId));
      ctx.selectedActorItem.remove();
      if (actor && slice && index >= 0) {
        ctx.undoStack.push({
          kind: "deleteActor",
          actor,
          sliceId: slice.id,
          index,
        });
      }
      ctx.selectedActorItem = null;
      ctx.selected = null;
      return;
    }
    if (holder && ctx.selected === "connection" && ctx.selectedConnectionNode) {
      const connectionId = ctx.selectedConnectionNode.dataset.id;
      const model = JSON.parse(holder.textContent || "{}");
      const index = (model.connections ?? []).findIndex(
        (connection) => connection.id === connectionId,
      );
      const connection = index >= 0 ? model.connections[index] : undefined;
      holder.textContent = JSON.stringify(
        deleteConnection(model, connectionId),
      );
      ctx.selectedConnectionNode.remove();
      if (connection && index >= 0) {
        ctx.undoStack.push({ kind: "deleteConnection", connection, index });
      }
      ctx.selectedConnectionNode = null;
      ctx.selected = null;
      return;
    }
    if (holder && ctx.selected === "connection") {
      const model = JSON.parse(holder.textContent || "{}");
      const connection = (model.connections ?? []).find(
        (item) =>
          item.fromKind === "EVENT" && item.toKind === "READMODEL",
      );
      if (connection) {
        holder.textContent = JSON.stringify(
          deleteConnection(model, connection.id),
        );
        const board = ctx.boardMount();
        const node = [...(board?.querySelectorAll?.("p") ?? [])].find(
          (p) => p.textContent === "Event Happened → Read Model",
        );
        node?.remove();
        ctx.selected = null;
        return;
      }
    }
    if (holder && ctx.selected === "command" && ctx.selectedCommandItem) {
      const commandId = ctx.selectedCommandItem.dataset.id;
      const model = JSON.parse(holder.textContent || "{}");
      const slice = (model.slices ?? []).find((s) =>
        (s.commands ?? []).some((command) => command.id === commandId),
      );
      const index = slice
        ? (slice.commands ?? []).findIndex((c) => c.id === commandId)
        : -1;
      const command = index >= 0 ? slice.commands[index] : undefined;
      holder.textContent = JSON.stringify(deleteCommand(model, commandId));
      ctx.selectedCommandItem.remove();
      if (command && slice && index >= 0) {
        ctx.undoStack.push({
          kind: "deleteCommand",
          command,
          sliceId: slice.id,
          index,
        });
      }
      ctx.selectedCommandItem = null;
      ctx.selected = null;
      ctx.nameInput()?.closest("label")?.remove();
      ctx.unbindDescription();
      ctx.unbindFieldChrome();
      const inspector = root.querySelector('[aria-label="Inspector"]');
      inspector?.insertAdjacentHTML(
        "beforeend",
        "<label>Type <select><option>State Change</option><option>State View</option><option>Automation</option></select></label>",
      );
      return;
    }
    const sliceId = ctx.selectedSliceItem?.dataset?.id;
    if (holder && ctx.selected === "slice" && sliceId && ctx.selectedSliceItem) {
      const model = JSON.parse(holder.textContent || "{}");
      const index = (model.slices ?? []).findIndex(
        (slice) => slice.id === sliceId,
      );
      const slice = index >= 0 ? model.slices[index] : undefined;
      holder.textContent = JSON.stringify(deleteSlice(model, sliceId));
      ctx.selectedSliceItem.remove();
      ctx.timelineList
        ?.querySelector(
          `.slice-col li[data-id="${sliceId}"]:not([data-kind])`,
        )
        ?.closest(".slice-col")
        ?.remove();
      root
        .querySelectorAll(`li[data-id="${sliceId}"]:not([data-kind])`)
        .forEach((item) => item.remove());
      if (slice && index >= 0) {
        ctx.undoStack.push({ kind: "deleteSlice", slice, index });
      }
      ctx.selectedSliceItem = null;
      ctx.selected = null;
    }
    const commandId = ctx.selectedCommandItem?.dataset?.id;
    if (holder && ctx.selected === "command" && commandId && ctx.selectedCommandItem) {
      holder.textContent = JSON.stringify(
        deleteCommand(JSON.parse(holder.textContent || "{}"), commandId),
      );
      ctx.selectedCommandItem.remove();
      ctx.selectedCommandItem = null;
      ctx.selected = null;
    }
    const connectionId = ctx.selectedConnectionItem?.dataset?.id;
    if (
      holder &&
      ctx.selected === "connection" &&
      connectionId &&
      ctx.selectedConnectionItem
    ) {
      holder.textContent = JSON.stringify(
        deleteConnection(JSON.parse(holder.textContent || "{}"), connectionId),
      );
      ctx.selectedConnectionItem.remove();
      ctx.selectedConnectionItem = null;
      ctx.selected = null;
    }
    const actorId = ctx.selectedActorItem?.dataset?.id;
    if (holder && ctx.selected === "actor" && actorId && ctx.selectedActorItem) {
      holder.textContent = JSON.stringify(
        deleteActor(JSON.parse(holder.textContent || "{}"), actorId),
      );
      ctx.selectedActorItem.remove();
      ctx.selectedActorItem = null;
      ctx.selected = null;
    }
    const eventId = ctx.selectedEventItem?.dataset?.id;
    if (holder && ctx.selected === "event" && eventId && ctx.selectedEventItem) {
      holder.textContent = JSON.stringify(
        deleteEvent(JSON.parse(holder.textContent || "{}"), eventId),
      );
      ctx.selectedEventItem.remove();
      ctx.selectedEventItem = null;
      ctx.selected = null;
    }
    const readModelId = ctx.selectedReadModelItem?.dataset?.id;
    if (
      holder &&
      ctx.selected === "readmodel" &&
      readModelId &&
      ctx.selectedReadModelItem
    ) {
      holder.textContent = JSON.stringify(
        deleteReadModel(JSON.parse(holder.textContent || "{}"), readModelId),
      );
      ctx.selectedReadModelItem.remove();
      ctx.selectedReadModelItem = null;
      ctx.selected = null;
    }
    const automationId = ctx.selectedAutomationItem?.dataset?.id;
    if (
      holder &&
      ctx.selected === "automation" &&
      automationId &&
      ctx.selectedAutomationItem
    ) {
      holder.textContent = JSON.stringify(
        deleteAutomation(JSON.parse(holder.textContent || "{}"), automationId),
      );
      ctx.selectedAutomationItem.remove();
      ctx.selectedAutomationItem = null;
      ctx.selected = null;
    }
  });
  root.addEventListener("keydown", (event) => {
    if (!event.altKey || !(event.metaKey || event.ctrlKey)) return;
    const holder = root.getElementById("event-model-document");
    if (!holder) return;
    const model = JSON.parse(holder.textContent || "{}");
    if (event.code === "Digit1") {
      const index =
        ctx.selectedSliceIndex ?? (model.slices?.length ?? 1) - 1;
      const next = appendActor(model, index);
      holder.textContent = JSON.stringify(next);
      const actor = next.slices?.[index]?.actors?.at(-1);
      const list = ctx.lastLaneList("actor");
      if (list && actor) {
        const item = root.createElement("li");
        item.textContent = "Actor";
        item.setAttribute("aria-label", "Actor");
        item.dataset.kind = "actor";
        list.append(item);
      }
    }
    if (event.code === "Digit2") {
      const index =
        ctx.selectedSliceIndex ?? (model.slices?.length ?? 1) - 1;
      const next = appendCommand(model, index);
      holder.textContent = JSON.stringify(next);
      const command = next.slices?.[index]?.commands?.at(-1);
      const cols = ctx.timelineList?.querySelectorAll(".slice-col") ?? [];
      const list = cols[index]?.querySelector('[data-lane="command"] ul');
      if (list && command) {
        const item = root.createElement("li");
        item.textContent = "Command";
        item.setAttribute("aria-label", "Command");
        item.dataset.kind = "command";
        const port = root.createElement("button");
        port.type = "button";
        port.textContent = "Command port";
        item.append(port);
        list.append(item);
      }
    }
    if (event.code === "Digit3") {
      const index =
        ctx.selectedSliceIndex ?? (model.slices?.length ?? 1) - 1;
      const next = appendEvent(model, index);
      holder.textContent = JSON.stringify(next);
      const eventBlock = next.slices?.[index]?.events?.at(-1);
      const list = ctx.lastLaneList("event");
      if (list && eventBlock) {
        const item = root.createElement("li");
        item.textContent = "Event Happened";
        item.setAttribute("aria-label", "Event Happened");
        const port = root.createElement("button");
        port.type = "button";
        port.textContent = "Event Happened port";
        item.append(port);
        list.append(item);
      }
    }
    if (event.code === "Digit4") {
      const index =
        ctx.selectedSliceIndex ?? (model.slices?.length ?? 1) - 1;
      const next = appendReadModel(model, index);
      holder.textContent = JSON.stringify(next);
      const readModel = next.slices?.[index]?.readModels?.at(-1);
      const list = ctx.lastLaneList("readmodel");
      if (list && readModel) {
        const item = root.createElement("li");
        item.textContent = "Read Model";
        item.setAttribute("aria-label", "Read Model");
        const port = root.createElement("button");
        port.type = "button";
        port.textContent = "Read Model port";
        item.append(port);
        list.append(item);
      }
    }
    if (event.code === "Digit5") {
      const index =
        ctx.selectedSliceIndex ?? (model.slices?.length ?? 1) - 1;
      const next = appendAutomation(model, index);
      holder.textContent = JSON.stringify(next);
      const automation = next.slices?.[index]?.processors?.at(-1);
      const list = ctx.lastLaneList("automation");
      if (list && automation) {
        const item = root.createElement("li");
        item.textContent = "Automation";
        item.setAttribute("aria-label", "Automation");
        item.dataset.kind = "automation";
        list.append(item);
      }
    }
  });
}
