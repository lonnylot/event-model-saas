export function setSliceTitle(model, title, id) {
  const slices = (model.slices ?? []).map((slice) =>
    slice.id === id ? { ...slice, title } : slice,
  );
  return { ...model, slices };
}
