export function moveReadModelToSlice(model, readModelId, sliceId) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    readModels: [...(slice.readModels ?? [])],
  }));
  let readModel;
  for (const slice of slices) {
    const index = slice.readModels.findIndex((item) => item.id === readModelId);
    if (index >= 0) {
      readModel = slice.readModels[index];
      slice.readModels.splice(index, 1);
      break;
    }
  }
  if (!readModel) return model;
  const target = slices.find((slice) => slice.id === sliceId);
  if (!target) return model;
  target.readModels.push(readModel);
  return { ...model, slices };
}
