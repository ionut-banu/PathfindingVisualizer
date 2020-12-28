import React, { Component } from 'react';
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import Modal from '@material-ui/core/Modal';
import Node from './Node/Node';
import { dijkstra } from '../algorithms/dijkstra';
import { dfs } from '../algorithms/dfs';
import { bfs } from '../algorithms/bfs';
import { computeRandomCost, getNodesInShortestPath } from '../util/util';

import './PathfindingVisualizer.css';
import SimpleModal from './Modal/SimpleModal';

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
      interactDisabled: false,
      visualizeDisabled: false,
      resetCostDisabled: false,
      isMouseDown: false,
      isStartSelected: false,
      isTargetSelected: false,
      START_NODE_ROW: 10,
      START_NODE_COL: 15,
      FINISH_NODE_ROW: 14,
      FINISH_NODE_COL: 20,
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
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
      isTarget:
        this.state.FINISH_NODE_ROW === row &&
        this.state.FINISH_NODE_COL === col,
      isWall: false,
      distance: Infinity,
      previousNode: null,
    };
  };

  setAlgorithm(eventkey, event) {
    this.setState({ algorithm: eventkey });
  }

  setAllButtons(disabled) {
    this.setState({
      visualizeDisabled: disabled,
      interactDisabled: disabled,
      resetCostDisabled: disabled,
    });
  }

  visualize() {
    this.setAllButtons(true);
    const { grid } = this.state;
    const startNode = this.getNode(true);
    const finishNode = this.getNode(false);
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
          if (i + 1 < nodesInOrder.length && !nodesInOrder[i + 1].isTarget)
            nodesInOrder[i + 1].ref.current.setState({ isCurrent: true });
          if (node.isTarget)
            if (node.ref.current.state.isShortPath) {
              this.setState({ interactDisabled: false });
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
            node.previousNode = null;
          }
          if (clearCost) node.cost = 0;
        }
      }
      this.setState({ grid: grid });
      this.setAllButtons(false);
    }
  }

  getNode = (start) => {
    const { grid } = this.state;
    for (const row of grid) {
      for (const node of row) {
        if ((node.isStart && start) || (node.isTarget && !start)) {
          return node;
        }
      }
    }
  };

  mouseDownHandle = (row, col) => {
    if (this.interactDisabled) return;
    this.setState({ isMouseDown: true });

    const startNode = this.getNode(true);
    if (startNode.isStart && startNode.row === row && startNode.col === col) {
      this.setState({ isStartSelected: true });
      return;
    }

    const targetNode = this.getNode(false);
    if (
      targetNode.isTarget &&
      targetNode.row === row &&
      targetNode.col === col
    ) {
      this.setState({ isTargetSelected: true });
      return;
    }

    //const newGrid = toggleWall(this.state.grid, row, col);
  };

  mouseUpHandle = () => {
    if (this.interactDisabled) return;
    this.setState({
      isMouseDown: false,
      isStartSelected: false,
      isTargetSelected: false,
    });
  };

  mouseEnterHandle = (row, col) => {
    if (this.interactDisabled) return;
    if (this.state.isMouseDown) {
      const { grid } = this.state;
      const newGrid = grid.slice();
      const node = newGrid[row][col];
      let newNode = null;
      if (this.state.isStartSelected) {
        newNode = { ...node, isStart: true };
      } else if (this.state.isTargetSelected) {
        newNode = { ...node, isTarget: true };
      } else {
        newNode = { ...node, isWall: !node.isWall };
      }
      if (newNode) {
        newGrid[row][col] = newNode;
        this.setState({ grid: newGrid });
      }
    }
  };

  mouseLeaveHandle = (row, col) => {
    if (this.interactDisabled) return;
    if (this.state.isMouseDown) {
      if (
        window.event.relatedTarget.className === 'App' ||
        window.event.relatedTarget.className === 'grid-row' ||
        window.event.relatedTarget.className === ''
      ) {
        this.mouseUpHandle();
        return;
      }
      const { grid } = this.state;
      const newGrid = grid.slice();
      const node = newGrid[row][col];
      let newNode = null;
      if (this.state.isStartSelected) {
        newNode = { ...node, isStart: false };
      } else if (this.state.isTargetSelected) {
        newNode = { ...node, isTarget: false };
      }

      if (newNode) {
        newGrid[row][col] = newNode;
        this.setState({ grid: newGrid });
      }
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
                onClick={() => this.clearNodes(true, true)}
                disabled={this.state.interactDisabled}
              >
                Clear
              </Nav.Link>
              <Nav.Link
                onClick={() => this.resetCost()}
                disabled={this.state.interactDisabled}
              >
                Randomize Cost
              </Nav.Link>

              <SimpleModal></SimpleModal>
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
                      isTarget,
                      isWall,
                      cost,
                    } = node;
                    return (
                      <Node
                        key={nodeIdx}
                        ref={ref}
                        row={row}
                        col={col}
                        isStart={isStart}
                        isTarget={isTarget}
                        isWall={isWall}
                        cost={cost}
                        onMouseDown={this.mouseDownHandle}
                        onMouseUp={this.mouseUpHandle}
                        onMouseEnter={this.mouseEnterHandle}
                        onMouseLeave={this.mouseLeaveHandle}
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
