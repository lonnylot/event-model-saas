export function undoAutomation(model) {
  const slices = [...(model.slices ?? [])];
  const last = slices.at(-1);
  if (!last) return model;
  const processors = [...(last.processors ?? [])];
  processors.pop();
  slices[slices.length - 1] = { ...last, processors };
  return { ...model, slices };
}
