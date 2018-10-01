import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { BrowserRouter } from "react-router-dom";
import FontFaceObserver from "fontfaceobserver";
import { connect } from "react-redux";
import ReactGA from "react-ga";
import Alert from "antd/lib/alert";
import Modal from "antd/lib/modal";
import MobileHeader from "../components/MobileHeader";
import Navbar from "../components/Nav";
import Footer from "../components/Footer";
import getWeb3 from "./utils/getWeb3";
import Routes from "./routes";
import "./css/root.css";
import { sendContractsToRedux } from "./appActions";
import Auth from "../features/auth";
import { updatePriceOnAllLiveAuctions } from "../features/market/marketActions";
import { updateGemOwnership } from "../features/items/itemActions";
import DutchAuction from "./ABI/DutchAuction.json";
import Gems from "./ABI/GemERC721.json";

require("antd/lib/alert/style/css");
require("antd/lib/modal/style/css");

// analytics breaks testing so you have to turn testmode on in development
const testMode = process.env.NODE_ENV === "development";

ReactGA.initialize(process.env.REACT_APP_ANALYTICS, {
  testMode
});

ReactGA.pageview(window.location.pathname + window.location.search);

const dutchAuctionABI = DutchAuction.abi;
const gemsABI = Gems.abi;

// @dev keeping component specific styling inside each component file is optimising for deletability. Change or delete this component in the future and all the relevant styles are removed and no more zombie css
const StickyHeader = styled.div`
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  z-index: 3;
`;

const NotStickyHeader = styled.div`
  position: relative;
  z-index: 2;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      font: "",
      visible: false,
      releaseConfetti: false,
      err: false
    };
  }

  async componentDidMount() {
    const {
      handleSendContractsToRedux,
      handleUpdatePriceOnAllLiveAuctions
    } = this.props;
    // @notice loading a custom font when app mounts
    const font = new FontFaceObserver("Muli", {
      weight: 400
    });
    font
      .load()
      .then(() => this.setState({ font: "muli" }))
      .catch(error => error);

    // @notice loading web3 when component mounts
    const Web3 = await getWeb3;
    const { web3 } = Web3;

    const currentAccountId = web3.eth.accounts[0];

    // @notice instantiating auction contract
    const contract1 = web3.eth.contract(dutchAuctionABI);
    const dutchContract = await contract1.at(
      process.env.REACT_APP_DUTCH_AUCTION
    );

    const contract2 = web3.eth.contract(gemsABI);
    const gemsContract = contract2.at(process.env.REACT_APP_GEM_ERC721);

    handleSendContractsToRedux(
      dutchContract,
      gemsContract,
      web3,
      currentAccountId
    );

    this.updatePriceOnAllLiveAuctions = setInterval(
      () => handleUpdatePriceOnAllLiveAuctions(),
      10000
    );
  }

  componentWillUnmount() {
    // @notice clear price update interval when you leav ethe app to stop any memory leaks
    clearInterval(this.priceInterval);
    clearInterval(this.updatePriceOnAllLiveAuctions);
  }

  // @notice lets users buy a gem in an active auction
  handleBuyNow = (_tokenId, _from) => {
    const { dutchAuctionContractInstance, priceInWei } = this.state;
    const { handleUpdateGemOwnership } = this.props;

    this.setState({ visible: true });

    dutchAuctionContractInstance.methods
      .buy(Number(_tokenId))
      .send({
        from: _from,
        value: Number(priceInWei)
      })
      .on("transactionHash", () => {
        this.setState({ releaseConfetti: true });
      })
      .on("receipt", () => {
        handleUpdateGemOwnership(_tokenId, _from);
      })
      .on("error", err => this.setState({ err }));
  };

  render() {
    const { font, err, visible } = this.state;

    return (
      <BrowserRouter>
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
              Once you pay for the Gem using Metamask, you will be redirected to
              your workshop.
            </p>
            <strong>This may take a few moments.</strong>
          </Modal>
          <Auth />
          <StickyHeader>
            <Navbar />
          </StickyHeader>
          {/* <NotStickyHeader>
            <MobileHeader />
          </NotStickyHeader> */}
          <Routes />
          <Footer />
        </main>
      </BrowserRouter>
    );
  }
}

const actions = {
  handleSendContractsToRedux: sendContractsToRedux,
  handleUpdatePriceOnAllLiveAuctions: updatePriceOnAllLiveAuctions,
  handleUpdateGemOwnership: updateGemOwnership
};

export default connect(
  null,
  actions
)(App);

App.propTypes = {
  handleSendContractsToRedux: PropTypes.func.isRequired,
  handleUpdatePriceOnAllLiveAuctions: PropTypes.func.isRequired,
  handleUpdateGemOwnership: PropTypes.func.isRequired
};
