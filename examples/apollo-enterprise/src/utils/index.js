export const offsetToCursor = (offset) => Buffer.from(offset.toString()).toString('base64');
export const mergeEdges = (left, right) => {
  const deduplicateEdges = right.filter((edge) => left.find((prevEdge) => prevEdge.node.id !== edge.node.id));
  return [...left, ...deduplicateEdges];
};
