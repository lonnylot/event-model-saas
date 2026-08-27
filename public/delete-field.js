export function deleteField(model) {
  const slices = [...(model.slices ?? [])];
  const slice = slices.at(-1);
  if (!slice) return model;
  const commands = [...(slice.commands ?? [])];
  const command = commands.at(-1);
  if (!command) return model;
  commands[commands.length - 1] = { ...command, fields: [] };
  slices[slices.length - 1] = { ...slice, commands };
  return { ...model, slices };
}
