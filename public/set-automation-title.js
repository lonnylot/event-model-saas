export function setAutomationTitle(model, title, id) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    processors: (slice.processors ?? []).map((processor) =>
      processor.id === id ? { ...processor, title } : processor,
    ),
  }));
  return { ...model, slices };
}
