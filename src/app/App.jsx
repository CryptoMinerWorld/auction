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
import { showConfirm, showExpired } from "../components/Modal";
import { calculateGemName } from "../features/items/helpers";
import { sendContractsToRedux } from "./appActions";
import { updateWalletId } from "../features/auth/authActions";
import Auth from "../features/auth";
import { updatePriceOnAllLiveAuctions } from "../features/market/marketActions";
import { updateGemOwnership } from "../features/items/itemActions";
import DutchAuction from "../../build/contracts/DutchAuction.json";
import Gems from "../../build/contracts/GemERC721.json";

const abiDecoder = require("abi-decoder");

abiDecoder.addABI(DutchAuction.abi);
abiDecoder.addABI(Gems.abi);

require("dotenv").config();
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
      web3: "",
      font: "",
      auctionStartPrice: "",
      auctionEndPrice: "",
      currentPrice: "",
      dutchAuctionContractInstance: "",
      gemsContractInstance: "",
      auctionStartTime: "",
      auctionEndTime: "",
      tokenId: "",
      grade: 1,
      level: 2,
      rate: 2,
      color: "",
      isTokenOnSale: true,
      gemImage: "",
      story: "",
      priceInWei: "",
      currentAccount: "",
      releaseConfetti: false,
      err: "",
      visible: false
    };
  }

  async componentDidMount() {
    const {
      handleSendContractsToRedux,
      handleUpdatePriceOnAllLiveAuctions,
      handleUpdateWalletId
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

    const currentAccountId = await web3.eth
      .getAccounts()
      .then(accounts => accounts[0]);

    web3.currentProvider.publicConfigStore.on(
      "update",
      ({ selectedAddress }) => {
        console.log("update");
        return handleUpdateWalletId(selectedAddress);
      }
    );

    // @notice instantiating auction contract
    const dutchContract = new web3.eth.Contract(
      dutchAuctionABI,
      process.env.REACT_APP_DUTCH_AUCTION,
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

    Promise.all([dutchContract, gemsContract, currentAccountId])
      .then(
        ([
          dutchAuctionContractInstance,
          gemsContractInstance,
          currentAccount
        ]) => {
          handleSendContractsToRedux(
            dutchAuctionContractInstance,
            gemsContractInstance,
            web3
          );
          this.setState({
            dutchAuctionContractInstance,
            gemsContractInstance,
            web3,
            currentAccount
          });
        }
      )
      .catch(err => {
        this.setState({ err });
      });

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
    const {
      redirectTo,
      tokenId,
      auctionEndTime,
      auctionStartTime,
      auctionStartPrice,
      auctionEndPrice,
      font,
      currentPrice,
      level,
      grade,
      rate,
      color,
      isTokenOnSale,
      web3,
      gemImage,
      story,
      releaseConfetti,
      err,
      currentAccount,
      visible,
      gemsContractInstance
    } = this.state;

    // @notice if the token is not on auction a modal tells people the auction is over
    if (!isTokenOnSale && window.location.href.includes("/auction/")) {
      showExpired();
    }

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
          <NotStickyHeader>
            <MobileHeader
              currentPrice={currentPrice}
              level={level}
              grade={grade}
              rate={rate}
            />
          </NotStickyHeader>
          <Routes
            currentPrice={Number(currentPrice).toFixed(3)}
            minPrice={Number(auctionStartPrice / 1000000000000000000)}
            maxPrice={Number(auctionEndPrice / 1000000000000000000)}
            level={level}
            grade={grade}
            rate={rate}
            color={color}
            buyNow={this.handleBuyNow}
            auctionStartTime={auctionStartTime}
            deadline={auctionEndTime}
            name={calculateGemName(color, tokenId)}
            tokenId={tokenId}
            gemsContractInstance={gemsContractInstance}
            redirectTo={redirectTo}
            showConfirm={showConfirm}
            web3={web3}
            sourceImage={gemImage}
            story={story}
            releaseConfetti={releaseConfetti}
            provider={!!web3}
            currentAccount={currentAccount}
          />
          <Footer />
        </main>
      </BrowserRouter>
    );
  }
}

const actions = {
  handleSendContractsToRedux: sendContractsToRedux,
  handleUpdatePriceOnAllLiveAuctions: updatePriceOnAllLiveAuctions,
  handleUpdateGemOwnership: updateGemOwnership,
  handleUpdateWalletId: updateWalletId
};

export default connect(
  null,
  actions
)(App);

App.propTypes = {
  handleSendContractsToRedux: PropTypes.func.isRequired,
  handleUpdatePriceOnAllLiveAuctions: PropTypes.func.isRequired,
  handleUpdateGemOwnership: PropTypes.func.isRequired,
  handleUpdateWalletId: PropTypes.func.isRequired
};
