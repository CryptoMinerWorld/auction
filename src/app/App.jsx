import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import FontFaceObserver from 'fontfaceobserver';
import * as Sentry from '@sentry/browser';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import { ApolloConsumer } from 'react-apollo';
import notification from 'antd/lib/notification';
import Modal from 'antd/lib/modal';
import ErrorBoundary from '../components/ErrorBoundary';
import Navbar from '../components/Nav';
import Footer from '../components/Footer';
import getWeb3 from './utils/getWeb3';
import Routes from './routes';
import './css/root.css';
import ScrollToTop from '../components/ScrollToTop';
import {
  sendContractsToRedux, clearError, setError, instantiateContracts,
} from './appActions';
import { updateWalletId } from '../features/auth/authActions';
import DutchAuction from './ABI/DutchAuction.json';
import Gems from './ABI/GemERC721.json';
import Presale from './ABI/Presale2.json';
import Country from './ABI/CountryERC721.json';
import CountrySale from './ABI/CountrySale.json';
import { resolveAnyPendingTx } from '../features/transactions/helpers';

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
const gemsABI = Gems.abi;
const presaleABI = Presale.abi;
const countryABI = Country.abi;
const countrySaleABI = CountrySale.abi;

const StickyHeader = styled.div`
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  z-index: 3;
`;

const select = store => ({
  visible: store.app.modalVisible,
  error: store.app.error,
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      font: '',
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
      .then(() => this.setState({ font: 'muli' }))
      .catch(error => handleSetError(error));

    // @notice loading web3 when component mounts
    const Web3 = await getWeb3;
    const { web3 } = Web3;

    instantiateContracts(web3, handleSendContractsToRedux, handleSetError);

    const currentAccountId = await web3.eth.getAccounts().then(accounts => accounts[0]);

    // this ensures that the wallet in metamask is always the wallet in the currentAccountId
    // however this is a problem because it means that you cant view someone elses profile page
    if (web3.currentProvider.publicConfigStore) {
      web3.currentProvider.publicConfigStore.on('update', ({ selectedAddress }) => handleUpdateWalletId(selectedAddress));
    }

    // @notice instantiating auction contract
    const dutchContract = new web3.eth.Contract(
      dutchAuctionABI,
      process.env.REACT_APP_DUTCH_AUCTION,
      {
        from: currentAccountId,
      },
    );

    const presaleContract = new web3.eth.Contract(presaleABI, process.env.REACT_APP_PRESALE2, {
      from: currentAccountId,
    });

    // @notice instantiating gem contract
    const gemsContract = new web3.eth.Contract(gemsABI, process.env.REACT_APP_GEM_ERC721, {
      from: currentAccountId,
    });

    const theCountrySaleContract = new web3.eth.Contract(
      countrySaleABI,
      process.env.REACT_APP_COUNTRY_SALE,
      {
        from: currentAccountId,
      },
    );

    const theCountryContract = new web3.eth.Contract(
      countryABI,
      process.env.REACT_APP_COUNTRY_ERC721,
      {
        from: currentAccountId,
      },
    );

    Promise.all([
      dutchContract,
      gemsContract,
      currentAccountId,
      presaleContract,
      theCountryContract,
      theCountrySaleContract,
    ])
      .then(
        ([
          dutchAuctionContractInstance,
          gemsContractInstance,
          currentAccount,
          presale,
          countryContract,
          countrySaleContract,
        ]) => {
          client.writeData({
            data: {
              userId: currentAccount,
            },
          });
          resolveAnyPendingTx(
            currentAccount,
            gemsContractInstance,
            dutchAuctionContractInstance,
            process.env.REACT_APP_DUTCH_AUCTION,
            process.env.REACT_APP_GEM_ERC721,
            web3,
            countryContract,
          );
          handleSendContractsToRedux(
            dutchAuctionContractInstance,
            gemsContractInstance,
            web3,
            presale,
            currentAccount,
            countryContract,
            countrySaleContract,
          );
        },
      )
      .catch((error) => {
        handleSetError(error);
      });
  }

  errorNotification = (error, title) => {
    const { handleClearError } = this.props;
    notification.error({
      message: `${title}` || 'Error',
      description: `${error}`,
      onClose: handleClearError(),
    });
  };

  render() {
    const { visible, error, errorTitle } = this.props;
    const { font } = this.state;
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
            <StickyHeader>
              <Navbar />
            </StickyHeader>
            <Routes />

            <Footer />
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
};

const EnhancedApp = props => (
  <ApolloConsumer>
    {client => (
      <BrowserRouter>
        <ErrorBoundary>
          <App {...props} client={client} />
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
