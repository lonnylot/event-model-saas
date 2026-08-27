export function setSliceType(model, sliceType, id) {
  const slices = [...(model.slices ?? [])];
  if (id) {
    return {
      ...model,
      slices: slices.map((slice) =>
        slice.id === id ? { ...slice, sliceType } : slice,
      ),
    };
  }
  if (!slices.length) return model;
  slices[slices.length - 1] = { ...slices[slices.length - 1], sliceType };
  return { ...model, slices };
}
