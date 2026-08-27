import { appendSlice } from "./append-slice.js";
import { appendActor } from "./append-actor.js";
import { appendCommand } from "./append-command.js";
import { appendEvent } from "./append-event.js";
import { appendReadModel } from "./append-read-model.js";
import { appendAutomation } from "./append-automation.js";
import { appendConnection } from "./append-connection.js";
import { setSliceTitle } from "./set-slice-title.js";
import { setActorName } from "./set-actor-name.js";
import { setCommandTitle } from "./set-command-title.js";
import { setEventTitle } from "./set-event-title.js";
import { setReadModelTitle } from "./set-read-model-title.js";
import { setAutomationTitle } from "./set-automation-title.js";
import { moveSliceLeft } from "./move-slice-left.js";
import { moveActorToSlice } from "./move-actor-to-slice.js";

export function onNewSliceClick(root) {
  const holder = root.getElementById("event-model-document");
  const next = appendSlice(JSON.parse(holder?.textContent || "{}"));
  if (holder) holder.textContent = JSON.stringify(next);
  const slice = next.slices?.at(-1);
  const list = root.querySelector("ul");
  if (list) {
    const item = root.createElement("li");
    item.textContent = "New Slice";
    item.setAttribute("aria-label", "New Slice");
    if (slice) item.setAttribute("data-id", slice.id);
    list.append(item);
  }
  const main = root.querySelector("main");
  if (main && !main.textContent?.includes("Unsaved changes.")) {
    main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
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
  root.querySelectorAll("button").forEach((button) => {
    if (button.textContent === "Zoom in") {
      button.addEventListener("click", () => {
        const timeline = root.querySelector('[aria-label="Timeline"]');
        if (timeline instanceof HTMLElement) {
          timeline.style.transform = "scale(1.25)";
        }
      });
    }
    if (button.textContent === "Zoom out") {
      button.addEventListener("click", () => {
        const timeline = root.querySelector('[aria-label="Timeline"]');
        if (timeline instanceof HTMLElement) {
          timeline.style.transform = "scale(0.8)";
        }
      });
    }
    if (button.textContent === "Reset zoom") {
      button.addEventListener("click", () => {
        const timeline = root.querySelector('[aria-label="Timeline"]');
        if (timeline instanceof HTMLElement) {
          timeline.style.transform = "scale(1)";
        }
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
  let selectedActorItem = null;
  let selectedCommandItem = null;
  let selectedEventItem = null;
  let selectedReadModelItem = null;
  let selectedAutomationItem = null;
  const inspector = root.querySelector('[aria-label="Inspector"]');
  const nameInput = () => inspector?.querySelector("input");
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
  });
  slicesList?.addEventListener("click", (event) => {
    const item = event.target?.closest?.("li");
    if (!item || !slicesList.contains(item)) return;
    selected = "slice";
    selectedSliceItem = item;
    bindName("New Slice");
  });
  root.addEventListener("keydown", (event) => {
    if (
      !(
        event.altKey &&
        (event.metaKey || event.ctrlKey) &&
        event.key === "ArrowLeft"
      )
    ) {
      return;
    }
    const holder = root.getElementById("event-model-document");
    const sliceId = selectedSliceItem?.dataset?.id;
    if (holder && sliceId) {
      holder.textContent = JSON.stringify(
        moveSliceLeft(JSON.parse(holder.textContent || "{}"), sliceId),
      );
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
    if (port) sourcePort = port;
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
              target.dataset.kind === "READMODEL"
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
      }
      if (
        sourcePort.dataset.kind === "COMMAND" &&
        target.dataset.kind === "READMODEL"
      ) {
        const main = root.querySelector("main");
        if (
          main &&
          !main.textContent?.includes("A command can't write a read model.")
        ) {
          main.insertAdjacentHTML(
            "afterbegin",
            "<p>A command can't write a read model.</p>",
          );
        }
      }
    }
    sourcePort = null;
  });
}

if (typeof document !== "undefined") {
  bindEditor(document);
}
