export function moveAutomationToSlice(model, automationId, sliceId) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    processors: [...(slice.processors ?? [])],
  }));
  let automation;
  for (const slice of slices) {
    const index = slice.processors.findIndex((item) => item.id === automationId);
    if (index >= 0) {
      automation = slice.processors[index];
      slice.processors.splice(index, 1);
      break;
    }
  }
  if (!automation) return model;
  const target = slices.find((slice) => slice.id === sliceId);
  if (!target) return model;
  target.processors.push(automation);
  return { ...model, slices };
}
