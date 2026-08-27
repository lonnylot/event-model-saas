export function setAutomationDescription(model, description, id) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    processors: (slice.processors ?? []).map((processor) =>
      processor.id === id ? { ...processor, description } : processor,
    ),
  }));
  return { ...model, slices };
}
