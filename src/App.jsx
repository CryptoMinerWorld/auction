import React, { PureComponent } from 'react';
import styled from 'styled-components';
import FontFaceObserver from 'fontfaceobserver';
import fromExponential from 'from-exponential';
import { BigNumber } from 'bignumber.js';
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
import DutchAuction from '../build/contracts/DutchAuction.json';
import Gems from '../build/contracts/GemERC721.json';



const dutchAuctionABI = DutchAuction.abi

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
            gemsContractInstance: '',
            auctionStartTime: '',
            auctionEndTime: '',
            tokenId: '',
            grade: 1,
            level: 'A',
            rate: '',
            color: '',
            isTokenOnSale: true,
            gemImage: '',
            story: '',
            priceInWei: '',
            currentAccount: ''
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
            dutchAuctionABI, '0xdd229423db08b1e9a0add49986e358dab72b7f54', {
                from: currentAccount
            }
        );

        // @notice instantiating gem contract
        const gemsContractInstance = await new web3.eth.Contract(gemsABI, '0x82ff6bbd7b64f707e704034907d582c7b6e09d97', {
            from: currentAccount
        });

        gemsContractInstance.events.allEvents({
        }, (error, event) => {
            if (!error) console.log(event)
            else console.log(error)
        }
        )


        dutchAuctionContractInstance.events.allEvents({
        }, (error, event) => {
            if (!error) console.log(event)
            else console.log(error)
        })

        // @notice set instances to component state for easy access
        this.setState(
            {
                dutchAuctionContractInstance,
                gemsContractInstance,
                web3,
                currentAccount
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
                    console.log('[color, level, gradeType, gradeValue]', [color, level, gradeType, gradeValue]);
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
    handleCreateAuction = async (
        _tokenId,
        _duration, _startPriceInWei, _endPriceInWei
    ) => {
        const { gemsContractInstance, currentAccount } = this.state

        // converts BigNumber representing Solidity uint256 into String representing Solidity bytes
        function toBytes(uint256) {
            let s = uint256.toString(16);
            const len = s.length;
            // 256 bits must occupy exactly 64 hex digits
            if (len > 64) {
                s = s.substr(0, 64);
            }
            for (let i = 0; i < 64 - len; i += 1) {
                s = `0${s}`;
            }
            return `0x${s}`;
        }

        // construct auction parameters
        const token = Number(_tokenId)
        const tokenId = new BigNumber(token)
        const t0 = (Math.round(new Date().getTime() / 1000)) || 0;
        const t1 = t0 + _duration;
        const p0 = _startPriceInWei;
        const p1 = _endPriceInWei;
        const two = new BigNumber(2)

        const bigNumber = two.pow(224).times(tokenId)
            .plus(two.pow(192).times(t0))
            .plus(two.pow(160).times(t1))
            .plus(two.pow(80).times(p0))
            .plus(p1)

        const bigNumberToBytes = toBytes(bigNumber)

        const auctionContract = '0xdd229423db08b1e9a0add49986e358dab72b7f54'

        gemsContractInstance.methods.safeTransferFrom(
            currentAccount, auctionContract, token, bigNumberToBytes
        ).send()
    };

    // @notice removes a gem from an auction
    handleRemoveGemFromAuction = async _tokenId => {
        const tokenId = Number(_tokenId)
        const { dutchAuctionContractInstance } = this.state
        await dutchAuctionContractInstance.methods.remove(
            tokenId).send()
    };

    // @notice lets users buy a gem in an active auction
    handleBuyNow = async _tokenId => {
        const { dutchAuctionContractInstance, priceInWei } = this.state
        await dutchAuctionContractInstance.methods.buy(_tokenId).send({ value: Number(priceInWei) })
    };

    // @notice get latest price from contract
    handleGetPrice = async _tokenId => {
        const { dutchAuctionContractInstance } = this.state
        await dutchAuctionContractInstance.methods.getCurrentPrice(
            _tokenId).call().then(result =>



                this.setState({
                    priceInWei: result,
                    currentPrice:
                        fromExponential(
                            Number(result) / 1000000000000000000
                        )
                })
            )
    }


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
                    deadline={auctionEndTime}
                    name={`#${tokenId}`}
                    tokenId={tokenId}
                    createAuction={this.handleCreateAuction}
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
