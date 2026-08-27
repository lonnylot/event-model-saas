import { appendSlice } from "./append-slice.js";
import { appendActor } from "./append-actor.js";
import { appendCommand } from "./append-command.js";
import { appendEvent } from "./append-event.js";
import { appendReadModel } from "./append-read-model.js";
import { appendAutomation } from "./append-automation.js";
import { appendConnection } from "./append-connection.js";
import { setSliceTitle } from "./set-slice-title.js";
import { setSliceDescription } from "./set-slice-description.js";
import { setSliceType } from "./set-slice-type.js";
import { setActorName } from "./set-actor-name.js";
import { setActorDescription } from "./set-actor-description.js";
import { setCommandTitle } from "./set-command-title.js";
import { setCommandDescription } from "./set-command-description.js";
import { setEventTitle } from "./set-event-title.js";
import { setEventDescription } from "./set-event-description.js";
import { setReadModelTitle } from "./set-read-model-title.js";
import { setReadModelDescription } from "./set-read-model-description.js";
import { setAutomationTitle } from "./set-automation-title.js";
import { setAutomationDescription } from "./set-automation-description.js";
import { appendField } from "./append-field.js";
import { setFieldName } from "./set-field-name.js";
import { setFieldType } from "./set-field-type.js";
import { setFieldOptional } from "./set-field-optional.js";
import { setFieldExample } from "./set-field-example.js";
import { deleteField } from "./delete-field.js";
import { setEventModelTitle } from "./set-event-model-title.js";
import { setEventModelDescription } from "./set-event-model-description.js";
import { moveSliceLeft } from "./move-slice-left.js";
import { moveSliceRight } from "./move-slice-right.js";
import { reorderSlices } from "./reorder-slices.js";
import { moveActorToSlice } from "./move-actor-to-slice.js";
import { moveCommandToSlice } from "./move-command-to-slice.js";
import { deleteSlice } from "./delete-slice.js";
import { deleteCommand } from "./delete-command.js";
import { deleteConnection } from "./delete-connection.js";
import { deleteActor } from "./delete-actor.js";
import { deleteEvent } from "./delete-event.js";
import { deleteReadModel } from "./delete-read-model.js";
import { deleteAutomation } from "./delete-automation.js";
import { undoConnection } from "./undo-connection.js";
import { undoAddCommand } from "./undo-add-command.js";

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
  const timeline = root.querySelector('[aria-label="Timeline"]');
  if (timeline) {
    const actor = root.createElement("button");
    actor.type = "button";
    actor.textContent = "Add Actor on lane";
    actor.setAttribute("data-slice-index", String(sliceIndex));
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
    event.setAttribute("data-slice-index", String(sliceIndex));
    timeline.append(event);
    const readModel = root.createElement("button");
    readModel.type = "button";
    readModel.textContent = "Add Read Model on lane";
    readModel.setAttribute("data-slice-index", String(sliceIndex));
    timeline.append(readModel);
    const automation = root.createElement("button");
    automation.type = "button";
    automation.textContent = "Add Automation on lane";
    automation.setAttribute("data-slice-index", String(sliceIndex));
    timeline.append(automation);
  }
  undoStack.push("slice");
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
    item.setAttribute("data-id", command.id);
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
    item.setAttribute("data-id", event.id);
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
    item.setAttribute("data-id", readModel.id);
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
    item.setAttribute("data-id", automation.id);
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
    timeline.addEventListener("click", (event) => {
      const connection = event.target?.closest?.("[data-kind=connection]");
      if (!connection || !timeline.contains(connection)) return;
      const inspector = root.querySelector('[aria-label="Inspector"]');
      if (connection.textContent === "Command → Event Happened") {
        if (
          inspector &&
          !inspector.textContent?.includes("Connection")
        ) {
          inspector.insertAdjacentHTML("beforeend", "<p>Connection</p>");
        }
        if (
          inspector &&
          !inspector.textContent?.includes("From Command")
        ) {
          inspector.insertAdjacentHTML("beforeend", "<p>From Command</p>");
        }
        if (
          inspector &&
          !inspector.textContent?.includes("To Event Happened")
        ) {
          inspector.insertAdjacentHTML("beforeend", "<p>To Event Happened</p>");
        }
        return;
      }
      if (connection.textContent !== "Event Happened → Read Model") return;
      if (
        inspector &&
        !inspector.textContent?.includes("From Event Happened")
      ) {
        inspector.insertAdjacentHTML("beforeend", "<p>From Event Happened</p>");
      }
      if (
        inspector &&
        !inspector.textContent?.includes("To Read Model")
      ) {
        inspector.insertAdjacentHTML("beforeend", "<p>To Read Model</p>");
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
  let selectedConnectionItem = null;
  const inspector = root.querySelector('[aria-label="Inspector"]');
  const nameInput = () =>
    [...(inspector?.querySelectorAll("input") ?? [])].find(
      (el) =>
        el.closest("label")?.childNodes[0]?.textContent?.trim() === "Name",
    );
  const descriptionInput = () =>
    [...(inspector?.querySelectorAll("input") ?? [])].find((el) =>
      el.closest("label")?.textContent?.includes("Description"),
    );
  const bindDescription = (value) => {
    if (
      !inspector ||
      (selected !== "slice" &&
        selected !== "actor" &&
        selected !== "command" &&
        selected !== "event" &&
        selected !== "readmodel" &&
        selected !== "automation")
    ) {
      unbindDescription();
      return;
    }
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
        if (holder && selected === "event") {
          holder.textContent = JSON.stringify(
            setEventDescription(
              JSON.parse(holder.textContent || "{}"),
              input.value,
            ),
          );
        }
        if (holder && selected === "readmodel") {
          holder.textContent = JSON.stringify(
            setReadModelDescription(
              JSON.parse(holder.textContent || "{}"),
              input.value,
            ),
          );
        }
        if (holder && selected === "automation") {
          holder.textContent = JSON.stringify(
            setAutomationDescription(
              JSON.parse(holder.textContent || "{}"),
              input.value,
            ),
          );
        }
      });
    }
    if (input && value !== undefined) input.value = value;
  };
  const addFieldButton = () =>
    [...(inspector?.querySelectorAll("button") ?? [])].find(
      (button) => button.textContent === "Add Field",
    );
  const fieldNameLabel = () =>
    [...(inspector?.querySelectorAll("label") ?? [])].find((label) =>
      label.textContent?.includes("Field name"),
    );
  const fieldTypeLabel = () =>
    [...(inspector?.querySelectorAll("label") ?? [])].find((label) =>
      label.textContent?.includes("Field type"),
    );
  const optionalLabel = () =>
    [...(inspector?.querySelectorAll("label") ?? [])].find((label) =>
      label.textContent?.includes("Optional"),
    );
  const exampleLabel = () =>
    [...(inspector?.querySelectorAll("label") ?? [])].find((label) =>
      label.textContent?.includes("Example"),
    );
  const deleteFieldButton = () =>
    [...(inspector?.querySelectorAll("button") ?? [])].find(
      (button) => button.textContent === "Delete Field",
    );
  const unbindAddField = () => addFieldButton()?.remove();
  const unbindFieldName = () => fieldNameLabel()?.remove();
  const unbindFieldRow = () => {
    unbindFieldName();
    fieldTypeLabel()?.remove();
    optionalLabel()?.remove();
    exampleLabel()?.remove();
    deleteFieldButton()?.remove();
  };
  const unbindDescription = () =>
    descriptionInput()?.closest("label")?.remove();
  const getRenderedTimelineItems = new Set(
    timelineList ? [...timelineList.querySelectorAll("li")] : [],
  );
  const omitGetRenderedInspectChrome = (item) => {
    if (!getRenderedTimelineItems.has(item)) return false;
    unbindAddField();
    unbindFieldRow();
    unbindDescription();
    return true;
  };
  const lastCommandDescription = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.commands?.at(-1)?.description ?? "";
  };
  const lastSliceDescription = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.description ?? "";
  };
  const lastActorDescription = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.actors?.at(-1)?.description ?? "";
  };
  const lastEventDescription = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.events?.at(-1)?.description ?? "";
  };
  const lastReadModelDescription = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.readModels?.at(-1)?.description ?? "";
  };
  const lastAutomationDescription = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.processors?.at(-1)?.description ?? "";
  };
  const lastCommandFieldName = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.commands?.at(-1)?.fields?.[0]?.name;
  };
  const lastEventFieldName = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.events?.at(-1)?.fields?.[0]?.name;
  };
  const lastReadModelFieldName = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.readModels?.at(-1)?.fields?.[0]?.name;
  };
  const lastAutomationFieldName = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.processors?.at(-1)?.fields?.[0]?.name;
  };
  const lastCommandFieldType = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.commands?.at(-1)?.fields?.[0]?.type;
  };
  const lastEventFieldType = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.events?.at(-1)?.fields?.[0]?.type;
  };
  const lastReadModelFieldType = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.readModels?.at(-1)?.fields?.[0]?.type;
  };
  const lastAutomationFieldType = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.processors?.at(-1)?.fields?.[0]?.type;
  };
  const lastCommandFieldOptional = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.commands?.at(-1)?.fields?.[0]?.optional === true;
  };
  const lastCommandFieldExample = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    return model.slices?.at(-1)?.commands?.at(-1)?.fields?.[0]?.example ?? "";
  };
  const lastSliceTypeLabel = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const sliceType = model.slices?.at(-1)?.sliceType;
    if (sliceType === "STATE_VIEW") return "State View";
    if (sliceType === "AUTOMATION") return "Automation";
    return "State Change";
  };
  const typeSelect = () =>
    [...(inspector?.querySelectorAll("select") ?? [])].find(
      (select) =>
        select.closest("label")?.childNodes[0]?.textContent?.trim() === "Type",
    );
  const unbindType = () => {
    typeSelect()?.closest("label")?.remove();
  };
  const bindType = (value) => {
    if (!inspector || selected !== "slice") {
      unbindType();
      return;
    }
    let select = typeSelect();
    if (!select) {
      inspector.insertAdjacentHTML(
        "beforeend",
        "<label>Type <select><option>State Change</option><option>State View</option><option>Automation</option></select></label>",
      );
      select = typeSelect();
      select?.addEventListener("change", () => {
        const sliceType =
          select.value === "State View"
            ? "STATE_VIEW"
            : select.value === "Automation"
              ? "AUTOMATION"
              : "STATE_CHANGE";
        const holder = root.getElementById("event-model-document");
        if (holder) {
          holder.textContent = JSON.stringify(
            setSliceType(JSON.parse(holder.textContent || "{}"), sliceType),
          );
        }
      });
    }
    if (select) select.value = value;
  };
  const fieldTypeSelect = () =>
    [...(inspector?.querySelectorAll("select") ?? [])].find((select) =>
      select.closest("label")?.textContent?.includes("Field type"),
    );
  const unbindFieldType = () => fieldTypeSelect()?.closest("label")?.remove();
  const bindFieldType = (value) => {
    if (
      !inspector ||
      (selected !== "command" &&
        selected !== "event" &&
        selected !== "readmodel" &&
        selected !== "automation")
    ) {
      unbindFieldType();
      return;
    }
    let select = fieldTypeSelect();
    if (!select) {
      inspector.insertAdjacentHTML(
        "beforeend",
        "<label>Field type <select><option>String</option><option>Boolean</option><option>Int</option><option>Long</option><option>Double</option><option>Decimal</option><option>Date</option><option>DateTime</option><option>UUID</option><option>Custom</option></select></label>",
      );
      select = fieldTypeSelect();
      select?.addEventListener("change", () => {
        const holder = root.getElementById("event-model-document");
        if (holder && selected === "command") {
          holder.textContent = JSON.stringify(
            setFieldType(JSON.parse(holder.textContent || "{}"), select.value),
          );
        }
        if (holder && selected === "event") {
          holder.textContent = JSON.stringify(
            setFieldType(
              JSON.parse(holder.textContent || "{}"),
              select.value,
              "event",
            ),
          );
        }
        if (holder && selected === "readmodel") {
          holder.textContent = JSON.stringify(
            setFieldType(
              JSON.parse(holder.textContent || "{}"),
              select.value,
              "readmodel",
            ),
          );
        }
        if (holder && selected === "automation") {
          holder.textContent = JSON.stringify(
            setFieldType(
              JSON.parse(holder.textContent || "{}"),
              select.value,
              "automation",
            ),
          );
        }
      });
    }
    if (select && value) select.value = value;
  };
  const optionalInput = () =>
    [...(inspector?.querySelectorAll("input") ?? [])].find(
      (el) =>
        el.type === "checkbox" &&
        el.closest("label")?.textContent?.includes("Optional"),
    );
  const unbindOptional = () => optionalInput()?.closest("label")?.remove();
  const bindOptional = (checked) => {
    if (!inspector || selected !== "command") {
      unbindOptional();
      return;
    }
    let input = optionalInput();
    if (!input) {
      inspector.insertAdjacentHTML(
        "beforeend",
        '<label>Optional <input type="checkbox" /></label>',
      );
      input = optionalInput();
      input?.addEventListener("change", () => {
        const holder = root.getElementById("event-model-document");
        if (holder && selected === "command") {
          holder.textContent = JSON.stringify(
            setFieldOptional(
              JSON.parse(holder.textContent || "{}"),
              input.checked,
            ),
          );
        }
      });
    }
    if (input) input.checked = !!checked;
  };
  const exampleInput = () =>
    [...(inspector?.querySelectorAll("input") ?? [])].find(
      (el) =>
        el.type !== "checkbox" &&
        el.closest("label")?.textContent?.includes("Example"),
    );
  const unbindExample = () => exampleInput()?.closest("label")?.remove();
  const bindExample = (value) => {
    if (!inspector || selected !== "command") {
      unbindExample();
      return;
    }
    let input = exampleInput();
    if (!input) {
      inspector.insertAdjacentHTML(
        "beforeend",
        "<label>Example <input /></label>",
      );
      input = exampleInput();
      input?.addEventListener("input", () => {
        const holder = root.getElementById("event-model-document");
        if (holder && selected === "command") {
          holder.textContent = JSON.stringify(
            setFieldExample(JSON.parse(holder.textContent || "{}"), input.value),
          );
        }
      });
    }
    if (input) input.value = value ?? "";
  };
  const fieldNameInput = () =>
    [...(inspector?.querySelectorAll("input") ?? [])].find((el) =>
      el.closest("label")?.textContent?.includes("Field name"),
    );
  const bindFieldName = (value) => {
    if (
      !inspector ||
      (selected !== "command" &&
        selected !== "event" &&
        selected !== "readmodel" &&
        selected !== "automation")
    ) {
      unbindFieldName();
      return;
    }
    let input = fieldNameInput();
    if (!input) {
      inspector.insertAdjacentHTML(
        "beforeend",
        "<label>Field name <input /></label>",
      );
      input = fieldNameInput();
      input?.addEventListener("input", () => {
        const holder = root.getElementById("event-model-document");
        if (holder && selected === "command") {
          holder.textContent = JSON.stringify(
            setFieldName(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              selectedCommandItem?.dataset?.id,
              "command",
            ),
          );
        }
        if (holder && selected === "event") {
          holder.textContent = JSON.stringify(
            setFieldName(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              selectedEventItem?.dataset?.id,
              "event",
            ),
          );
        }
        if (holder && selected === "readmodel") {
          holder.textContent = JSON.stringify(
            setFieldName(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              selectedReadModelItem?.dataset?.id,
              "readmodel",
            ),
          );
        }
        if (holder && selected === "automation") {
          holder.textContent = JSON.stringify(
            setFieldName(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              selectedAutomationItem?.dataset?.id,
              "automation",
            ),
          );
        }
      });
    }
    if (input) input.value = value;
  };
  const unbindFieldChrome = () => {
    unbindAddField();
    unbindFieldRow();
  };
  const bindAddField = () => {
    if (!inspector || addFieldButton()) return;
    inspector.insertAdjacentHTML(
      "beforeend",
      '<button type="button">Add Field</button>',
    );
    addFieldButton()?.addEventListener("click", () => {
      if (
        selected !== "command" &&
        selected !== "event" &&
        selected !== "readmodel" &&
        selected !== "automation"
      ) {
        return;
      }
      const holder = root.getElementById("event-model-document");
      if (holder) {
        holder.textContent = JSON.stringify(
          appendField(
            JSON.parse(holder.textContent || "{}"),
            selected,
            selected === "command"
              ? selectedCommandItem?.dataset?.id
              : selected === "event"
                ? selectedEventItem?.dataset?.id
                : selected === "readmodel"
                  ? selectedReadModelItem?.dataset?.id
                  : selectedAutomationItem?.dataset?.id,
          ),
        );
      }
      if (
        inspector &&
        (selected === "command" ||
          selected === "event" ||
          selected === "readmodel" ||
          selected === "automation") &&
        !fieldNameLabel()
      ) {
        inspector.insertAdjacentHTML(
          "beforeend",
          "<label>Field name <input /></label>",
        );
        const fieldNameInput = fieldNameLabel()?.querySelector("input");
        fieldNameInput?.addEventListener("input", () => {
          const documentHolder = root.getElementById("event-model-document");
          if (documentHolder) {
            documentHolder.textContent = JSON.stringify(
              setFieldName(
                JSON.parse(documentHolder.textContent || "{}"),
                fieldNameInput.value,
                selected === "command"
                  ? selectedCommandItem?.dataset?.id
                  : selected === "event"
                    ? selectedEventItem?.dataset?.id
                    : selected === "readmodel"
                      ? selectedReadModelItem?.dataset?.id
                      : selectedAutomationItem?.dataset?.id,
                selected,
              ),
            );
          }
        });
      }
      if (
        inspector &&
        (selected === "command" ||
          selected === "event" ||
          selected === "readmodel" ||
          selected === "automation") &&
        ![...inspector.querySelectorAll("select")].some((select) =>
          select.closest("label")?.textContent?.includes("Field type"),
        )
      ) {
        inspector.insertAdjacentHTML(
          "beforeend",
          "<label>Field type <select><option>String</option><option>Boolean</option><option>Int</option><option>Long</option><option>Double</option><option>Decimal</option><option>Date</option><option>DateTime</option><option>UUID</option><option>Custom</option></select></label>",
        );
        const fieldTypeSelect = [...inspector.querySelectorAll("select")].find(
          (select) =>
            select.closest("label")?.textContent?.includes("Field type"),
        );
        fieldTypeSelect?.addEventListener("change", () => {
          const documentHolder = root.getElementById("event-model-document");
          if (documentHolder) {
            documentHolder.textContent = JSON.stringify(
              setFieldType(
                JSON.parse(documentHolder.textContent || "{}"),
                fieldTypeSelect.value,
                selected,
                selected === "command"
                  ? selectedCommandItem?.dataset?.id
                  : undefined,
              ),
            );
          }
        });
      }
      if (
        inspector &&
        (selected === "command" ||
          selected === "event" ||
          selected === "readmodel" ||
          selected === "automation") &&
        ![...inspector.querySelectorAll("input")].some((input) =>
          input.closest("label")?.textContent?.includes("Optional"),
        )
      ) {
        inspector.insertAdjacentHTML(
          "beforeend",
          '<label>Optional <input type="checkbox" /></label>',
        );
        const optionalInput = [...inspector.querySelectorAll("input")].find(
          (input) => input.closest("label")?.textContent?.includes("Optional"),
        );
        optionalInput?.addEventListener("change", () => {
          const documentHolder = root.getElementById("event-model-document");
          if (documentHolder) {
            documentHolder.textContent = JSON.stringify(
              setFieldOptional(
                JSON.parse(documentHolder.textContent || "{}"),
                optionalInput.checked,
                selected,
                selected === "command"
                  ? selectedCommandItem?.dataset?.id
                  : undefined,
              ),
            );
          }
        });
      }
      if (
        inspector &&
        (selected === "command" ||
          selected === "event" ||
          selected === "readmodel" ||
          selected === "automation") &&
        ![...inspector.querySelectorAll("input")].some((input) =>
          input.closest("label")?.textContent?.includes("Example"),
        )
      ) {
        inspector.insertAdjacentHTML(
          "beforeend",
          "<label>Example <input /></label>",
        );
        const exampleInput = [...inspector.querySelectorAll("input")].find(
          (input) => input.closest("label")?.textContent?.includes("Example"),
        );
        exampleInput?.addEventListener("input", () => {
          const documentHolder = root.getElementById("event-model-document");
          if (documentHolder) {
            documentHolder.textContent = JSON.stringify(
              setFieldExample(
                JSON.parse(documentHolder.textContent || "{}"),
                exampleInput.value,
                selected,
                selected === "command"
                  ? selectedCommandItem?.dataset?.id
                  : undefined,
              ),
            );
          }
        });
      }
      if (
        inspector &&
        (selected === "command" ||
          selected === "event" ||
          selected === "readmodel" ||
          selected === "automation") &&
        ![...inspector.querySelectorAll("button")].some(
          (item) => item.textContent === "Delete Field",
        )
      ) {
        inspector.insertAdjacentHTML(
          "beforeend",
          '<button type="button">Delete Field</button>',
        );
        const deleteButton = [...inspector.querySelectorAll("button")].find(
          (item) => item.textContent === "Delete Field",
        );
        deleteButton?.addEventListener("click", () => {
          const documentHolder = root.getElementById("event-model-document");
          if (documentHolder) {
            documentHolder.textContent = JSON.stringify(
              deleteField(
                JSON.parse(documentHolder.textContent || "{}"),
                selected,
                selected === "command"
                  ? selectedCommandItem?.dataset?.id
                  : undefined,
              ),
            );
          }
        });
      }
    });
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
            setSliceTitle(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              selectedSliceItem?.dataset?.id,
            ),
          );
        }
        if (holder && selected === "actor") {
          holder.textContent = JSON.stringify(
            setActorName(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              selectedActorItem?.dataset?.id,
            ),
          );
        }
        if (holder && selected === "command") {
          holder.textContent = JSON.stringify(
            setCommandTitle(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              selectedCommandItem?.dataset?.id,
            ),
          );
        }
        if (holder && selected === "event") {
          holder.textContent = JSON.stringify(
            setEventTitle(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              selectedEventItem?.dataset?.id,
            ),
          );
        }
        if (holder && selected === "readmodel") {
          holder.textContent = JSON.stringify(
            setReadModelTitle(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              selectedReadModelItem?.dataset?.id,
            ),
          );
        }
        if (holder && selected === "automation") {
          holder.textContent = JSON.stringify(
            setAutomationTitle(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              selectedAutomationItem?.dataset?.id,
            ),
          );
        }
        if (holder && selected === "model") {
          holder.textContent = JSON.stringify(
            setEventModelTitle(
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
          const textNode = [...selectedCommandItem.childNodes].find(
            (node) => node.nodeType === Node.TEXT_NODE,
          );
          if (textNode) textNode.textContent = input.value;
          selectedCommandItem.setAttribute("aria-label", input.value);
        }
        if (selected === "event" && selectedEventItem) {
          const text = [...selectedEventItem.childNodes].find(
            (node) => node.nodeType === 3,
          );
          if (text) text.textContent = input.value;
          selectedEventItem.setAttribute("aria-label", input.value);
        }
        if (selected === "readmodel" && selectedReadModelItem) {
          selectedReadModelItem.setAttribute("aria-label", input.value);
        }
        if (selected === "automation" && selectedAutomationItem) {
          selectedAutomationItem.setAttribute("aria-label", input.value);
        }
        if (selected === "model") {
          const heading = root.querySelector("h1");
          if (heading) heading.textContent = input.value;
        }
        if (selected === "slice" || selected === "actor" || selected === "command") {
          const main = root.querySelector("main");
          if (main && !main.textContent?.includes("Unsaved changes.")) {
            main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
          }
        }
      });
    }
    if (input) input.value = value;
    const typeSelect = inspector?.querySelector("select");
    if (selected === "slice") {
      if (inspector && !typeSelect) {
        inspector.insertAdjacentHTML(
          "beforeend",
          "<label>Type <select><option>State Change</option><option>State View</option><option>Automation</option></select></label>",
        );
        const select = inspector.querySelector("select");
        select?.addEventListener("change", () => {
          const sliceType =
            select.value === "State View"
              ? "STATE_VIEW"
              : select.value === "Automation"
                ? "AUTOMATION"
                : null;
          if (!sliceType) return;
          const holder = root.getElementById("event-model-document");
          if (holder) {
            holder.textContent = JSON.stringify(
              setSliceType(JSON.parse(holder.textContent || "{}"), sliceType),
            );
          }
        });
      }
    } else {
      typeSelect?.closest("label")?.remove();
    }
    if (selected !== "model") {
      inspector.querySelector("textarea")?.closest("label")?.remove();
    } else {
      unbindDescription();
    }
  };
  timelineList?.addEventListener("click", (event) => {
    const item = event.target?.closest?.("li");
    if (!item || !timelineList.contains(item)) return;
    if (item.dataset.kind === "command") {
      selected = "command";
      selectedCommandItem = item;
      bindName(item.getAttribute("aria-label") ?? "Command");
      if (omitGetRenderedInspectChrome(item)) {
        bindDescription(lastCommandDescription());
        const fieldName = lastCommandFieldName();
        if (fieldName) {
          bindFieldName(fieldName);
          bindFieldType(lastCommandFieldType());
          bindOptional(lastCommandFieldOptional());
          bindExample(lastCommandFieldExample());
        }
        return;
      }
      bindAddField();
      bindDescription(lastCommandDescription());
      const fieldName = lastCommandFieldName();
      if (fieldName) {
        bindFieldName(fieldName);
        bindFieldType(lastCommandFieldType());
        bindOptional(lastCommandFieldOptional());
        bindExample(lastCommandFieldExample());
      }
      return;
    }
    if (item.dataset.kind === "event") {
      selected = "event";
      selectedEventItem = item;
      bindName(item.getAttribute("aria-label") ?? "Event Happened");
      if (omitGetRenderedInspectChrome(item)) {
        bindDescription(lastEventDescription());
        const eventFieldName = lastEventFieldName();
        if (eventFieldName) {
          bindFieldName(eventFieldName);
          bindFieldType(lastEventFieldType());
        }
        return;
      }
      bindAddField();
      bindDescription(lastEventDescription());
      const eventFieldName = lastEventFieldName();
      if (eventFieldName) {
        bindFieldName(eventFieldName);
        bindFieldType(lastEventFieldType());
      } else {
        unbindFieldRow();
      }
      return;
    }
    if (item.dataset.kind === "readmodel") {
      selected = "readmodel";
      selectedReadModelItem = item;
      bindName(item.getAttribute("aria-label") ?? "Read Model");
      if (omitGetRenderedInspectChrome(item)) {
        bindDescription(lastReadModelDescription());
        const readModelFieldName = lastReadModelFieldName();
        if (readModelFieldName) {
          bindFieldName(readModelFieldName);
          bindFieldType(lastReadModelFieldType());
        }
        return;
      }
      bindAddField();
      bindDescription(lastReadModelDescription());
      const readModelFieldName = lastReadModelFieldName();
      if (readModelFieldName) {
        bindFieldName(readModelFieldName);
        bindFieldType(lastReadModelFieldType());
      } else {
        unbindFieldRow();
      }
      return;
    }
    if (item.dataset.kind === "automation") {
      selected = "automation";
      selectedAutomationItem = item;
      bindName(item.getAttribute("aria-label") ?? "Automation");
      if (omitGetRenderedInspectChrome(item)) {
        bindDescription(lastAutomationDescription());
        const automationFieldName = lastAutomationFieldName();
        if (automationFieldName) {
          bindFieldName(automationFieldName);
          bindFieldType(lastAutomationFieldType());
        }
        return;
      }
      bindAddField();
      bindDescription(lastAutomationDescription());
      const automationFieldName = lastAutomationFieldName();
      if (automationFieldName) {
        bindFieldName(automationFieldName);
        bindFieldType(lastAutomationFieldType());
      } else {
        unbindFieldRow();
      }
      return;
    }
    if (item.dataset.kind !== "actor") return;
    selected = "actor";
    selectedActorItem = item;
    bindName(item.getAttribute("aria-label") ?? "Actor");
    if (omitGetRenderedInspectChrome(item)) {
      bindDescription(lastActorDescription());
      return;
    }
    bindDescription(lastActorDescription());
    unbindFieldChrome();
  });
  timeline?.addEventListener("click", (event) => {
    const line = event.target?.closest?.("p");
    if (!line || !timeline.contains(line)) return;
    if (line.textContent !== "Command → Event Happened") return;
    selected = "connection";
    selectedConnectionItem = line;
  });
  slicesList?.addEventListener("click", (event) => {
    const item = event.target?.closest?.("li");
    if (!item || !slicesList.contains(item)) return;
    selected = "slice";
    selectedSliceItem = item;
    const indexAttr = item.getAttribute("data-slice-index");
    selectedSliceIndex = indexAttr === null ? null : Number(indexAttr);
    bindName(item.getAttribute("aria-label") ?? "New Slice");
    bindDescription(lastSliceDescription());
    bindType(lastSliceTypeLabel());
    unbindFieldChrome();
  });
  root.querySelector("h1")?.addEventListener("click", () => {
    selected = "model";
    const heading = root.querySelector("h1");
    bindName(heading?.textContent ?? "Untitled");
    unbindDescription();
    unbindType();
    unbindFieldChrome();
    if (inspector && !inspector.querySelector("textarea")) {
      inspector.insertAdjacentHTML(
        "beforeend",
        "<label>Description <textarea></textarea></label>",
      );
      inspector.querySelector("textarea")?.addEventListener("input", () => {
        const holder = root.getElementById("event-model-document");
        const textarea = inspector.querySelector("textarea");
        if (holder && selected === "model" && textarea) {
          holder.textContent = JSON.stringify(
            setEventModelDescription(
              JSON.parse(holder.textContent || "{}"),
              textarea.value,
            ),
          );
        }
      });
    }
  });
  root.addEventListener("keydown", (event) => {
    if (
      event.shiftKey &&
      (event.metaKey || event.ctrlKey) &&
      !event.altKey &&
      (event.key === "n" || event.key === "N")
    ) {
      event.preventDefault();
      onNewSliceClick(root);
      return;
    }
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
      event.altKey &&
      (event.metaKey || event.ctrlKey) &&
      event.key === "ArrowRight"
    ) {
      const holder = root.getElementById("event-model-document");
      const sliceId = selectedSliceItem?.dataset?.id;
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
      if (kind === "command") {
        holder.textContent = JSON.stringify(
          undoAddCommand(JSON.parse(holder.textContent || "{}")),
        );
        const timelineList = root.querySelector('[aria-label="Timeline"] ul');
        for (const node of [...(timelineList?.querySelectorAll("li") ?? [])]) {
          if (node.getAttribute("aria-label") === "Command") node.remove();
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
    if (
      (event.metaKey || event.ctrlKey) &&
      !event.altKey &&
      (event.key === "=" || event.key === "+")
    ) {
      event.preventDefault();
      scale = 1.25;
      applyTimelineTransform();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key === "-") {
      event.preventDefault();
      scale = 0.8;
      applyTimelineTransform();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key === "0") {
      event.preventDefault();
      scale = 1;
      applyTimelineTransform();
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
    const commandId = selectedCommandItem?.dataset?.id;
    if (holder && selected === "command" && commandId && selectedCommandItem) {
      holder.textContent = JSON.stringify(
        deleteCommand(JSON.parse(holder.textContent || "{}"), commandId),
      );
      selectedCommandItem.remove();
      selectedCommandItem = null;
      selected = null;
    }
    const connectionId = selectedConnectionItem?.dataset?.id;
    if (
      holder &&
      selected === "connection" &&
      connectionId &&
      selectedConnectionItem
    ) {
      holder.textContent = JSON.stringify(
        deleteConnection(JSON.parse(holder.textContent || "{}"), connectionId),
      );
      selectedConnectionItem.remove();
      selectedConnectionItem = null;
      selected = null;
    }
    const actorId = selectedActorItem?.dataset?.id;
    if (holder && selected === "actor" && actorId && selectedActorItem) {
      holder.textContent = JSON.stringify(
        deleteActor(JSON.parse(holder.textContent || "{}"), actorId),
      );
      selectedActorItem.remove();
      selectedActorItem = null;
      selected = null;
    }
    const eventId = selectedEventItem?.dataset?.id;
    if (holder && selected === "event" && eventId && selectedEventItem) {
      holder.textContent = JSON.stringify(
        deleteEvent(JSON.parse(holder.textContent || "{}"), eventId),
      );
      selectedEventItem.remove();
      selectedEventItem = null;
      selected = null;
    }
    const readModelId = selectedReadModelItem?.dataset?.id;
    if (
      holder &&
      selected === "readmodel" &&
      readModelId &&
      selectedReadModelItem
    ) {
      holder.textContent = JSON.stringify(
        deleteReadModel(JSON.parse(holder.textContent || "{}"), readModelId),
      );
      selectedReadModelItem.remove();
      selectedReadModelItem = null;
      selected = null;
    }
    const automationId = selectedAutomationItem?.dataset?.id;
    if (
      holder &&
      selected === "automation" &&
      automationId &&
      selectedAutomationItem
    ) {
      holder.textContent = JSON.stringify(
        deleteAutomation(JSON.parse(holder.textContent || "{}"), automationId),
      );
      selectedAutomationItem.remove();
      selectedAutomationItem = null;
      selected = null;
    }
  });
  let sourcePort = null;
  let dragActorItem = null;
  let dragSliceItem = null;
  let dragCommandItem = null;
  root.addEventListener("mousedown", (event) => {
    const actorItem = event.target?.closest?.("li");
    if (actorItem && slicesList?.contains(actorItem)) {
      dragSliceItem = actorItem;
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
        const timeline = root.querySelector('[aria-label="Timeline"]');
        if (
          timeline &&
          !timeline.textContent?.includes("Command → Event Happened")
        ) {
          const line = root.createElement("p");
          line.textContent = "Command → Event Happened";
          line.setAttribute("data-kind", "connection");
          const connection = JSON.parse(
            holder?.textContent || "{}",
          ).connections?.at(-1);
          if (connection) line.setAttribute("data-id", connection.id);
          timeline.append(line);
        }
        undoStack.push("connection");
      }
      if (
        !alreadyConnected &&
        sourcePort.dataset.kind === "EVENT" &&
        target.dataset.kind === "READMODEL"
      ) {
        const timelineRegion = root.querySelector('[aria-label="Timeline"]');
        if (
          timelineRegion &&
          !timelineRegion.textContent?.includes("Event Happened → Read Model")
        ) {
          timelineRegion.insertAdjacentHTML(
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
  root.addEventListener("keydown", (event) => {
    if (!event.altKey || !(event.metaKey || event.ctrlKey)) return;
    const holder = root.getElementById("event-model-document");
    if (!holder) return;
    const model = JSON.parse(holder.textContent || "{}");
    if (event.code === "Digit1") {
      const index =
        selectedSliceIndex ?? (model.slices?.length ?? 1) - 1;
      holder.textContent = JSON.stringify(appendActor(model, index));
    }
    if (event.code === "Digit2") {
      const index =
        selectedSliceIndex ?? (model.slices?.length ?? 1) - 1;
      holder.textContent = JSON.stringify(appendCommand(model, index));
    }
    if (event.code === "Digit3") {
      const index =
        selectedSliceIndex ?? (model.slices?.length ?? 1) - 1;
      holder.textContent = JSON.stringify(appendEvent(model, index));
    }
    if (event.code === "Digit4") {
      const index =
        selectedSliceIndex ?? (model.slices?.length ?? 1) - 1;
      holder.textContent = JSON.stringify(appendReadModel(model, index));
    }
    if (event.code === "Digit5") {
      const index =
        selectedSliceIndex ?? (model.slices?.length ?? 1) - 1;
      holder.textContent = JSON.stringify(appendAutomation(model, index));
    }
  });
}

if (typeof document !== "undefined") {
  bindEditor(document);
}
