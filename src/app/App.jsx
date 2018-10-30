import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import FontFaceObserver from 'fontfaceobserver';
import * as Sentry from '@sentry/browser';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
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
      handleSendContractsToRedux,
      handleUpdateWalletId,
      handleSetError,
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

    // this ensures that the wallet in metamask is always the wallet in the currentAccountId
    // however this is a problem because it means that you cant view someone elses profile page
    if (web3.currentProvider.publicConfigStore) {
      web3.currentProvider.publicConfigStore.on('update', ({ selectedAddress }) => handleUpdateWalletId(selectedAddress));
    }
  }

  errorNotification = (error) => {
    const { handleClearError } = this.props;
    notification.error({
      message: 'Error',
      description: `${error}`,
      onClose: handleClearError(),
    });
  };

  render() {
    const { font } = this.state;
    const { visible, error } = this.props;

    return (
      <BrowserRouter>
        <ErrorBoundary>
          {/* <React.StrictMode> */}
          <ScrollToTop>
            <main className={font}>
              {error && error !== false && this.errorNotification(error)}
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
        </ErrorBoundary>
      </BrowserRouter>
    );
  }
}

const actions = {
  handleSendContractsToRedux: sendContractsToRedux,
  handleClearError: clearError,
  handleSetError: setError,
  handleUpdateWalletId: updateWalletId,
};

export default connect(
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
};

App.defaultProps = {
  error: false,
};
