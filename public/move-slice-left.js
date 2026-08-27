export function moveSliceLeft(model, sliceId) {
  const slices = [...(model.slices ?? [])];
  const index = slices.findIndex((slice) => slice.id === sliceId);
  if (index <= 0) return model;
  const next = [...slices];
  [next[index - 1], next[index]] = [next[index], next[index - 1]];
  return { ...model, slices: next };
}
