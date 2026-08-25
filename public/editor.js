import { appendSlice } from "./append-slice.js";
import { appendActor } from "./append-actor.js";
import { appendCommand } from "./append-command.js";
import { appendEvent } from "./append-event.js";
import { appendReadModel } from "./append-read-model.js";
import { appendAutomation } from "./append-automation.js";
import { appendConnection } from "./append-connection.js";
import { setSliceTitle } from "./set-slice-title.js";

export function onNewSliceClick(root) {
  const list = root.querySelector("ul");
  if (list) {
    const item = root.createElement("li");
    item.textContent = "New Slice";
    item.setAttribute("aria-label", "New Slice");
    list.append(item);
  }
  const main = root.querySelector("main");
  if (main && !main.textContent?.includes("Unsaved changes.")) {
    main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
  }
  const holder = root.getElementById("event-model-document");
  if (holder) {
    holder.textContent = JSON.stringify(
      appendSlice(JSON.parse(holder.textContent || "{}")),
    );
  }
}

export function onAddActorClick(root) {
  const list = root.querySelector('[aria-label="Timeline"] ul');
  if (list) {
    const item = root.createElement("li");
    item.textContent = "Actor";
    item.setAttribute("aria-label", "Actor");
    list.append(item);
  }
  const holder = root.getElementById("event-model-document");
  if (holder) {
    holder.textContent = JSON.stringify(
      appendActor(JSON.parse(holder.textContent || "{}")),
    );
  }
}

export function onAddCommandClick(root) {
  const holder = root.getElementById("event-model-document");
  const next = appendCommand(JSON.parse(holder?.textContent || "{}"));
  if (holder) holder.textContent = JSON.stringify(next);
  const command = next.slices?.at(-1)?.commands?.at(-1);
  const list = root.querySelector('[aria-label="Timeline"] ul');
  if (list) {
    const item = root.createElement("li");
    item.textContent = "Command";
    item.setAttribute("aria-label", "Command");
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
  if (list) {
    const item = root.createElement("li");
    item.textContent = "Event Happened";
    item.setAttribute("aria-label", "Event Happened");
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
  if (list) {
    const item = root.createElement("li");
    item.textContent = "Read Model";
    item.setAttribute("aria-label", "Read Model");
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
  const list = root.querySelector('[aria-label="Timeline"] ul');
  if (list) {
    const item = root.createElement("li");
    item.textContent = "Automation";
    item.setAttribute("aria-label", "Automation");
    list.append(item);
  }
  const holder = root.getElementById("event-model-document");
  if (holder) {
    holder.textContent = JSON.stringify(
      appendAutomation(JSON.parse(holder.textContent || "{}")),
    );
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
  timelineList?.addEventListener("click", (event) => {
    const item = event.target?.closest?.("li");
    if (!item || !timelineList.contains(item)) return;
    const inspector = root.querySelector('[aria-label="Inspector"]');
    if (inspector && !inspector.querySelector("input")) {
      inspector.insertAdjacentHTML("beforeend", "<label>Name <input /></label>");
    }
  });
  const slicesList = root.querySelector("ul");
  let selectedSliceItem = null;
  slicesList?.addEventListener("click", (event) => {
    const item = event.target?.closest?.("li");
    if (!item || !slicesList.contains(item)) return;
    selectedSliceItem = item;
    const inspector = root.querySelector('[aria-label="Inspector"]');
    if (inspector && !inspector.querySelector("input")) {
      inspector.insertAdjacentHTML(
        "beforeend",
        '<label>Name <input value="New Slice" /></label>',
      );
      const input = inspector.querySelector("input");
      input?.addEventListener("input", () => {
        const holder = root.getElementById("event-model-document");
        if (holder) {
          holder.textContent = JSON.stringify(
            setSliceTitle(JSON.parse(holder.textContent || "{}"), input.value),
          );
        }
        if (selectedSliceItem) {
          selectedSliceItem.textContent = input.value;
          selectedSliceItem.setAttribute("aria-label", input.value);
        }
        const main = root.querySelector("main");
        if (main && !main.textContent?.includes("Unsaved changes.")) {
          main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
        }
      });
    }
  });
  let sourcePort = null;
  root.addEventListener("mousedown", (event) => {
    const port = event.target?.closest?.("[data-id]");
    if (port) sourcePort = port;
  });
  root.addEventListener("mouseup", (event) => {
    const target = event.target?.closest?.("[data-id]");
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
