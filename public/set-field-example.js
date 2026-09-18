export function setFieldExample(model, example, target = "command", id) {
  const slices = [...(model.slices ?? [])];
  const slice = slices.at(-1);
  if (!slice) return model;
  if (target === "event") {
    if (id) {
      const sliceIndex = slices.findIndex((candidate) =>
        (candidate.events ?? []).some((event) => event.id === id),
      );
      if (sliceIndex < 0) return model;
      const selected = slices[sliceIndex];
      const events = [...(selected.events ?? [])];
      const index = events.findIndex((event) => event.id === id);
      if (index < 0) return model;
      const event = events[index];
      if (!event) return model;
      const fields = [...(event.fields ?? [])];
      if (!fields.length) return model;
      fields[0] = { ...fields[0], example };
      events[index] = { ...event, fields };
      slices[sliceIndex] = { ...selected, events };
      return { ...model, slices };
    }
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
  if (target === "readmodel") {
    const readModels = [...(slice.readModels ?? [])];
    const readModel = readModels.at(-1);
    if (!readModel) return model;
    const fields = [...(readModel.fields ?? [])];
    if (!fields.length) return model;
    fields[0] = { ...fields[0], example };
    readModels[readModels.length - 1] = { ...readModel, fields };
    slices[slices.length - 1] = { ...slice, readModels };
    return { ...model, slices };
  }
  if (target === "automation") {
    const processors = [...(slice.processors ?? [])];
    const automation = processors.at(-1);
    if (!automation) return model;
    const fields = [...(automation.fields ?? [])];
    if (!fields.length) return model;
    fields[0] = { ...fields[0], example };
    processors[processors.length - 1] = { ...automation, fields };
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
    fields[0] = { ...fields[0], example };
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
  fields[0] = { ...fields[0], example };
  commands[index] = { ...command, fields };
  slices[slices.length - 1] = { ...slice, commands };
  return { ...model, slices };
}
