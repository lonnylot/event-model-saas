export function appendSlice(model) {
  return {
    ...model,
    slices: [
      ...(model.slices ?? []),
      {
        id: crypto.randomUUID(),
        title: "New Slice",
        sliceType: "STATE_CHANGE",
        actors: [{ id: crypto.randomUUID(), name: "Actor" }],
        commands: [],
        events: [],
        readModels: [],
        processors: [],
      },
    ],
  };
}
