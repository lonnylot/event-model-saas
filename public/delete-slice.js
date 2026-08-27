export function deleteSlice(model, sliceId) {
  return {
    ...model,
    slices: (model.slices ?? []).filter((slice) => slice.id !== sliceId),
  };
}
