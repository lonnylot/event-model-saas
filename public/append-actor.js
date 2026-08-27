export function appendActor(model, sliceIndex) {
  const slices = [...(model.slices ?? [])];
  if (slices.length === 0) return { ...model, slices };
  const index = sliceIndex ?? slices.length - 1;
  const target = slices[index];
  if (!target) return { ...model, slices };
  slices[index] = {
    ...target,
    actors: [
      ...(target.actors ?? []),
      { id: crypto.randomUUID(), name: "Actor" },
    ],
  };
  return { ...model, slices };
}
