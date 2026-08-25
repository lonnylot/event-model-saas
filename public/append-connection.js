export function appendConnection(model, edge) {
  if (edge.fromKind === "COMMAND" && edge.toKind === "READMODEL") {
    return model;
  }
  return {
    ...model,
    connections: [
      ...(model.connections ?? []),
      {
        id: crypto.randomUUID(),
        fromID: edge.fromID,
        fromKind: edge.fromKind,
        toID: edge.toID,
        toKind: edge.toKind,
      },
    ],
  };
}
