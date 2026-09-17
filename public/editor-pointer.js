import { appendConnection } from "./append-connection.js";
import { reorderSlices } from "./reorder-slices.js";
import { moveActorToSlice } from "./move-actor-to-slice.js";
import { moveCommandToSlice } from "./move-command-to-slice.js";
import { moveEventToSlice } from "./move-event-to-slice.js";
import { moveReadModelToSlice } from "./move-read-model-to-slice.js";
import { moveAutomationToSlice } from "./move-automation-to-slice.js";

export function bindPointer(root, ctx) {
  let sourcePort = null;
  let dragActorItem = null;
  let dragSliceItem = null;
  let dragCommandItem = null;
  let dragEventItem = null;
  let dragReadModelItem = null;
  let dragAutomationItem = null;
  let dragTimelineSliceItem = null;
  root.addEventListener("mousedown", (event) => {
    const actorItem = event.target?.closest?.("li");
    if (actorItem && ctx.slicesList?.contains(actorItem)) {
      dragSliceItem = actorItem;
      return;
    }
    if (
      actorItem &&
      ctx.timelineList?.contains(actorItem) &&
      !actorItem.dataset.kind
    ) {
      dragTimelineSliceItem = actorItem;
      return;
    }
    if (
      actorItem &&
      ctx.timelineList?.contains(actorItem) &&
      actorItem.dataset.kind === "actor"
    ) {
      dragActorItem = actorItem;
      return;
    }
    if (
      actorItem &&
      ctx.timelineList?.contains(actorItem) &&
      actorItem.dataset.kind === "command" &&
      !event.target?.closest?.("button[data-id]")
    ) {
      dragCommandItem = actorItem;
    }
    if (
      actorItem &&
      ctx.timelineList?.contains(actorItem) &&
      actorItem.dataset.kind === "event" &&
      !event.target?.closest?.("button[data-id]")
    ) {
      dragEventItem = actorItem;
    }
    if (
      actorItem &&
      ctx.timelineList?.contains(actorItem) &&
      actorItem.dataset.kind === "readmodel" &&
      !event.target?.closest?.("button[data-id]")
    ) {
      dragReadModelItem = actorItem;
    }
    if (
      actorItem &&
      ctx.timelineList?.contains(actorItem) &&
      actorItem.dataset.kind === "automation" &&
      !event.target?.closest?.("button[data-id]")
    ) {
      dragAutomationItem = actorItem;
    }
    const port = event.target?.closest?.("button[data-id]");
    if (port) {
      sourcePort = port;
      if (port.dataset.kind === "COMMAND") {
        const eventPorts = root.querySelectorAll('[data-kind="EVENT"]');
        const holder = root.getElementById("event-model-document");
        const model = JSON.parse(holder?.textContent || "{}");
        for (const eventPort of eventPorts) {
          const alreadyConnected = (model.connections ?? []).some(
            (connection) =>
              connection.fromID === port.dataset.id &&
              connection.toID === eventPort.dataset.id,
          );
          if (!alreadyConnected) {
            eventPort.setAttribute("aria-current", "true");
          }
        }
      }
      if (port.dataset.kind === "EVENT") {
        const readModelPorts = root.querySelectorAll('[data-kind="READMODEL"]');
        const holder = root.getElementById("event-model-document");
        const model = JSON.parse(holder?.textContent || "{}");
        for (const readModelPort of readModelPorts) {
          const alreadyConnected = (model.connections ?? []).some(
            (connection) =>
              connection.fromID === port.dataset.id &&
              connection.toID === readModelPort.dataset.id,
          );
          if (!alreadyConnected) {
            readModelPort.setAttribute("aria-current", "true");
          }
        }
      }
    }
  });
  root.addEventListener("mouseup", (event) => {
    if (dragSliceItem) {
      const sliceItem = event.target?.closest?.("li");
      const holder = root.getElementById("event-model-document");
      if (
        holder &&
        sliceItem &&
        ctx.slicesList?.contains(sliceItem) &&
        dragSliceItem !== sliceItem &&
        dragSliceItem.dataset.id &&
        sliceItem.dataset.id
      ) {
        holder.textContent = JSON.stringify(
          reorderSlices(
            JSON.parse(holder.textContent || "{}"),
            dragSliceItem.dataset.id,
            sliceItem.dataset.id,
          ),
        );
      }
      dragSliceItem = null;
      return;
    }
    if (dragTimelineSliceItem) {
      const sliceItem = event.target?.closest?.("li");
      const holder = root.getElementById("event-model-document");
      if (
        holder &&
        sliceItem &&
        ctx.timelineList?.contains(sliceItem) &&
        !sliceItem.dataset.kind &&
        dragTimelineSliceItem !== sliceItem &&
        dragTimelineSliceItem.dataset.id &&
        sliceItem.dataset.id
      ) {
        holder.textContent = JSON.stringify(
          reorderSlices(
            JSON.parse(holder.textContent || "{}"),
            dragTimelineSliceItem.dataset.id,
            sliceItem.dataset.id,
          ),
        );
      }
      dragTimelineSliceItem = null;
      return;
    }
    if (dragActorItem) {
      const sliceItem = event.target?.closest?.("li");
      const holder = root.getElementById("event-model-document");
      if (
        holder &&
        sliceItem &&
        ctx.slicesList?.contains(sliceItem) &&
        dragActorItem.dataset.id &&
        sliceItem.dataset.id
      ) {
        holder.textContent = JSON.stringify(
          moveActorToSlice(
            JSON.parse(holder.textContent || "{}"),
            dragActorItem.dataset.id,
            sliceItem.dataset.id,
          ),
        );
      }
      dragActorItem = null;
      return;
    }
    if (dragCommandItem) {
      const sliceItem = event.target?.closest?.("li");
      const holder = root.getElementById("event-model-document");
      if (
        holder &&
        sliceItem &&
        ctx.slicesList?.contains(sliceItem) &&
        dragCommandItem.dataset.id &&
        sliceItem.dataset.id
      ) {
        holder.textContent = JSON.stringify(
          moveCommandToSlice(
            JSON.parse(holder.textContent || "{}"),
            dragCommandItem.dataset.id,
            sliceItem.dataset.id,
          ),
        );
        dragCommandItem = null;
        sourcePort = null;
        return;
      }
      if (
        holder &&
        sliceItem &&
        ctx.timelineList?.contains(sliceItem) &&
        sliceItem.dataset.kind === "command" &&
        dragCommandItem.dataset.id &&
        sliceItem.dataset.id &&
        dragCommandItem !== sliceItem
      ) {
        holder.textContent = JSON.stringify(
          moveCommandToSlice(
            JSON.parse(holder.textContent || "{}"),
            dragCommandItem.dataset.id,
            sliceItem.dataset.id,
            sliceItem.dataset.id,
          ),
        );
        dragCommandItem = null;
        sourcePort = null;
        return;
      }
      dragCommandItem = null;
    }
    if (dragEventItem) {
      const sliceItem = event.target?.closest?.("li");
      const holder = root.getElementById("event-model-document");
      if (
        holder &&
        sliceItem &&
        ctx.slicesList?.contains(sliceItem) &&
        dragEventItem.dataset.id &&
        sliceItem.dataset.id
      ) {
        holder.textContent = JSON.stringify(
          moveEventToSlice(
            JSON.parse(holder.textContent || "{}"),
            dragEventItem.dataset.id,
            sliceItem.dataset.id,
          ),
        );
        dragEventItem = null;
        sourcePort = null;
        return;
      }
      dragEventItem = null;
    }
    if (dragReadModelItem) {
      const sliceItem = event.target?.closest?.("li");
      const holder = root.getElementById("event-model-document");
      if (
        holder &&
        sliceItem &&
        ctx.slicesList?.contains(sliceItem) &&
        dragReadModelItem.dataset.id &&
        sliceItem.dataset.id
      ) {
        holder.textContent = JSON.stringify(
          moveReadModelToSlice(
            JSON.parse(holder.textContent || "{}"),
            dragReadModelItem.dataset.id,
            sliceItem.dataset.id,
          ),
        );
        dragReadModelItem = null;
        sourcePort = null;
        return;
      }
      dragReadModelItem = null;
    }
    if (dragAutomationItem) {
      const sliceItem = event.target?.closest?.("li");
      const holder = root.getElementById("event-model-document");
      if (
        holder &&
        sliceItem &&
        ctx.slicesList?.contains(sliceItem) &&
        dragAutomationItem.dataset.id &&
        sliceItem.dataset.id
      ) {
        holder.textContent = JSON.stringify(
          moveAutomationToSlice(
            JSON.parse(holder.textContent || "{}"),
            dragAutomationItem.dataset.id,
            sliceItem.dataset.id,
          ),
        );
        dragAutomationItem = null;
        sourcePort = null;
        return;
      }
      dragAutomationItem = null;
    }
    const target = event.target?.closest?.("button[data-id]");
    if (sourcePort && target && sourcePort === target) {
      const commandItem = sourcePort.closest("li");
      if (
        commandItem &&
        !commandItem.textContent?.includes("A block can't connect to itself.")
      ) {
        commandItem.insertAdjacentHTML(
          "beforeend",
          "<p>A block can't connect to itself.</p>",
        );
      }
    }
    if (sourcePort && target && sourcePort !== target) {
      const holder = root.getElementById("event-model-document");
      const model = JSON.parse(holder?.textContent || "{}");
      const alreadyConnected = (model.connections ?? []).some(
        (connection) =>
          connection.fromID === sourcePort.dataset.id &&
          connection.toID === target.dataset.id,
      );
      if (holder) {
        holder.textContent = JSON.stringify(
          appendConnection(model, {
            fromID: sourcePort.dataset.id,
            fromKind: sourcePort.dataset.kind,
            toID: target.dataset.id,
            toKind:
              target.dataset.kind === "EVENT" ||
              target.dataset.kind === "READMODEL" ||
              target.dataset.kind === "COMMAND"
                ? target.dataset.kind
                : undefined,
          }),
        );
      }
      if (alreadyConnected) {
        const sourceItem = sourcePort.closest("li");
        if (
          sourceItem &&
          !sourceItem.textContent?.includes(
            "That connection already exists.",
          )
        ) {
          sourceItem.insertAdjacentHTML(
            "beforeend",
            "<p>That connection already exists.</p>",
          );
        }
      }
      if (
        !alreadyConnected &&
        sourcePort.dataset.kind === "COMMAND" &&
        target.dataset.kind === "EVENT"
      ) {
        const board = ctx.boardMount();
        if (board) {
          const line = root.createElement("p");
          line.textContent = "Command → Event Happened";
          line.setAttribute("data-kind", "connection");
          const connection = JSON.parse(
            holder?.textContent || "{}",
          ).connections?.at(-1);
          if (connection) line.setAttribute("data-id", connection.id);
          board.append(line);
        }
        ctx.undoStack.push("connection");
      }
      if (
        !alreadyConnected &&
        sourcePort.dataset.kind === "EVENT" &&
        target.dataset.kind === "READMODEL"
      ) {
        const board = ctx.boardMount();
        if (
          board &&
          !board.textContent?.includes("Event Happened → Read Model")
        ) {
          const line = root.createElement("p");
          line.textContent = "Event Happened → Read Model";
          line.setAttribute("data-kind", "connection");
          board.append(line);
        }
      }
      if (
        sourcePort.dataset.kind === "COMMAND" &&
        target.dataset.kind === "READMODEL"
      ) {
        const commandItem = sourcePort.closest("li");
        if (
          commandItem &&
          !commandItem.textContent?.includes(
            "A command can't write a read model.",
          )
        ) {
          commandItem.insertAdjacentHTML(
            "beforeend",
            "<p>A command can't write a read model.</p>",
          );
        }
      }
      if (
        sourcePort.dataset.kind === "EVENT" &&
        target.dataset.kind === "COMMAND"
      ) {
        const eventItem = sourcePort.closest("li");
        if (
          eventItem &&
          !eventItem.textContent?.includes("An event can't issue a command.")
        ) {
          eventItem.insertAdjacentHTML(
            "beforeend",
            "<p>An event can't issue a command.</p>",
          );
        }
      }
      if (
        sourcePort.dataset.kind === "COMMAND" &&
        target.dataset.kind === "COMMAND"
      ) {
        const commandItem = sourcePort.closest("li");
        if (
          commandItem &&
          !commandItem.textContent?.includes(
            "A command can't write a command.",
          )
        ) {
          commandItem.insertAdjacentHTML(
            "beforeend",
            "<p>A command can't write a command.</p>",
          );
        }
      }
      if (
        sourcePort.dataset.kind === "EVENT" &&
        target.dataset.kind === "EVENT"
      ) {
        const eventItem = sourcePort.closest("li");
        if (
          eventItem &&
          !eventItem.textContent?.includes("An event can't feed an event.")
        ) {
          eventItem.insertAdjacentHTML(
            "beforeend",
            "<p>An event can't feed an event.</p>",
          );
        }
      }
      if (
        sourcePort.dataset.kind === "READMODEL" &&
        target.dataset.kind === "COMMAND"
      ) {
        const readModelItem = sourcePort.closest("li");
        if (
          readModelItem &&
          !readModelItem.textContent?.includes(
            "A read model can't issue a command.",
          )
        ) {
          readModelItem.insertAdjacentHTML(
            "beforeend",
            "<p>A read model can't issue a command.</p>",
          );
        }
      }
      if (
        sourcePort.dataset.kind === "READMODEL" &&
        target.dataset.kind === "EVENT"
      ) {
        const readModelItem = sourcePort.closest("li");
        if (
          readModelItem &&
          !readModelItem.textContent?.includes(
            "A read model can't write an event.",
          )
        ) {
          readModelItem.insertAdjacentHTML(
            "beforeend",
            "<p>A read model can't write an event.</p>",
          );
        }
      }
      if (
        sourcePort.dataset.kind === "READMODEL" &&
        target.dataset.kind === "READMODEL"
      ) {
        const readModelItem = sourcePort.closest("li");
        if (
          readModelItem &&
          !readModelItem.textContent?.includes(
            "A read model can't feed a read model.",
          )
        ) {
          readModelItem.insertAdjacentHTML(
            "beforeend",
            "<p>A read model can't feed a read model.</p>",
          );
        }
      }
    }
    const dropItem = event.target?.closest?.("li");
    if (
      sourcePort &&
      !target &&
      dropItem &&
      ctx.timelineList?.contains(dropItem) &&
      dropItem.dataset.kind === "actor"
    ) {
      const commandItem = sourcePort.closest("li");
      if (
        commandItem &&
        !commandItem.textContent?.includes(
          "An actor isn't a connection endpoint.",
        )
      ) {
        commandItem.insertAdjacentHTML(
          "beforeend",
          "<p>An actor isn't a connection endpoint.</p>",
        );
      }
    }
    if (
      sourcePort &&
      !target &&
      dropItem &&
      ctx.timelineList?.contains(dropItem) &&
      dropItem.dataset.kind === "automation"
    ) {
      const commandItem = sourcePort.closest("li");
      if (
        commandItem &&
        !commandItem.textContent?.includes(
          "An automation isn't a connection endpoint.",
        )
      ) {
        commandItem.insertAdjacentHTML(
          "beforeend",
          "<p>An automation isn't a connection endpoint.</p>",
        );
      }
    }
    if (
      sourcePort &&
      !target &&
      dropItem &&
      ctx.slicesList?.contains(dropItem)
    ) {
      const commandItem = sourcePort.closest("li");
      if (
        commandItem &&
        !commandItem.textContent?.includes(
          "A slice isn't a connection endpoint.",
        )
      ) {
        commandItem.insertAdjacentHTML(
          "beforeend",
          "<p>A slice isn't a connection endpoint.</p>",
        );
      }
    }
    for (const highlighted of root.querySelectorAll("[aria-current]")) {
      highlighted.removeAttribute("aria-current");
    }
    sourcePort = null;
  });
}
