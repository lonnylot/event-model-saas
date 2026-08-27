export function setCommandTitle(model, title, id) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    commands: (slice.commands ?? []).map((command) =>
      command.id === id ? { ...command, title } : command,
    ),
  }));
  return { ...model, slices };
}
