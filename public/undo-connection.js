export function undoConnection(model) {
  const connections = [...(model.connections ?? [])];
  connections.pop();
  return { ...model, connections };
}
