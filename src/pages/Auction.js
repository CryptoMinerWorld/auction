import React, { Component } from 'react';
import MobileHeader from '../components/MobileHeader';
import AuctionImage from '../components/AuctionImage';
import styled from 'styled-components';
import AuctionBox from '../components/AuctionBox';
import DescriptionBox from '../components/DescriptionBox';
import ProgressMeter from '../components/ProgressMeter';
import FAQ from '../components/FAQ';
import MailingList from '../components/MailingList';
import PropTypes from 'prop-types';

const StickyHeader = styled.div`
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  z-index: 3;
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
    buyNow: PropTypes.func.isRequired
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
      deadline
    } = this.props;

    return (
      <div>
        <StickyHeader>
          <MobileHeader
            currentPrice={currentPrice}
            level={level}
            grade={grade}
            rate={rate}
          />
        </StickyHeader>
        <AuctionImage />
        <AuctionBox
          currentPrice={currentPrice}
          deadline={deadline}
          handleBuyNow={buyNow}
          level={level}
          grade={grade}
          rate={rate}
        />
        <DescriptionBox level={level} grade={grade} rate={rate} />
        <ProgressMeter
          currentPrice={currentPrice}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
        <FAQ />
        <MailingList />
      </div>
    );
  }
}

export default Auction;
