export function moveActorToSlice(model, actorId, sliceId) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    actors: [...(slice.actors ?? [])],
  }));
  let actor;
  for (const slice of slices) {
    const index = slice.actors.findIndex((item) => item.id === actorId);
    if (index >= 0) {
      actor = slice.actors[index];
      slice.actors.splice(index, 1);
      break;
    }
  }
  if (!actor) return model;
  const target = slices.find((slice) => slice.id === sliceId);
  if (!target) return model;
  target.actors.push(actor);
  return { ...model, slices };
}
