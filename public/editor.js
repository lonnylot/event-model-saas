import { appendSlice } from "./append-slice.js";
import { appendActor } from "./append-actor.js";
import { appendCommand } from "./append-command.js";
import { appendEvent } from "./append-event.js";
import { appendReadModel } from "./append-read-model.js";
import { appendAutomation } from "./append-automation.js";
import { appendConnection } from "./append-connection.js";
import { setSliceTitle } from "./set-slice-title.js";
import { setSliceDescription } from "./set-slice-description.js";
import { setActorName } from "./set-actor-name.js";
import { setActorDescription } from "./set-actor-description.js";
import { setCommandTitle } from "./set-command-title.js";
import { setCommandDescription } from "./set-command-description.js";
import { setEventTitle } from "./set-event-title.js";
import { setReadModelTitle } from "./set-read-model-title.js";
import { setAutomationTitle } from "./set-automation-title.js";
import { moveSliceLeft } from "./move-slice-left.js";
import { moveActorToSlice } from "./move-actor-to-slice.js";
import { deleteSlice } from "./delete-slice.js";
import { undoConnection } from "./undo-connection.js";

const undoStack = [];

export function onNewSliceClick(root) {
  const holder = root.getElementById("event-model-document");
  const next = appendSlice(JSON.parse(holder?.textContent || "{}"));
  if (holder) holder.textContent = JSON.stringify(next);
  const slice = next.slices?.at(-1);
  const sliceIndex = (next.slices?.length ?? 1) - 1;
  const list = root.querySelector("ul");
  if (list) {
    const item = root.createElement("li");
    item.textContent = "New Slice";
    item.setAttribute("aria-label", "New Slice");
    if (slice) item.setAttribute("data-id", slice.id);
    item.setAttribute("data-slice-index", String(sliceIndex));
    list.append(item);
  }
  const main = root.querySelector("main");
  if (main && !main.textContent?.includes("Unsaved changes.")) {
    main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
  }
  undoStack.push("slice");
  const timeline = root.querySelector('[aria-label="Timeline"]');
  if (timeline) {
    const actor = root.createElement("button");
    actor.type = "button";
    actor.textContent = "Add Actor on lane";
    timeline.append(actor);
    const command = root.createElement("button");
    command.type = "button";
    command.textContent = "Add Command on lane";
    command.addEventListener("click", () => {
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
    timeline.append(command);
    const event = root.createElement("button");
    event.type = "button";
    event.textContent = "Add Event on lane";
    timeline.append(event);
    const readModel = root.createElement("button");
    readModel.type = "button";
    readModel.textContent = "Add Read Model on lane";
    timeline.append(readModel);
    const automation = root.createElement("button");
    automation.type = "button";
    automation.textContent = "Add Automation on lane";
    timeline.append(automation);
  }
}

export function onAddActorClick(root) {
  const holder = root.getElementById("event-model-document");
  const next = appendActor(JSON.parse(holder?.textContent || "{}"));
  if (holder) holder.textContent = JSON.stringify(next);
  const actor = next.slices?.at(-1)?.actors?.at(-1);
  const list = root.querySelector('[aria-label="Timeline"] ul');
  if (list) {
    const item = root.createElement("li");
    item.textContent = "Actor";
    item.setAttribute("aria-label", "Actor");
    item.dataset.kind = "actor";
    if (actor) item.setAttribute("data-id", actor.id);
    list.append(item);
  }
}

export function onAddCommandClick(root) {
  const holder = root.getElementById("event-model-document");
  const next = appendCommand(JSON.parse(holder?.textContent || "{}"));
  if (holder) holder.textContent = JSON.stringify(next);
  const command = next.slices?.at(-1)?.commands?.at(-1);
  const list = root.querySelector('[aria-label="Timeline"] ul');
  if (list && command) {
    const item = root.createElement("li");
    item.textContent = "Command";
    item.setAttribute("aria-label", "Command");
    item.dataset.kind = "command";
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
}

export function onAddEventClick(root) {
  const holder = root.getElementById("event-model-document");
  const next = appendEvent(JSON.parse(holder?.textContent || "{}"));
  if (holder) holder.textContent = JSON.stringify(next);
  const event = next.slices?.at(-1)?.events?.at(-1);
  const list = root.querySelector('[aria-label="Timeline"] ul');
  if (list && event) {
    const item = root.createElement("li");
    item.textContent = "Event Happened";
    item.setAttribute("aria-label", "Event Happened");
    item.dataset.kind = "event";
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
}

export function onAddReadModelClick(root) {
  const holder = root.getElementById("event-model-document");
  const next = appendReadModel(JSON.parse(holder?.textContent || "{}"));
  if (holder) holder.textContent = JSON.stringify(next);
  const readModel = next.slices?.at(-1)?.readModels?.at(-1);
  const list = root.querySelector('[aria-label="Timeline"] ul');
  if (list && readModel) {
    const item = root.createElement("li");
    item.textContent = "Read Model";
    item.setAttribute("aria-label", "Read Model");
    item.dataset.kind = "readmodel";
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
}

export function onAddAutomationClick(root) {
  const holder = root.getElementById("event-model-document");
  const next = appendAutomation(JSON.parse(holder?.textContent || "{}"));
  if (holder) holder.textContent = JSON.stringify(next);
  const automation = next.slices?.at(-1)?.processors?.at(-1);
  const list = root.querySelector('[aria-label="Timeline"] ul');
  if (list && automation) {
    const item = root.createElement("li");
    item.textContent = "Automation";
    item.setAttribute("aria-label", "Automation");
    item.dataset.kind = "automation";
    list.append(item);
  }
}

export function bindEditor(root) {
  const timeline = root.querySelector('[aria-label="Timeline"]');
  let scale = 1;
  let panX = 0;
  let panY = 0;
  const applyTimelineTransform = () => {
    if (!(timeline instanceof HTMLElement)) return;
    const parts = [`scale(${scale})`];
    if (panX !== 0 || panY !== 0) {
      parts.push(`translate(${panX}px, ${panY}px)`);
    }
    timeline.style.transform = parts.join(" ");
  };
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
  const timelineList = root.querySelector('[aria-label="Timeline"] ul');
  const slicesList = root.querySelector("ul");
  let selected = null;
  let selectedSliceItem = null;
  let selectedSliceIndex = null;
  let selectedActorItem = null;
  let selectedCommandItem = null;
  let selectedEventItem = null;
  let selectedReadModelItem = null;
  let selectedAutomationItem = null;
  const inspector = root.querySelector('[aria-label="Inspector"]');
  const nameInput = () => inspector?.querySelector("input");
  const descriptionInput = () =>
    [...(inspector?.querySelectorAll("input") ?? [])].find((el) =>
      el.closest("label")?.textContent?.includes("Description"),
    );
  const bindDescription = () => {
    if (!inspector) return;
    let input = descriptionInput();
    if (!input) {
      inspector.insertAdjacentHTML(
        "beforeend",
        "<label>Description <input /></label>",
      );
      input = descriptionInput();
      input?.addEventListener("input", () => {
        const holder = root.getElementById("event-model-document");
        if (holder && selected === "slice") {
          holder.textContent = JSON.stringify(
            setSliceDescription(
              JSON.parse(holder.textContent || "{}"),
              input.value,
            ),
          );
        }
        if (holder && selected === "actor") {
          holder.textContent = JSON.stringify(
            setActorDescription(
              JSON.parse(holder.textContent || "{}"),
              input.value,
            ),
          );
        }
        if (holder && selected === "command") {
          holder.textContent = JSON.stringify(
            setCommandDescription(
              JSON.parse(holder.textContent || "{}"),
              input.value,
            ),
          );
        }
      });
    }
  };
  const bindName = (value) => {
    if (!inspector) return;
    let input = nameInput();
    if (!input) {
      inspector.insertAdjacentHTML("beforeend", "<label>Name <input /></label>");
      input = nameInput();
      input?.addEventListener("input", () => {
        const holder = root.getElementById("event-model-document");
        if (holder && selected === "slice") {
          holder.textContent = JSON.stringify(
            setSliceTitle(JSON.parse(holder.textContent || "{}"), input.value),
          );
        }
        if (holder && selected === "actor") {
          holder.textContent = JSON.stringify(
            setActorName(JSON.parse(holder.textContent || "{}"), input.value),
          );
        }
        if (holder && selected === "command") {
          holder.textContent = JSON.stringify(
            setCommandTitle(JSON.parse(holder.textContent || "{}"), input.value),
          );
        }
        if (holder && selected === "event") {
          holder.textContent = JSON.stringify(
            setEventTitle(JSON.parse(holder.textContent || "{}"), input.value),
          );
        }
        if (holder && selected === "readmodel") {
          holder.textContent = JSON.stringify(
            setReadModelTitle(
              JSON.parse(holder.textContent || "{}"),
              input.value,
            ),
          );
        }
        if (holder && selected === "automation") {
          holder.textContent = JSON.stringify(
            setAutomationTitle(
              JSON.parse(holder.textContent || "{}"),
              input.value,
            ),
          );
        }
        if (selected === "slice" && selectedSliceItem) {
          selectedSliceItem.textContent = input.value;
          selectedSliceItem.setAttribute("aria-label", input.value);
        }
        if (selected === "actor" && selectedActorItem) {
          selectedActorItem.textContent = input.value;
          selectedActorItem.setAttribute("aria-label", input.value);
        }
        if (selected === "command" && selectedCommandItem) {
          selectedCommandItem.setAttribute("aria-label", input.value);
        }
        if (selected === "event" && selectedEventItem) {
          selectedEventItem.setAttribute("aria-label", input.value);
        }
        if (selected === "readmodel" && selectedReadModelItem) {
          selectedReadModelItem.setAttribute("aria-label", input.value);
        }
        if (selected === "automation" && selectedAutomationItem) {
          selectedAutomationItem.setAttribute("aria-label", input.value);
        }
        if (selected === "slice") {
          const main = root.querySelector("main");
          if (main && !main.textContent?.includes("Unsaved changes.")) {
            main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
          }
        }
      });
    }
    if (input) input.value = value;
  };
  timelineList?.addEventListener("click", (event) => {
    const item = event.target?.closest?.("li");
    if (!item || !timelineList.contains(item)) return;
    if (item.dataset.kind === "command") {
      selected = "command";
      selectedCommandItem = item;
      bindName("Command");
      bindDescription();
      return;
    }
    if (item.dataset.kind === "event") {
      selected = "event";
      selectedEventItem = item;
      bindName("Event Happened");
      return;
    }
    if (item.dataset.kind === "readmodel") {
      selected = "readmodel";
      selectedReadModelItem = item;
      bindName("Read Model");
      return;
    }
    if (item.dataset.kind === "automation") {
      selected = "automation";
      selectedAutomationItem = item;
      bindName("Automation");
      return;
    }
    if (item.dataset.kind !== "actor") return;
    selected = "actor";
    selectedActorItem = item;
    bindName("Actor");
    bindDescription();
  });
  slicesList?.addEventListener("click", (event) => {
    const item = event.target?.closest?.("li");
    if (!item || !slicesList.contains(item)) return;
    selected = "slice";
    selectedSliceItem = item;
    const indexAttr = item.getAttribute("data-slice-index");
    selectedSliceIndex = indexAttr === null ? null : Number(indexAttr);
    bindName("New Slice");
    bindDescription();
  });
  root.addEventListener("keydown", (event) => {
    if (
      event.altKey &&
      (event.metaKey || event.ctrlKey) &&
      event.key === "ArrowLeft"
    ) {
      const holder = root.getElementById("event-model-document");
      const sliceId = selectedSliceItem?.dataset?.id;
      if (holder && sliceId) {
        holder.textContent = JSON.stringify(
          moveSliceLeft(JSON.parse(holder.textContent || "{}"), sliceId),
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
      const kind = undoStack.pop();
      if (kind === "connection") {
        holder.textContent = JSON.stringify(
          undoConnection(JSON.parse(holder.textContent || "{}")),
        );
        const timeline = root.querySelector('[aria-label="Timeline"]');
        for (const node of [...(timeline?.querySelectorAll("p") ?? [])]) {
          if (node.textContent === "Command → Event Happened") node.remove();
        }
        return;
      }
      if (kind !== "slice") return;
      const model = JSON.parse(holder.textContent || "{}");
      const last = model.slices?.at(-1);
      if (!last) return;
      holder.textContent = JSON.stringify(deleteSlice(model, last.id));
      root.querySelector("ul")?.lastElementChild?.remove();
      return;
    }
    if (event.key !== "Backspace" && event.key !== "Delete") return;
    if (event.target instanceof HTMLInputElement) return;
    const holder = root.getElementById("event-model-document");
    const sliceId = selectedSliceItem?.dataset?.id;
    if (holder && selected === "slice" && sliceId && selectedSliceItem) {
      holder.textContent = JSON.stringify(
        deleteSlice(JSON.parse(holder.textContent || "{}"), sliceId),
      );
      selectedSliceItem.remove();
      selectedSliceItem = null;
      selected = null;
    }
  });
  let sourcePort = null;
  let dragActorItem = null;
  root.addEventListener("mousedown", (event) => {
    const actorItem = event.target?.closest?.("li");
    if (
      actorItem &&
      timelineList?.contains(actorItem) &&
      actorItem.dataset.kind === "actor"
    ) {
      dragActorItem = actorItem;
      return;
    }
    const port = event.target?.closest?.("button[data-id]");
    if (port) {
      sourcePort = port;
      if (port.dataset.kind === "COMMAND") {
        root
          .querySelector('[data-kind="EVENT"]')
          ?.setAttribute("aria-current", "true");
      }
      if (port.dataset.kind === "EVENT") {
        root
          .querySelector('[data-kind="READMODEL"]')
          ?.setAttribute("aria-current", "true");
      }
    }
  });
  root.addEventListener("mouseup", (event) => {
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
    const target = event.target?.closest?.("button[data-id]");
    if (sourcePort && target && sourcePort !== target) {
      const holder = root.getElementById("event-model-document");
      if (holder) {
        holder.textContent = JSON.stringify(
          appendConnection(JSON.parse(holder.textContent || "{}"), {
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
      if (
        sourcePort.dataset.kind === "COMMAND" &&
        target.dataset.kind === "EVENT"
      ) {
        const timeline = root.querySelector('[aria-label="Timeline"]');
        if (
          timeline &&
          !timeline.textContent?.includes("Command → Event Happened")
        ) {
          timeline.insertAdjacentHTML(
            "beforeend",
            "<p>Command → Event Happened</p>",
          );
        }
        undoStack.push("connection");
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
    }
    for (const highlighted of root.querySelectorAll("[aria-current]")) {
      highlighted.removeAttribute("aria-current");
    }
    sourcePort = null;
  });
  root.addEventListener("keydown", (event) => {
    if (!event.altKey || !(event.metaKey || event.ctrlKey)) return;
    const holder = root.getElementById("event-model-document");
    if (!holder) return;
    const model = JSON.parse(holder.textContent || "{}");
    if (event.code === "Digit1") {
      holder.textContent = JSON.stringify(appendActor(model));
    }
    if (event.code === "Digit2") {
      const index =
        selectedSliceIndex ?? (model.slices?.length ?? 1) - 1;
      holder.textContent = JSON.stringify(appendCommand(model, index));
    }
    if (event.code === "Digit3") {
      holder.textContent = JSON.stringify(appendEvent(model));
    }
    if (event.code === "Digit4") {
      holder.textContent = JSON.stringify(appendReadModel(model));
    }
    if (event.code === "Digit5") {
      holder.textContent = JSON.stringify(appendAutomation(model));
    }
  });
}

if (typeof document !== "undefined") {
  bindEditor(document);
}
