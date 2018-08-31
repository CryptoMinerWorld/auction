import React, { PureComponent } from 'react';
import MobileHeader from './components/MobileHeader';
import Navbar from './components/Nav';
import Footer from './components/Footer';
import getWeb3 from './utils/getWeb3';
import styled from 'styled-components';
import FontFaceObserver from 'fontfaceobserver';
import { Routes } from './routes';
import 'antd/dist/antd.css';
import './css/root.css';
import { showConfirm, showExpired } from './components/Modal';
import fromExponential from 'from-exponential';
import {
  isTokenOnSale,
  getAuctionDetails,
  calcMiningRate,
  getGemQualities
} from './pages/Auction/helpers';
// import { handleApproveGemTransfer } from './pages/Create/helpers';

import DutchAuction from '../build/contracts/DutchAuction.json';
const dutchAuctionABI = DutchAuction.abi;

import Gems from '../build/contracts/GemERC721.json';
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
      storageValue: 0,
      web3: null,
      font: '',
      currentPrice: '',
      minPrice: '',
      maxPrice: '',
      deadline: '',
      dutchAuctionContractInstance: '',
      tokenId: '',
      grade: '',
      level: '',
      rate: '',
      isTokenOnSale: true
    };
  }

  componentDidMount() {
    var font = new FontFaceObserver('Muli', {
      weight: 400
    });

    font
      .load()
      .then(() => this.setState({ font: 'muli' }))
      .catch(() => console.warn('Font is not available'));

    getWeb3
      .then(results =>
        this.setState({
          web3: results.web3,
          tokenId: Number(window.location.href.split('/').pop())
        })
      )
      .then(async () => {
        const newDutchAuctionContract = this.state.web3.eth.contract(
          dutchAuctionABI
        );
        const dutchAuctionContractInstance = await newDutchAuctionContract.at(
          // process.env.RINKBY_AUCTION_CONTRACT
          '0x51e5b41f82b71dcebe11a7bd67ce12c862772e98'
        );

        const newGemsContract = this.state.web3.eth.contract(gemsABI);
        const gemsContractInstance = await newGemsContract.at(
          // process.env.RINKBY_GEM_CONTRACT
          '0x82ff6bbd7b64f707e704034907d582c7b6e09d97'
        );

        this.setState(
          {
            dutchAuctionContractInstance,
            gemsContractInstance
          },
          () => {
            getAuctionDetails(
              this.state.dutchAuctionContractInstance,
              this.state.tokenId
            ).then(result => {
              let [startTime, endTime, startPrice, endPrice] = result;
              this.setState(
                {
                  auctionStartTime: startTime.toNumber(),
                  auctionEndTime: endTime.toNumber(),
                  auctionStartPrice: startPrice.toNumber(),
                  auctionEndPrice: endPrice.toNumber()
                },
                () => {
                  this.handleGetPrice(this.state.tokenId);
                  isTokenOnSale(
                    this.state.dutchAuctionContractInstance,
                    this.state.tokenId
                  ).then(isTokenOnSale => this.setState({ isTokenOnSale }));
                }
              );
            });
          }
        );

        this.priceInterval = setInterval(() => {
          this.handleGetPrice(this.state.tokenId);
        }, 10000);

        getGemQualities(gemsContractInstance, this.state.tokenId).then(
          result => {
            let [color, level, gradeType, gradeValue] = result;
            this.setState({
              grade: gradeType,
              level,
              color,
              rate: calcMiningRate(gradeType, gradeValue)
            });
          }
        );
      });
  }

  componentWillUnmount() {
    clearInterval(this.priceInterval);
  }

  handleCreateAuction = async (_tokenId, _duration, _startPrice, _endPrice) => {
    console.log('creating auction...', _tokenId);

    let startTime = Date.now() / 1000;
    let endTime = (Date.now() + _duration) / 1000;

    await this.state.dutchAuctionContractInstance.addWith(
      _tokenId,
      startTime,
      endTime,
      _startPrice,
      _endPrice,
      (error, result) => {
        if (!error)
          console.log(
            `Auction successfully submitted with gemId ${_tokenId}`,
            result
          );
        else console.error(error);
      }
    );
  };

  handleRemoveGemFromAuction = async _tokenId => {
    console.log('removing gem from auction...', _tokenId);
    await this.state.dutchAuctionContractInstance.remove(
      _tokenId,
      (error, result) => {
        if (!error)
          console.log(
            `Gem successfully removed from auction ${_tokenId}`,
            result
          );
        else console.error(error);
      }
    );
  };

  handleBuyNow = async _tokenId => {
    console.log(this.state.currentPrice);
    await this.state.dutchAuctionContractInstance.buy(
      _tokenId,
      { value: this.state.currentPrice },
      (error, result) => {
        if (!error) this.setState({ redirectTo: '/workshop' });
        else console.error(error);
      }
    );
  };

  handleGetPrice = async _tokenId => {
    await this.state.dutchAuctionContractInstance.getCurrentPrice(
      _tokenId,
      (error, result) => {
        if (!error) this.setState({ currentPrice: result.toNumber() });
        else console.error(error);
      }
    );
  };

  handleApproveGemTransfer = async _tokenId => {
    await this.state.gemsContractInstance.approve(
      '0x51e5b41f82b71dcebe11a7bd67ce12c862772e98',
      _tokenId,
      (error, result) => {
        if (!error)
          console.log(`gemId ${_tokenId} successfully transferred to auction`);
        else console.error(error);
      }
    );
  };

  render() {
    // @notice if the token is not on auction a modal tells people the auction is over
    !this.state.isTokenOnSale &&
      window.location.href.includes('/auction/') &&
      showExpired();

    let currentPrice = fromExponential(
      Number(this.state.currentPrice) / 1000000000000000000
    );
    let level = Number(this.state.level);
    let grade = this.state.grade;
    let rate = Number(this.state.rate);
    let name = 'Amethyst Thingymajig';
    // let sourceImage = '';

    return (
      <main className={this.state.font}>
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
          currentPrice={currentPrice}
          minPrice={Number(this.state.minPrice)}
          maxPrice={Number(this.state.maxPrice)}
          level={level}
          grade={grade}
          rate={rate}
          buyNow={this.handleBuyNow}
          deadline={new Date(this.state.auctionEndTime * 1000)}
          name={name}
          tokenId={this.state.tokenId}
          createAuction={this.handleCreateAuction}
          handleApproveGemTransfer={this.handleApproveGemTransfer}
          handleRemoveGemFromAuction={this.handleRemoveGemFromAuction}
          redirectTo={this.state.redirectTo}
          showConfirm={showConfirm}
        />
        <Footer />
      </main>
    );
  }
}

export default App;
