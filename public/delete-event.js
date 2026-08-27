export function deleteEvent(model, eventId) {
  return {
    ...model,
    slices: (model.slices ?? []).map((slice) => ({
      ...slice,
      events: (slice.events ?? []).filter((event) => event.id !== eventId),
    })),
  };
}
