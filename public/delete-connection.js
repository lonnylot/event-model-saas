export function deleteConnection(model, connectionId) {
  return {
    ...model,
    connections: (model.connections ?? []).filter(
      (connection) => connection.id !== connectionId,
    ),
  };
}
