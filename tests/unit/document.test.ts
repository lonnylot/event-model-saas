import { describe, expect, it } from "vitest";
import { appendSlice } from "../../src/document/append-slice.ts";
import { appendActor } from "../../src/document/append-actor.ts";
import { appendCommand } from "../../src/document/append-command.ts";
import {
  onAddActorClick,
  onAddCommandClick,
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
});
