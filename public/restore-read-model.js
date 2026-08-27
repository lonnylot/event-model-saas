export function restoreReadModel(model, readModel, sliceId, index) {
  return {
    ...model,
    slices: (model.slices ?? []).map((slice) => {
      if (slice.id !== sliceId) return slice;
      const readModels = [...(slice.readModels ?? [])];
      readModels.splice(index, 0, readModel);
      return { ...slice, readModels };
    }),
  };
}
