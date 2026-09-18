export function appendSlice(model, afterIndex) {
  const slices = [...(model.slices ?? [])];
  const insertAt = (afterIndex ?? slices.length - 1) + 1;
  slices.splice(insertAt, 0, {
    id: crypto.randomUUID(),
    title: `Slice ${slices.length + 1}`,
    sliceType: "STATE_CHANGE",
    actors: [{ id: crypto.randomUUID(), name: "Actor" }],
    commands: [],
    events: [],
    readModels: [],
    processors: [],
  });
  return { ...model, slices };
}
