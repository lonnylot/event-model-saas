export function setSliceDescription(model, description, id) {
  const slices = (model.slices ?? []).map((slice) =>
    slice.id === id ? { ...slice, description } : slice,
  );
  return { ...model, slices };
}
