export function restoreAutomation(model, automation, sliceId, index) {
  return {
    ...model,
    slices: (model.slices ?? []).map((slice) => {
      if (slice.id !== sliceId) return slice;
      const processors = [...(slice.processors ?? [])];
      processors.splice(index, 0, automation);
      return { ...slice, processors };
    }),
  };
}
