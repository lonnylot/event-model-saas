export function restoreSlice(model, slice, index) {
  const slices = [...(model.slices ?? [])];
  slices.splice(index, 0, slice);
  return { ...model, slices };
}
