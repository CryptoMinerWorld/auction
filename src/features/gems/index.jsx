import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AuctionImage from "../../components/AuctionImage";
import DescriptionBox from "../../components/DescriptionBox/index";
import FAQ from "../../components/FAQ";
import MailingList from "../../components/MailingList";
import "./animations.css";
import { getGemDetails, createAuction, removeFromAuction } from "./gemActions";
import { calculateGemName } from "./helpers";
import rockBackground from "../../app/images/rockBackground.png";
import TradingBox from "../../components/TradingBox";

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
    gemName: PropTypes.string.isRequired,
    details: PropTypes.shape({
      color: PropTypes.number,
      gemImage: PropTypes.string,
      story: PropTypes.string,
      auctionIsLive: PropTypes.bool
    }).isRequired,
    handleGetGemDetails: PropTypes.func.isRequired,
    match: PropTypes.func,
    handleCreateAuction: PropTypes.func.isRequired,
    handleRemoveGemFromAuction: PropTypes.func.isRequired
  };

  static defaultProps = {
    match: () => {}
  };

  componentDidMount() {
    const { match, handleGetGemDetails } = this.props;
    if (match.params) {
      handleGetGemDetails(match.params.gemId);
    }
  }

  render() {
    const {
      gemName,
      details,
      handleCreateAuction,
      handleRemoveGemFromAuction,
      match
    } = this.props;
    return (
      <div>
        <div className="bg-off-black ">
          <RockOverlay>
            <div className="relative mw9 center">
              {details.gemImage && (
                <AuctionImage sourceImage={details.gemImage} />
              )}
              <ReactCSSTransitionGroup
                transitionName="example"
                transitionAppear
                transitionAppearTimeout={5000}
                transitionEnterTimeout={5000}
                transitionLeaveTimeout={5000}
              >
                <TradingBox
                  createAuction={handleCreateAuction}
                  handleRemoveGemFromAuction={handleRemoveGemFromAuction}
                  gemId={match.params && match.params.gemId}
                  auctionIsLive={details.auctionIsLive}
                />
              </ReactCSSTransitionGroup>
            </div>
          </RockOverlay>
          <div className="bg-off-black">
            <TopHighlight />
            <div className="mw9 center relative-l">
              {details.gemLevel &&
                details.grade &&
                details.rate &&
                details.color &&
                details.story &&
                gemName && (
                  <DescriptionBox
                    level={details.gemLevel}
                    grade={details.grade}
                    rate={details.rate}
                    color={details.color}
                    story={details.story}
                    name={gemName}
                  />
                )}
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
  handleGetGemDetails: getGemDetails,
  handleCreateAuction: createAuction,
  handleRemoveGemFromAuction: removeFromAuction
};

export default withRouter(
  connect(
    select,
    actions
  )(GemPage)
);
