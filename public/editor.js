import { appendSlice } from "./append-slice.js";

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
