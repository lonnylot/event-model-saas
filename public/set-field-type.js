export function setFieldType(model, type, target = "command", id) {
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
    const fields = [...(event.fields ?? [])];
    if (!fields.length) return model;
    fields[0] = { ...fields[0], type };
    events[index] = { ...event, fields };
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
    const fields = [...(readModel.fields ?? [])];
    if (!fields.length) return model;
    fields[0] = { ...fields[0], type };
    readModels[index] = { ...readModel, fields };
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
    const fields = [...(automation.fields ?? [])];
    if (!fields.length) return model;
    fields[0] = { ...fields[0], type };
    processors[index] = { ...automation, fields };
    slices[slices.length - 1] = { ...slice, processors };
    return { ...model, slices };
  }
  if (id) {
    const sliceIndex = slices.findIndex((candidate) =>
      (candidate.commands ?? []).some((command) => command.id === id),
    );
    if (sliceIndex < 0) return model;
    const selected = slices[sliceIndex];
    const commands = [...(selected.commands ?? [])];
    const index = commands.findIndex((command) => command.id === id);
    if (index < 0) return model;
    const command = commands[index];
    if (!command) return model;
    const fields = [...(command.fields ?? [])];
    if (!fields.length) return model;
    fields[0] = { ...fields[0], type };
    commands[index] = { ...command, fields };
    slices[sliceIndex] = { ...selected, commands };
    return { ...model, slices };
  }
  const commands = [...(slice.commands ?? [])];
  const index = commands.length - 1;
  if (index < 0) return model;
  const command = commands[index];
  if (!command) return model;
  const fields = [...(command.fields ?? [])];
  if (!fields.length) return model;
  fields[0] = { ...fields[0], type };
  commands[index] = { ...command, fields };
  slices[slices.length - 1] = { ...slice, commands };
  return { ...model, slices };
}
