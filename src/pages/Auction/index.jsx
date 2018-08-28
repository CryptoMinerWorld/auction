import React, { Component } from 'react';
import AuctionImage from '../../components/AuctionImage';
import AuctionBox from '../../components/AuctionBox';
import DescriptionBox from '../../components/DescriptionBox/index';
import ProgressMeter from '../../components/ProgressMeter';
import FAQ from '../../components/FAQ';
import MailingList from '../../components/MailingList';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
import './animations.css';
import rockBackground from '../../images/rockBackground.png';

const OverlapOnDesktopView = styled.div`
  @media (min-width: 64em) {
    position: absolute;
    bottom: 1em;
    left: 5em;
  }
`;

const RockOverlay = styled.div`
  background-image: url(${rockBackground});
  background-repeat: repeat;
  background-size: contain;
`;

const TopHighlight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  border-radius: 4px 4px 0px 0px;
  height: 3px;
`;

class Auction extends Component {
  static propTypes = {
    deadline: PropTypes.instanceOf(Date).isRequired,
    currentPrice: PropTypes.number.isRequired,
    minPrice: PropTypes.number.isRequired,
    maxPrice: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    grade: PropTypes.string.isRequired,
    rate: PropTypes.number.isRequired,
    buyNow: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
  };
  render() {
    let {
      currentPrice,
      minPrice,
      maxPrice,
      level,
      grade,
      rate,
      buyNow,
      deadline,
      name,
      tokenId
    } = this.props;

    return (
      <div className="bg-off-black ">
        <RockOverlay>
          <div className="relative mw9 center">
            <AuctionImage />
            <ReactCSSTransitionGroup
              transitionName="example"
              transitionAppear={true}
              transitionAppearTimeout={5000}
              transitionEnterTimeout={5000}
              transitionLeaveTimeout={5000}
            >
              <AuctionBox
                currentPrice={currentPrice}
                deadline={deadline}
                handleBuyNow={buyNow}
                level={level}
                grade={grade}
                rate={rate}
                name={name}
                tokenId={tokenId}
              />
            </ReactCSSTransitionGroup>
          </div>
        </RockOverlay>
        <div className="bg-off-black">
          <TopHighlight />
          <div className="mw9 center relative-l">
            <DescriptionBox level={level} grade={grade} rate={rate} />
            <div className="w-50-l measure-wide-l">
              <OverlapOnDesktopView>
                <ProgressMeter
                  currentPrice={currentPrice}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                />
                <div className="h3" />
                <FAQ />
              </OverlapOnDesktopView>
            </div>
          </div>
        </div>
        <MailingList />
      </div>
    );
  }
}

export default Auction;
