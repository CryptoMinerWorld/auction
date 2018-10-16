import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import FontFaceObserver from 'fontfaceobserver';
import * as Sentry from '@sentry/browser';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import ErrorBoundary from '../components/ErrorBoundary';
import Alert from 'antd/lib/alert';
import Modal from 'antd/lib/modal';
import Navbar from '../components/Nav';
import Footer from '../components/Footer';
import getWeb3 from './utils/getWeb3';
import Routes from './routes';
import './css/root.css';
import ScrollToTop from '../components/ScrollToTop';
import { sendContractsToRedux } from './appActions';
import { updateWalletId } from '../features/auth/authActions';
// import { updatePriceOnAllLiveAuctions } from '../features/market/marketActions';
import DutchAuction from './ABI/DutchAuction.json';
import Gems from './ABI/GemERC721.json';
import Presale from './ABI/Presale2.json';
import { Subscribe } from 'unstated';
import AppContainer from './containers/App';
require('antd/lib/alert/style/css');
require('antd/lib/modal/style/css');

// analytics breaks testing so you have to turn testmode on in development
const testMode = process.env.NODE_ENV === 'development';

ReactGA.initialize(process.env.REACT_APP_ANALYTICS, {
  testMode
});

ReactGA.pageview(window.location.pathname + window.location.search);

Sentry.init({
  dsn: 'https://7fc52f2bd8de42f9bf46596f996086e8@sentry.io/1299588',

  environment: process.env.NODE_ENV
});

const dutchAuctionABI = DutchAuction.abi;
const gemsABI = Gems.abi;
const presaleABI = Presale.abi;

const StickyHeader = styled.div`
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  z-index: 3;
`;

const select = store => ({
  visible: store.app.modalVisible
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      font: '',
      err: '',
      visible: false
    };
  }

  async componentDidMount() {
    const {
      handleSendContractsToRedux,
      // handleUpdatePriceOnAllLiveAuctions,
      handleUpdateWalletId,
      setWeb3,
      setGemsContract,
      setCurrentAccountId
    } = this.props;
    // @notice loading a custom font when app mounts
    const font = new FontFaceObserver('Muli', {
      weight: 400
    });
    font
      .load()
      .then(() => this.setState({ font: 'muli' }))
      .catch(error => error);

    // @notice loading web3 when component mounts
    const Web3 = await getWeb3;
    const { web3 } = Web3;
    setWeb3(web3);

    const currentAccountId = await web3.eth
      .getAccounts()
      .then(accounts => accounts[0]);

    setCurrentAccountId(currentAccountId);

    // this ensures that the wallet in metamask is always the wallet in the currentAccountId, however this is a problem because it means that you cant view someone eles profile page
    web3.currentProvider.publicConfigStore.on('update', ({ selectedAddress }) =>
      handleUpdateWalletId(selectedAddress)
    );

    // @notice instantiating auction contract
    const dutchContract = new web3.eth.Contract(
      dutchAuctionABI,
      process.env.REACT_APP_DUTCH_AUCTION,
      {
        from: currentAccountId
      }
    );

    const presaleContract = new web3.eth.Contract(
      presaleABI,
      process.env.REACT_APP_PRESALE2,
      {
        from: currentAccountId
      }
    );

    // @notice instantiating gem contract
    const gemsContract = new web3.eth.Contract(
      gemsABI,
      process.env.REACT_APP_GEM_ERC721,
      {
        from: currentAccountId
      }
    );

    Promise.all([
      dutchContract,
      gemsContract,
      currentAccountId,
      presaleContract
    ])
      .then(
        ([
          dutchAuctionContractInstance,
          gemsContractInstance,
          currentAccount,
          presaleContract
        ]) => {
          setGemsContract(gemsContractInstance);
          handleSendContractsToRedux(
            dutchAuctionContractInstance,
            gemsContractInstance,
            web3,
            presaleContract,
            currentAccount
          );
        }
      )
      .catch(err => {
        this.setState({ err });
      });
  }

  componentWillUnmount() {
    // @notice clear price update interval when you leav ethe app to stop any memory leaks
    clearInterval(this.priceInterval);
    // clearInterval(this.updatePriceOnAllLiveAuctions);
  }

  render() {
    const { font, err } = this.state;
    const { visible } = this.props;

    return (
      <BrowserRouter>
        <ErrorBoundary>
          <ScrollToTop>
            <main className={font}>
              {err && (
                <Alert
                  message="Error Text"
                  description={`${err.message}`}
                  type="error"
                  closable
                />
              )}
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
                  Once you pay for the Gem using Metamask, you will be
                  redirected to your workshop.
                </p>
                <strong>This may take a few moments.</strong>
              </Modal>
              <StickyHeader>
                <Navbar />
              </StickyHeader>
              <Routes />

              <Footer />
            </main>
          </ScrollToTop>
        </ErrorBoundary>
      </BrowserRouter>
    );
  }
}

const actions = {
  handleSendContractsToRedux: sendContractsToRedux,
  // handleUpdatePriceOnAllLiveAuctions: updatePriceOnAllLiveAuctions,
  handleUpdateWalletId: updateWalletId
};

const connectedApp = props => (
  <Subscribe to={[AppContainer]}>
    {app => (
      <App
        setWeb3={app.setWeb3}
        setGemsContract={app.setGemsContract}
        setCurrentAccountId={app.setCurrentAccountId}
        {...props}
      />
    )}
  </Subscribe>
);

export default connect(
  select,
  actions
)(connectedApp);

App.propTypes = {
  handleSendContractsToRedux: PropTypes.func.isRequired,
  // handleUpdatePriceOnAllLiveAuctions: PropTypes.func.isRequired,
  handleUpdateWalletId: PropTypes.func.isRequired
};
