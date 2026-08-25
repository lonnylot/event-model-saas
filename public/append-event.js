export function appendEvent(model) {
  const slices = [...(model.slices ?? [])];
  if (slices.length === 0) return { ...model, slices };
  const last = slices[slices.length - 1];
  slices[slices.length - 1] = {
    ...last,
    events: [
      ...(last.events ?? []),
      { id: crypto.randomUUID(), title: "Event Happened", type: "EVENT" },
    ],
  };
  return { ...model, slices };
}
