export function undoActor(model) {
  const slices = [...(model.slices ?? [])];
  const last = slices.at(-1);
  if (!last) return model;
  const actors = [...(last.actors ?? [])];
  actors.pop();
  slices[slices.length - 1] = { ...last, actors };
  return { ...model, slices };
}
