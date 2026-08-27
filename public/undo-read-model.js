export function undoReadModel(model) {
  const slices = [...(model.slices ?? [])];
  const last = slices.at(-1);
  if (!last) return model;
  const readModels = [...(last.readModels ?? [])];
  readModels.pop();
  slices[slices.length - 1] = { ...last, readModels };
  return { ...model, slices };
}
