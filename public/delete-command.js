export function deleteCommand(model, commandId) {
  return {
    ...model,
    slices: (model.slices ?? []).map((slice) => ({
      ...slice,
      commands: (slice.commands ?? []).filter(
        (command) => command.id !== commandId,
      ),
    })),
  };
}
