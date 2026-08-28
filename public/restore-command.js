export function restoreCommand(model, command, sliceId, index) {
  return {
    ...model,
    slices: (model.slices ?? []).map((slice) => {
      if (slice.id !== sliceId) return slice;
      const commands = [...(slice.commands ?? [])];
      commands.splice(index, 0, command);
      return { ...slice, commands };
    }),
  };
}
