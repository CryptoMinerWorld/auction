import React, { Component } from 'react';
import MobileHeader from '../components/MobileHeader';
import AuctionImage from '../components/AuctionImage';
import styled from 'styled-components';
import AuctionBox from '../components/AuctionBox';
import DescriptionBox from '../components/DescriptionBox';
import ProgressMeter from '../components/ProgressMeter';
import FAQ from '../components/FAQ';
import MailingList from '../components/MailingList';

const StickyHeader = styled.div`
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  z-index: 3;
`;

class Auction extends Component {
  render() {
    let {
      currentPrice,
      minPrice,
      maxPrice,
      level,
      grade,
      rate,
      buyNow
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
