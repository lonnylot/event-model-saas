export function setActorDescription(model, description, id) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    actors: (slice.actors ?? []).map((actor) =>
      actor.id === id ? { ...actor, description } : actor,
    ),
  }));
  return { ...model, slices };
}
