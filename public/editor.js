import { appendSlice } from "./append-slice.js";

export function onNewSliceClick(root) {
  const holder = root.getElementById("event-model-document");
  if (holder) {
    holder.textContent = JSON.stringify(
      appendSlice(JSON.parse(holder.textContent || "{}")),
    );
  }
}

export function bindEditor(root) {
  root.querySelectorAll("button").forEach((button) => {
    if (button.textContent === "New Slice") {
      button.addEventListener("click", () => onNewSliceClick(root));
    }
  });
}

if (typeof document !== "undefined") {
  bindEditor(document);
}
