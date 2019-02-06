import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import Icon from 'antd/lib/icon';
import CountdownTimer from './CountdownTimer';
import Gembox from './Gembox';
import buyNow from '../../../app/images/pinkBuyNowButton.png';
import ProgressMeter from './ProgressMeter';
import { showSignInModal } from '../../auth/authActions';
import { handleBuyNow } from '../itemActions';
// import { showConfirm } from '../../../components/Modal';
// import Auth from '../../auth/index';

const TopHighLight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  height: 4px;
`;

const tophighlight = {
  background: 'linear-gradient(to right, #e36d2d, #b91a78)',
  height: '4px',
};

const BuyNow = styled.button`
  background-image: url(${buyNow});
  background-position: center top;
  width: 100%;
  height: 100%;
  text-align: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: transparent;
  border: none;
  color: white;
  text-transform: uppercase;
  cursor: pointer;
`;

const OverlapOnDesktopView = styled.div`
  @media (min-width: 64em) {
    position: absolute;
    top: 2em;
    left: 5em;
    z-index: 2;
  }
`;

const select = store => ({
  accountExists: store.auth.existingUser,
  newUser: store.auth && store.auth.newUser ? store.auth.newUser : false,
});

const AuctionBox = ({
  gem,
  currentAccount,
  accountExists,
  provider,
  history,
  handleShowSignInBox,
  handleBuyGem,
}) => {
  const [loading, setLoading] = useState(false);
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
        {gem.deadline && <CountdownTimer deadline={gem.deadline} />}
        <div className="mt3" />
        <Gembox
          gem={gem}
        />

        <div className="w-100 w5-ns h3 center mt4">
          <BuyNow
            onClick={() => {
              if (provider && accountExists) {
                setLoading(true);
                handleBuyGem(gem.id, currentAccount, history, setLoading);
              } else {
                setLoading(false);
                handleShowSignInBox();
              }
            }}
            className="b"
            data-testid="buyNowButton"
          >
            {loading && <Icon type="loading" theme="outlined" className="pr3" />}
            Buy Now
          </BuyNow>

          {/* <ButtonCTA
  disabled={} onClick={() => {
    if (provider && accountExists) {
      handleBuyGem(tokenId, currentAccount, history);
    } else {
      handleShowSignInBox();
    }
  }} testId="buyNowButton" loading={loading} loadingText='BUYING...' text='BUY'

/> */}
        </div>
        <ProgressMeter currentPrice={gem.currentPrice} minPrice={gem.minPrice} maxPrice={gem.maxPrice} />
      </div>
    </OverlapOnDesktopView>
  );
};

const actions = {
  handleShowSignInModal: showSignInModal,
  handleBuyGem: handleBuyNow,
  handleShowSignInBox: () => ({ type: 'SHOW_SIGN_IN_BOX' }),
};

export default compose(
  connect(
    select,
    actions,
  ),
  withRouter,
)(AuctionBox);

AuctionBox.propTypes = {
  provider: PropTypes.bool.isRequired,
  currentAccount: PropTypes.string.isRequired,
  accountExists: PropTypes.bool,
  history: PropTypes.shape({}).isRequired,
  handleShowSignInBox: PropTypes.func.isRequired,
  handleBuyGem: PropTypes.func.isRequired,
};

AuctionBox.defaultProps = {
  accountExists: false,
};
