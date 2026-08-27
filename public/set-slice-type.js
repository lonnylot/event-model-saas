export function setSliceType(model, sliceType, id) {
  const slices = (model.slices ?? []).map((slice) =>
    slice.id === id ? { ...slice, sliceType } : slice,
  );
  return { ...model, slices };
}
