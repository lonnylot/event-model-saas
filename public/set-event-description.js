export function setEventDescription(model, description) {
  const slices = [...(model.slices ?? [])];
  const slice = slices.at(-1);
  if (!slice) return model;
  const events = [...(slice.events ?? [])];
  if (!events.length) return model;
  events[events.length - 1] = { ...events[events.length - 1], description };
  slices[slices.length - 1] = { ...slice, events };
  return { ...model, slices };
}
