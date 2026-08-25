export function setSliceTitle(model, title) {
  const slices = [...(model.slices ?? [])];
  if (!slices.length) return model;
  slices[slices.length - 1] = { ...slices[slices.length - 1], title };
  return { ...model, slices };
}
