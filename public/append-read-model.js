export function appendReadModel(model) {
  const slices = [...(model.slices ?? [])];
  if (slices.length === 0) return { ...model, slices };
  const last = slices[slices.length - 1];
  slices[slices.length - 1] = {
    ...last,
    readModels: [
      ...(last.readModels ?? []),
      { id: crypto.randomUUID(), title: "Read Model" },
    ],
  };
  return { ...model, slices };
}
