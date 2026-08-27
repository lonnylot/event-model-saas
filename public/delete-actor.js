export function deleteActor(model, actorId) {
  return {
    ...model,
    slices: (model.slices ?? []).map((slice) => ({
      ...slice,
      actors: (slice.actors ?? []).filter((actor) => actor.id !== actorId),
    })),
  };
}
