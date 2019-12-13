import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPath } from '../algorithms/dijkstra';
import { getAllNodes, computeRandomCost } from '../util/util';

import './PathfindingVisualizer.css';

const MAX_COST = 5;

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 15;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      clearDisabled: true,
      visualizeDisabled: false,
      resetCostDisabled: false
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid: grid });
  }

  visualizeDijkstra() {
    this.setAllButtons(true);
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    this.animateNodes(visitedNodesInOrder, 'node-visited', 0);
    this.animateNodes(visitedNodesInOrder, { isVisited: true }, 0);
    const nodesInShortestPath = getNodesInShortestPath(finishNode);
    this.animateNodes(
      nodesInShortestPath,
      { isShortPath: true },
      visitedNodesInOrder.length
    );
  }

  animateNodes(nodesInOrder, animation, delay) {
    setTimeout(() => {
      for (let i = 0; i < nodesInOrder.length; i++) {
        setTimeout(() => {
          const node = nodesInOrder[i];
          node.ref.current.setState(animation);
          if (i + 1 < nodesInOrder.length && !nodesInOrder[i + 1].isFinish)
            nodesInOrder[i + 1].ref.current.setState({ isCurrent: true });
          if (node.isFinish)
            if (node.ref.current.state.isShortPath) {
              this.setState({ clearDisabled: false });
            }
        }, 5 * i);
      }
    }, 5 * delay);
  }

  clearGrid() {
    const { grid } = this.state;
    for (const row of grid) {
      for (const node of row) {
        node.ref.current.setState({
          cost: 0,
          isVisited: false,
          isShortPath: false,
          isCurrent: false
        });
        node.distance = Infinity;
        node.isVisited = false;
      }
    }
    this.setAllButtons(false);
  }

  setAllButtons(disabled) {
    this.setState({
      visualizeDisabled: disabled,
      clearDisabled: disabled,
      resetCostDisabled: disabled
    });
  }

  resetCost() {
    const { grid } = this.state;
    for (const row of grid) {
      for (const node of row) {
        const cost = computeRandomCost(MAX_COST);
        node.ref.current.setState({ cost: cost });
      }
    }
  }

  render() {
    const { grid } = this.state;

    return (
      <>
        <div className='navbar'>
          <span className='brand'>Visualizer</span>
          <span className='nav-item'>Visualize</span>
        </div>
        <button
          onClick={() => this.visualizeDijkstra()}
          disabled={this.state.visualizeDisabled}
        >
          Visualize
        </button>
        <button
          onClick={() => this.clearGrid()}
          disabled={this.state.clearDisabled}
        >
          Clear
        </button>
        <button
          onClick={() => this.resetCost()}
          disabled={this.state.resetCostDisabled}
        >
          Reset Cost
        </button>
        <div className='grid'>
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {
                    ref,
                    row,
                    col,
                    cost,
                    isStart,
                    isFinish,
                    isWall
                  } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      ref={ref}
                      row={row}
                      col={col}
                      cost={cost}
                      isStart={isStart}
                      isFinish={isFinish}
                      isWall={isWall}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (row, col) => {
  return {
    ref: React.createRef(),
    col: col,
    row: row,
    cost: computeRandomCost(MAX_COST),
    isStart: START_NODE_ROW === row && START_NODE_COL === col,
    isFinish: FINISH_NODE_ROW === row && FINISH_NODE_COL === col,
    isVisited: false,
    isWall: false,
    distance: Infinity,
    previousNode: null
  };
};
