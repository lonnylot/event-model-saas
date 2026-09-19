export function deleteField(model, target = "command", id) {
  const slices = [...(model.slices ?? [])];
  const slice = slices.at(-1);
  if (!slice) return model;
  if (target === "event") {
    const events = [...(slice.events ?? [])];
    const index = id
      ? events.findIndex((event) => event.id === id)
      : events.length - 1;
    if (index < 0) return model;
    const event = events[index];
    if (!event) return model;
    events[index] = { ...event, fields: [] };
    slices[slices.length - 1] = { ...slice, events };
    return { ...model, slices };
  }
  if (target === "readmodel") {
    const readModels = [...(slice.readModels ?? [])];
    const readModel = readModels.at(-1);
    if (!readModel) return model;
    readModels[readModels.length - 1] = { ...readModel, fields: [] };
    slices[slices.length - 1] = { ...slice, readModels };
    return { ...model, slices };
  }
  if (target === "automation") {
    const processors = [...(slice.processors ?? [])];
    const automation = processors.at(-1);
    if (!automation) return model;
    processors[processors.length - 1] = { ...automation, fields: [] };
    slices[slices.length - 1] = { ...slice, processors };
    return { ...model, slices };
  }
  const commands = [...(slice.commands ?? [])];
  const index = id
    ? commands.findIndex((command) => command.id === id)
    : commands.length - 1;
  if (index < 0) return model;
  const command = commands[index];
  if (!command) return model;
  const fieldId = command.fields?.[0]?.id;
  commands[index] = {
    ...command,
    fields: (command.fields ?? []).filter((field) => field.id !== fieldId),
  };
  slices[slices.length - 1] = { ...slice, commands };
  return { ...model, slices };
}
