import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ProgressMeter extends PureComponent {
  static propTypes = {};

  render() {
    return (
      <div className="bg-off-black white">
        <p>I'm a progress meter.</p>
        <progress value="22" max="100" />
      </div>
    );
  }
}

export default ProgressMeter;
