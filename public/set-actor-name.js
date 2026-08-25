export function setActorName(model, name) {
  const slices = [...(model.slices ?? [])];
  const slice = slices.at(-1);
  if (!slice) return model;
  const actors = [...(slice.actors ?? [])];
  if (!actors.length) return model;
  actors[actors.length - 1] = { ...actors[actors.length - 1], name };
  slices[slices.length - 1] = { ...slice, actors };
  return { ...model, slices };
}
