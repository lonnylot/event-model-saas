export function appendActor(model) {
  const slices = [...(model.slices ?? [])];
  if (slices.length === 0) return { ...model, slices };
  const last = slices[slices.length - 1];
  slices[slices.length - 1] = {
    ...last,
    actors: [
      ...(last.actors ?? []),
      { id: crypto.randomUUID(), name: "Actor" },
    ],
  };
  return { ...model, slices };
}
