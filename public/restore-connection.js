export function restoreConnection(model, connection, index) {
  const connections = [...(model.connections ?? [])];
  connections.splice(index, 0, connection);
  return { ...model, connections };
}
