import React, { Component } from 'react';

import DutchAuction from '../build/contracts/DutchAuction.json';

import Gems from '../build/contracts/GemERC721.json';

// import getWeb3 from './utils/getWeb3';

// @notice context allows me to inject application state into any component in app
export const Context = React.createContext();

class Provider extends Component {
  // async componentDidMount() {
  //   let _web3 = await getWeb3;
  //   this.setState(
  //     {
  //       web3: _web3.web3,
  //       tokenId: Number(window.location.href.split('/').pop())
  //     },
  //     async () => {
  //       await this.setContractInstances(this.state.web3);

  //       this.getAuctionProperties(
  //         this.state.tokenId,
  //         this.state.dutchAuctionContractInstance
  //       );
  //       this.handleGetPrice(
  //         this.state.tokenId,
  //         this.state.dutchAuctionContractInstance
  //       );
  //       this.isTokenOnSale(
  //         this.state.tokenId,
  //         this.state.dutchAuctionContractInstance
  //       );
  //     }
  //   );

  // this.priceInterval = setInterval(() => {
  //   this.handleGetPrice(this.state.tokenId);
  // }, 10000);

  //   //   let _grade = gemsContractInstance.gems[tokenId].grade;
  //   //   let _gradeValue = gemsContractInstance.gems[tokenId].gradeValue;
  //   //   let _level = gemsContractInstance.gems[tokenId].level;

  //   //   Promise.all([
  //   //     _minPrice,
  //   //     _maxPrice,
  //   //     _deadline,
  //   //     _grade,
  //   //     _level,
  //   //     _gradeValue
  //   //   ]).then(values => {
  //   //     console.log('xxx', values);
  //   //     let [minPrice, maxPrice, deadline, grade, level, gradeValue] = values;

  //   //     let calcMiningRate = (gradeType, gradeValue) => {
  //   //       switch (gradeType) {
  //   //         case 1:
  //   //           return gradeValue / 200000;
  //   //         case 2:
  //   //           return 10 + gradeValue / 200000;
  //   //         case 3:
  //   //           return 20 + gradeValue / 200000;
  //   //         case 4:
  //   //           return 40 + (3 * gradeValue) / 200000;
  //   //         case 5:
  //   //           return 100 + gradeValue / 40000;
  //   //         case 6:
  //   //           return 300 + gradeValue / 10000;
  //   //         default:
  //   //           return 300 + gradeValue / 10000;
  //   //       }
  //   //     };

  //   //     this.setState({
  //   //       tokenId,
  //   //       dutchAuctionContractInstance,
  //   //       minPrice,
  //   //       maxPrice,
  //   //       deadline,
  //   //       grade,
  //   //       level,
  //   //       rate: calcMiningRate(grade, gradeValue)
  //   //     });
  //   //   });
  //   // })
  //   // .catch(() => {
  //   //   console.error('Error finding web3.');}
  // });
  // }

  // componentWillUnmount() {
  //   clearInterval(this.priceInterval);
  // }

  handleGetPrice = async (_tokenId, _auctionContract) => {
    await _auctionContract.getCurrentPrice(_tokenId, (error, result) => {
      if (!error) this.setState({ currentPrice: result.toNumber() });
      else console.error(error);
    });
  };

  isTokenOnSale = async (_tokenId, _auctionContract) => {
    await _auctionContract.isTokenOnSale(_tokenId, (error, result) => {
      console.log('istoken on sale', result);
      if (!error) this.setState({ isTokenOnSale: result });
      else console.error(error);
    });
  };

  getAuctionProperties = async (_tokenId, _auctionContract) => {
    console.log('pou');

    await _auctionContract.items(_tokenId, (error, result) => {
      if (!error) {
        let [startTime, endTime, startPrice, endPrice] = result;
        this.setState({
          auctionStartTime: startTime.toNumber(),
          auctionEndTime: endTime.toNumber(),
          auctionStartPrice: startPrice.toNumber(),
          auctionEndPrice: endPrice.toNumber()
        });
      } else console.error(error);
    });
  };

  setContractInstances = _web3 => {
    const dutchAuctionContract = _web3.eth.contract(DutchAuction.abi);

    let dutchAuctionContractInstance = dutchAuctionContract.at(
      // process.env.RINKBY_AUCTION_CONTRACT
      '0x51e5b41f82b71dcebe11a7bd67ce12c862772e98'
    );

    const gemsContract = _web3.eth.contract(Gems.abi);
    let gemsContractInstance = gemsContract.at(
      // process.env.RINKBY_GEM_CONTRACT
      '0x82ff6bbd7b64f707e704034907d582c7b6e09d97'
    );

    Promise.all([dutchAuctionContractInstance, gemsContractInstance]).then(
      values => {
        let [dutchAuctionContractInstance, gemsContractInstance] = values;

        this.setState({
          dutchAuctionContractInstance,
          gemsContractInstance
        });
      }
    );
  };

  state = {
    on: false,
    web3: false
  };

  render() {
    return <Context.Provider value={this.state} {...this.props} />;
  }
}

export default Provider;
