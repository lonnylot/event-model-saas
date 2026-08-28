export function moveEventToSlice(model, eventId, sliceId) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    events: [...(slice.events ?? [])],
  }));
  let event;
  for (const slice of slices) {
    const index = slice.events.findIndex((item) => item.id === eventId);
    if (index >= 0) {
      event = slice.events[index];
      slice.events.splice(index, 1);
      break;
    }
  }
  if (!event) return model;
  const target = slices.find((slice) => slice.id === sliceId);
  if (!target) return model;
  target.events.push(event);
  return { ...model, slices };
}
