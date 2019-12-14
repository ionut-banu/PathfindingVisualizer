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
      cost: 0,
      isVisited: false,
      isShortPath: false,
      isCurrent: false
    };
  }

  getExtraClassName(className) {
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
      isCurrent: false
    });
  }

  componentDidMount() {
    this.initNode();
  }

  render() {
    return (
      <div className={'node ' + this.getExtraClassName()}>
        {this.state.cost}
      </div>
    );
  }
}

export const DEFAULT_NODE = {
  row: 0,
  col: 0
};
