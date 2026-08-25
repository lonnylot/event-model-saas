export function appendAutomation(model) {
  const slices = [...(model.slices ?? [])];
  if (slices.length === 0) return { ...model, slices };
  const last = slices[slices.length - 1];
  slices[slices.length - 1] = {
    ...last,
    processors: [
      ...(last.processors ?? []),
      { id: crypto.randomUUID(), title: "Automation" },
    ],
  };
  return { ...model, slices };
}
