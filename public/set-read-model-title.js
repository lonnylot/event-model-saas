export function setReadModelTitle(model, title) {
  const slices = [...(model.slices ?? [])];
  const slice = slices.at(-1);
  if (!slice) return model;
  const readModels = [...(slice.readModels ?? [])];
  if (!readModels.length) return model;
  readModels[readModels.length - 1] = {
    ...readModels[readModels.length - 1],
    title,
  };
  slices[slices.length - 1] = { ...slice, readModels };
  return { ...model, slices };
}
