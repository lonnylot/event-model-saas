import { appendSlice } from "./append-slice.js";
import { appendActor } from "./append-actor.js";
import { appendCommand } from "./append-command.js";
import { appendEvent } from "./append-event.js";

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
  const holder = root.getElementById("event-model-document");
  if (holder) {
    holder.textContent = JSON.stringify(
      appendActor(JSON.parse(holder.textContent || "{}")),
    );
  }
}

export function onAddCommandClick(root) {
  const holder = root.getElementById("event-model-document");
  if (holder) {
    holder.textContent = JSON.stringify(
      appendCommand(JSON.parse(holder.textContent || "{}")),
    );
  }
}

export function onAddEventClick(root) {
  const holder = root.getElementById("event-model-document");
  if (holder) {
    holder.textContent = JSON.stringify(
      appendEvent(JSON.parse(holder.textContent || "{}")),
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
  });
}

if (typeof document !== "undefined") {
  bindEditor(document);
}
