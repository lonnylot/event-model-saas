export function setReadModelTitle(model, title, id) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    readModels: (slice.readModels ?? []).map((readModel) =>
      readModel.id === id ? { ...readModel, title } : readModel,
    ),
  }));
  return { ...model, slices };
}
