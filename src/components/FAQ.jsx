import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class FAQ extends PureComponent {
  static propTypes = {};

  render() {
    return (
      <div className="bg-off-black white">
        <h2>Frequently Asked Questions</h2>
        <details open>
          <summary>some question</summary>
          <p>Answer to that question.</p>
        </details>
        <details>
          <summary>some question</summary>
          <p>Answer to that question.</p>
        </details>
        <details>
          <summary>some question</summary>
          <p>Answer to that question.</p>
        </details>
        <details>
          <summary>some question</summary>
          <p>Answer to that question.</p>
        </details>
      </div>
    );
  }
}

export default FAQ;
