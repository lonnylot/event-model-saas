import { describe, expect, it } from "vitest";
import { appendSlice } from "../../src/document/append-slice.ts";
import { appendActor } from "../../src/document/append-actor.ts";
import { appendCommand } from "../../src/document/append-command.ts";
import { appendEvent } from "../../src/document/append-event.ts";
import { appendReadModel } from "../../src/document/append-read-model.ts";
import { appendAutomation } from "../../src/document/append-automation.ts";
import { appendConnection } from "../../src/document/append-connection.ts";
import {
  onAddActorClick,
  onAddAutomationClick,
  onAddCommandClick,
  onAddEventClick,
  onAddReadModelClick,
  onNewSliceClick,
} from "../../public/editor.js";

const empty = {
  format: "eventmodel" as const,
  schemaVersion: 1,
  id: "11111111-1111-1111-1111-111111111111",
  title: "Untitled",
  slices: [] as unknown[],
};

function clickedSlice() {
  const holder = { textContent: JSON.stringify(empty) };
  const root = {
    querySelector(sel: string) {
      if (sel === "ul") return { append() {} };
      if (sel === "main") return { textContent: "", insertAdjacentHTML() {} };
      return null;
    },
    getElementById(id: string) {
      return id === "event-model-document" ? holder : null;
    },
    createElement() {
      return { textContent: "", setAttribute() {} };
    },
  };
  onNewSliceClick(root);
  return JSON.parse(holder.textContent).slices[0];
}

describe("clicking New Slice", () => {
  it("Clicking `New Slice` on that page appends a Slice whose `title` is `New Slice`", () => {
    expect(clickedSlice().title).toBe("New Slice");
    expect(appendSlice(empty).slices[0]?.title).toBe("New Slice");
  });

  it("Clicking `New Slice` on that page appends a Slice whose `sliceType` is `STATE_CHANGE`", () => {
    expect(clickedSlice().sliceType).toBe("STATE_CHANGE");
    expect(appendSlice(empty).slices[0]?.sliceType).toBe("STATE_CHANGE");
  });

  it("Clicking `New Slice` on that page appends a Slice whose `actors` is `[]`", () => {
    expect(clickedSlice().actors).toEqual([]);
    expect(appendSlice(empty).slices[0]?.actors).toEqual([]);
  });

  it("Clicking `New Slice` on that page appends a Slice whose `commands` is `[]`", () => {
    expect(clickedSlice().commands).toEqual([]);
    expect(appendSlice(empty).slices[0]?.commands).toEqual([]);
  });

  it("Clicking `New Slice` on that page appends a Slice whose `events` is `[]`", () => {
    expect(clickedSlice().events).toEqual([]);
    expect(appendSlice(empty).slices[0]?.events).toEqual([]);
  });

  it("Clicking `New Slice` on that page appends a Slice whose `readModels` is `[]`", () => {
    expect(clickedSlice().readModels).toEqual([]);
    expect(appendSlice(empty).slices[0]?.readModels).toEqual([]);
  });

  it("Clicking `New Slice` on that page appends a Slice whose `processors` is `[]`", () => {
    expect(clickedSlice().processors).toEqual([]);
    expect(appendSlice(empty).slices[0]?.processors).toEqual([]);
  });
});

function clickedActor() {
  const holder = { textContent: JSON.stringify(empty) };
  const root = {
    querySelector(sel: string) {
      if (sel === "ul") return { append() {} };
      if (sel === "main") return { textContent: "", insertAdjacentHTML() {} };
      if (sel === '[aria-label="Timeline"]') return { append() {} };
      return null;
    },
    getElementById(id: string) {
      return id === "event-model-document" ? holder : null;
    },
    createElement() {
      return { textContent: "", setAttribute() {} };
    },
  };
  onNewSliceClick(root);
  onAddActorClick(root);
  return JSON.parse(holder.textContent).slices[0].actors[0];
}

describe("clicking Add Actor", () => {
  it("Clicking `Add Actor` on that page after `New Slice` appends an Actor whose `name` is `Actor`", () => {
    expect(clickedActor().name).toBe("Actor");
    expect(appendActor(appendSlice(empty)).slices[0]?.actors[0]?.name).toBe(
      "Actor",
    );
  });
});

function clickedCommand() {
  const holder = { textContent: JSON.stringify(empty) };
  const root = {
    querySelector(sel: string) {
      if (sel === "ul") return { append() {} };
      if (sel === "main") return { textContent: "", insertAdjacentHTML() {} };
      if (sel === '[aria-label="Timeline"]') return { append() {} };
      return null;
    },
    getElementById(id: string) {
      return id === "event-model-document" ? holder : null;
    },
    createElement() {
      return { textContent: "", setAttribute() {} };
    },
  };
  onNewSliceClick(root);
  onAddCommandClick(root);
  return JSON.parse(holder.textContent).slices[0].commands[0];
}

describe("clicking Add Command", () => {
  it("Clicking `Add Command` on that page after `New Slice` appends a Command whose `title` is `Command`", () => {
    expect(clickedCommand().title).toBe("Command");
    expect(
      appendCommand(appendSlice(empty)).slices[0]?.commands[0]?.title,
    ).toBe("Command");
  });

  it("Clicking `Add Command` on that page after `New Slice` appends a Command whose `type` is `COMMAND`", () => {
    expect(clickedCommand().type).toBe("COMMAND");
    expect(
      appendCommand(appendSlice(empty)).slices[0]?.commands[0]?.type,
    ).toBe("COMMAND");
  });

  it("Clicking `Add Command` on that page after `New Slice` appends a Command whose `fields` is `[]`", () => {
    expect(clickedCommand().fields).toEqual([]);
    expect(
      appendCommand(appendSlice(empty)).slices[0]?.commands[0]?.fields,
    ).toEqual([]);
  });
});

function clickedEvent() {
  const holder = { textContent: JSON.stringify(empty) };
  const root = {
    querySelector(sel: string) {
      if (sel === "ul") return { append() {} };
      if (sel === "main") return { textContent: "", insertAdjacentHTML() {} };
      if (sel === '[aria-label="Timeline"]') return { append() {} };
      return null;
    },
    getElementById(id: string) {
      return id === "event-model-document" ? holder : null;
    },
    createElement() {
      return { textContent: "", setAttribute() {} };
    },
  };
  onNewSliceClick(root);
  onAddEventClick(root);
  return JSON.parse(holder.textContent).slices[0].events[0];
}

describe("clicking Add Event", () => {
  it("Clicking `Add Event` on that page after `New Slice` appends an Event whose `title` is `Event Happened`", () => {
    expect(clickedEvent().title).toBe("Event Happened");
    expect(appendEvent(appendSlice(empty)).slices[0]?.events[0]?.title).toBe(
      "Event Happened",
    );
  });

  it("Clicking `Add Event` on that page after `New Slice` appends an Event whose `type` is `EVENT`", () => {
    expect(clickedEvent().type).toBe("EVENT");
    expect(appendEvent(appendSlice(empty)).slices[0]?.events[0]?.type).toBe(
      "EVENT",
    );
  });

  it("Clicking `Add Event` on that page after `New Slice` appends an Event whose `fields` is `[]`", () => {
    expect(clickedEvent().fields).toEqual([]);
    expect(
      appendEvent(appendSlice(empty)).slices[0]?.events[0]?.fields,
    ).toEqual([]);
  });
});

function clickedReadModel() {
  const holder = { textContent: JSON.stringify(empty) };
  const root = {
    querySelector(sel: string) {
      if (sel === "ul") return { append() {} };
      if (sel === "main") return { textContent: "", insertAdjacentHTML() {} };
      if (sel === '[aria-label="Timeline"]') return { append() {} };
      return null;
    },
    getElementById(id: string) {
      return id === "event-model-document" ? holder : null;
    },
    createElement() {
      return { textContent: "", setAttribute() {} };
    },
  };
  onNewSliceClick(root);
  onAddReadModelClick(root);
  return JSON.parse(holder.textContent).slices[0].readModels[0];
}

describe("clicking Add Read Model", () => {
  it("Clicking `Add Read Model` on that page after `New Slice` appends a Read Model whose `title` is `Read Model`", () => {
    expect(clickedReadModel().title).toBe("Read Model");
    expect(
      appendReadModel(appendSlice(empty)).slices[0]?.readModels[0]?.title,
    ).toBe("Read Model");
  });

  it("Clicking `Add Read Model` on that page after `New Slice` appends a Read Model whose `type` is `READMODEL`", () => {
    expect(clickedReadModel().type).toBe("READMODEL");
    expect(
      appendReadModel(appendSlice(empty)).slices[0]?.readModels[0]?.type,
    ).toBe("READMODEL");
  });

  it("Clicking `Add Read Model` on that page after `New Slice` appends a Read Model whose `fields` is `[]`", () => {
    expect(clickedReadModel().fields).toEqual([]);
    expect(
      appendReadModel(appendSlice(empty)).slices[0]?.readModels[0]?.fields,
    ).toEqual([]);
  });
});

function clickedAutomation() {
  const holder = { textContent: JSON.stringify(empty) };
  const root = {
    querySelector(sel: string) {
      if (sel === "ul") return { append() {} };
      if (sel === "main") return { textContent: "", insertAdjacentHTML() {} };
      if (sel === '[aria-label="Timeline"]') return { append() {} };
      return null;
    },
    getElementById(id: string) {
      return id === "event-model-document" ? holder : null;
    },
    createElement() {
      return { textContent: "", setAttribute() {} };
    },
  };
  onNewSliceClick(root);
  onAddAutomationClick(root);
  return JSON.parse(holder.textContent).slices[0].processors[0];
}

describe("clicking Add Automation", () => {
  it("Clicking `Add Automation` on that page after `New Slice` appends an Automation whose `title` is `Automation`", () => {
    expect(clickedAutomation().title).toBe("Automation");
    expect(
      appendAutomation(appendSlice(empty)).slices[0]?.processors[0]?.title,
    ).toBe("Automation");
  });

  it("Clicking `Add Automation` on that page after `New Slice` appends an Automation whose `type` is `AUTOMATION`", () => {
    expect(clickedAutomation().type).toBe("AUTOMATION");
    expect(
      appendAutomation(appendSlice(empty)).slices[0]?.processors[0]?.type,
    ).toBe("AUTOMATION");
  });

  it("Clicking `Add Automation` on that page after `New Slice` appends an Automation whose `fields` is `[]`", () => {
    expect(clickedAutomation().fields).toEqual([]);
    expect(
      appendAutomation(appendSlice(empty)).slices[0]?.processors[0]?.fields,
    ).toEqual([]);
  });
});

describe("dragging ports", () => {
  it("Dragging from `Command port` onto `Event Happened port` appends a Connection whose `fromKind` is `COMMAND`", () => {
    const withBlocks = appendEvent(appendCommand(appendSlice(empty)));
    const command = withBlocks.slices[0].commands[0];
    const event = withBlocks.slices[0].events[0];
    const next = appendConnection(withBlocks, {
      fromID: command.id,
      fromKind: "COMMAND",
      toID: event.id,
    });
    expect(next.connections[0]?.fromKind).toBe("COMMAND");
  });

  it("Dragging from `Command port` onto `Event Happened port` appends a Connection whose `toKind` is `EVENT`", () => {
    const withBlocks = appendEvent(appendCommand(appendSlice(empty)));
    const command = withBlocks.slices[0].commands[0];
    const event = withBlocks.slices[0].events[0];
    const next = appendConnection(withBlocks, {
      fromID: command.id,
      fromKind: "COMMAND",
      toID: event.id,
      toKind: "EVENT",
    });
    expect(next.connections[0]?.toKind).toBe("EVENT");
  });
});
