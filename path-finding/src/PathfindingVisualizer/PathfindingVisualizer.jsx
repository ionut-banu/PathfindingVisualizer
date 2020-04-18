import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra } from '../algorithms/dijkstra';
import { dfs } from '../algorithms/dfs';
import { bfs } from '../algorithms/bfs';
import { computeRandomCost, getNodesInShortestPath } from '../util/util';
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';

import './PathfindingVisualizer.css';

const DIJKSTRA = 'Dijkstra';
const DFS = 'DFS';
const BFS = 'BFS';

const MAX_COST = 5;

const SPEED = 20;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      algorithm: DIJKSTRA,
      grid: [],
      clearNodesDisabled: false,
      visualizeDisabled: false,
      resetCostDisabled: false,
      isMouseDown: false,
      isStartSelected: false,
      isTargetSelected: false,
      START_NODE_ROW: 10,
      START_NODE_COL: 15,
      FINISH_NODE_ROW: 14,
      FINISH_NODE_COL: 20
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid: grid });
  }

  visualize() {
    this.setAllButtons(true);
    const { grid } = this.state;
    const startNode =
      grid[this.state.START_NODE_ROW][this.state.START_NODE_COL];
    const finishNode =
      grid[this.state.FINISH_NODE_ROW][this.state.FINISH_NODE_COL];
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
        default:
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
              this.setState({ clearNodesDisabled: false });
            }
        }, SPEED * i);
      }
    }, SPEED * delay);
  }

  clearNodes(clearPath, clearCost) {
    if (clearPath || clearCost) {
      const { grid } = this.state;
      for (const row of grid) {
        for (const node of row) {
          if (clearPath) {
            node.ref.current.initNode();
            node.isVisited = false;
            node.distance = Infinity;
          }
          if (clearCost) node.cost = 0;
        }
      }
      this.setState({ grid: grid });
      this.setAllButtons(false);
    }
  }

  setAlgorithm(eventkey, event) {
    this.setState({ algorithm: eventkey });
  }

  setAllButtons(disabled) {
    this.setState({
      visualizeDisabled: disabled,
      clearNodesDisabled: disabled,
      resetCostDisabled: disabled
    });
  }

  mouseDownHandle = (row, col) => {
    const { grid } = this.state;
    for (const row of grid) {
      for (const node of row) {
        if (node.isStart) {
          this.setState({ isStartSelected: true });
          break;
        }
      }
    }
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = { ...node, isStart: true };
    newGrid[row][col] = newNode;
    this.setState({ grid: newGrid });
    //const newGrid = toggleWall(this.state.grid, row, col);
    //this.setState({ isMouseDown: true, grid: newGrid });
  };

  mouseUpHandle = () => {
    this.setState({ isMouseDown: false });
  };

  mouseEnterHandle = (row, col) => {
    if (this.state.isMouseDown) {
      const newGrid = toggleWall(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
  };

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

  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(this.createNode(row, col));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  createNode = (row, col) => {
    return {
      ref: React.createRef(),
      col: col,
      row: row,
      cost: 0,
      isStart:
        this.state.START_NODE_ROW === row && this.state.START_NODE_COL === col,
      isFinish:
        this.state.FINISH_NODE_ROW === row &&
        this.state.FINISH_NODE_COL === col,
      isWall: false,
      distance: Infinity,
      previousNode: null
    };
  };

  render() {
    const { grid } = this.state;

    return (
      <>
        <Navbar bg='light' expand='md'>
          <Navbar.Brand>Path-finding</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav
              onSelect={(eventKey, event) => this.setAlgorithm(eventKey, event)}
              className='mr-auto'
            >
              <Nav.Link
                onClick={() => this.clearNodes(true, false)}
                disabled={this.state.clearNodesDisabled}
              >
                Start Node
              </Nav.Link>

              <Nav.Link
                onClick={() => this.clearNodes(true, false)}
                disabled={this.state.clearNodesDisabled}
              >
                Target Node
              </Nav.Link>

              <NavDropdown title='Pick algorithm' id='basic-nav-dropdown'>
                <NavDropdown.Item eventKey={DIJKSTRA}>
                  Dijkstra
                </NavDropdown.Item>
                <NavDropdown.Item eventKey={DFS}>DFS</NavDropdown.Item>
                <NavDropdown.Item eventKey={BFS}>BFS</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link
                variant='success'
                onClick={() => this.visualize()}
                disabled={this.state.visualizeDisabled}
              >
                {`Visualize ${this.state.algorithm}`}
              </Nav.Link>
              <Nav.Link
                onClick={() => this.resetCost()}
                disabled={this.state.clearNodesDisabled}
              >
                Randomize Cost
              </Nav.Link>
              <Nav.Link
                onClick={() => this.clearNodes(true, false)}
                disabled={this.state.clearNodesDisabled}
              >
                Clear Path
              </Nav.Link>
              <Nav.Link
                onClick={() => this.clearNodes(false, true)}
                disabled={this.state.clearNodesDisabled}
              >
                Clear Cost
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className='noselect' onMouseUp={this.mouseUpHandle}>
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
                      <Node
                        key={nodeIdx}
                        ref={ref}
                        row={row}
                        col={col}
                        isStart={isStart}
                        isFinish={isFinish}
                        isWall={isWall}
                        cost={cost}
                        onMouseDown={this.mouseDownHandle}
                        onMouseUp={this.mouseUpHandle}
                        onMouseEnter={this.mouseEnterHandle}
                      ></Node>
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

const toggleWall = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = { ...node, isWall: !node.isWall };
  newGrid[row][col] = newNode;
  return newGrid;
};
