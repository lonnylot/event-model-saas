export function setSliceType(model, sliceType) {
  const slices = [...(model.slices ?? [])];
  if (!slices.length) return model;
  slices[slices.length - 1] = { ...slices[slices.length - 1], sliceType };
  return { ...model, slices };
}
