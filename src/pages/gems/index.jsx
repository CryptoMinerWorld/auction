import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Confetti from "react-confetti";
import sizeMe from "react-sizeme";
import styled from "styled-components";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { connect } from "react-redux";
import { compose } from "redux";
import AuctionImage from "../../components/AuctionImage";
import AuctionBox from "../../components/AuctionBox";
import DescriptionBox from "../../components/DescriptionBox/index";
import FAQ from "../../components/FAQ";
import MailingList from "../../components/MailingList";
import "./animations.css";
import { getAuctionDetails } from "../Auction/auctionActions";
import { calculateGemName } from "./helpers";

import rockBackground from "../../images/rockBackground.png";

export const OverlapOnDesktopView = styled.div`
  @media (min-width: 64em) {
    position: absolute;
    bottom: 1em;
    left: 5em;
  }
`;

export const RockOverlay = styled.div`
  background-image: url(${rockBackground});
  background-repeat: repeat;
  background-size: contain;
`;

export const TopHighlight = styled.div`
  background: linear-gradient(to right, #e36d2d, #b91a78);
  border-radius: 4px 4px 0px 0px;
  height: 3px;
`;
const select = store => ({
  details: store.auction,
  gemName: calculateGemName(store.auction.color, store.auction.id)
});

class GemPage extends PureComponent {
  static propTypes = {
    size: PropTypes.shape({
      monitorHeight: PropTypes.bool,
      monitorWidth: PropTypes.bool
    }).isRequired,
    deadline: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    currentPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    minPrice: PropTypes.number.isRequired,
    maxPrice: PropTypes.number.isRequired,
    level: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    buyNow: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    showConfirm: PropTypes.func.isRequired,
    tokenId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    redirectTo: PropTypes.string,
    color: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sourceImage: PropTypes.string.isRequired,
    story: PropTypes.string.isRequired,
    provider: PropTypes.bool.isRequired,
    currentAccount: PropTypes.string.isRequired,
    handleGetGemDetails: PropTypes.func.isRequired
  };

  static defaultProps = {
    redirectTo: ""
  };

  componentDidMount() {
    console.log("pf");
    const { match, handleGetGemDetails } = this.props;
    console.log("match.params.gemId", match.params.gemId);

    handleGetGemDetails(match.params.gemId);
  }

  render() {
    const {
      releaseConfetti,
      size,
      sourceImage,
      currentPrice,
      minPrice,
      maxPrice,
      deadline,
      buyNow,
      level,
      grade,
      rate,
      name,
      tokenId,
      redirectTo,
      showConfirm,
      provider,
      color,
      story,
      currentAccount,
      details,
      gemName
    } = this.props;

    return (
      <div>
        {releaseConfetti && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: "999"
            }}
          >
            <Confetti {...size} />
          </div>
        )}
        <div className="bg-off-black ">
          <RockOverlay>
            <div className="relative mw9 center">
              <AuctionImage sourceImage={details.gemImage || sourceImage} />
              <ReactCSSTransitionGroup
                transitionName="example"
                transitionAppear
                transitionAppearTimeout={5000}
                transitionEnterTimeout={5000}
                transitionLeaveTimeout={5000}
              >
                <AuctionBox
                  currentPrice={currentPrice}
                  minPrice={details.minPrice || minPrice}
                  maxPrice={details.maxPrice || maxPrice}
                  deadline={details.deadline || deadline}
                  handleBuyNow={buyNow}
                  level={details.gemLevel || level}
                  grade={details.grade || grade}
                  rate={details.rate || rate}
                  name={gemName || name}
                  tokenId={details.id || tokenId}
                  redirectTo={redirectTo}
                  showConfirm={showConfirm}
                  provider={provider}
                  currentAccount={currentAccount}
                  story={details.story}
                  owner={details.owner}
                />
              </ReactCSSTransitionGroup>
            </div>
          </RockOverlay>
          <div className="bg-off-black">
            <TopHighlight />
            <div className="mw9 center relative-l">
              <DescriptionBox
                level={level}
                grade={grade}
                rate={rate}
                color={color}
                story={story}
                name={name}
              />
              <div className="w-50-l measure-wide-l">
                <OverlapOnDesktopView>
                  <FAQ />
                </OverlapOnDesktopView>
              </div>
            </div>
          </div>
          <MailingList />
        </div>
      </div>
    );
  }
}

const actions = {
  handleGetGemDetails: getAuctionDetails
};

export default compose(
  sizeMe({
    monitorHeight: true,
    monitorWidth: true
  }),
  withRouter,
  connect(
    select,
    actions
  )
)(GemPage);
