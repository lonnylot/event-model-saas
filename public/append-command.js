export function appendCommand(model) {
  const slices = [...(model.slices ?? [])];
  if (slices.length === 0) return { ...model, slices };
  const last = slices[slices.length - 1];
  slices[slices.length - 1] = {
    ...last,
    commands: [
      ...(last.commands ?? []),
      { id: crypto.randomUUID(), title: "Command", type: "COMMAND" },
    ],
  };
  return { ...model, slices };
}
