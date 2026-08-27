export function setCommandDescription(model, description, id) {
  const slices = (model.slices ?? []).map((slice) => ({
    ...slice,
    commands: (slice.commands ?? []).map((command) =>
      command.id === id ? { ...command, description } : command,
    ),
  }));
  return { ...model, slices };
}
