export function reorderSlices(model, sliceId, targetId) {
  const slices = [...(model.slices ?? [])];
  const fromIndex = slices.findIndex((slice) => slice.id === sliceId);
  const toIndex = slices.findIndex((slice) => slice.id === targetId);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return model;
  const next = [...slices];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return { ...model, slices: next };
}
