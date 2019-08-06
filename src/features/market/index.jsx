import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {getAuctions, getImagesForGems, paginate, preLoadAuctionPage,} from './marketActions';
import Plot from "../../app/images/dashboard/Plot.png";
import Gem from "../../app/images/dashboard/gems.png";
import CountryGem from "../../app/images/dashboard/countryGem.png";
import Artifact from "../../app/images/dashboard/Artifacts.png";
import Keys from "../../app/images/dashboard/Keys.png";
import Tabs from "antd/lib/tabs";
import GemMarket from "./components/GemMarket";
import styled from 'styled-components';
import stripeImage from "../../app/images/stripe.png";
import {setItemEventListeners} from "../items/itemEventListener";
import {setMarketEventListeners} from "./marketEventListener";
import CountryGemsMarket from "./components/CountryGemsMarket";
import queryString from "query-string";

const {TabPane} = Tabs;
require('antd/lib/tabs/style/css');
require('antd/lib/notification/style/css');
require('antd/lib/pagination/style/css');
require('antd/lib/slider/style/css');

const select = store => {
    return ({
        auctions: store.market.auctions,
        error: store.marketActions.error,
        totalGems: store.market.auctions && store.market.auctions.length,
        dutchContract: store.app.auctionContract,
        gemContractAddress: store.app.gemContract && store.app.gemContract.options.address,
        gemService: store.app.gemService,
        auctionService: store.app.auctionService,
    });
};

class Marketplace extends React.Component {

    static defaultProps = {
        loading: true
    };

    state = {
        tab: 1
    };

    componentDidMount() {
        const {auctionService, handleGetAuctions, handlePagination, location} = this.props;
        if (auctionService) {
            setMarketEventListeners({
                auctionService,
                marketChangedCallback: handleGetAuctions,
                transactionResolved: () => {}
            });
            handleGetAuctions();
        }
        if (location && location.search) {
            let params = queryString.parse(location.search);
            if (params.tab && !isNaN(Number(params.tab))) {
                this.setState({tab: Number(params.tab)});
            }
        }
    }

    componentDidUpdate(prevProps) {
        const {auctionService, handleGetAuctions, location} = this.props;
        if (auctionService && (auctionService !== prevProps.auctionService)) {
            setMarketEventListeners({
                auctionService,
                marketChangedCallback: handleGetAuctions,
                transactionResolved: () => {}
            });
            handleGetAuctions();
        }
        if (location && location.search && prevProps.location !== location) {
            let params = queryString.parse(location.search);
            if (params.tab && Number(params.tab) !== Number(this.state.tab)) {
                this.setState({tab: Number(params.tab)});
            }
        }
    }

    render() {
        const {tab} = this.state;

        return (
          <div className="bg-off-black white market-card-container relative"
          style={{paddingTop: "72px"}}>
              <MarketHeader>
                  <h1 className="white f1 b o-90" data-testid="header">
                      Market
                  </h1>
              </MarketHeader>
              <Tabs
                activeKey={`${tab}`}
                animated
                className="bg-transparent white"
                type="card"
                style={{
                    zIndex: 2
                }}
              >
                  <TabPane
                    tab={(
                      <span
                        tabIndex={-1}
                        role="button"
                        onKeyPress={() => this.setState({tab: 1})}
                        className="h-100 flex aic"
                        onClick={() => this.setState({tab: 1})}
                      >
                          <img src={Gem} alt="Gems" className="h2 w-auto pr2"/>
                          Gem
                      </span>
                    )}
                    key="1"
                  >
                      <GemMarket/>
                  </TabPane>
                  <TabPane
                    tab={(
                      <span
                        tabIndex={-1}
                        role="button"
                        onKeyPress={() => this.setState({tab: 2})}
                        className="h-100 flex aic b"
                        onClick={() => this.setState({tab: 2})}
                      >
                          <img src={CountryGem} alt="Gems" className="h2 w-auto pr2"/>
                          Country Gem
                      </span>
                    )}
                    key="2"
                  >
                      <CountryGemsMarket/>
                  </TabPane>
                  <TabPane tab={(
                    <span
                      tabIndex={-2}
                      className="h-100 flex aic white o-50"><img src={Plot} alt="" className="h2 w-auto pr2"/>
                        Plot
                      </span>
                  )}
                           disabled
                           key="2a"
                  >
                  </TabPane>
                  <TabPane
                    tab={(
                      <span className="h-100 flex aic white o-50">
                          <img src={Artifact} alt="" className="h2 w-auto pr2"/>
                          Artifact
                      </span>
                    )}
                    disabled
                    key="3"
                  />
                  <TabPane
                    tab={(
                      <span className="h-100 flex aic white o-50">
                          <img src={Keys} alt="" className="h2 w-auto pr2"/>
                          Key
                      </span>
                    )}
                    disabled
                    key="4"
                  />
              </Tabs>
          </div>
        )
    }
}

const actions = {
    handleGetAuctions: getAuctions,
    handlePagination: paginate,
    handlePreLoadAuctionPage: preLoadAuctionPage,
    handleGetImagesForGems: getImagesForGems,
    //handleUpdatePriceOnAllLiveAuctions: updatePriceOnAllLiveAuctions,
};

export default compose(
  connect(
    select,
    actions,
  )
)(Marketplace);

Marketplace.propTypes = {
    handlePagination: PropTypes.func.isRequired,
    pageNumber: PropTypes.number,
    totalGems: PropTypes.number.isRequired,
    handlePreLoadAuctionPage: PropTypes.func.isRequired,
};

Marketplace.defaultProps = {
    pageNumber: 1,
};

const MarketHeader = styled.div`
    background-image: url(${stripeImage});
    background-position: center center;
    text-align: center;
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    height: 112px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;