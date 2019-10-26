import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {getAuctions, getImagesForGems, paginate, preLoadAuctionPage,} from './marketActions';
import Plot from "../../app/images/dashboard/Plot.png";
import Gem from "../../app/images/dashboard/gem100.png";
import Silver from "../../app/images/dashboard/silver100.png";
import Gold from "../../app/images/dashboard/gold100.png";
import ChestKey from "../../app/images/dashboard/chestKey100.png";
import FoundersKey from "../../app/images/dashboard/foundersKey100.png";
import CountryGem from "../../app/images/dashboard/countryGem.png";
import Artifact from "../../app/images/dashboard/artifacts100.png";
import Keys from "../../app/images/dashboard/Keys.png";
import Tabs from "antd/lib/tabs";
import GemMarket from "./components/GemMarket";
import styled from 'styled-components';
import stripeImage from "../../app/images/stripe.png";
import {setItemEventListeners} from "../items/itemEventListener";
import {setMarketEventListeners} from "./marketEventListener";
import CountryGemsMarket from "./components/CountryGemsMarket";
import queryString from "query-string";
import { Erc20Market } from '../../components/Erc20Market';

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
                        onKeyPress={() => {
                          this.setState({tab: 1})
                          this.props.history.push('/market?tab=1')
                        }}
                        className="h-100 flex aic"
                        onClick={() => {
                          this.setState({tab: 1})
                          this.props.history.push('/market?tab=1')
                        }}
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
                        onKeyPress={() => {
                          this.setState({tab: 2})
                          this.props.history.push('/market?tab=2')
                        }}
                        className="h-100 flex aic "
                        onClick={() => {
                          this.setState({tab: 2})
                          this.props.history.push('/market?tab=2')
                        }}
                      >
                          <img src={CountryGem} alt="Gems" className="h2 w-auto pr2"/>
                          Country Gem
                      </span>
                    )}
                    key="2"
                  >
                      <CountryGemsMarket/>
                  </TabPane>
                  <TabPane
                    tab={(
                      <span 
                        onKeyPress={() => {
                          this.setState({tab: 3})
                          this.props.history.push('/market?tab=3')
                        }}
                        onClick={() => {
                          this.setState({tab: 3})
                          this.props.history.push('/market?tab=3')
                        }}
                        className="h-100 flex aic white b">
                          <img src={Silver} alt="" className="h2 w-auto pr2"/>
                          <img src={Gold} alt="" className="h2 w-auto pr2"/>
                          <img src={ChestKey} alt="" className="h2 w-auto pr2"/>
                          <img src={FoundersKey} alt="" className="h2 w-auto pr2"/>
                          <img src={Artifact} alt="" className="h2 w-auto pr2"/>
                          ERC20
                      </span>
                    )}
                    key="3"
                  >
                    <Erc20Market/>
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