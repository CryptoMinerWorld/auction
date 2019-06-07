import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {BrowserRouter} from 'react-router-dom';
import FontFaceObserver from 'fontfaceobserver';
import * as Sentry from '@sentry/browser';
import {connect} from 'react-redux';
import ReactGA from 'react-ga';
import {ApolloConsumer} from 'react-apollo';
import notification from 'antd/lib/notification';
import Modal from 'antd/lib/modal';
import ErrorBoundary from '../components/ErrorBoundary';
import Navbar from '../components/Nav';
import Footer from '../components/Footer';
import getWeb3 from './utils/getWeb3';
import Routes from './routes';
import './css/root.css';
import ScrollToTop from '../components/ScrollToTop';
import {clearError, sendContractsToRedux, setError,} from './appActions';
import {updateWalletId} from '../features/auth/authActions';
import DutchAuction from './ABI/DutchAuction.json';
import DutchAuctionHelper from './ABI/DutchAuctionHelper';
import Gems from './ABI/GemERC721.json';
import Presale from './ABI/Presale2.json';
import Country from './ABI/CountryERC721.json';
import CountrySale from './ABI/CountrySale.json';
import RefPointsTracker from './ABI/RefPointsTracker';
import Silver from './ABI/SilverERC20';
import Gold from './ABI/GoldERC20';
import Workshop from './ABI/Workshop';
import SilverSale from './ABI/SilverSale';
import SilverCoupons from './ABI/SilverCoupons';
import PlotSale from './ABI/PlotSale';
import Plot from './ABI/PlotERC721';
import Artifact from './ABI/ArtifactERC20';
import Miner from './ABI/Miner';
import GemService from "./services/GemService";
import AuctionService from "./services/AuctionService";
import SilverGoldService from "./services/SilverGoldService";
import CountryService from "./services/CountryService";
import PlotService from "./services/PlotService";
import LootPopup from "../components/LootPopup";
import assist from 'bnc-assist';
import {getUpdatedTransactionHistory} from "../features/transactions/txActions";

require('antd/lib/notification/style/css');
require('antd/lib/modal/style/css');

// analytics breaks testing so you have to turn testmode on in development
const testMode = process.env.NODE_ENV === 'development';

ReactGA.initialize(process.env.REACT_APP_ANALYTICS, {
    testMode,
});

ReactGA.pageview(window.location.pathname + window.location.search);

Sentry.init({
    dsn: 'https://7fc52f2bd8de42f9bf46596f996086e8@sentry.io/1299588',
    environment: process.env.NODE_ENV,
});

const dutchAuctionABI = DutchAuction.abi;
const dutchAuctionHelperABI = DutchAuctionHelper.abi;
const gemsABI = Gems.abi;
const presaleABI = Presale.abi;
const countryABI = Country.abi;
const countrySaleABI = CountrySale.abi;
const refPointsTrackerABI = RefPointsTracker.abi;
const silverABI = Silver.abi;
const goldABI = Gold.abi;
const workshopABI = Workshop.abi;
const silverSaleABI = SilverSale.abi;
const silverCouponsABI = SilverCoupons.abi;
const plotSaleABI = PlotSale.abi;
const plotABI = Plot.abi;
const minerABI = Miner.abi;
const artifactABI = Artifact.abi;

const StickyHeader = styled.div`
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  z-index: 3;
`;

const select = store => ({
    plotService: store.app.plotServiceInstance,
    visible: store.app.modalVisible,
    error: store.app.error,
    currentUserId: store.auth.currentUserId,
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            font: '',
            wrongNetwork: false,
            lootFound: false,
        };
    }

    async componentDidMount() {
        const {
            handleSendContractsToRedux, handleUpdateWalletId, handleSetError, client,
        } = this.props;

        // @notice loading a custom font when app mounts
        const font = new FontFaceObserver('Muli', {
            weight: 400,
        });
        font
          .load()
          .then(() => this.setState({font: 'muli'}))
          .catch(error => handleSetError(error));

        // @notice loading web3 when component mounts
        let Web3, web3;


        //const network = await web3.eth.net.getNetworkType();

        try {
            Web3 = await getWeb3;
        } catch (err) {
            return;
        }
        web3 = Web3.web3;


        // if (network !== process.env.REACT_APP_NETWORK_TYPE) {
        //     this.setState({wrongNetwork: true})
        // }

        let bncAssistConfig = {
            dappId: "e8432341-1602-487b-ba82-c3e2c46fb47d",      // [String] The API key created by step one above
            networkId: 4  // [Integer] The Ethereum network ID your dapp uses.
        };

        let assistInstance = assist.init(bncAssistConfig);

        try {
            await assistInstance.onboard();
        }
        catch (e) {
            console.log(e.message);
        }

        const currentAccountId = await web3.eth.getAccounts().then(accounts => accounts[0]);

        // this ensures that the wallet in metamask is always the wallet in the currentAccountId
        // however this is a problem because it means that you cant view someone else profile page
        if (web3.currentProvider.publicConfigStore) {
            web3.currentProvider.publicConfigStore.on('update', ({selectedAddress}) => {
                handleUpdateWalletId(selectedAddress)
            });
        }

        // @notice instantiating auction contract
        const dutchContract = assistInstance.Contract(new web3.eth.Contract(
          dutchAuctionABI,
          process.env.REACT_APP_DUTCH_AUCTION,
          {
              from: currentAccountId,
          },
        ))

        const dutchHelperContract = assistInstance.Contract(new web3.eth.Contract(
          dutchAuctionHelperABI,
          process.env.REACT_APP_DUTCH_AUCTION_HELPER,
          {
              from: currentAccountId,
          },
        ))

        const presaleContract = assistInstance.Contract(new web3.eth.Contract(presaleABI, process.env.REACT_APP_PRESALE2, {
            from: currentAccountId,
        }))

        // @notice instantiating gem contract
        const gemsContract = assistInstance.Contract(new web3.eth.Contract(gemsABI, process.env.REACT_APP_GEM_ERC721, {
            from: currentAccountId,
        }))

        const theCountrySaleContract = assistInstance.Contract(new web3.eth.Contract(
          countrySaleABI,
          process.env.REACT_APP_COUNTRY_SALE,
          {
              from: currentAccountId,
          },
        ))

        const theCountryContract = assistInstance.Contract(new web3.eth.Contract(
          countryABI,
          process.env.REACT_APP_COUNTRY_ERC721,
          {
              from: currentAccountId,
          },
        ))

        const refPointsTrackerContract = assistInstance.Contract(new web3.eth.Contract(
          refPointsTrackerABI,
          process.env.REACT_APP_REF_POINTS_TRACKER,
          {
              from: currentAccountId,
          },
        ))

        const goldContract = assistInstance.Contract(new web3.eth.Contract(
          goldABI,
          process.env.REACT_APP_GOLD_ERC721,
          {
              from: currentAccountId,
          },
        ))

        const silverContract = assistInstance.Contract(new web3.eth.Contract(
          silverABI,
          process.env.REACT_APP_SILVER_ERC721,
          {
              from: currentAccountId,
          },
        ))

        const workshopContract = assistInstance.Contract(new web3.eth.Contract(
          workshopABI,
          process.env.REACT_APP_WORKSHOP,
          {
              from: currentAccountId,
          },
        ))

        const silverSaleContract = assistInstance.Contract(new web3.eth.Contract(
          silverSaleABI,
          process.env.REACT_APP_SILVER_SALE,
          {
              from: currentAccountId,
          },
        ))

        const silverCouponsContract = assistInstance.Contract(new web3.eth.Contract(
          silverCouponsABI,
          process.env.REACT_APP_SILVER_COUPONS,
          {
              from: currentAccountId,
          },
        ))

        const plotSaleContract = assistInstance.Contract(new web3.eth.Contract(
          plotSaleABI,
          process.env.REACT_APP_PLOT_SALE,
          {
              from: currentAccountId,
          },
        ))

        const plotContract = assistInstance.Contract(new web3.eth.Contract(
          plotABI,
          process.env.REACT_APP_PLOT_ERC721,
          {
              from: currentAccountId,
          },
        ))

        const minerContract = assistInstance.Contract(new web3.eth.Contract(
          minerABI,
          process.env.REACT_APP_MINER,
          {
              from: currentAccountId,
          },
        ))

        const artifactContract = assistInstance.Contract(new web3.eth.Contract(
          artifactABI,
          process.env.REACT_APP_ARTIFACT_ERC20,
          {
              from: currentAccountId,
          },
        ))

        //const silverCouponsContract = {};

        Promise.all([
            dutchContract,
            dutchHelperContract,
            gemsContract,
            currentAccountId,
            presaleContract,
            theCountryContract,
            theCountrySaleContract,
            refPointsTrackerContract,
            silverContract,
            goldContract,
            workshopContract,
            silverSaleContract,
            silverCouponsContract,
            plotContract,
            plotSaleContract,
            minerContract,
            artifactContract
        ])
          .then(
            ([
                 dutchAuctionContractInstance,
                 dutchAuctionHelperContractInstance,
                 gemsContractInstance,
                 currentAccount,
                 presale,
                 countryContract,
                 countrySaleContract,
                 refPointsTrackerContract,
                 silverContract,
                 goldContract,
                 workshopContract,
                 silverSaleContract,
                 silverCouponsContract,
                 plotContract,
                 plotSaleContract,
                 minerContract,
                 artifactContract
             ]) => {
                client.writeData({
                    data: {
                        userId: currentAccount,
                    },
                });

                const gemService = new GemService(gemsContractInstance, web3, dutchAuctionContractInstance);
                const auctionService = new AuctionService(dutchAuctionContractInstance, dutchAuctionHelperContractInstance, gemsContractInstance);
                const silverGoldService = new SilverGoldService(silverSaleContract, silverContract, goldContract, refPointsTrackerContract, silverCouponsContract);
                const countryService = new CountryService(null, countryContract);
                const plotService = new PlotService(plotContract, plotSaleContract, minerContract);

                handleSendContractsToRedux(
                  dutchAuctionContractInstance,
                  dutchAuctionHelperContractInstance,
                  gemsContractInstance,
                  web3,
                  presale,
                  currentAccount,
                  countryContract,
                  countrySaleContract,
                  refPointsTrackerContract,
                  silverContract,
                  goldContract,
                  workshopContract,
                  silverSaleContract,
                  silverCouponsContract,
                  artifactContract,
                  plotService,
                  gemService,
                  auctionService,
                  silverGoldService,
                  countryService,
                );
            },
          )
          .catch((error) => {
              handleSetError(error);
          });
    }

    componentDidUpdate(prevProps) {

        if (this.props.plotService && this.props.currentUserId && (this.props.plotService !== prevProps.plotService || this.props.currentUserId !== prevProps.currentUserId)) {
            const showLootClosure = this.showLoot;
            const currentUserId = this.props.currentUserId;
            this.props.plotService.minerContract.events.Updated({
                filter: {'_by': currentUserId},
                fromBlock: 'latest'
            })
              .on('data', function (event) {
                  //console.log('DATA EVENT:', event);
                  if (event.returnValues['_by'] !== currentUserId) {
                      console.error("_by address is different from current user address.", event.returnValues['_by'], currentUserId);
                  }
                  else {
                      if (event.returnValues['loot'])
                          showLootClosure(event);
                  }
              })
              .on('changed', function (event) {
              })
              .on('error', console.error);
            this.props.handleGetUpdatedTransactionHistory();
        }

    }

    clearLoot = () => {
        this.setState({lootFound: null});
    }

    showLoot = async (eventUpdate) => {
        let lootFound = this.state.lootFound;
        if (lootFound) {
            //console.log("LOOT IS ALREADY NOT EMPTY", lootFound);
            let lootArray = lootFound['loot'] || [0, 0, 0, 0, 0, 0, 0, 0, 0]; //9 types of loot
            const newLootFound = eventUpdate.returnValues;
            const newLootArray = newLootFound['loot'];
            if (newLootArray) {
                for (let i = 0; i < lootArray.length; i++) {
                    lootArray[i] = Number(lootArray[i]) + Number(newLootArray[i]);
                }
            }
            lootFound['blocksProcessed'] += (Number(newLootFound['offsetTo']) - Number(newLootFound['offsetFrom']));
            lootFound['plotsProcessed']++;
            lootFound['loot'] = lootArray;
            lootFound['plotState'] = lootFound['plotState'] || await this.props.plotService.getPlotState(eventUpdate.returnValues['plotId']);
        } else {
            lootFound = eventUpdate.returnValues;
            lootFound['plotState'] = await this.props.plotService.getPlotState(eventUpdate.returnValues['plotId']);
            lootFound['blocksProcessed'] = (Number(lootFound['offsetTo']) - Number(lootFound['offsetFrom']));
            lootFound['plotsProcessed'] = 1;
        }
        this.setState({
            lootFound: lootFound
        })
    }

    errorNotification = (error, title) => {
        const {handleClearError} = this.props;
        notification.error({
            message: `${title}` || 'Error',
            description: `${error}`,
            onClose: handleClearError(),
        });
    };

    render() {
        const {visible, error, errorTitle} = this.props;
        const {font, wrongNetwork, lootFound} = this.state;
        console.warn('----------> APP starts <----------');
        return (
          <>
              {/* <React.StrictMode> */}
              <ScrollToTop>
                  <main className={font}>
                      {error && error !== false && this.errorNotification(error, errorTitle)}
                      <Modal
                        visible={visible}
                        title="Please Confirm Your Transaction In Metamask to Proceed"
                        iconType="loading"
                        zIndex={1000}
                        footer={false}
                        maskClosable={false}
                        closable={false}
                      >
                          <p>
                              Once you pay for the Gem using Metamask, you will be redirected to your workshop.
                          </p>
                          <strong>This may take a few moments.</strong>
                      </Modal>
                      <Modal
                        visible={wrongNetwork}
                        title={"Please change network for Ether transactions to " + process.env.REACT_APP_NETWORK_TYPE + " Net."}
                        zindex={2000}
                        footer={false}
                        closable={false}
                      >
                      </Modal>
                      {lootFound && <LootPopup visible={!!lootFound} lootFound={lootFound} onClose={() => {
                          this.setState({lootFound: false})
                      }}/>}
                      <StickyHeader>
                          <Navbar/>
                      </StickyHeader>
                      <Routes/>

                      <Footer/>
                  </main>
              </ScrollToTop>
              {/* </React.StrictMode> */}
          </>
        );
    }
}

const actions = {
    handleSendContractsToRedux: sendContractsToRedux,
    handleClearError: clearError,
    handleSetError: setError,
    handleUpdateWalletId: updateWalletId,
    handleGetUpdatedTransactionHistory: getUpdatedTransactionHistory,
};

const EnhancedApp = props => (
  <ApolloConsumer>
      {client => (
        <BrowserRouter>
            <ErrorBoundary>
                <App {...props} client={client}/>
            </ErrorBoundary>
        </BrowserRouter>
      )}
  </ApolloConsumer>
);

export default connect(
  select,
  actions,
)(EnhancedApp);

export const TestApp = connect(
  select,
  actions,
)(App);

App.propTypes = {
    handleClearError: PropTypes.func.isRequired,
    handleSetError: PropTypes.func.isRequired,
    handleSendContractsToRedux: PropTypes.func.isRequired,
    handleUpdateWalletId: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.object]),
    errorTitle: PropTypes.string,
};

App.defaultProps = {
    error: false,
    errorTitle: '',
};
