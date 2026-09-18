import { setSliceTitle } from "./set-slice-title.js";
import { setSliceType } from "./set-slice-type.js";
import { setSliceDescription } from "./set-slice-description.js";
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
import { appendCommand } from "./append-command.js";
import { appendField } from "./append-field.js";
import { setFieldName } from "./set-field-name.js";
import { setFieldType } from "./set-field-type.js";
import { setFieldOptional } from "./set-field-optional.js";
import { setFieldExample } from "./set-field-example.js";
import { deleteField } from "./delete-field.js";
import { setEventModelTitle } from "./set-event-model-title.js";
import { setEventModelDescription } from "./set-event-model-description.js";

export function bindInspect(root, ctx) {
  const timeline = ctx.timeline;
  const board = ctx.board;
  const timelineList = timeline;
  const slicesList = ctx.slicesList;
  const commandEventTitles = (node) => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const connection = (model.connections ?? []).find(
      (item) => item.id === node.getAttribute("data-id"),
    );
    if (
      !connection ||
      connection.fromKind !== "COMMAND" ||
      connection.toKind !== "EVENT"
    ) {
      return null;
    }
    let fromTitle;
    let toTitle;
    for (const slice of model.slices ?? []) {
      fromTitle ??= (slice.commands ?? []).find(
        (item) => item.id === connection.fromID,
      )?.title;
      toTitle ??= (slice.events ?? []).find(
        (item) => item.id === connection.toID,
      )?.title;
    }
    if (!fromTitle || !toTitle) return null;
    return { fromTitle, toTitle };
  };
  const eventReadTitles = (node) => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const connection = (model.connections ?? []).find(
      (item) => item.id === node.getAttribute("data-id"),
    );
    if (
      !connection ||
      connection.fromKind !== "EVENT" ||
      connection.toKind !== "READMODEL"
    ) {
      return null;
    }
    let fromTitle;
    let toTitle;
    for (const slice of model.slices ?? []) {
      fromTitle ??= (slice.events ?? []).find(
        (item) => item.id === connection.fromID,
      )?.title;
      toTitle ??= (slice.readModels ?? []).find(
        (item) => item.id === connection.toID,
      )?.title;
    }
    if (!fromTitle || !toTitle) return null;
    return { fromTitle, toTitle };
  };
  const paintCommandEventCaptions = () => {
    for (const line of timeline?.querySelectorAll?.("[data-kind=connection]") ??
      []) {
      const titles = commandEventTitles(line);
      if (titles) line.textContent = `${titles.fromTitle} → ${titles.toTitle}`;
    }
  };
  const paintEventReadCaptions = () => {
    for (const line of timeline?.querySelectorAll?.("[data-kind=connection]") ??
      []) {
      const titles = eventReadTitles(line);
      if (titles) line.textContent = `${titles.fromTitle} → ${titles.toTitle}`;
    }
  };
  timeline?.addEventListener("click", (event) => {
    const button = event.target?.closest?.("button");
    if (!button || button.textContent !== "Add Command on lane") return;
    const index = Number(button.getAttribute("data-slice-index"));
    if (Number.isNaN(index)) return;
    const holder = root.getElementById("event-model-document");
    if (!holder) return;
    const model = JSON.parse(holder.textContent || "{}");
    const cols = timeline.querySelectorAll?.(".slice-col") ?? [];
    const list = cols[index]?.querySelector('[data-lane="command"] ul');
    const painted = list?.querySelectorAll('[data-kind="command"]').length ?? 0;
    const jsonCount = model.slices?.[index]?.commands?.length ?? 0;
    let next = model;
    if (jsonCount === painted) {
      next = appendCommand(model, index);
      holder.textContent = JSON.stringify(next);
    }
    const command = next.slices?.[index]?.commands?.at(-1);
    if (
      list &&
      command &&
      painted < (next.slices?.[index]?.commands?.length ?? 0)
    ) {
      const item = root.createElement("li");
      item.textContent = "Command";
      item.setAttribute("aria-label", "Command");
      item.dataset.kind = "command";
      item.setAttribute("data-id", command.id);
      const port = root.createElement("button");
      port.type = "button";
      port.textContent = "Command port";
      port.dataset.id = command.id;
      port.dataset.kind = "COMMAND";
      item.append(port);
      list.append(item);
    }
  });
  timeline?.addEventListener("click", (event) => {
      const connection = event.target?.closest?.("[data-kind=connection]");
      if (!connection || !timeline.contains(connection)) return;
      const inspector = root.querySelector('[aria-label="Inspector"]');
      const titles = commandEventTitles(connection);
      if (titles) {
        [...(inspector?.querySelectorAll("p") ?? [])]
          .find((p) => p.textContent === "From Event Happened")
          ?.remove();
        [...(inspector?.querySelectorAll("p") ?? [])]
          .find((p) => p.textContent === "To Read Model")
          ?.remove();
        if (
          inspector &&
          !inspector.textContent?.includes("Connection")
        ) {
          inspector.insertAdjacentHTML("beforeend", "<p>Connection</p>");
        }
        const fromCopy = `From ${titles.fromTitle}`;
        if (inspector && !inspector.textContent?.includes(fromCopy)) {
          inspector.insertAdjacentHTML("beforeend", `<p>${fromCopy}</p>`);
        }
        const toCopy = `To ${titles.toTitle}`;
        if (inspector && !inspector.textContent?.includes(toCopy)) {
          inspector.insertAdjacentHTML("beforeend", `<p>${toCopy}</p>`);
        }
        if (
          inspector &&
          ![...(inspector.querySelectorAll("button") ?? [])].some(
            (button) => button.textContent === "Delete Connection",
          )
        ) {
          inspector.insertAdjacentHTML(
            "beforeend",
            '<button type="button">Delete Connection</button>',
          );
        }
        return;
      }
      const eventRead = eventReadTitles(connection);
      if (eventRead) {
        const fromCopy = `From ${eventRead.fromTitle}`;
        if (inspector && !inspector.textContent?.includes(fromCopy)) {
          inspector.insertAdjacentHTML("beforeend", `<p>${fromCopy}</p>`);
        }
        const toCopy = `To ${eventRead.toTitle}`;
        if (inspector && !inspector.textContent?.includes(toCopy)) {
          inspector.insertAdjacentHTML("beforeend", `<p>${toCopy}</p>`);
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
  timeline?.addEventListener("click", (event) => {
    const p = event.target?.closest?.("p");
    if (
      p &&
      timeline.contains(p) &&
      p.textContent === "Command → Event Happened"
    ) {
      ctx.selected = "connection";
      ctx.selectedConnectionNode = p;
    }
  });
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
      (ctx.selected !== "slice" &&
        ctx.selected !== "actor" &&
        ctx.selected !== "command" &&
        ctx.selected !== "event" &&
        ctx.selected !== "readmodel" &&
        ctx.selected !== "automation")
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
        if (holder && ctx.selected === "slice") {
          holder.textContent = JSON.stringify(
            setSliceDescription(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedSliceItem?.dataset?.id,
            ),
          );
          const main = root.querySelector("main");
          if (main && !main.textContent?.includes("Unsaved changes.")) {
            main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
          }
        }
        if (holder && ctx.selected === "actor") {
          holder.textContent = JSON.stringify(
            setActorDescription(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedActorItem?.dataset?.id,
            ),
          );

          const main = root.querySelector("main");
          if (main && !main.textContent?.includes("Unsaved changes.")) {
            main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
          }
        }
        if (holder && ctx.selected === "command") {
          holder.textContent = JSON.stringify(
            setCommandDescription(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedCommandItem?.dataset?.id,
            ),
          );
          const main = root.querySelector("main");
          if (main && !main.textContent?.includes("Unsaved changes.")) {
            main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
          }
        }
        if (holder && ctx.selected === "event") {
          holder.textContent = JSON.stringify(
            setEventDescription(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedEventItem?.dataset?.id,
            ),
          );
          const main = root.querySelector("main");
          if (main && !main.textContent?.includes("Unsaved changes.")) {
            main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
          }
        }
        if (holder && ctx.selected === "readmodel") {
          holder.textContent = JSON.stringify(
            setReadModelDescription(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedReadModelItem?.dataset?.id,
            ),
          );
          const main = root.querySelector("main");
          if (main && !main.textContent?.includes("Unsaved changes.")) {
            main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
          }
        }
        if (holder && ctx.selected === "automation") {
          holder.textContent = JSON.stringify(
            setAutomationDescription(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedAutomationItem?.dataset?.id,
            ),
          );
          const main = root.querySelector("main");
          if (main && !main.textContent?.includes("Unsaved changes.")) {
            main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
          }
        }
        if (ctx.selected === "heading") {
          const main = root.querySelector("main");
          if (main && !main.textContent?.includes("Unsaved changes.")) {
            main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
          }
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
  const unbindFieldName = () => {
    for (const label of [...(inspector?.querySelectorAll("label") ?? [])].filter(
      (label) => label.textContent?.includes("Field name"),
    )) {
      label.remove();
    }
  };
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
    timelineList && typeof timelineList.querySelectorAll === "function"
      ? [...timelineList.querySelectorAll("li")]
      : [],
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
    const id = ctx.selectedCommandItem?.dataset?.id;
    const command = id
      ? model.slices?.flatMap((s) => s.commands ?? []).find((c) => c.id === id)
      : model.slices?.at(-1)?.commands?.at(-1);
    return command?.description ?? "";
  };
  const lastSliceDescription = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedSliceItem?.dataset?.id;
    const slice = id
      ? model.slices?.find((s) => s.id === id)
      : model.slices?.at(-1);
    return slice?.description ?? "";
  };
  const lastActorDescription = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedActorItem?.dataset?.id;
    const actor = id
      ? model.slices?.flatMap((s) => s.actors ?? []).find((a) => a.id === id)
      : model.slices?.at(-1)?.actors?.at(-1);
    return actor?.description ?? "";
  };
  const lastEventDescription = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedEventItem?.dataset?.id;
    const event = id
      ? model.slices?.flatMap((s) => s.events ?? []).find((e) => e.id === id)
      : model.slices?.at(-1)?.events?.at(-1);
    return event?.description ?? "";
  };
  const lastReadModelDescription = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedReadModelItem?.dataset?.id;
    const readModel = id
      ? model.slices?.flatMap((s) => s.readModels ?? []).find((r) => r.id === id)
      : model.slices?.at(-1)?.readModels?.at(-1);
    return readModel?.description ?? "";
  };
  const lastAutomationDescription = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedAutomationItem?.dataset?.id;
    const automation = id
      ? model.slices?.flatMap((s) => s.processors ?? []).find((p) => p.id === id)
      : model.slices?.at(-1)?.processors?.at(-1);
    return automation?.description ?? "";
  };
  const lastCommandFieldName = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedCommandItem?.dataset?.id;
    const command = id
      ? model.slices?.flatMap((s) => s.commands ?? []).find((c) => c.id === id)
      : model.slices?.at(-1)?.commands?.at(-1);
    return command?.fields?.[0]?.name;
  };
  const lastCommandSecondFieldName = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedCommandItem?.dataset?.id;
    const command = id
      ? model.slices?.flatMap((s) => s.commands ?? []).find((c) => c.id === id)
      : model.slices?.at(-1)?.commands?.at(-1);
    return command?.fields?.[1]?.name;
  };
  const lastEventFieldName = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedEventItem?.dataset?.id;
    const event = id
      ? model.slices?.flatMap((s) => s.events ?? []).find((e) => e.id === id)
      : model.slices?.at(-1)?.events?.at(-1);
    return event?.fields?.[0]?.name;
  };
  const lastEventSecondFieldName = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedEventItem?.dataset?.id;
    const event = id
      ? model.slices?.flatMap((s) => s.events ?? []).find((e) => e.id === id)
      : model.slices?.at(-1)?.events?.at(-1);
    return event?.fields?.[1]?.name;
  };
  const lastReadModelFieldName = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedReadModelItem?.dataset?.id;
    const readModel = id
      ? model.slices?.flatMap((s) => s.readModels ?? []).find((r) => r.id === id)
      : model.slices?.at(-1)?.readModels?.at(-1);
    return readModel?.fields?.[0]?.name;
  };
  const lastReadModelSecondFieldName = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedReadModelItem?.dataset?.id;
    const readModel = id
      ? model.slices?.flatMap((s) => s.readModels ?? []).find((r) => r.id === id)
      : model.slices?.at(-1)?.readModels?.at(-1);
    return readModel?.fields?.[1]?.name;
  };
  const lastAutomationFieldName = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedAutomationItem?.dataset?.id;
    const automation = id
      ? model.slices?.flatMap((s) => s.processors ?? []).find((p) => p.id === id)
      : model.slices?.at(-1)?.processors?.at(-1);
    return automation?.fields?.[0]?.name;
  };
  const lastAutomationSecondFieldName = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedAutomationItem?.dataset?.id;
    const automation = id
      ? model.slices?.flatMap((s) => s.processors ?? []).find((p) => p.id === id)
      : model.slices?.at(-1)?.processors?.at(-1);
    return automation?.fields?.[1]?.name;
  };
  const lastCommandFieldType = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedCommandItem?.dataset?.id;
    const command = id
      ? model.slices?.flatMap((s) => s.commands ?? []).find((c) => c.id === id)
      : model.slices?.at(-1)?.commands?.at(-1);
    return command?.fields?.[0]?.type;
  };
  const lastEventFieldType = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedEventItem?.dataset?.id;
    const event = id
      ? model.slices?.flatMap((s) => s.events ?? []).find((e) => e.id === id)
      : model.slices?.at(-1)?.events?.at(-1);
    return event?.fields?.[0]?.type;
  };
  const lastReadModelFieldType = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedReadModelItem?.dataset?.id;
    const readModel = id
      ? model.slices?.flatMap((s) => s.readModels ?? []).find((r) => r.id === id)
      : model.slices?.at(-1)?.readModels?.at(-1);
    return readModel?.fields?.[0]?.type;
  };
  const lastAutomationFieldType = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedAutomationItem?.dataset?.id;
    const automation = id
      ? model.slices?.flatMap((s) => s.processors ?? []).find((p) => p.id === id)
      : model.slices?.at(-1)?.processors?.at(-1);
    return automation?.fields?.[0]?.type;
  };
  const lastCommandFieldOptional = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedCommandItem?.dataset?.id;
    const command = id
      ? model.slices?.flatMap((s) => s.commands ?? []).find((c) => c.id === id)
      : model.slices?.at(-1)?.commands?.at(-1);
    return command?.fields?.[0]?.optional === true;
  };
  const lastEventFieldOptional = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedEventItem?.dataset?.id;
    const event = id
      ? model.slices?.flatMap((s) => s.events ?? []).find((e) => e.id === id)
      : model.slices?.at(-1)?.events?.at(-1);
    return event?.fields?.[0]?.optional === true;
  };
  const lastReadModelFieldOptional = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedReadModelItem?.dataset?.id;
    const readModel = id
      ? model.slices?.flatMap((s) => s.readModels ?? []).find((r) => r.id === id)
      : model.slices?.at(-1)?.readModels?.at(-1);
    return readModel?.fields?.[0]?.optional === true;
  };
  const lastAutomationFieldOptional = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedAutomationItem?.dataset?.id;
    const automation = id
      ? model.slices?.flatMap((s) => s.processors ?? []).find((p) => p.id === id)
      : model.slices?.at(-1)?.processors?.at(-1);
    return automation?.fields?.[0]?.optional === true;
  };
  const lastCommandFieldExample = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedCommandItem?.dataset?.id;
    const command = id
      ? model.slices?.flatMap((s) => s.commands ?? []).find((c) => c.id === id)
      : model.slices?.at(-1)?.commands?.at(-1);
    return command?.fields?.[0]?.example ?? "";
  };
  const lastEventFieldExample = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedEventItem?.dataset?.id;
    const event = id
      ? model.slices?.flatMap((s) => s.events ?? []).find((e) => e.id === id)
      : model.slices?.at(-1)?.events?.at(-1);
    return event?.fields?.[0]?.example ?? "";
  };
  const lastReadModelFieldExample = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedReadModelItem?.dataset?.id;
    const readModel = id
      ? model.slices?.flatMap((s) => s.readModels ?? []).find((r) => r.id === id)
      : model.slices?.at(-1)?.readModels?.at(-1);
    return readModel?.fields?.[0]?.example ?? "";
  };
  const lastAutomationFieldExample = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedAutomationItem?.dataset?.id;
    const automation = id
      ? model.slices?.flatMap((s) => s.processors ?? []).find((p) => p.id === id)
      : model.slices?.at(-1)?.processors?.at(-1);
    return automation?.fields?.[0]?.example ?? "";
  };
  const lastSliceTypeLabel = () => {
    const holder = root.getElementById("event-model-document");
    const model = JSON.parse(holder?.textContent || "{}");
    const id = ctx.selectedSliceItem?.dataset?.id;
    const slice = id
      ? model.slices?.find((s) => s.id === id)
      : model.slices?.at(-1);
    const sliceType = slice?.sliceType;
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
    if (!inspector || ctx.selected !== "slice") {
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
            setSliceType(
              JSON.parse(holder.textContent || "{}"),
              sliceType,
              ctx.selectedSliceItem?.dataset?.id,
            ),
          );
          const main = root.querySelector("main");
          if (main && !main.textContent?.includes("Unsaved changes.")) {
            main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
          }
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
      (ctx.selected !== "command" &&
        ctx.selected !== "event" &&
        ctx.selected !== "readmodel" &&
        ctx.selected !== "automation")
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
        if (holder && ctx.selected === "command") {
          holder.textContent = JSON.stringify(
            setFieldType(
              JSON.parse(holder.textContent || "{}"),
              select.value,
              "command",
              ctx.selectedCommandItem?.dataset?.id,
            ),
          );
        }
        if (holder && ctx.selected === "event") {
          holder.textContent = JSON.stringify(
            setFieldType(
              JSON.parse(holder.textContent || "{}"),
              select.value,
              "event",
              ctx.selectedEventItem?.dataset?.id,
            ),
          );
        }
        if (holder && ctx.selected === "readmodel") {
          holder.textContent = JSON.stringify(
            setFieldType(
              JSON.parse(holder.textContent || "{}"),
              select.value,
              "readmodel",
              ctx.selectedReadModelItem?.dataset?.id,
            ),
          );
        }
        if (holder && ctx.selected === "automation") {
          holder.textContent = JSON.stringify(
            setFieldType(
              JSON.parse(holder.textContent || "{}"),
              select.value,
              "automation",
              ctx.selectedAutomationItem?.dataset?.id,
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
    if (
      !inspector ||
      (ctx.selected !== "command" &&
        ctx.selected !== "event" &&
        ctx.selected !== "readmodel" &&
        ctx.selected !== "automation")
    ) {
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
        if (holder && ctx.selected === "command") {
          holder.textContent = JSON.stringify(
            setFieldOptional(
              JSON.parse(holder.textContent || "{}"),
              input.checked,
              "command",
              ctx.selectedCommandItem?.dataset?.id,
            ),
          );
        }
        if (holder && ctx.selected === "event") {
          holder.textContent = JSON.stringify(
            setFieldOptional(
              JSON.parse(holder.textContent || "{}"),
              input.checked,
              "event",
              ctx.selectedEventItem?.dataset?.id,
            ),
          );
        }
        if (holder && ctx.selected === "readmodel") {
          holder.textContent = JSON.stringify(
            setFieldOptional(
              JSON.parse(holder.textContent || "{}"),
              input.checked,
              "readmodel",
              ctx.selectedReadModelItem?.dataset?.id,
            ),
          );
        }
        if (holder && ctx.selected === "automation") {
          holder.textContent = JSON.stringify(
            setFieldOptional(
              JSON.parse(holder.textContent || "{}"),
              input.checked,
              "automation",
              ctx.selectedAutomationItem?.dataset?.id,
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
    if (
      !inspector ||
      (ctx.selected !== "command" &&
        ctx.selected !== "event" &&
        ctx.selected !== "readmodel" &&
        ctx.selected !== "automation")
    ) {
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
        if (holder && ctx.selected === "command") {
          holder.textContent = JSON.stringify(
            setFieldExample(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              "command",
              ctx.selectedCommandItem?.dataset?.id,
            ),
          );
        }
        if (holder && ctx.selected === "event") {
          holder.textContent = JSON.stringify(
            setFieldExample(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              "event",
              ctx.selectedEventItem?.dataset?.id,
            ),
          );
        }
        if (holder && ctx.selected === "readmodel") {
          holder.textContent = JSON.stringify(
            setFieldExample(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              "readmodel",
            ),
          );
        }
        if (holder && ctx.selected === "automation") {
          holder.textContent = JSON.stringify(
            setFieldExample(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              "automation",
            ),
          );
        }
      });
    }
    if (input) input.value = value ?? "";
  };
  const bindDeleteField = () => {
    if (
      !inspector ||
      (ctx.selected !== "command" &&
        ctx.selected !== "event" &&
        ctx.selected !== "readmodel" &&
        ctx.selected !== "automation")
    ) {
      deleteFieldButton()?.remove();
      return;
    }
    if (deleteFieldButton()) return;
    inspector.insertAdjacentHTML(
      "beforeend",
      '<button type="button">Delete Field</button>',
    );
    deleteFieldButton()?.addEventListener("click", () => {
      const holder = root.getElementById("event-model-document");
      if (holder) {
        holder.textContent = JSON.stringify(
          deleteField(
            JSON.parse(holder.textContent || "{}"),
            ctx.selected,
            ctx.selected === "event"
              ? ctx.selectedEventItem?.dataset?.id
              : ctx.selected === "readmodel"
                ? ctx.selectedReadModelItem?.dataset?.id
                : ctx.selected === "automation"
                  ? ctx.selectedAutomationItem?.dataset?.id
                  : ctx.selectedCommandItem?.dataset?.id,
          ),
        );
      }
    });
  };
  const fieldNameInput = () =>
    [...(inspector?.querySelectorAll("input") ?? [])].find((el) =>
      el.closest("label")?.textContent?.includes("Field name"),
    );
  const bindFieldName = (value) => {
    if (
      !inspector ||
      (ctx.selected !== "command" &&
        ctx.selected !== "event" &&
        ctx.selected !== "readmodel" &&
        ctx.selected !== "automation")
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
        if (holder && ctx.selected === "command") {
          holder.textContent = JSON.stringify(
            setFieldName(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedCommandItem?.dataset?.id,
              "command",
            ),
          );
        }
        if (holder && ctx.selected === "event") {
          holder.textContent = JSON.stringify(
            setFieldName(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedEventItem?.dataset?.id,
              "event",
            ),
          );
        }
        if (holder && ctx.selected === "readmodel") {
          holder.textContent = JSON.stringify(
            setFieldName(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedReadModelItem?.dataset?.id,
              "readmodel",
            ),
          );
        }
        if (holder && ctx.selected === "automation") {
          holder.textContent = JSON.stringify(
            setFieldName(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedAutomationItem?.dataset?.id,
              "automation",
            ),
          );
        }
      });
    }
    if (input) input.value = value;
  };
  const bindSecondFieldName = (value) => {
    if (
      !inspector ||
      (ctx.selected !== "command" &&
        ctx.selected !== "event" &&
        ctx.selected !== "readmodel" &&
        ctx.selected !== "automation")
    )
      return;
    inspector.insertAdjacentHTML(
      "beforeend",
      "<label>Field name <input /></label>",
    );
    const inputs = [...inspector.querySelectorAll("input")].filter((el) =>
      el.closest("label")?.textContent?.includes("Field name"),
    );
    const input = inputs[1];
    if (input) {
      input.value = value;
      input.addEventListener("input", () => {
        const holder = root.getElementById("event-model-document");
        if (holder && ctx.selected === "command") {
          holder.textContent = JSON.stringify(
            setFieldName(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedCommandItem?.dataset?.id,
              "command",
              1,
            ),
          );
        }
        if (holder && ctx.selected === "event") {
          holder.textContent = JSON.stringify(
            setFieldName(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedEventItem?.dataset?.id,
              "event",
              1,
            ),
          );
        }
        if (holder && ctx.selected === "readmodel") {
          holder.textContent = JSON.stringify(
            setFieldName(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedReadModelItem?.dataset?.id,
              "readmodel",
              1,
            ),
          );
        }
        if (holder && ctx.selected === "automation") {
          holder.textContent = JSON.stringify(
            setFieldName(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedAutomationItem?.dataset?.id,
              "automation",
              1,
            ),
          );
        }
      });
    }
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
        ctx.selected !== "command" &&
        ctx.selected !== "event" &&
        ctx.selected !== "readmodel" &&
        ctx.selected !== "automation"
      ) {
        return;
      }
      const holder = root.getElementById("event-model-document");
      if (holder) {
        holder.textContent = JSON.stringify(
          appendField(
            JSON.parse(holder.textContent || "{}"),
            ctx.selected,
            ctx.selected === "command"
              ? ctx.selectedCommandItem?.dataset?.id
              : ctx.selected === "event"
                ? ctx.selectedEventItem?.dataset?.id
                : ctx.selected === "readmodel"
                  ? ctx.selectedReadModelItem?.dataset?.id
                  : ctx.selectedAutomationItem?.dataset?.id,
          ),
        );
      }
      const main = root.querySelector("main");
      if (main && !main.textContent?.includes("Unsaved changes.")) {
        main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
      }
      if (
        inspector &&
        (ctx.selected === "command" ||
          ctx.selected === "event" ||
          ctx.selected === "readmodel" ||
          ctx.selected === "automation") &&
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
                ctx.selected === "command"
                  ? ctx.selectedCommandItem?.dataset?.id
                  : ctx.selected === "event"
                    ? ctx.selectedEventItem?.dataset?.id
                    : ctx.selected === "readmodel"
                      ? ctx.selectedReadModelItem?.dataset?.id
                      : ctx.selectedAutomationItem?.dataset?.id,
                ctx.selected,
              ),
            );
          }
        });
      }
      if (
        inspector &&
        (ctx.selected === "command" ||
          ctx.selected === "event" ||
          ctx.selected === "readmodel" ||
          ctx.selected === "automation") &&
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
                ctx.selected,
                ctx.selected === "command"
                  ? ctx.selectedCommandItem?.dataset?.id
                  : undefined,
              ),
            );
          }
        });
      }
      if (
        inspector &&
        (ctx.selected === "command" ||
          ctx.selected === "event" ||
          ctx.selected === "readmodel" ||
          ctx.selected === "automation") &&
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
                ctx.selected,
                ctx.selected === "command"
                  ? ctx.selectedCommandItem?.dataset?.id
                  : ctx.selected === "event"
                    ? ctx.selectedEventItem?.dataset?.id
                    : ctx.selected === "readmodel"
                      ? ctx.selectedReadModelItem?.dataset?.id
                      : ctx.selectedAutomationItem?.dataset?.id,
              ),
            );
          }
        });
      }
      const leftoverOptional = [...(inspector?.querySelectorAll("input") ?? [])].find(
        (el) =>
          el.type === "checkbox" &&
          el.closest("label")?.textContent?.includes("Optional"),
      );
      if (leftoverOptional) leftoverOptional.checked = false;
      if (
        inspector &&
        (ctx.selected === "command" ||
          ctx.selected === "event" ||
          ctx.selected === "readmodel" ||
          ctx.selected === "automation") &&
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
                ctx.selected,
                ctx.selected === "command"
                  ? ctx.selectedCommandItem?.dataset?.id
                  : ctx.selected === "event"
                    ? ctx.selectedEventItem?.dataset?.id
                    : undefined,
              ),
            );
          }
        });
      }
      if (
        inspector &&
        (ctx.selected === "command" ||
          ctx.selected === "event" ||
          ctx.selected === "readmodel" ||
          ctx.selected === "automation") &&
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
                ctx.selected,
                ctx.selected === "command"
                  ? ctx.selectedCommandItem?.dataset?.id
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
        if (holder && ctx.selected === "slice") {
          holder.textContent = JSON.stringify(
            setSliceTitle(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedSliceItem?.dataset?.id,
            ),
          );
        }
        if (holder && ctx.selected === "actor") {
          holder.textContent = JSON.stringify(
            setActorName(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedActorItem?.dataset?.id,
            ),
          );
        }
        if (holder && ctx.selected === "command") {
          holder.textContent = JSON.stringify(
            setCommandTitle(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedCommandItem?.dataset?.id,
            ),
          );
        }
        if (holder && ctx.selected === "event") {
          holder.textContent = JSON.stringify(
            setEventTitle(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedEventItem?.dataset?.id,
            ),
          );
        }
        if (holder && ctx.selected === "readmodel") {
          holder.textContent = JSON.stringify(
            setReadModelTitle(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedReadModelItem?.dataset?.id,
            ),
          );
        }
        if (holder && ctx.selected === "automation") {
          holder.textContent = JSON.stringify(
            setAutomationTitle(
              JSON.parse(holder.textContent || "{}"),
              input.value,
              ctx.selectedAutomationItem?.dataset?.id,
            ),
          );
        }
        if (holder && ctx.selected === "model") {
          holder.textContent = JSON.stringify(
            setEventModelTitle(
              JSON.parse(holder.textContent || "{}"),
              input.value,
            ),
          );
        }
        if (ctx.selected === "slice" && ctx.selectedSliceItem) {
          ctx.selectedSliceItem.textContent = input.value;
          ctx.selectedSliceItem.setAttribute("aria-label", input.value);
        }
        if (ctx.selected === "actor" && ctx.selectedActorItem) {
          ctx.selectedActorItem.textContent = input.value;
          ctx.selectedActorItem.setAttribute("aria-label", input.value);
        }
        if (ctx.selected === "command" && ctx.selectedCommandItem) {
          const textNode = [...ctx.selectedCommandItem.childNodes].find(
            (node) => node.nodeType === Node.TEXT_NODE,
          );
          if (textNode) textNode.textContent = input.value;
          ctx.selectedCommandItem.setAttribute("aria-label", input.value);
        }
        if (ctx.selected === "event" && ctx.selectedEventItem) {
          const text = [...ctx.selectedEventItem.childNodes].find(
            (node) => node.nodeType === 3,
          );
          if (text) text.textContent = input.value;
          ctx.selectedEventItem.setAttribute("aria-label", input.value);
        }
        if (ctx.selected === "command" || ctx.selected === "event") {
          paintCommandEventCaptions();
        }
        if (ctx.selected === "event" || ctx.selected === "readmodel") {
          paintEventReadCaptions();
        }
        if (ctx.selected === "readmodel" && ctx.selectedReadModelItem) {
          const text = [...ctx.selectedReadModelItem.childNodes].find(
            (node) => node.nodeType === 3,
          );
          if (text) text.textContent = input.value;
          ctx.selectedReadModelItem.setAttribute("aria-label", input.value);
        }
        if (ctx.selected === "automation" && ctx.selectedAutomationItem) {
          ctx.selectedAutomationItem.textContent = input.value;
          ctx.selectedAutomationItem.setAttribute("aria-label", input.value);
        }
        if (ctx.selected === "model") {
          const heading = root.querySelector("h1");
          if (heading) heading.textContent = input.value;
        }
        if (
          ctx.selected === "slice" ||
          ctx.selected === "actor" ||
          ctx.selected === "command" ||
          ctx.selected === "event" ||
          ctx.selected === "readmodel" ||
          ctx.selected === "automation" ||
          ctx.selected === "model"
        ) {
          const main = root.querySelector("main");
          if (main && !main.textContent?.includes("Unsaved changes.")) {
            main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
          }
        }
      });
    }
    if (input) input.value = value;
    const typeSelect = inspector?.querySelector("select");
    if (ctx.selected === "slice") {
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
                : "STATE_CHANGE";
          const holder = root.getElementById("event-model-document");
          if (holder) {
            holder.textContent = JSON.stringify(
              setSliceType(
                JSON.parse(holder.textContent || "{}"),
                sliceType,
                ctx.selectedSliceItem?.dataset?.id,
              ),
            );
            const main = root.querySelector("main");
            if (main && !main.textContent?.includes("Unsaved changes.")) {
              main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
            }
          }
        });
      }
    } else {
      typeSelect?.closest("label")?.remove();
    }
    if (ctx.selected !== "model") {
      inspector.querySelector("textarea")?.closest("label")?.remove();
    } else {
      unbindDescription();
    }
  };
  timelineList?.addEventListener("click", (event) => {
    const item = event.target?.closest?.("li");
    if (!item || !timelineList.contains(item)) return;
    if (item.dataset.kind === "command") {
      ctx.selected = "command";
      ctx.selectedCommandItem = item;
      [...(inspector?.querySelectorAll("p") ?? [])]
        .find((p) => p.textContent === "From Event Happened")
        ?.remove();
      [...(inspector?.querySelectorAll("p") ?? [])]
        .find((p) => p.textContent === "To Read Model")
        ?.remove();
      [...(inspector?.querySelectorAll("p") ?? [])]
        .find((p) => p.textContent === "From Command")
        ?.remove();
      [...(inspector?.querySelectorAll("p") ?? [])]
        .find((p) => p.textContent === "To Event Happened")
        ?.remove();
      [...(inspector?.querySelectorAll("p") ?? [])]
        .find((p) => p.textContent === "Connection")
        ?.remove();
      [...(inspector?.querySelectorAll("button") ?? [])]
        .find((button) => button.textContent === "Delete Connection")
        ?.remove();
      bindName(item.getAttribute("aria-label") ?? "Command");
      if (omitGetRenderedInspectChrome(item)) {
        bindDescription(lastCommandDescription());
        const fieldName = lastCommandFieldName();
        if (fieldName) {
          bindFieldName(fieldName);
          const secondFieldName = lastCommandSecondFieldName();
          if (secondFieldName) {
            bindSecondFieldName(secondFieldName);
          }
          bindFieldType(lastCommandFieldType());
          bindOptional(lastCommandFieldOptional());
          bindExample(lastCommandFieldExample());
          bindDeleteField();
        }
        bindAddField();
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
        bindDeleteField();
      } else {
        unbindFieldName();
        deleteFieldButton()?.remove();
      }
      return;
    }
    if (item.dataset.kind === "event") {
      ctx.selected = "event";
      ctx.selectedEventItem = item;
      [...(inspector?.querySelectorAll("p") ?? [])]
        .find((p) => p.textContent === "From Command")
        ?.remove();
      [...(inspector?.querySelectorAll("p") ?? [])]
        .find((p) => p.textContent === "To Event Happened")
        ?.remove();
      [...(inspector?.querySelectorAll("p") ?? [])]
        .find((p) => p.textContent === "Connection")
        ?.remove();
      bindName(item.getAttribute("aria-label") ?? "Event Happened");
      if (omitGetRenderedInspectChrome(item)) {
        bindDescription(lastEventDescription());
        const eventFieldName = lastEventFieldName();
        if (eventFieldName) {
          bindFieldName(eventFieldName);
          const secondFieldName = lastEventSecondFieldName();
          if (secondFieldName) {
            bindSecondFieldName(secondFieldName);
          }
          bindFieldType(lastEventFieldType());
          bindOptional(lastEventFieldOptional());
          bindExample(lastEventFieldExample());
          bindDeleteField();
        }
        bindAddField();
        return;
      }
      bindAddField();
      bindDescription(lastEventDescription());
      const eventFieldName = lastEventFieldName();
      if (eventFieldName) {
        bindFieldName(eventFieldName);
        bindFieldType(lastEventFieldType());
        bindOptional(lastEventFieldOptional());
        bindExample(lastEventFieldExample());
        bindDeleteField();
      } else {
        unbindFieldRow();
      }
      return;
    }
    if (item.dataset.kind === "readmodel") {
      ctx.selected = "readmodel";
      ctx.selectedReadModelItem = item;
      bindName(item.getAttribute("aria-label") ?? "Read Model");
      if (omitGetRenderedInspectChrome(item)) {
        bindDescription(lastReadModelDescription());
        const readModelFieldName = lastReadModelFieldName();
        if (readModelFieldName) {
          bindFieldName(readModelFieldName);
          const secondFieldName = lastReadModelSecondFieldName();
          if (secondFieldName) {
            bindSecondFieldName(secondFieldName);
          }
          bindFieldType(lastReadModelFieldType());
          bindOptional(lastReadModelFieldOptional());
          bindExample(lastReadModelFieldExample());
          bindDeleteField();
        }
        bindAddField();
        return;
      }
      bindAddField();
      bindDescription(lastReadModelDescription());
      const readModelFieldName = lastReadModelFieldName();
      if (readModelFieldName) {
        bindFieldName(readModelFieldName);
        bindFieldType(lastReadModelFieldType());
        bindOptional(lastReadModelFieldOptional());
        bindExample(lastReadModelFieldExample());
      } else {
        unbindFieldRow();
      }
      return;
    }
    if (item.dataset.kind === "automation") {
      ctx.selected = "automation";
      ctx.selectedAutomationItem = item;
      bindName(item.getAttribute("aria-label") ?? "Automation");
      if (omitGetRenderedInspectChrome(item)) {
        bindDescription(lastAutomationDescription());
        const automationFieldName = lastAutomationFieldName();
        if (automationFieldName) {
          bindFieldName(automationFieldName);
          const secondFieldName = lastAutomationSecondFieldName();
          if (secondFieldName) {
            bindSecondFieldName(secondFieldName);
          }
          bindFieldType(lastAutomationFieldType());
          bindOptional(lastAutomationFieldOptional());
          bindExample(lastAutomationFieldExample());
          bindDeleteField();
        }
        bindAddField();
        return;
      }
      bindAddField();
      bindDescription(lastAutomationDescription());
      const automationFieldName = lastAutomationFieldName();
      if (automationFieldName) {
        bindFieldName(automationFieldName);
        bindFieldType(lastAutomationFieldType());
        bindOptional(lastAutomationFieldOptional());
        bindExample(lastAutomationFieldExample());
      } else {
        unbindFieldRow();
      }
      return;
    }
    if (!item.dataset.kind) {
      ctx.selected = "slice";
      ctx.selectedSliceItem = item;
      const indexAttr = item.closest(".slice-col")?.getAttribute("data-slice-index");
      ctx.selectedSliceIndex = indexAttr == null ? null : Number(indexAttr);
      bindName(item.getAttribute("aria-label") ?? "New Slice");
      bindDescription(lastSliceDescription());
      bindType(lastSliceTypeLabel());
      unbindFieldChrome();
      return;
    }
    if (item.dataset.kind !== "actor") return;
    ctx.selected = "actor";
    ctx.selectedActorItem = item;
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
    ctx.selected = "connection";
    ctx.selectedConnectionItem = line;
    unbindType();
    unbindAddField();
    unbindFieldRow();
  });
  timeline?.addEventListener("click", (event) => {
    const line = event.target?.closest?.("p");
    if (!line || !timeline.contains(line)) return;
    if (line.textContent !== "Event Happened → Read Model") return;
    ctx.selected = "connection";
    unbindType();
    unbindAddField();
    unbindFieldName();
    unbindFieldType();
    unbindOptional();
    unbindExample();
    deleteFieldButton()?.remove();
    [...(inspector?.querySelectorAll("button") ?? [])]
      .find((button) => button.textContent === "Delete Connection")
      ?.remove();
  });
  if (timeline && typeof timeline.querySelector === "function") {
    timeline.querySelector(".time-chrome")?.addEventListener("click", () => {
      ctx.selected = null;
      nameInput()?.closest("label")?.remove();
      unbindDescription();
      unbindType();
      unbindFieldChrome();
      [...(inspector?.querySelectorAll("button") ?? [])]
        .find((button) => button.textContent === "Delete Connection")
        ?.remove();
    });
  }
  board?.addEventListener("click", (event) => {
    if (event.target?.closest?.("li")) return;
    if (event.target?.closest?.("[data-kind=connection]")) return;
    ctx.selected = null;
    nameInput()?.closest("label")?.remove();
    unbindDescription();
    unbindType();
    unbindFieldChrome();
    [...(inspector?.querySelectorAll("button") ?? [])]
      .find((button) => button.textContent === "Delete Connection")
      ?.remove();
  });
  slicesList?.addEventListener("click", (event) => {
    const item = event.target?.closest?.("li");
    if (!item || !slicesList.contains(item)) return;
    ctx.selected = "slice";
    ctx.selectedSliceItem = item;
    const indexAttr = item.getAttribute("data-slice-index");
    ctx.selectedSliceIndex = indexAttr === null ? null : Number(indexAttr);
    bindName(item.getAttribute("aria-label") ?? "New Slice");
    bindDescription(lastSliceDescription());
    bindType(lastSliceTypeLabel());
    unbindFieldChrome();
  });
  root.querySelector("h1")?.addEventListener("click", () => {
    ctx.selected = "model";
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
        if (holder && ctx.selected === "model" && textarea) {
          holder.textContent = JSON.stringify(
            setEventModelDescription(
              JSON.parse(holder.textContent || "{}"),
              textarea.value,
            ),
          );
          const main = root.querySelector("main");
          if (main && !main.textContent?.includes("Unsaved changes.")) {
            main.insertAdjacentHTML("afterbegin", "<p>Unsaved changes.</p>");
          }
        }
      });
    }
  });
  ctx.nameInput = nameInput;
  ctx.unbindDescription = unbindDescription;
  ctx.unbindType = unbindType;
  ctx.unbindFieldChrome = unbindFieldChrome;
}
