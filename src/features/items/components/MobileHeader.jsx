import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Gembox from './Gembox';

import { } from '../../market/helpers';

const Triangle = styled.div`
  width: 140px;
  height: 10px;
  border-left: 70px solid transparent;
  border-right: 70px solid transparent;
  border-top: 20px solid #5f1763;
`;

const select = store => ({
});

class MobileHeader extends PureComponent {
  static propTypes = {
  };

  static defaultProps = {

  };

  render() {
    const {
      gem
    } = this.props;
    return (
      <div className="flex-s dn-ns jca bg-base shadow-1">
        <div className="absolute left-1">
          <div className="bg-deep-purple pa3 tc">
            <small className="white ttu b tc center">
              current
              {' '}
              <br />
              {' '}
price
            </small>
            <p className="white f3 tc">
Ξ
              {gem && Math.round((gem.currentPrice) * 100) / 100}
            </p>
          </div>
          <Triangle />
        </div>

        <div className="w-100">
            {gem && <Gembox gem={gem} styling="w-60 fr mr6-ns" mobileHeader />}
        </div>
      </div>
    );
  }
}

export default connect(select)(MobileHeader);
