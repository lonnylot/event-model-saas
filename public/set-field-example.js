export function setFieldExample(model, example, target = "command") {
  const slices = [...(model.slices ?? [])];
  const slice = slices.at(-1);
  if (!slice) return model;
  if (target === "event") {
    const events = [...(slice.events ?? [])];
    const event = events.at(-1);
    if (!event) return model;
    const fields = [...(event.fields ?? [])];
    if (!fields.length) return model;
    fields[0] = { ...fields[0], example };
    events[events.length - 1] = { ...event, fields };
    slices[slices.length - 1] = { ...slice, events };
    return { ...model, slices };
  }
  const commands = [...(slice.commands ?? [])];
  const command = commands.at(-1);
  if (!command) return model;
  const fields = [...(command.fields ?? [])];
  if (!fields.length) return model;
  fields[0] = { ...fields[0], example };
  commands[commands.length - 1] = { ...command, fields };
  slices[slices.length - 1] = { ...slice, commands };
  return { ...model, slices };
}
