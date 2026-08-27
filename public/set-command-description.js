export function setCommandDescription(model, description) {
  const slices = [...(model.slices ?? [])];
  const slice = slices.at(-1);
  if (!slice) return model;
  const commands = [...(slice.commands ?? [])];
  if (!commands.length) return model;
  commands[commands.length - 1] = {
    ...commands[commands.length - 1],
    description,
  };
  slices[slices.length - 1] = { ...slice, commands };
  return { ...model, slices };
}
