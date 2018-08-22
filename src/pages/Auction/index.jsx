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

const OverlapOnDesktopView = styled.div`
  @media (min-width: 30em) {
    position: absolute;
    bottom: 5em;
    left: 5em;
  }
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
      name
    } = this.props;

    return (
      <div className="bg-off-black">
        <AuctionImage />
        <ReactCSSTransitionGroup
          transitionName="example"
          transitionAppear={true}
          transitionAppearTimeout={5000}
        >
          <AuctionBox
            currentPrice={currentPrice}
            deadline={deadline}
            handleBuyNow={buyNow}
            level={level}
            grade={grade}
            rate={rate}
            name={name}
          />
        </ReactCSSTransitionGroup>

        <DescriptionBox level={level} grade={grade} rate={rate} />
        <div className="w-50-ns measure-wide relative">
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
        <MailingList />
      </div>
    );
  }
}

export default Auction;
