export function deleteAutomation(model, automationId) {
  return {
    ...model,
    slices: (model.slices ?? []).map((slice) => ({
      ...slice,
      processors: (slice.processors ?? []).filter(
        (processor) => processor.id !== automationId,
      ),
    })),
  };
}
