export function setEventTitle(model, title, id) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    events: (slice.events ?? []).map((event) =>
      event.id === id ? { ...event, title } : event,
    ),
  }));
  return { ...model, slices };
}
