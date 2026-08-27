export function setEventDescription(model, description, id) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    events: (slice.events ?? []).map((event) =>
      event.id === id ? { ...event, description } : event,
    ),
  }));
  return { ...model, slices };
}
