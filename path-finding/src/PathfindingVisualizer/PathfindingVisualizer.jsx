import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra } from '../algorithms/dijkstra';
import { dfs } from '../algorithms/dfs';
import { bfs } from '../algorithms/bfs';
import { computeRandomCost, getNodesInShortestPath } from '../util/util';
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';

import './PathfindingVisualizer.css';

const DIJKSTRA = 'dijkstra';
const DFS = 'dfs';
const BFS = 'bfs';

const MAX_COST = 5;

const SPEED = 20;

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 14;
const FINISH_NODE_COL = 20;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      algorithm: DIJKSTRA,
      grid: [],
      clearDisabled: true,
      visualizeDisabled: false,
      resetCostDisabled: false,
      mouseDown: false
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid: grid });
  }

  visualize() {
    this.setAllButtons(true);
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const { algorithm } = this.state;
    if (algorithm != null) {
      switch (algorithm) {
        case DIJKSTRA:
          this.visualizeDijkstra(grid, startNode, finishNode);
          break;
        case DFS:
          this.visualizeDfs(grid, startNode, finishNode);
          break;
        case BFS:
          this.visualizeBfs(grid, startNode, finishNode);
          break;
      }
    }
  }

  visualizeDijkstra(grid, startNode, finishNode) {
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    this.animateNodes(visitedNodesInOrder, { isVisited: true }, 0);
    const nodesInShortestPath = getNodesInShortestPath(finishNode);
    this.animateNodes(
      nodesInShortestPath,
      { isShortPath: true, isCurrent: false },
      visitedNodesInOrder.length
    );
  }

  visualizeDfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = dfs(grid, startNode, finishNode);
    this.animateNodes(visitedNodesInOrder, { isVisited: true }, 0);
    const nodesInShortestPath = getNodesInShortestPath(finishNode);
    this.animateNodes(
      nodesInShortestPath,
      { isShortPath: true, isCurrent: false },
      visitedNodesInOrder.length
    );
  }

  visualizeBfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = bfs(grid, startNode, finishNode);
    this.animateNodes(visitedNodesInOrder, { isVisited: true }, 0);
    const nodesInShortestPath = getNodesInShortestPath(finishNode);
    this.animateNodes(
      nodesInShortestPath,
      { isShortPath: true, isCurrent: false },
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
        }, SPEED * i);
      }
    }, SPEED * delay);
  }

  clearGrid() {
    const { grid } = this.state;
    for (const row of grid) {
      for (const node of row) {
        node.ref.current.initNode();
        node.isVisited = false;
        node.distance = Infinity;
        node.cost = 0;
      }
    }
    this.setState({ grid: grid });
    this.setAllButtons(false);
  }

  setAlgorithm(eventkey, event) {
    this.setState({ algorithm: eventkey });
  }

  setAllButtons(disabled) {
    this.setState({
      visualizeDisabled: disabled,
      clearDisabled: disabled,
      resetCostDisabled: disabled
    });
  }

  mouseDownHandle(ref) {
    this.setState({ mouseDown: true });
    ref.current.setState({ isWall: true });
  }

  mouseUpHandle = event => {
    this.setState({ mouseDown: false });
  };

  mouseEnterHandle(ref) {
    if (this.state.mouseDown) ref.current.setState({ isWall: true });
  }

  resetCost() {
    const { grid } = this.state;
    for (const row of grid) {
      for (const node of row) {
        const cost = computeRandomCost(MAX_COST);
        node.cost = cost;
      }
    }
    this.setState({ grid: grid });
  }

  render() {
    const { grid } = this.state;

    return (
      <>
        <Navbar bg='light' expand='lg'>
          <Navbar.Brand>Path-finding</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav
              onSelect={(eventKey, event) => this.setAlgorithm(eventKey, event)}
              className='mr-auto'
            >
              <NavDropdown title='Pick algorithm' id='basic-nav-dropdown'>
                <NavDropdown.Item eventKey={DIJKSTRA}>
                  Dijkstra
                </NavDropdown.Item>
                <NavDropdown.Item eventKey={DFS}>DFS</NavDropdown.Item>
                <NavDropdown.Item eventKey={BFS}>BFS</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className='noselect' onMouseUp={this.mouseUpHandle}>
          <button
            onClick={() => this.visualize()}
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
          <button>Test</button>
          <div className='grid'>
            {grid.map((row, rowIdx) => {
              return (
                <div className='grid-row' key={rowIdx}>
                  {row.map((node, nodeIdx) => {
                    const {
                      ref,
                      row,
                      col,
                      isStart,
                      isFinish,
                      isWall,
                      cost
                    } = node;
                    return (
                      <div
                        key={nodeIdx}
                        className='node-div'
                        onMouseDown={() => this.mouseDownHandle(ref)}
                        onMouseEnter={() => this.mouseEnterHandle(ref)}
                      >
                        <Node
                          ref={ref}
                          row={row}
                          col={col}
                          isStart={isStart}
                          isFinish={isFinish}
                          isWall={isWall}
                          cost={cost}
                        ></Node>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
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
    cost: 0,
    isStart: START_NODE_ROW === row && START_NODE_COL === col,
    isFinish: FINISH_NODE_ROW === row && FINISH_NODE_COL === col,
    isWall: false,
    distance: Infinity,
    previousNode: null
  };
};
