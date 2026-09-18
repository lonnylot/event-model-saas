export function appendField(model, target = "command", id) {
  const slices = [...(model.slices ?? [])];
  const field = { id: crypto.randomUUID(), name: "newField", type: "String" };
  if (target === "event") {
    if (id) {
      const sliceIndex = slices.findIndex((slice) =>
        (slice.events ?? []).some((event) => event.id === id),
      );
      if (sliceIndex < 0) return model;
      const slice = slices[sliceIndex];
      const events = [...(slice.events ?? [])];
      const index = events.findIndex((event) => event.id === id);
      if (index < 0) return model;
      const event = events[index];
      if (!event) return model;
      events[index] = {
        ...event,
        fields: [...(event.fields ?? []), field],
      };
      slices[sliceIndex] = { ...slice, events };
      return { ...model, slices };
    }
    const slice = slices.at(-1);
    if (!slice) return model;
    const events = [...(slice.events ?? [])];
    const index = events.length - 1;
    if (index < 0) return model;
    const event = events[index];
    if (!event) return model;
    events[index] = {
      ...event,
      fields: [...(event.fields ?? []), field],
    };
    slices[slices.length - 1] = { ...slice, events };
    return { ...model, slices };
  }
  if (target === "readmodel") {
    if (id) {
      const sliceIndex = slices.findIndex((slice) =>
        (slice.readModels ?? []).some((readModel) => readModel.id === id),
      );
      if (sliceIndex < 0) return model;
      const slice = slices[sliceIndex];
      const readModels = [...(slice.readModels ?? [])];
      const index = readModels.findIndex((readModel) => readModel.id === id);
      if (index < 0) return model;
      const readModel = readModels[index];
      if (!readModel) return model;
      readModels[index] = {
        ...readModel,
        fields: [...(readModel.fields ?? []), field],
      };
      slices[sliceIndex] = { ...slice, readModels };
      return { ...model, slices };
    }
    const slice = slices.at(-1);
    if (!slice) return model;
    const readModels = [...(slice.readModels ?? [])];
    const index = readModels.length - 1;
    if (index < 0) return model;
    const readModel = readModels[index];
    if (!readModel) return model;
    readModels[index] = {
      ...readModel,
      fields: [...(readModel.fields ?? []), field],
    };
    slices[slices.length - 1] = { ...slice, readModels };
    return { ...model, slices };
  }
  if (target === "automation") {
    const slice = slices.at(-1);
    if (!slice) return model;
    const processors = [...(slice.processors ?? [])];
    const index = id
      ? processors.findIndex((automation) => automation.id === id)
      : processors.length - 1;
    if (index < 0) return model;
    const automation = processors[index];
    if (!automation) return model;
    processors[index] = {
      ...automation,
      fields: [...(automation.fields ?? []), field],
    };
    slices[slices.length - 1] = { ...slice, processors };
    return { ...model, slices };
  }
  if (id) {
    const sliceIndex = slices.findIndex((slice) =>
      (slice.commands ?? []).some((command) => command.id === id),
    );
    if (sliceIndex < 0) return model;
    const slice = slices[sliceIndex];
    const commands = [...(slice.commands ?? [])];
    const index = commands.findIndex((command) => command.id === id);
    if (index < 0) return model;
    const command = commands[index];
    if (!command) return model;
    commands[index] = {
      ...command,
      fields: [...(command.fields ?? []), field],
    };
    slices[sliceIndex] = { ...slice, commands };
    return { ...model, slices };
  }
  const slice = slices.at(-1);
  if (!slice) return model;
  const commands = [...(slice.commands ?? [])];
  const index = commands.length - 1;
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
