import React, { Component } from 'react';

export default class Arc extends Component {
  render() {
    const { d, arcClass } = this.props;
    return <path d={d} className={arcClass} />;
  }
}
