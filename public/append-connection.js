export function appendConnection(model, edge) {
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
