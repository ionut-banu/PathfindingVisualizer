import {
  getAllNodes,
  getUnvisitedNeighbors,
  getNodesInShortestPath
} from '../util/util';

export function dfs(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }

  const visitedNodes = [];
  const stack = [];
  stack.push(startNode);

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === finishNode) return visitedNodes;
    current.isVisited = true;
    visitedNodes.push(current);
    const unvisited = getUnvisitedNeighbors(current, grid);
    if (unvisited.length > 0) {
      unvisited.forEach(node => {
        node.previousNode = current;
        if (stack.includes(node)) stack.splice(stack.indexOf(node), 1);
        stack.push(node);
      });
    }
  }

  return visitedNodes;
}
