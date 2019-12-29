import React, { Component } from 'react';

import './Node.css';

const START_NODE_ClS = 'node-start';
const FINISH_NODE_ClS = 'node-finish';
const WALL_NODE_CLS = 'node-wall';
const SHORT_NODE_CLS = 'node-short';
const VISITED_NODE_CLS = 'node-visited';
const CURRENT_NODE_CLS = 'node-current';

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisited: false,
      isShortPath: false,
      isCurrent: false
    };
  }

  getExtraClassName() {
    const { isStart, isFinish, isWall } = this.props;
    const { isVisited, isShortPath, isCurrent } = this.state;
    return isFinish
      ? FINISH_NODE_ClS
      : isStart
      ? START_NODE_ClS
      : isWall
      ? WALL_NODE_CLS
      : isShortPath
      ? SHORT_NODE_CLS
      : isVisited
      ? VISITED_NODE_CLS
      : isCurrent
      ? CURRENT_NODE_CLS
      : '';
  }

  initNode() {
    this.setState({
      cost: 0,
      isVisited: false,
      isShortPath: false,
      isCurrent: false,
      isWall: false
    });
  }

  componentDidMount() {
    this.initNode();
  }

  mouseDownHandle() {
    this.setState({ isWall: true });
  }

  render() {
    const { row, col, onMouseDown, onMouseUp, onMouseEnter } = this.props;
    return (
      <div
        className={'node ' + this.getExtraClassName()}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseUp={() => onMouseUp()}
        onMouseEnter={() => onMouseEnter(row, col)}
      >
        <span className='node-cost'>
          {this.props.cost !== 0 ? this.props.cost : ' '}
        </span>
      </div>
    );
  }
}

export const DEFAULT_NODE = {
  row: 0,
  col: 0
};
