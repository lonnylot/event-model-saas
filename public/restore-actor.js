export function restoreActor(model, actor, sliceId, index) {
  return {
    ...model,
    slices: (model.slices ?? []).map((slice) => {
      if (slice.id !== sliceId) return slice;
      const actors = [...(slice.actors ?? [])];
      actors.splice(index, 0, actor);
      return { ...slice, actors };
    }),
  };
}
