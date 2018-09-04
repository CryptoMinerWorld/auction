import React, { PureComponent } from 'react';
import styled from 'styled-components';
import FontFaceObserver from 'fontfaceobserver';
import fromExponential from 'from-exponential';
import MobileHeader from './components/MobileHeader';
import Navbar from './components/Nav';
import Footer from './components/Footer';
import getWeb3 from './utils/getWeb3';
import Routes from './routes';
import 'antd/dist/antd.css';
import './css/root.css';
import { showConfirm, showExpired } from './components/Modal';
import {
  isTokenForSale,
  getAuctionDetails,
  calcMiningRate,
  getGemQualities
} from './pages/Auction/helpers';

import DutchAuction from '../build/contracts/DutchAuction.json';

import Gems from '../build/contracts/GemERC721.json';

const dutchAuctionABI = DutchAuction.abi;

const gemsABI = Gems.abi;

// @dev keeping component specific styling inside each component file is optimising for deletability. Change or delete this component in the future and all the relevant styles are removed and no more zombie css
const StickyHeader = styled.div`
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
  z-index: 3;
`;

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

      font: '',
      auctionStartPrice: '',
      auctionEndPrice: '',
      currentPrice: '',
      dutchAuctionContractInstance: '',
      auctionStartTime: '',
      auctionEndTime: '',
      tokenId: '',
      grade: '',
      level: '',
      rate: '',
      color: '',
      isTokenOnSale: true
    };
  }

  async componentDidMount() {
    // @notice loading a custom font when app mounts
    const font = new FontFaceObserver('Muli', {
      weight: 400
    });
    font
      .load()
      .then(() => this.setState({ font: 'muli' }))
      .catch((error) => error);

    // @notice loading web3 when component mounts
    const Web3 = await getWeb3
    const { web3 } = Web3

    const tokenId = Number(window.location.href.split('/').pop())
    // @notice instantiating auction contract
    const newDutchAuctionContract = web3.eth.contract(
      dutchAuctionABI
    );
    const dutchAuctionContractInstances = await newDutchAuctionContract.at(
      // process.env.RINKBY_AUCTION_CONTRACT
      '0x82ff6bbd7b64f707e704034907d582c7b6e09d97'
    );
    // @notice instantiating gem contract
    const newGemsContract = web3.eth.contract(gemsABI);
    const gemsContractInstance = await newGemsContract.at(
      // process.env.RINKBY_GEM_CONTRACT
      '0x82ff6bbd7b64f707e704034907d582c7b6e09d97'
    );
    // @notice set instances to component state for easy access
    this.setState(
      {
        dutchAuctionContractInstance: dutchAuctionContractInstances,
        gemsContractInstance
      })

    // @notice get auction details from contract
    getAuctionDetails(
      dutchAuctionContractInstances,
      tokenId
    ).then(result => {
      const [startTime, endTime, startPrice, endPrice] = result;
      // @notice set auction details to app state
      this.setState(
        {
          auctionStartTime: startTime.toNumber(),
          auctionEndTime: endTime.toNumber(),
          auctionStartPrice: startPrice.toNumber(),
          auctionEndPrice: endPrice.toNumber()
        },
        () => {
          // @notice get current price from contract
          this.handleGetPrice(tokenId);
          // @notice check if the token is on sale
          isTokenForSale(
            dutchAuctionContractInstances,
            tokenId
          ).then(isTokenOnSale => this.setState({ isTokenOnSale }));
        }
      );
    });



    // @notice updates the price every 10 seconds
    this.priceInterval = setInterval(() => {
      this.handleGetPrice(tokenId);
    }, 10000);

    // @notice get gem qualities from gem contract
    getGemQualities(gemsContractInstance, tokenId).then(
      result => {
        const [color, level, gradeType, gradeValue] = result;
        this.setState({
          grade: gradeType,
          level: Number(level),
          color,
          rate: Number(calcMiningRate(gradeType, gradeValue))
        });
      }
    );
  }

  componentWillUnmount() {
    // @notice clear price update interval when you leav ethe app to stop any memory leaks
    clearInterval(this.priceInterval);
  }

  // @notice creates an auction
  handleCreateAuction = async (_tokenId, _duration, _startPrice, _endPrice) => {
    const startTime = Number(Date.now() / 1000);
    const endTime = Number((Date.now() + _duration) / 1000);
    const { dutchAuctionContractInstance } = this.state
    await dutchAuctionContractInstance.addWith(
      _tokenId,
      startTime,
      endTime,
      _startPrice,
      _endPrice,
      (error) => error
    );
  };

  // @notice removes a gem from an auction
  handleRemoveGemFromAuction = async _tokenId => {
    const { dutchAuctionContractInstance } = this.state
    await dutchAuctionContractInstance.remove(
      _tokenId,
      (error) => error)
  };

  // @notice lets users buy a gem in an active auction
  handleBuyNow = async _tokenId => {
    const { currentPrice, dutchAuctionContractInstance } = this.state
    await dutchAuctionContractInstance.buy(
      _tokenId,
      { value: currentPrice },
      (error) => {
        if (!error) this.setState({ redirectTo: '/workshop' });

      }
    );
  };

  // @notice get latest price from contract
  handleGetPrice = async _tokenId => {
    const { dutchAuctionContractInstance } = this.state
    await dutchAuctionContractInstance.getCurrentPrice(
      _tokenId,
      (error, result) => {
        if (!error) this.setState({
          currentPrice:
            fromExponential(
              Number(result.toNumber()) / 1000000000000000000
            )
        });

      }
    );
  };

  // @notice you must approve a gem before it can be sent to an auction
  handleApproveGemTransfer = async _tokenId => {
    const { gemsContractInstance } = this.state
    await gemsContractInstance.approve(
      '0xD97f21e4402a5b70B48DFad8B630B5554B6396b8',
      _tokenId,
      (error) => error

    );
  };

  render() {
    const { redirectTo, tokenId, auctionEndTime, auctionStartTime, auctionStartPrice, auctionEndPrice, font, currentPrice, level, grade, rate, color, isTokenOnSale } = this.state

    // @notice if the token is not on auction a modal tells people the auction is over
    if (!isTokenOnSale &&
      window.location.href.includes('/auction/')) {
      showExpired();
    }

    const name = 'Amethyst Thingymajig';

    // let sourceImage = '';

    return (
      <main className={font}>
        <StickyHeader>
          <Navbar />
          <MobileHeader
            currentPrice={currentPrice}
            level={level}
            grade={grade}
            rate={rate}
          />
        </StickyHeader>

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
          deadline={new Date(auctionEndTime * 1000)}
          name={name}
          tokenId={tokenId}
          createAuction={this.handleCreateAuction}
          handleApproveGemTransfer={this.handleApproveGemTransfer}
          handleRemoveGemFromAuction={this.handleRemoveGemFromAuction}
          redirectTo={redirectTo}
          showConfirm={showConfirm}
        />
        <Footer />
      </main>
    );
  }
}

export default App;
