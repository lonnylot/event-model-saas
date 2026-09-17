import { bindPointer } from "./editor-pointer.js";
import { bindKeyboard } from "./editor-keyboard.js";
import { bindInspect } from "./editor-inspect.js";
import { bindCanvas } from "./editor-canvas.js";
import { appendSlice } from "./append-slice.js";
import { appendActor } from "./append-actor.js";
import { appendCommand } from "./append-command.js";
import { appendEvent } from "./append-event.js";
import { appendReadModel } from "./append-read-model.js";
import { appendAutomation } from "./append-automation.js";

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
    if (kind === "actor") {
      for (const actor of slice?.actors ?? []) {
        const item = root.createElement("li");
        item.textContent = "Actor";
        item.setAttribute("aria-label", "Actor");
        item.setAttribute("data-kind", "actor");
        if (actor.id) item.setAttribute("data-id", actor.id);
        list.append(item);
      }
    }
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

export function onAddActorClick(root, sliceIndex) {
  const holder = root.getElementById("event-model-document");
  const next = appendActor(
    JSON.parse(holder?.textContent || "{}"),
    sliceIndex,
  );
  if (holder) holder.textContent = JSON.stringify(next);
  const index = sliceIndex ?? (next.slices?.length ?? 1) - 1;
  const actor = next.slices?.[index]?.actors?.at(-1);
  const cols = timelineEl(root)?.querySelectorAll?.(".slice-col") ?? [];
  const list =
    cols[index]?.querySelector('[data-lane="actor"] ul') ??
    lastLaneList(root, "actor");
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

export function onAddCommandClick(root, sliceIndex) {
  const holder = root.getElementById("event-model-document");
  const next = appendCommand(
    JSON.parse(holder?.textContent || "{}"),
    sliceIndex,
  );
  if (holder) holder.textContent = JSON.stringify(next);
  const index = sliceIndex ?? (next.slices?.length ?? 1) - 1;
  const command = next.slices?.[index]?.commands?.at(-1);
  const cols = timelineEl(root)?.querySelectorAll?.(".slice-col") ?? [];
  const list =
    cols[index]?.querySelector('[data-lane="command"] ul') ??
    lastLaneList(root, "command");
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

export function onAddEventClick(root, sliceIndex) {
  const holder = root.getElementById("event-model-document");
  const next = appendEvent(
    JSON.parse(holder?.textContent || "{}"),
    sliceIndex,
  );
  if (holder) holder.textContent = JSON.stringify(next);
  const index = sliceIndex ?? (next.slices?.length ?? 1) - 1;
  const event = next.slices?.[index]?.events?.at(-1);
  const cols = timelineEl(root)?.querySelectorAll?.(".slice-col") ?? [];
  const list =
    cols[index]?.querySelector('[data-lane="event"] ul') ??
    lastLaneList(root, "event");
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

export function onAddReadModelClick(root, sliceIndex) {
  const holder = root.getElementById("event-model-document");
  const next = appendReadModel(
    JSON.parse(holder?.textContent || "{}"),
    sliceIndex,
  );
  if (holder) holder.textContent = JSON.stringify(next);
  const index = sliceIndex ?? (next.slices?.length ?? 1) - 1;
  const readModel = next.slices?.[index]?.readModels?.at(-1);
  const cols = timelineEl(root)?.querySelectorAll?.(".slice-col") ?? [];
  const list =
    cols[index]?.querySelector('[data-lane="readmodel"] ul') ??
    lastLaneList(root, "readmodel");
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
  if (timeline instanceof HTMLElement) {
    timeline.addEventListener("click", (event) => {
      const button = event.target?.closest?.("button");
      const holder = root.getElementById("event-model-document");
      if (!holder || !button) return;
      const index = Number(button.getAttribute("data-slice-index"));
      const model = JSON.parse(holder.textContent || "{}");
      if (button.textContent === "Add Actor on lane") {
        const next = appendActor(model, index);
        holder.textContent = JSON.stringify(next);
        const actor = next.slices?.[index]?.actors?.at(-1);
        const cols = timeline.querySelectorAll?.(".slice-col") ?? [];
        const list = cols[index]?.querySelector('[data-lane="actor"] ul');
        if (list && actor) {
          const item = root.createElement("li");
          item.textContent = "Actor";
          item.setAttribute("aria-label", "Actor");
          list.append(item);
        }
      }
      if (button.textContent === "Add Event on lane") {
        const next = appendEvent(model, index);
        holder.textContent = JSON.stringify(next);
        const eventItem = next.slices?.[index]?.events?.at(-1);
        const cols = timeline.querySelectorAll?.(".slice-col") ?? [];
        const list = cols[index]?.querySelector('[data-lane="event"] ul');
        if (list && eventItem) {
          const item = root.createElement("li");
          item.textContent = "Event Happened";
          item.setAttribute("aria-label", "Event Happened");
          list.append(item);
        }
      }
      if (button.textContent === "Add Read Model on lane") {
        const next = appendReadModel(model, index);
        holder.textContent = JSON.stringify(next);
        const readModel = next.slices?.[index]?.readModels?.at(-1);
        const cols = timeline.querySelectorAll?.(".slice-col") ?? [];
        const list = cols[index]?.querySelector('[data-lane="readmodel"] ul');
        if (list && readModel) {
          const item = root.createElement("li");
          item.textContent = "Read Model";
          item.setAttribute("aria-label", "Read Model");
          list.append(item);
        }
      }
      if (button.textContent === "Add Automation on lane") {
        const next = appendAutomation(model, index);
        holder.textContent = JSON.stringify(next);
        const automation = next.slices?.[index]?.processors?.at(-1);
        const cols = timeline.querySelectorAll?.(".slice-col") ?? [];
        const list = cols[index]?.querySelector('[data-lane="automation"] ul');
        if (list && automation) {
          const item = root.createElement("li");
          item.textContent = "Automation";
          item.setAttribute("aria-label", "Automation");
          list.append(item);
        }
      }
    });
  }
  root.querySelectorAll("button").forEach((button) => {
    if (button.textContent === "New Slice") {
      button.addEventListener("click", () => onNewSliceClick(root));
    }
    if (button.textContent === "Add Actor") {
      button.addEventListener("click", () =>
        onAddActorClick(root, selectedSliceIndex),
      );
    }
    if (button.textContent === "Add Command") {
      button.addEventListener("click", () =>
        onAddCommandClick(root, selectedSliceIndex),
      );
    }
    if (button.textContent === "Add Event") {
      button.addEventListener("click", () =>
        onAddEventClick(root, selectedSliceIndex),
      );
    }
    if (button.textContent === "Add Read Model") {
      button.addEventListener("click", () =>
        onAddReadModelClick(root, selectedSliceIndex),
      );
    }
    if (button.textContent === "Add Automation") {
      button.addEventListener("click", () => onAddAutomationClick(root));
    }
  });
  const timelineList = timeline;
  const slicesList = sidebarList(root);
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
  bindCanvas(root, ctx);
  bindInspect(root, ctx);
  ctx.undoStack = undoStack;
  ctx.redoStack = redoStack;
  ctx.timelineList = timelineList;
  ctx.lastLaneList = (kind) => lastLaneList(root, kind);
  ctx.boardMount = () => boardMount(root);
  ctx.onNewSliceClick = () => onNewSliceClick(root);
  ctx.onAddActorClick = () => onAddActorClick(root, selectedSliceIndex);
  ctx.onAddCommandClick = () => onAddCommandClick(root, selectedSliceIndex);
  ctx.onAddEventClick = () => onAddEventClick(root, selectedSliceIndex);
  ctx.onAddReadModelClick = () => onAddReadModelClick(root, selectedSliceIndex);
  ctx.onAddAutomationClick = () => onAddAutomationClick(root);
  bindKeyboard(root, ctx);
  bindPointer(root, ctx);
}

if (typeof document !== "undefined") {
  bindEditor(document);
}
