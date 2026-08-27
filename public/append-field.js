export function appendField(model, target = "command", id) {
export function appendField(model, target = "command") {
  const slices = [...(model.slices ?? [])];
  const slice = slices.at(-1);
  if (!slice) return model;
  const field = { id: crypto.randomUUID(), name: "newField", type: "String" };
  if (target === "event") {
    const events = [...(slice.events ?? [])];
    const index = id
      ? events.findIndex((event) => event.id === id)
      : events.length - 1;
    if (index < 0) return model;
    const event = events[index];
    if (!event) return model;
    events[index] = {
    const event = events.at(-1);
    if (!event) return model;
    events[events.length - 1] = {
      ...event,
      fields: [...(event.fields ?? []), field],
    };
    slices[slices.length - 1] = { ...slice, events };
    return { ...model, slices };
  }
  if (target === "readmodel") {
    const readModels = [...(slice.readModels ?? [])];
    const index = id
      ? readModels.findIndex((readModel) => readModel.id === id)
      : readModels.length - 1;
    if (index < 0) return model;
    const readModel = readModels[index];
    if (!readModel) return model;
    readModels[index] = {
    const readModel = readModels.at(-1);
    if (!readModel) return model;
    readModels[readModels.length - 1] = {
      ...readModel,
      fields: [...(readModel.fields ?? []), field],
    };
    slices[slices.length - 1] = { ...slice, readModels };
    return { ...model, slices };
  }
  if (target === "automation") {
    const processors = [...(slice.processors ?? [])];
    const index = id
      ? processors.findIndex((automation) => automation.id === id)
      : processors.length - 1;
    if (index < 0) return model;
    const automation = processors[index];
    if (!automation) return model;
    processors[index] = {
    const automation = processors.at(-1);
    if (!automation) return model;
    processors[processors.length - 1] = {
      ...automation,
      fields: [...(automation.fields ?? []), field],
    };
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
  commands[index] = {
    ...command,
    fields: [...(command.fields ?? []), field],
  };
  slices[slices.length - 1] = { ...slice, commands };
  return { ...model, slices };
}
