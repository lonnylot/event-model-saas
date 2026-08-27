export function appendEvent(model, sliceIndex) {
  const slices = [...(model.slices ?? [])];
  if (slices.length === 0) return { ...model, slices };
  const index = sliceIndex ?? slices.length - 1;
  const target = slices[index];
  if (!target) return { ...model, slices };
  slices[index] = {
    ...target,
    events: [
      ...(target.events ?? []),
      { id: crypto.randomUUID(), title: "Event Happened", type: "EVENT", fields: [] },
    ],
  };
  return { ...model, slices };
}
