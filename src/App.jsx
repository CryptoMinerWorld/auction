import React, { PureComponent } from 'react';
import MobileHeader from './components/MobileHeader';
import Navbar from './components/Nav';
import Footer from './components/Footer';
import getWeb3 from './utils/getWeb3';
import styled from 'styled-components';
import FontFaceObserver from 'fontfaceobserver';
import { Routes } from './routes';
import './css/root.css';

import DutchAuction from '../build/contracts/DutchAuction.json';
const dutchAuctionABI = DutchAuction.abi;

import Gems from '../build/contracts/GemERC721.json';
const gemsABI = Gems.abi;

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
      rate: ''
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
          web3: results.web3
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

        let tokenId = Number(window.location.href.split('/').pop());

        await dutchAuctionContractInstance.items(tokenId, (error, result) => {
          if (!error) {
            let [startTime, endTime, startPrice, endPrice] = result;

            this.setState(
              {
                dutchAuctionContractInstance: dutchAuctionContractInstance,
                gemsContractInstance: gemsContractInstance,
                tokenId: tokenId,
                auctionStartTime: startTime.toNumber(),
                auctionEndTime: endTime.toNumber(),
                auctionStartPrice: startPrice.toNumber(),
                auctionEndPrice: endPrice.toNumber()
              },
              () => this.handleGetPrice(tokenId)
            );
          } else console.error(error);
        });

        //   let _grade = gemsContractInstance.gems[tokenId].grade;
        //   let _gradeValue = gemsContractInstance.gems[tokenId].gradeValue;
        //   let _level = gemsContractInstance.gems[tokenId].level;

        //   Promise.all([
        //     _minPrice,
        //     _maxPrice,
        //     _deadline,
        //     _grade,
        //     _level,
        //     _gradeValue
        //   ]).then(values => {
        //     console.log('xxx', values);
        //     let [minPrice, maxPrice, deadline, grade, level, gradeValue] = values;

        //     let calcMiningRate = (gradeType, gradeValue) => {
        //       switch (gradeType) {
        //         case 1:
        //           return gradeValue / 200000;
        //         case 2:
        //           return 10 + gradeValue / 200000;
        //         case 3:
        //           return 20 + gradeValue / 200000;
        //         case 4:
        //           return 40 + (3 * gradeValue) / 200000;
        //         case 5:
        //           return 100 + gradeValue / 40000;
        //         case 6:
        //           return 300 + gradeValue / 10000;
        //         default:
        //           return 300 + gradeValue / 10000;
        //       }
        //     };

        //     this.setState({
        //       tokenId,
        //       dutchAuctionContractInstance,
        //       minPrice,
        //       maxPrice,
        //       deadline,
        //       grade,
        //       level,
        //       rate: calcMiningRate(grade, gradeValue)
        //     });
        //   });
        // })
        // .catch(() => {
        //   console.error('Error finding web3.');}
      });
  }

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
    console.log('buying...', _tokenId, typeof _tokenId);
    await this.state.dutchAuctionContractInstance.buy(
      _tokenId,
      (error, result) => {
        if (!error) console.log('bought successfully');
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

  render() {
    let currentPrice = Number(this.state.currentPrice) || 1.323;

    let minPrice = Number(this.state.minPrice) || 0.8;
    let maxPrice = Number(this.state.maxPrice) || 4.5;

    let deadline = new Date(this.state.auctionEndTime * 1000);

    let level = Number(this.state.level) || 2;
    let grade = this.state.grade || 'a';
    let rate = Number(this.state.rate) || 53;

    let name = 'Amethyst Thingymajig';
    // let sourceImage = '';
    let tokenId = Number(window.location.href.split('/').pop());

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
          minPrice={minPrice}
          maxPrice={maxPrice}
          level={level}
          grade={grade}
          rate={rate}
          buyNow={this.handleBuyNow}
          deadline={deadline}
          name={name}
          tokenId={tokenId}
          createAuction={this.handleCreateAuction}
          handleApproveGemTransfer={this.handleApproveGemTransfer}
          handleRemoveGemFromAuction={this.handleRemoveGemFromAuction}
        />
        <Footer />
      </main>
    );
  }
}

export default App;

// export default () => (
//   <Subscribe to={[AuctionSettingsContainer, AuctionContainer]}>
//     {(_auctionSettingsStore, _auctionStore) => (
//       <App
//         auctionSettingsStore={_auctionSettingsStore}
//         auctionStore={_auctionStore}
//       />
//     )}
//   </Subscribe>
// );
