//return all nodes as an array
export function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

export function computeRandomCost(maxCost) {
  return Math.floor(Math.random() * maxCost) + 1;
}
