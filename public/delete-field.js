export function deleteField(model, target = "command") {
  const slices = [...(model.slices ?? [])];
  const slice = slices.at(-1);
  if (!slice) return model;
  if (target === "event") {
    const events = [...(slice.events ?? [])];
    const event = events.at(-1);
    if (!event) return model;
    events[events.length - 1] = { ...event, fields: [] };
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
  const command = commands.at(-1);
  if (!command) return model;
  commands[commands.length - 1] = { ...command, fields: [] };
  slices[slices.length - 1] = { ...slice, commands };
  return { ...model, slices };
}
