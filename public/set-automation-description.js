export function setAutomationDescription(model, description) {
  const slices = [...(model.slices ?? [])];
  const slice = slices.at(-1);
  if (!slice) return model;
  const processors = [...(slice.processors ?? [])];
  if (!processors.length) return model;
  processors[processors.length - 1] = {
    ...processors[processors.length - 1],
    description,
  };
  slices[slices.length - 1] = { ...slice, processors };
  return { ...model, slices };
}
