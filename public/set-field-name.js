export function setFieldName(model, name, id, target = "command") {
  const slices = [...(model.slices ?? [])];
  const slice = slices.at(-1);
  if (!slice) return model;
  if (target === "event") {
    const events = [...(slice.events ?? [])];
    const event = events.at(-1);
    if (!event) return model;
    const fields = [...(event.fields ?? [])];
    if (!fields.length) return model;
    fields[0] = { ...fields[0], name };
    events[events.length - 1] = { ...event, fields };
    slices[slices.length - 1] = { ...slice, events };
    return { ...model, slices };
  }
  const commands = [...(slice.commands ?? [])];
  const index = id
    ? commands.findIndex((command) => command.id === id)
    : commands.length - 1;
  if (index < 0) return model;
  const command = commands[index];
  if (!command) return model;
  const fields = [...(command.fields ?? [])];
  if (!fields.length) return model;
  fields[0] = { ...fields[0], name };
  commands[index] = { ...command, fields };
  slices[slices.length - 1] = { ...slice, commands };
  return { ...model, slices };
}
