export function undoEvent(model) {
  const slices = [...(model.slices ?? [])];
  const last = slices.at(-1);
  if (!last) return model;
  const events = [...(last.events ?? [])];
  events.pop();
  slices[slices.length - 1] = { ...last, events };
  return { ...model, slices };
}
