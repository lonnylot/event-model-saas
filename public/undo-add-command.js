export function undoAddCommand(model) {
  const slices = [...(model.slices ?? [])];
  if (slices.length === 0) return model;
  const last = slices[slices.length - 1];
  const commands = [...(last.commands ?? [])];
  commands.pop();
  slices[slices.length - 1] = { ...last, commands };
  return { ...model, slices };
}
