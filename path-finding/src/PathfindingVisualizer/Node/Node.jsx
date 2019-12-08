import React, { Component } from 'react';

import './Node.css';

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {
      extraClassName: '',
      cost: 0
    };
  }

  updateExtraClassName(className) {
    this.setState({ extraClassName: className });
  }

  initNode() {
    const { isStart, isFinish, isWall } = this.props;
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : '';

    this.updateExtraClassName(extraClassName);
  }

  componentDidMount() {
    this.initNode();
  }

  render() {
    return (
      <div className={'node ' + this.state.extraClassName}>
        {this.state.cost}
      </div>
    );
  }
}

export const DEFAULT_NODE = {
  row: 0,
  col: 0
};
