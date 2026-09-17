export function undoAddCommand(model, sliceIndex) {
  const slices = [...(model.slices ?? [])];
  if (slices.length === 0) return model;
  const index = sliceIndex ?? slices.length - 1;
  const target = slices[index];
  if (!target) return model;
  const commands = [...(target.commands ?? [])];
  commands.pop();
  slices[index] = { ...target, commands };
  return { ...model, slices };
}
