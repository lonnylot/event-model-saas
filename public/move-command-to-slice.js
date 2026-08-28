export function moveCommandToSlice(model, commandId, sliceId) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    commands: [...(slice.commands ?? [])],
  }));
  let command;
  for (const slice of slices) {
    const index = slice.commands.findIndex((item) => item.id === commandId);
    if (index >= 0) {
      command = slice.commands[index];
      break;
    }
  }
  if (!command) return model;
  const target = slices.find((slice) => slice.id === sliceId);
  if (!target) return model;
  target.commands.push(command);
  return { ...model, slices };
}
