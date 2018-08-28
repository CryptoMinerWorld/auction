import React, { PureComponent } from 'react';
import '../css/root.css';
import Auction from './Auction/index';
import MobileHeader from '../components/MobileHeader';
import Navbar from '../components/Nav';
import Footer from '../components/Footer';
import getWeb3 from '../utils/getWeb3';
import styled from 'styled-components';
import FontFaceObserver from 'fontfaceobserver';

import DutchAuction from '../../build/contracts/DutchAuction.json';
const dutchAuctionABI = DutchAuction.abi;

import Gems from '../../build/contracts/GemERC721.json';
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
      .catch(() => console.log('Font is not available'));

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

        // tk
        const dutchAuctionContractInstance = await newDutchAuctionContract.at(
          '0x51e5b41f82b71dcebe11a7bd67ce12c862772e98'
        );
        console.log('a', dutchAuctionContractInstance);

        // tk
        const newGemsContract = this.state.web3.eth.contract(gemsABI);
        const gemsContractInstance = await newGemsContract.at(
          '0x82ff6bbd7b64f707e704034907d582c7b6e09d97'
        );

        // tk
        let tokenId = 69664;

        dutchAuctionContractInstance.items(tokenId, (error, result) => {
          if (!error) {
            let [startTime, endTime, startPrice, endPrice] = result;

            this.setState(
              {
                dutchAuctionContractInstance: dutchAuctionContractInstance,
                tokenId: tokenId,
                auctionStartTime: startTime.toNumber(),
                auctionEndTime: endTime.toNumber(),
                auctionStartPrice: startPrice.toNumber(),
                auctionEndPrice: endPrice.toNumber()
              },
              () => this.handleGetPrice(tokenId)
            );

            console.log('prices set');
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
        //   console.error('Error finding web3.');
      });
  }

  handleBuyNow = async _tokenId => {
    console.log('buying...', _tokenId);
    await this.state.dutchAuctionContractInstance.buy(_tokenId);
    console.log('bought successfully');
  };

  handleGetPrice = async _tokenId => {
    console.log('fetching price...');
    let currentPrice = await this.state.dutchAuctionContractInstance.getCurrentPrice(
      _tokenId,
      (error, result) => {
        if (!error) this.setState({ currentPrice: result.toNumber() });
        else console.error(error);
      }
    );
    console.log('price updated');
  };

  render() {
    let currentPrice = this.state.currentPrice || 1.323;

    let minPrice = this.state.minPrice || 0.8;
    let maxPrice = this.state.maxPrice || 4.5;

    let someDate = new Date();

    let numberOfDaysToAdd = 4;
    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
    let deadline = someDate;
    // let deadline = new Date(this.state.auctionEndTime) ;

    let level = this.state.level || 2;
    let grade = this.state.grade || 'a';
    let rate = this.state.rate || 53;

    let name = 'Amethyst Thingymajig';
    // let sourceImage = '';
    let tokenId = this.state.tokenId;

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
        <Auction
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
        />
        <Footer />
      </main>
    );
  }
}

export default App;
