export function appendField(model, target = "command") {
  const slices = [...(model.slices ?? [])];
  const slice = slices.at(-1);
  if (!slice) return model;
  const field = { id: crypto.randomUUID(), name: "newField", type: "String" };
  if (target === "event") {
    const events = [...(slice.events ?? [])];
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
    const readModel = readModels.at(-1);
    if (!readModel) return model;
    readModels[readModels.length - 1] = {
      ...readModel,
      fields: [...(readModel.fields ?? []), field],
    };
    slices[slices.length - 1] = { ...slice, readModels };
    return { ...model, slices };
  }
  const commands = [...(slice.commands ?? [])];
  const command = commands.at(-1);
  if (!command) return model;
  commands[commands.length - 1] = {
    ...command,
    fields: [...(command.fields ?? []), field],
  };
  slices[slices.length - 1] = { ...slice, commands };
  return { ...model, slices };
}
