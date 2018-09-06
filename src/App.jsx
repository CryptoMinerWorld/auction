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
import { db, storage } from './utils/firebase'

// import DutchAuction from '../build/contracts/DutchAuction.json';

import Gems from '../build/contracts/GemERC721.json';

const dutchAuctionABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "owners",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "operator",
        "type": "address"
      },
      {
        "name": "role",
        "type": "uint256"
      }
    ],
    "name": "addOperator",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "MAX_FEE_INV",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "features",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "tokenInstance",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "userRoles",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "operator",
        "type": "address"
      },
      {
        "name": "role",
        "type": "uint256"
      }
    ],
    "name": "removeRole",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "operator",
        "type": "address"
      },
      {
        "name": "role",
        "type": "uint256"
      }
    ],
    "name": "addRole",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "ROLE_FEE_MANAGER",
    "outputs": [
      {
        "name": "",
        "type": "uint32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "removeOperator",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "ROLE_AUCTION_MANAGER",
    "outputs": [
      {
        "name": "",
        "type": "uint32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "items",
    "outputs": [
      {
        "name": "t0",
        "type": "uint48"
      },
      {
        "name": "t1",
        "type": "uint48"
      },
      {
        "name": "p0",
        "type": "uint80"
      },
      {
        "name": "p1",
        "type": "uint80"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "mask",
        "type": "uint256"
      }
    ],
    "name": "updateFeatures",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "fee",
    "outputs": [
      {
        "name": "nominator",
        "type": "uint16"
      },
      {
        "name": "denominator",
        "type": "uint16"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "tokenAddress",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_by",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "tokenId",
        "type": "uint32"
      },
      {
        "indexed": false,
        "name": "t0",
        "type": "uint48"
      },
      {
        "indexed": false,
        "name": "t1",
        "type": "uint48"
      },
      {
        "indexed": false,
        "name": "p0",
        "type": "uint80"
      },
      {
        "indexed": false,
        "name": "p1",
        "type": "uint80"
      },
      {
        "indexed": false,
        "name": "p",
        "type": "uint80"
      }
    ],
    "name": "ItemAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_by",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "tokenId",
        "type": "uint32"
      }
    ],
    "name": "ItemRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_to",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "tokenId",
        "type": "uint32"
      },
      {
        "indexed": false,
        "name": "t0",
        "type": "uint48"
      },
      {
        "indexed": false,
        "name": "t1",
        "type": "uint48"
      },
      {
        "indexed": false,
        "name": "p0",
        "type": "uint80"
      },
      {
        "indexed": false,
        "name": "p1",
        "type": "uint80"
      },
      {
        "indexed": false,
        "name": "p",
        "type": "uint80"
      },
      {
        "indexed": false,
        "name": "fee",
        "type": "uint80"
      }
    ],
    "name": "ItemBought",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "nominator",
        "type": "uint16"
      },
      {
        "indexed": false,
        "name": "denominator",
        "type": "uint16"
      },
      {
        "indexed": false,
        "name": "beneficiary",
        "type": "address"
      }
    ],
    "name": "TransactionFeeUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_by",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_requested",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_actual",
        "type": "uint256"
      }
    ],
    "name": "FeaturesUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_by",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_role",
        "type": "uint256"
      }
    ],
    "name": "RoleUpdated",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint32"
      },
      {
        "name": "duration",
        "type": "uint32"
      },
      {
        "name": "p0",
        "type": "uint80"
      },
      {
        "name": "p1",
        "type": "uint80"
      }
    ],
    "name": "add",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint32"
      },
      {
        "name": "t0",
        "type": "uint32"
      },
      {
        "name": "t1",
        "type": "uint32"
      },
      {
        "name": "p0",
        "type": "uint80"
      },
      {
        "name": "p1",
        "type": "uint80"
      }
    ],
    "name": "addWith",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint32"
      }
    ],
    "name": "remove",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint32"
      }
    ],
    "name": "buy",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "nominator",
        "type": "uint16"
      },
      {
        "name": "denominator",
        "type": "uint16"
      }
    ],
    "name": "setFee",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_beneficiary",
        "type": "address"
      }
    ],
    "name": "setBeneficiary",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "nominator",
        "type": "uint16"
      },
      {
        "name": "denominator",
        "type": "uint16"
      },
      {
        "name": "_beneficiary",
        "type": "address"
      }
    ],
    "name": "setFeeAndBeneficiary",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint32"
      }
    ],
    "name": "getTokenSaleStatus",
    "outputs": [
      {
        "name": "",
        "type": "uint224"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint32"
      }
    ],
    "name": "isTokenOnSale",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint32"
      }
    ],
    "name": "getCurrentPrice",
    "outputs": [
      {
        "name": "",
        "type": "uint80"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]

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
      web3: '',
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
      isTokenOnSale: true,
      gemImage: '',
      story: ''
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
    const currentAccount = await web3.eth.getAccounts().then(accounts => accounts[0]);

    const tokenId = Number(window.location.href.split('/').pop())
    // @notice instantiating auction contract
    const dutchAuctionContractInstance = await new web3.eth.Contract(
      dutchAuctionABI, '0xD97f21e4402a5b70B48DFad8B630B5554B6396b8', {
        from: currentAccount
      }
    );

    // @notice instantiating gem contract
    const gemsContractInstance = await new web3.eth.Contract(gemsABI, '0x82ff6bbd7b64f707e704034907d582c7b6e09d97', {
      from: currentAccount
    });

    // @notice set instances to component state for easy access
    this.setState(
      {
        dutchAuctionContractInstance,
        gemsContractInstance,
        web3
      })

    if (tokenId) {
      // @notice get auction details from contract
      const gemDetails = await getAuctionDetails(
        dutchAuctionContractInstance,
        tokenId
      )

      const [startTime, endTime, startPrice, endPrice] = await gemDetails;

      // @notice set auction details to app state
      this.setState(
        {
          tokenId,
          auctionStartTime: Number(startTime),
          auctionEndTime: Number(endTime),
          auctionStartPrice: Number(startPrice),
          auctionEndPrice: Number(endPrice)
        },
        () => {
          // @notice get current price from contract
          this.handleGetPrice(tokenId);
          // @notice check if the token is on sale
          isTokenForSale(
            dutchAuctionContractInstance,
            tokenId
          ).then(isTokenOnSale => this.setState({ isTokenOnSale }));
        }
      );

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
          return [color, gradeType, level]
        }
      ).then(result => {

        const [color, gradeType, level] = result
        const image = this.getGemImage(color, gradeType, level)

        const story = this.getGemStory(color, level)

        return Promise.all([image, story]).then(data => data
        )


      })
        .then(([image, story]) => this.setState({ gemImage: image, story }))
        .catch(err => {
          // eslint-disable-next-line
          console.error(err)
        })
    }
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
    await dutchAuctionContractInstance.methods.addWith(
      _tokenId,
      startTime,
      endTime,
      _startPrice,
      _endPrice
    ).send()
  };

  // @notice removes a gem from an auction
  handleRemoveGemFromAuction = async _tokenId => {
    const { dutchAuctionContractInstance } = this.state
    await dutchAuctionContractInstance.methods.remove(
      _tokenId)
  };

  // @notice lets users buy a gem in an active auction
  handleBuyNow = async _tokenId => {
    const { currentPrice, dutchAuctionContractInstance } = this.state
    await dutchAuctionContractInstance.methods.buy(
      _tokenId,
      { value: currentPrice }
    );
  };

  // @notice get latest price from contract
  handleGetPrice = async _tokenId => {
    const { dutchAuctionContractInstance } = this.state
    await dutchAuctionContractInstance.methods.getCurrentPrice(
      _tokenId).call().then(result =>



        this.setState({
          currentPrice:
            fromExponential(
              Number(result) / 1000000000000000000
            )
        })


      )
  }

  // @notice you must approve a gem before it can be sent to an auction
  handleApproveGemTransfer = async _tokenId => {
    const { gemsContractInstance } = this.state
    gemsContractInstance.methods.approve(
      '0xD97f21e4402a5b70B48DFad8B630B5554B6396b8',
      _tokenId
    ).send()
  };

  getGemImage = (color, grade, level) => {

    const type = {
      9: 'Sap',
      10: 'Opa',
      1: 'Gar',
      2: 'Ame',
    }[color]

    const gradeType = {
      1: 'D',
      2: 'C',
      3: 'B',
      4: 'A',
      5: 'AA',
      6: 'AAA',
    }[grade]

    const sourceImage = `${type}-${level}-${gradeType}-4500.png`;

    return storage
      .ref(`gems/${sourceImage}`)
      .getDownloadURL()
  }



  getGemStory = (color, level) => {
    const type = {
      9: 'sapphire',
      10: 'opal',
      1: 'garnet',
      2: 'amethyst',
    }[color]
    const lvl = `lvl${level}`
    return db.doc(`gems/${type}`).get().then(doc => doc.data()[lvl])
  }


  render() {
    const { redirectTo, tokenId, auctionEndTime, auctionStartTime, auctionStartPrice, auctionEndPrice, font, currentPrice, level, grade, rate, color, isTokenOnSale, web3, gemImage, story } = this.state

    // @notice if the token is not on auction a modal tells people the auction is over
    if (!isTokenOnSale &&
      window.location.href.includes('/auction/')) {
      showExpired();
    }


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
          name={`# ${tokenId}`}
          tokenId={tokenId}
          createAuction={this.handleCreateAuction}
          handleApproveGemTransfer={this.handleApproveGemTransfer}
          handleRemoveGemFromAuction={this.handleRemoveGemFromAuction}
          redirectTo={redirectTo}
          showConfirm={showConfirm}
          web3={web3}
          sourceImage={gemImage}
          story={story}
        />
        <Footer />
      </main>
    );
  }
}

export default App;
