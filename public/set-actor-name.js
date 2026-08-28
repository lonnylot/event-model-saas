export function setActorName(model, name, id) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    actors: (slice.actors ?? []).map((actor) =>
      actor.id === id ? { ...actor, name } : actor,
    ),
  }));
  return { ...model, slices };
}
