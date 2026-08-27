export function appendReadModel(model, sliceIndex) {
  const slices = [...(model.slices ?? [])];
  if (slices.length === 0) return { ...model, slices };
  const index = sliceIndex ?? slices.length - 1;
  const target = slices[index];
  if (!target) return { ...model, slices };
  slices[index] = {
    ...target,
    readModels: [
      ...(target.readModels ?? []),
      { id: crypto.randomUUID(), title: "Read Model", type: "READMODEL", fields: [] },
    ],
  };
  return { ...model, slices };
}
