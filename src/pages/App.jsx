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
      .then(results => {
        this.setState(
          {
            web3: results.web3
          },
          async () => {
            const newDutchAuctionContract = this.state.web3.eth.contract(
              dutchAuctionABI
            );
            const dutchAuctionContractInstance = newDutchAuctionContract.at(
              'TK_AUCTION_CONTRACT_ADDRESS'
            );

            const newGemsContract = this.state.web3.eth.contract(gemsABI);
            const gemsContractInstance = newGemsContract.at(
              'TK_GEMS_CONTRACT_ADDRESS'
            );

            let tokenId = 'TK_TOKEN_ID';

            let _minPrice = dutchAuctionContractInstance.items[tokenId].p0;
            let _maxPrice = dutchAuctionContractInstance.items[tokenId].p1;
            let _deadline = dutchAuctionContractInstance.items[tokenId].t1;

            let _grade = gemsContractInstance.gems[tokenId].grade;
            let _gradeValue = gemsContractInstance.gems[tokenId].gradeValue;
            let _level = gemsContractInstance.gems[tokenId].level;

            Promise.all([
              _minPrice,
              _maxPrice,
              _deadline,
              _grade,
              _level,
              _gradeValue
            ]).then(values => {
              let [
                minPrice,
                maxPrice,
                deadline,
                grade,
                level,
                gradeValue
              ] = values;

              let calcMiningRate = (gradeType, gradeValue) => {
                switch (gradeType) {
                  case 1:
                    return gradeValue / 200000;
                  case 2:
                    return 10 + gradeValue / 200000;
                  case 3:
                    return 20 + gradeValue / 200000;
                  case 4:
                    return 40 + (3 * gradeValue) / 200000;
                  case 5:
                    return 100 + gradeValue / 40000;
                  case 6:
                    return 300 + gradeValue / 10000;
                  default:
                    return 300 + gradeValue / 10000;
                }
              };

              this.setState({
                tokenId,
                dutchAuctionContractInstance,
                minPrice,
                maxPrice,
                deadline,
                grade,
                level,
                rate: calcMiningRate(grade, gradeValue)
              });
            });
          }
        );
      })
      .catch(() => {
        console.error('Error finding web3.');
      });
  }

  handleBuyNow = async tokenId => {
    console.log('buying...');
    await this.state.dutchAuctionContractInstance.buy(tokenId);
    console.log('bought successfully');
  };

  handleGetPrice = async tokenId => {
    console.log('fetching price...');
    let currentPrice = await this.state.dutchAuctionContractInstance.getCurrentPrice(
      tokenId
    );
    this.setState({ currentPrice });
    console.log('price updated');
  };

  render() {
    let currentPrice = this.state.currentPrice || 1.323;

    let minPrice = this.state.minPrice || 0.8;
    let maxPrice = this.state.maxPrice || 4.5;
    let deadline = this.state.deadline || 'Aug 20, 2018 @ 00:00 EST';

    let level = this.state.level || 2;
    let grade = this.state.grade || 'a';
    let rate = this.state.rate || 53;

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
        />
        <Footer />
      </main>
    );
  }
}

export default App;
