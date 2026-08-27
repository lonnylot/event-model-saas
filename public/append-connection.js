export function appendConnection(model, edge) {
  if (edge.fromKind === "COMMAND" && edge.toKind === "READMODEL") {
    return model;
  }
  if (edge.fromKind === "EVENT" && edge.toKind === "COMMAND") {
    return model;
  }
  if (edge.fromKind === "COMMAND" && edge.toKind === "COMMAND") {
    return model;
  }
  if (edge.fromKind === "EVENT" && edge.toKind === "EVENT") {
    return model;
  }
  if (edge.fromKind === "READMODEL" && edge.toKind === "COMMAND") {
    return model;
  }
  if (edge.fromKind === "READMODEL" && edge.toKind === "EVENT") {
    return model;
  }
  if (edge.fromKind === "READMODEL" && edge.toKind === "READMODEL") {
    return model;
  }
  if (
    (model.connections ?? []).some(
      (connection) =>
        connection.fromID === edge.fromID && connection.toID === edge.toID,
    )
  ) {
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
