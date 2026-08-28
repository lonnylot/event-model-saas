export function restoreEvent(model, event, sliceId, index) {
  return {
    ...model,
    slices: (model.slices ?? []).map((slice) => {
      if (slice.id !== sliceId) return slice;
      const events = [...(slice.events ?? [])];
      events.splice(index, 0, event);
      return { ...slice, events };
    }),
  };
}
