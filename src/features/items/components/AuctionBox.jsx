import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import CountdownTimer from '../features/items/components/CountdownTimer';
import Gembox from '../features/items/components/Gembox';
import buyNow from '../app/images/pinkBuyNowButton.png';
import ProgressMeter from '../features/items/components/ProgressMeter';
import { showSignInModal } from '../features/auth/authActions';
import { buyNowAction } from '../itemActions';
import { showConfirm } from '../../../components/Modal';
const TopHighLight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  height: 4px;
`;

const tophighlight = {
  background: 'linear-gradient(to right, #e36d2d, #b91a78)',
  height: '4px'
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
});

const AuctionBox = ({
  currentPrice,
  handleBuyNow,
  level,
  grade,
  rate,
  deadline,
  name,
  tokenId,
  provider,
  minPrice,
  maxPrice,
  currentAccount,
  handleShowSignInModal,
  accountExists,
  provider
}) => (
  <OverlapOnDesktopView
    className="bg-dark-gray measure-l w-100 shadow-3"
    style={{
      WebkitClipPath:
        'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
      clipPath:
        'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)'
    }}
  >
    <TopHighLight style={tophighlight} />
    <div className="white pa3">
      <h1
        className="tc pb3 b white"
        style={{ wordBreak: 'break-all' }}
        data-testid="gemName"
      >
        {name}
      </h1>
      {deadline && <CountdownTimer deadline={deadline} />}
      <div className="mt3" />
      <Gembox level={level} grade={grade} rate={rate} />

      <div className="w-100 w5-ns h3 center mt4">
        <BuyNow
          onClick={() => {
            if (provider && accountExists) {
              handleBuyNow(tokenId, currentAccount);
            } else if (provider && !accountExists) {
              handleShowSignInModal();
            } else {
              showConfirm();
            }
          }}
          className="b"
          data-testid="buyNowButton"
        >
          Buy Now
        </BuyNow>
      </div>
      <ProgressMeter
        currentPrice={currentPrice}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
    </div>
  </OverlapOnDesktopView>
);

const actions = {
  handleShowSignInModal: showSignInModal,
  handleBuyNow: buyNowAction
};

export default connect(
  select,
  actions
)(AuctionBox);

AuctionBox.propTypes = {
  currentPrice: PropTypes.string.isRequired,
  handleBuyNow: PropTypes.func.isRequired,
  level: PropTypes.number.isRequired,
  grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  deadline: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  name: PropTypes.string.isRequired,
  handleShowSignInModal: PropTypes.func.isRequired,
  tokenId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  maxPrice: PropTypes.number.isRequired,
  minPrice: PropTypes.number.isRequired,
  provider: PropTypes.bool.isRequired,
  currentAccount: PropTypes.string.isRequired,
  accountExists: PropTypes.bool.isRequired
};
