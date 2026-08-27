export function deleteReadModel(model, readModelId) {
  return {
    ...model,
    slices: (model.slices ?? []).map((slice) => ({
      ...slice,
      readModels: (slice.readModels ?? []).filter(
        (readModel) => readModel.id !== readModelId,
      ),
    })),
  };
}
