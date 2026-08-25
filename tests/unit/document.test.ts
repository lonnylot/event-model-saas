import { describe, expect, it } from "vitest";
import { appendSlice } from "../../src/document/append-slice.ts";
import { onNewSliceClick } from "../../public/editor.js";

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
});
