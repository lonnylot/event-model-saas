export function moveCommandToSlice(model, commandId, sliceId, before) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    commands: [...(slice.commands ?? [])],
  }));
  let command;
  for (const slice of slices) {
    const index = slice.commands.findIndex((item) => item.id === commandId);
    if (index >= 0) {
      command = slice.commands[index];
      slice.commands.splice(index, 1);
      break;
    }
  }
  if (!command) return model;
  if (before) {
    const target = slices.find((slice) =>
      slice.commands.some((item) => item.id === before),
    );
    if (!target) return model;
    const beforeIndex = target.commands.findIndex((item) => item.id === before);
    target.commands.splice(beforeIndex, 0, command);
    return { ...model, slices };
  }
  const target = slices.find((slice) => slice.id === sliceId);
  if (!target) return model;
  target.commands.push(command);
  return { ...model, slices };
}
