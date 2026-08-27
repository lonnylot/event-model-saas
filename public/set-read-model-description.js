export function setReadModelDescription(model, description, id) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    readModels: (slice.readModels ?? []).map((readModel) =>
      readModel.id === id ? { ...readModel, description } : readModel,
    ),
  }));
  return { ...model, slices };
}
