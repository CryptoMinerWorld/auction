import React, { PureComponent } from 'react';
import styled from 'styled-components';
import FontFaceObserver from 'fontfaceobserver';
import { Alert } from 'antd';
import MobileHeader from './components/MobileHeader';
import Navbar from './components/Nav';
import Footer from './components/Footer';
import getWeb3 from './utils/getWeb3';
import Routes from './routes';
import 'antd/dist/antd.css';
import './css/root.css';
import { showConfirm, showExpired, confirmInMetamask } from './components/Modal';
import {
    isTokenForSale,
    getAuctionDetails,
    calcMiningRate,
    getGemQualities,
    getGemStory,
    getGemImage,
    getPrice,
    nonExponential
} from './pages/Auction/helpers';
import { createAuction } from './pages/Create/helpers';
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
            currentAccount: '',
            releaseConfetti: false,
            err: ''
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
                    getPrice(tokenId, dutchAuctionContractInstance).then(result =>
                        this.setState({
                            priceInWei: result,
                            currentPrice: nonExponential(result)

                        })
                    )
                    // @notice check if the token is on sale
                    isTokenForSale(
                        dutchAuctionContractInstance,
                        tokenId
                    ).then(isTokenOnSale => this.setState({ isTokenOnSale }));
                }
            );

            // @notice updates the price every 10 seconds
            this.priceInterval = setInterval(() => {
                getPrice(tokenId, dutchAuctionContractInstance).then(result =>
                    this.setState({
                        priceInWei: result,
                        currentPrice: nonExponential(result)

                    })
                )
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

                    const image = getGemImage(color, gradeType, level)
                    const story = getGemStory(color, level)

                    Promise.all([image, story]).then(([_image, _story]) => this.setState({ gemImage: _image, story: _story }))
                        .catch(err => {
                            this.setState({ err })
                        })
                }
            )
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
        createAuction(_tokenId,
            _duration, _startPriceInWei, _endPriceInWei, gemsContractInstance, currentAccount)
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
        confirmInMetamask();
        await dutchAuctionContractInstance.methods.buy(_tokenId).send({ value: Number(priceInWei) }).on('transactionHash', () => {
            this.setState({ releaseConfetti: true })
        }).on('confirmation', () => { window.location = 'https://cryptominerworld.com/workshop/' }
        ).on('error', err => this.setState({ err }));
    };

    render() {
        const { redirectTo, tokenId, auctionEndTime, auctionStartTime, auctionStartPrice, auctionEndPrice, font, currentPrice, level, grade, rate, color, isTokenOnSale, web3, gemImage, story, releaseConfetti, err } = this.state

        // @notice if the token is not on auction a modal tells people the auction is over
        if (!isTokenOnSale &&
            window.location.href.includes('/auction/')) {
            showExpired();
        }

        return (
            <main className={font}>
                {err && <Alert
                    message="Error Text"
                    description={`${err.message}`}
                    type="error"
                    closable
                />}
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
                    releaseConfetti={releaseConfetti}
                />
                <Footer />
            </main>
        );
    }
}

export default App;