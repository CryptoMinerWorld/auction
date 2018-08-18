import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class DescriptionBox extends PureComponent {
  static propTypes = {};

  render() {
    return (
      <div className="bg-off-black white">
        <h2>hello</h2>
        <p>description</p>
        <div>
          <img src="" alt="" />
          <p>Category</p>
          <p>description</p>
        </div>
        <div>
          <img src="" alt="" />
          <p>Category</p>
          <p>description</p>
        </div>
        <div>
          <img src="" alt="" />
          <p>Category</p>
          <p>description</p>
        </div>
      </div>
    );
  }
}

export default DescriptionBox;
