import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Gembox from './Gembox';
import {  } from '../../market/helpers';

const TopHighLight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  height: 4px;
`;

const tophighlight = {
  background: 'linear-gradient(to right, #e36d2d, #b91a78)',
  height: '4px',
};

const OverlapOnDesktopView = styled.div`
  @media (min-width: 64em) {
    position: absolute;
    top: 2em;
    left: 5em;
    z-index: 2;
  }
`;

const gradientAndShape = {
  background: 'linear-gradient(45deg, #c018ab, #5f1763)',
  WebkitClipPath:
    'polygon(4.46% -0.15%, 96.33% 0px, 100.22% 11.24%, 100% 86.58%, 98.1% 97.17%, 93.09% 100.5%, 3.94% 100.25%, -1px 90.05%, -0.09% 8.97%)',
  clipPath:
    'polygon(4.46% -0.15%, 96.33% 0px, 100.22% 11.24%, 100% 86.58%, 98.1% 97.17%, 93.09% 100.5%, 3.94% 100.25%, -1px 90.05%, -0.09% 8.97%)',
};

class StatsBox extends PureComponent {
  render() {
    const {
      gem, lastSoldFor, role,
    } = this.props;

    return (
      <OverlapOnDesktopView
        className="bg-dark-gray measure-l w-100 shadow-3"
        style={{
          WebkitClipPath:
            'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
          clipPath:
            'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
        }}
      >
        <TopHighLight style={tophighlight} />
        <div className="white pa3">
          <h1 className="tc pb3 b white" style={{ wordBreak: 'break-all' }} data-testid="gemName">
            {gem.name}
          </h1>

          <div className="mv3" />
          <Gembox
            gem={gem}
            role={role}
          />

          {lastSoldFor ? (
            <div className="pa3 pt4 mt3 tc" style={gradientAndShape}>
              <small className="white ttu ">Last Sold For</small>
              <p className="basic" style={{ fontSize: 'xx-large' }}>
                Ξ
                {' '}
                <span data-testid="currentPrice">{lastSoldFor}</span>
              </p>
            </div>
          ) : null}
        </div>
      </OverlapOnDesktopView>
    );
  }
}

export default StatsBox;

StatsBox.propTypes = {
  lastSoldFor: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
};

StatsBox.defaultProps = {
  lastSoldFor: false,
};
