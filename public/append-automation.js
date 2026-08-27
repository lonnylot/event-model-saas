export function appendAutomation(model, sliceIndex) {
  const slices = [...(model.slices ?? [])];
  if (slices.length === 0) return { ...model, slices };
  const index = sliceIndex ?? slices.length - 1;
  const target = slices[index];
  if (!target) return { ...model, slices };
  slices[index] = {
    ...target,
    processors: [
      ...(target.processors ?? []),
      { id: crypto.randomUUID(), title: "Automation", type: "AUTOMATION", fields: [] },
    ],
  };
  return { ...model, slices };
}
