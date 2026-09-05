import { bindKeyboard } from "./editor-keyboard.js";
import { bindInspect } from "./editor-inspect.js";
import { appendSlice } from "./append-slice.js";
import { appendActor } from "./append-actor.js";
import { appendCommand } from "./append-command.js";
import { appendEvent } from "./append-event.js";
import { appendReadModel } from "./append-read-model.js";
import { appendAutomation } from "./append-automation.js";
import { appendConnection } from "./append-connection.js";
import { reorderSlices } from "./reorder-slices.js";
import { moveActorToSlice } from "./move-actor-to-slice.js";
import { moveCommandToSlice } from "./move-command-to-slice.js";
import { moveEventToSlice } from "./move-event-to-slice.js";
import { moveReadModelToSlice } from "./move-read-model-to-slice.js";
import { moveAutomationToSlice } from "./move-automation-to-slice.js";

const undoStack = [];
const redoStack = [];

function sidebarList(root) {
  return root.querySelector(".slice-rail ul") ?? root.querySelector("ul");
}

function timelineEl(root) {
  return root.querySelector('[aria-label="Timeline"]');
}

function lastLaneList(root, kind) {
  const timeline = timelineEl(root);
  if (!timeline || typeof timeline.querySelectorAll !== "function") {
    return typeof timeline?.querySelector === "function"
      ? timeline.querySelector("ul")
      : null;
  }
  const cols = timeline.querySelectorAll(".slice-col") ?? [];
  const col = cols[cols.length - 1];
  if (!col) return timeline.querySelector("ul");
  return (
    col.querySelector(`[data-lane="${kind}"] ul`) ??
    col.querySelector("ul")
  );
}

function boardMount(root) {
  const timeline = timelineEl(root);
  if (!timeline || typeof timeline.querySelector !== "function") return timeline;
  return (
    timeline.querySelector(".board-pan") ??
    timeline.querySelector(".board") ??
    timeline
  );
}

function ensurePanLayer(board) {
  if (!(board instanceof HTMLElement) || typeof board.querySelector !== "function") {
    return null;
  }
  let layer = board.querySelector(":scope > .board-pan");
  if (layer) return layer;
  const doc = board.ownerDocument;
  if (!doc) return null;
  layer = doc.createElement("div");
  layer.className = "board-pan";
  while (board.firstChild) layer.append(board.firstChild);
  board.append(layer);
  return layer;
}

function mountSliceColumn(root, slice, sliceIndex) {
  const timeline = timelineEl(root);
  if (!timeline) return;
  const board = boardMount(root);
  const col = root.createElement("div");
  if (typeof col.append !== "function") return;
  col.className = "slice-col";
  col.setAttribute("data-slice-index", String(sliceIndex));
  const head = root.createElement("ul");
  head.className = "slice-head";
  const titleItem = root.createElement("li");
  titleItem.textContent = "New Slice";
  titleItem.setAttribute("aria-label", "New Slice");
  if (slice) titleItem.setAttribute("data-id", slice.id);
  head.append(titleItem);
  col.append(head);
  const lanes = [
    ["actor", "Add Actor on lane"],
    ["command", "Add Command on lane"],
    ["event", "Add Event on lane"],
    ["readmodel", "Add Read Model on lane"],
    ["automation", "Add Automation on lane"],
  ];
  for (const [kind, label] of lanes) {
    const lane = root.createElement("div");
    lane.className = "lane";
    lane.setAttribute("data-lane", kind);
    const list = root.createElement("ul");
    lane.append(list);
    const button = root.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("data-slice-index", String(sliceIndex));
    if (kind === "command") {
      button.addEventListener("click", () => {
        const documentHolder = root.getElementById("event-model-document");
        if (documentHolder) {
          documentHolder.textContent = JSON.stringify(
            appendCommand(
              JSON.parse(documentHolder.textContent || "{}"),
              sliceIndex,
            ),
          );
        }
      });
    }
    lane.append(button);
    col.append(lane);
  }
  board.append(col);
}

export function onNewSliceClick(root) {
  const holder = root.getElementById("event-model-document");
  const next = appendSlice(JSON.parse(holder?.textContent || "{}"));
  if (holder) holder.textContent = JSON.stringify(next);
  const slice = next.slices?.at(-1);
  const sliceIndex = (next.slices?.length ?? 1) - 1;
  const list = sidebarList(root);
  if (list) {
    const item = root.createElement("li");
    item.textContent = "New Slice";
    item.setAttribute("aria-label", "New Slice");
    if (slice) item.setAttribute("data-id", slice.id);
    item.setAttribute("data-slice-index", String(sliceIndex));
    list.append(item);
  }
  mountSliceColumn(root, slice, sliceIndex);
  const main = root.querySelector("main");
  if (main && !main.textContent?.includes("Unsaved changes.")) {
    main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
  }
  undoStack.push("slice");
}

export function onAddActorClick(root) {
  const holder = root.getElementById("event-model-document");
  const next = appendActor(JSON.parse(holder?.textContent || "{}"));
  if (holder) holder.textContent = JSON.stringify(next);
  const actor = next.slices?.at(-1)?.actors?.at(-1);
  const list = lastLaneList(root, "actor");
  if (list) {
    const item = root.createElement("li");
    item.textContent = "Actor";
    item.setAttribute("aria-label", "Actor");
    item.dataset.kind = "actor";
    if (actor) item.setAttribute("data-id", actor.id);
    list.append(item);
  }
  undoStack.push("actor");
}

export function onAddCommandClick(root) {
  const holder = root.getElementById("event-model-document");
  const next = appendCommand(JSON.parse(holder?.textContent || "{}"));
  if (holder) holder.textContent = JSON.stringify(next);
  const command = next.slices?.at(-1)?.commands?.at(-1);
  const list = lastLaneList(root, "command");
  if (list && command) {
    const item = root.createElement("li");
    item.textContent = "Command";
    item.setAttribute("aria-label", "Command");
    item.dataset.kind = "command";
    item.setAttribute("data-id", command.id);
    if (command) item.setAttribute("data-id", command.id);
    const port = root.createElement("button");
    port.type = "button";
    port.textContent = "Command port";
    if (command) {
      port.dataset.id = command.id;
      port.dataset.kind = "COMMAND";
    }
    item.append(port);
    list.append(item);
  }
  if (command) undoStack.push("command");
  redoStack.length = 0;
}

export function onAddEventClick(root) {
  const holder = root.getElementById("event-model-document");
  const next = appendEvent(JSON.parse(holder?.textContent || "{}"));
  if (holder) holder.textContent = JSON.stringify(next);
  const event = next.slices?.at(-1)?.events?.at(-1);
  const list = lastLaneList(root, "event");
  if (list && event) {
    const item = root.createElement("li");
    item.textContent = "Event Happened";
    item.setAttribute("aria-label", "Event Happened");
    item.dataset.kind = "event";
    item.setAttribute("data-id", event.id);
    if (event) item.setAttribute("data-id", event.id);
    const port = root.createElement("button");
    port.type = "button";
    port.textContent = "Event Happened port";
    if (event) {
      port.dataset.id = event.id;
      port.dataset.kind = "EVENT";
    }
    item.append(port);
    list.append(item);
  }
  undoStack.push("event");
}

export function onAddReadModelClick(root) {
  const holder = root.getElementById("event-model-document");
  const next = appendReadModel(JSON.parse(holder?.textContent || "{}"));
  if (holder) holder.textContent = JSON.stringify(next);
  const readModel = next.slices?.at(-1)?.readModels?.at(-1);
  const list = lastLaneList(root, "readmodel");
  if (list && readModel) {
    const item = root.createElement("li");
    item.textContent = "Read Model";
    item.setAttribute("aria-label", "Read Model");
    item.dataset.kind = "readmodel";
    item.setAttribute("data-id", readModel.id);
    if (readModel) item.setAttribute("data-id", readModel.id);
    const port = root.createElement("button");
    port.type = "button";
    port.textContent = "Read Model port";
    if (readModel) {
      port.dataset.id = readModel.id;
      port.dataset.kind = "READMODEL";
    }
    item.append(port);
    list.append(item);
  }
  undoStack.push("readmodel");
}

export function onAddAutomationClick(root) {
  const holder = root.getElementById("event-model-document");
  const next = appendAutomation(JSON.parse(holder?.textContent || "{}"));
  if (holder) holder.textContent = JSON.stringify(next);
  const automation = next.slices?.at(-1)?.processors?.at(-1);
  const list = lastLaneList(root, "automation");
  if (list && automation) {
    const item = root.createElement("li");
    item.textContent = "Automation";
    item.setAttribute("aria-label", "Automation");
    item.dataset.kind = "automation";
    item.setAttribute("data-id", automation.id);
    list.append(item);
  }
  undoStack.push("automation");
}

export function bindEditor(root) {
  const timeline = root.querySelector('[aria-label="Timeline"]');
  const board =
    timeline && typeof timeline.querySelector === "function"
      ? timeline.querySelector(".board")
      : null;
  let scale = 1;
  let panX = 0;
  let panY = 0;
  const applyTimelineTransform = () => {
    if (!(board instanceof HTMLElement)) return;
    const parts = [`scale(${scale})`];
    if (panX !== 0 || panY !== 0) {
      parts.push(`translate(${panX}px, ${panY}px)`);
    }
    board.style.transform = parts.join(" ");
    const lift = panY < 0 ? -panY : 0;
    board.style.marginTop = lift ? `${lift}px` : "";
    const layer = ensurePanLayer(board);
    if (layer instanceof HTMLElement) {
      layer.style.transform = lift ? `translate(0px, ${panY}px)` : "";
    }
  };
  ensurePanLayer(board);
  if (timeline instanceof HTMLElement) {
    timeline.style.minHeight = "48px";
    timeline.addEventListener(
      "wheel",
      (event) => {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          scale *= Math.exp(-event.deltaY * 0.01);
          applyTimelineTransform();
          return;
        }
        panX -= event.deltaX;
        panY -= event.deltaY;
        applyTimelineTransform();
      },
      { passive: false },
    );
    timeline.addEventListener("click", (event) => {
      const button = event.target?.closest?.("button");
      const holder = root.getElementById("event-model-document");
      if (!holder || !button) return;
      const index = Number(button.getAttribute("data-slice-index"));
      const model = JSON.parse(holder.textContent || "{}");
      if (button.textContent === "Add Actor on lane") {
        holder.textContent = JSON.stringify(appendActor(model, index));
      }
      if (button.textContent === "Add Event on lane") {
        holder.textContent = JSON.stringify(appendEvent(model, index));
      }
      if (button.textContent === "Add Read Model on lane") {
        holder.textContent = JSON.stringify(appendReadModel(model, index));
      }
      if (button.textContent === "Add Automation on lane") {
        holder.textContent = JSON.stringify(appendAutomation(model, index));
      }
    });
  }
  root.querySelectorAll("button").forEach((button) => {
    if (button.textContent === "Zoom in") {
      button.addEventListener("click", () => {
        scale = 1.25;
        applyTimelineTransform();
      });
    }
    if (button.textContent === "Zoom out") {
      button.addEventListener("click", () => {
        scale = 0.8;
        applyTimelineTransform();
      });
    }
    if (button.textContent === "Reset zoom") {
      button.addEventListener("click", () => {
        scale = 1;
        applyTimelineTransform();
      });
    }
    if (button.textContent === "New Slice") {
      button.addEventListener("click", () => onNewSliceClick(root));
    }
    if (button.textContent === "Add Actor") {
      button.addEventListener("click", () => onAddActorClick(root));
    }
    if (button.textContent === "Add Command") {
      button.addEventListener("click", () => onAddCommandClick(root));
    }
    if (button.textContent === "Add Event") {
      button.addEventListener("click", () => onAddEventClick(root));
    }
    if (button.textContent === "Add Read Model") {
      button.addEventListener("click", () => onAddReadModelClick(root));
    }
    if (button.textContent === "Add Automation") {
      button.addEventListener("click", () => onAddAutomationClick(root));
    }
  });
  const timelineList = timeline;
  const slicesList = sidebarList(root);
  let selected = null;
  let selectedSliceItem = null;
  let selectedSliceIndex = null;
  let selectedActorItem = null;
  let selectedCommandItem = null;
  let selectedEventItem = null;
  let selectedReadModelItem = null;
  let selectedAutomationItem = null;
  let selectedConnectionItem = null;
  let selectedConnectionNode = null;
  const ctx = {
    timeline,
    board,
    slicesList,
    get selected() { return selected; },
    set selected(v) { selected = v; },
    get selectedSliceItem() { return selectedSliceItem; },
    set selectedSliceItem(v) { selectedSliceItem = v; },
    get selectedSliceIndex() { return selectedSliceIndex; },
    set selectedSliceIndex(v) { selectedSliceIndex = v; },
    get selectedActorItem() { return selectedActorItem; },
    set selectedActorItem(v) { selectedActorItem = v; },
    get selectedCommandItem() { return selectedCommandItem; },
    set selectedCommandItem(v) { selectedCommandItem = v; },
    get selectedEventItem() { return selectedEventItem; },
    set selectedEventItem(v) { selectedEventItem = v; },
    get selectedReadModelItem() { return selectedReadModelItem; },
    set selectedReadModelItem(v) { selectedReadModelItem = v; },
    get selectedAutomationItem() { return selectedAutomationItem; },
    set selectedAutomationItem(v) { selectedAutomationItem = v; },
    get selectedConnectionItem() { return selectedConnectionItem; },
    set selectedConnectionItem(v) { selectedConnectionItem = v; },
    get selectedConnectionNode() { return selectedConnectionNode; },
    set selectedConnectionNode(v) { selectedConnectionNode = v; },
  };
  bindInspect(root, ctx);
  ctx.undoStack = undoStack;
  ctx.redoStack = redoStack;
  ctx.timelineList = timelineList;
  ctx.lastLaneList = (kind) => lastLaneList(root, kind);
  ctx.boardMount = () => boardMount(root);
  ctx.onNewSliceClick = () => onNewSliceClick(root);
  ctx.onAddActorClick = () => onAddActorClick(root);
  ctx.onAddCommandClick = () => onAddCommandClick(root);
  ctx.onAddEventClick = () => onAddEventClick(root);
  ctx.onAddReadModelClick = () => onAddReadModelClick(root);
  ctx.onAddAutomationClick = () => onAddAutomationClick(root);
  Object.defineProperty(ctx, "scale", {
    get() { return scale; },
    set(v) { scale = v; },
    configurable: true,
  });
  ctx.applyTimelineTransform = applyTimelineTransform;
  bindKeyboard(root, ctx);
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
    if (actorItem && slicesList?.contains(actorItem)) {
      dragSliceItem = actorItem;
      return;
    }
    if (
      actorItem &&
      timelineList?.contains(actorItem) &&
      !actorItem.dataset.kind
    ) {
      dragTimelineSliceItem = actorItem;
      return;
    }
    if (
      actorItem &&
      timelineList?.contains(actorItem) &&
      actorItem.dataset.kind === "actor"
    ) {
      dragActorItem = actorItem;
      return;
    }
    if (
      actorItem &&
      timelineList?.contains(actorItem) &&
      actorItem.dataset.kind === "command" &&
      !event.target?.closest?.("button[data-id]")
    ) {
      dragCommandItem = actorItem;
    }
    if (
      actorItem &&
      timelineList?.contains(actorItem) &&
      actorItem.dataset.kind === "event" &&
      !event.target?.closest?.("button[data-id]")
    ) {
      dragEventItem = actorItem;
    }
    if (
      actorItem &&
      timelineList?.contains(actorItem) &&
      actorItem.dataset.kind === "readmodel" &&
      !event.target?.closest?.("button[data-id]")
    ) {
      dragReadModelItem = actorItem;
    }
    if (
      actorItem &&
      timelineList?.contains(actorItem) &&
      actorItem.dataset.kind === "automation" &&
      !event.target?.closest?.("button[data-id]")
    ) {
      dragAutomationItem = actorItem;
    }
    const port = event.target?.closest?.("button[data-id]");
    if (port) {
      sourcePort = port;
      if (port.dataset.kind === "COMMAND") {
        const eventPort = root.querySelector('[data-kind="EVENT"]');
        const holder = root.getElementById("event-model-document");
        const model = JSON.parse(holder?.textContent || "{}");
        const alreadyConnected = (model.connections ?? []).some(
          (connection) =>
            connection.fromID === port.dataset.id &&
            connection.toID === eventPort?.dataset.id,
        );
        if (eventPort && !alreadyConnected) {
          eventPort.setAttribute("aria-current", "true");
        }
      }
      if (port.dataset.kind === "EVENT") {
        const readModelPort = root.querySelector('[data-kind="READMODEL"]');
        const holder = root.getElementById("event-model-document");
        const model = JSON.parse(holder?.textContent || "{}");
        const alreadyConnected = (model.connections ?? []).some(
          (connection) =>
            connection.fromID === port.dataset.id &&
            connection.toID === readModelPort?.dataset.id,
        );
        if (readModelPort && !alreadyConnected) {
          readModelPort.setAttribute("aria-current", "true");
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
        slicesList?.contains(sliceItem) &&
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
        timelineList?.contains(sliceItem) &&
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
        slicesList?.contains(sliceItem) &&
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
        slicesList?.contains(sliceItem) &&
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
      dragCommandItem = null;
    }
    if (dragEventItem) {
      const sliceItem = event.target?.closest?.("li");
      const holder = root.getElementById("event-model-document");
      if (
        holder &&
        sliceItem &&
        slicesList?.contains(sliceItem) &&
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
        slicesList?.contains(sliceItem) &&
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
        slicesList?.contains(sliceItem) &&
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
        const board = boardMount(root);
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
        undoStack.push("connection");
      }
      if (
        !alreadyConnected &&
        sourcePort.dataset.kind === "EVENT" &&
        target.dataset.kind === "READMODEL"
      ) {
        const board = boardMount(root);
        if (
          board &&
          !board.textContent?.includes("Event Happened → Read Model")
        ) {
          board.insertAdjacentHTML(
            "beforeend",
            '<p data-kind="connection">Event Happened → Read Model</p>',
          );
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
          !eventItem.textContent?.includes("An event can't trigger a command.")
        ) {
          eventItem.insertAdjacentHTML(
            "beforeend",
            "<p>An event can't trigger a command.</p>",
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
      timelineList?.contains(dropItem) &&
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
      timelineList?.contains(dropItem) &&
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
      slicesList?.contains(dropItem)
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

if (typeof document !== "undefined") {
  bindEditor(document);
}
