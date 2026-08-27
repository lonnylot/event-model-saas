export function setSliceDescription(model, description) {
  const slices = [...(model.slices ?? [])];
  if (!slices.length) return model;
  slices[slices.length - 1] = { ...slices[slices.length - 1], description };
  return { ...model, slices };
}
