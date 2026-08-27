export function appendCommand(model, sliceIndex) {
  const slices = [...(model.slices ?? [])];
  if (slices.length === 0) return { ...model, slices };
  const index = sliceIndex ?? slices.length - 1;
  const target = slices[index];
  if (!target) return { ...model, slices };
  slices[index] = {
    ...target,
    commands: [
      ...(target.commands ?? []),
      { id: crypto.randomUUID(), title: "Command", type: "COMMAND", fields: [] },
    ],
  };
  return { ...model, slices };
}
