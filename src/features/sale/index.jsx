import React, {Component} from 'react';
import {connect} from 'react-redux';
import windowSize from 'react-window-size';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {compose, lifecycle} from 'recompose';
import Gold from '../../app/images/dashboard/Gold.png';
import Silver from '../../app/images/dashboard/Silver.png';
import goldishSilver from '../../app/images/sale/goldishSilverGeode.png';
import rotundSilver from '../../app/images/sale/rotundSilverGeode.png';
import smallSilver from '../../app/images/sale/smallSilverGeode.png';
import buyNowImage from "../../app/images/pinkBuyNowButton.png";
import {
    buyGeode,
    getBoxesAvailableData,
    getChestValue,
    getGeodesData,
    getSaleState,
    getUserBalance,
    updateSaleState
} from "./saleActions";
import {withRouter} from "react-router-dom";
import {parseSaleEventData} from "../../app/services/SilverGoldService";
import CountdownTimer from "./components/CountdownTimer";

import tableReferralPoints from '../../app/images/sale/tableReferralPoints.png';
import gemEating from '../../app/images/sale/gemEatingGoldGeode.png';
import getLoot from '../../app/images/sale/getLoot.png';
import tableGoldAmounts from '../../app/images/sale/tableGoldAmounts.png';
import tableSilverAmounts from '../../app/images/sale/tableSilverAmounts.png';
import tableSilverGoldDropRates from '../../app/images/sale/tableSilverGoldDropRates.png';
import upArrow from '../../app/images/sale/upMagentaArrow.png';
import downArrow from '../../app/images/sale/downMagentaArrow.png';
import foundersChest from '../../app/images/sale/foundersChest.png';


const select = store => ({
    silverGoldService: store.app.silverGoldServiceInstance,
    presaleContract: store.app.presaleContractInstance,
    currentUserId: store.auth.currentUserId,
    saleState: store.sale.saleState,
    userBalance: store.sale.balance,
    provider: store.auth.web3 && store.auth.web3.currentProvider,
    accountExists: store.auth.existingUser,
    chestValue: store.sale.chestValue
});

class Sale extends Component {

    state = {
        silverGeodeChosen: 1,
        rotundGeodeChosen: 1,
        goldishGeodeChosen: 1,
        totalEth: 0,
        proceedBuy: false,
        proceedBuyType: '',
        proceedBuyAmount: 0,
        boxesAvailable: ['...', '...', '...'],
        boxesPrices: [],
        referrer: null,
        smallScreen: false,
        copied: false,
    };

    static defaultProps = {
        saleState: {
            '0': {currentPrice: '...', boxesAvailable: '...'},
            '1': {currentPrice: '...', boxesAvailable: '...'},
            '2': {currentPrice: '...', boxesAvailable: '...'},
        }
    }

    async componentDidMount() {
        console.log(888888888888, ' PROPS: ', this.props);
        const {
            handleGetBoxesAvailable, handleUpdateSaleState, handleGetSaleState, silverGoldService,
            currentUserId, handleGetUserBalance, presaleContract, handleGetChestValue
        } = this.props;

        this.interval = setInterval(
          () => this.setState({
              currentTime: new Date().getTime()
          }),
          10000,
        ); //10 sec interval

        this.setState({
            currentTime: new Date().getTime()
        });

        if (presaleContract) {
            handleGetChestValue();
        }

        if (silverGoldService) {
            silverGoldService.saleContract.events.SaleStateChanged({
                fromBlock: 'latest'
            })
              .on('data', function (event) {
                  handleUpdateSaleState(event);
                  console.log('DATA EVENT:', event); // same results as the optional callback above
              })
              .on('changed', function (event) {
                  // remove event from local database
              })
              .on('error', console.error);
            handleGetSaleState();
            if (currentUserId) {
                handleGetUserBalance(currentUserId);
            }
        }
    }

    async componentDidUpdate(prevProps) {
        const {
            handleGetUserBalance, silverGoldService, currentUserId, handleUpdateSaleState, handleGetSaleState,
            saleState, userBalance, presaleContract, handleGetChestValue
        } = this.props;
        const {silverAvailable, goldAvailable} = this.state;

        console.log('11111 PROPS: ', this.props);
        console.log('22222 PROPS: ', prevProps);

        if (presaleContract && presaleContract !== prevProps.presaleContract) {
            handleGetChestValue();
        }

        if (silverGoldService && (prevProps.silverGoldService !== silverGoldService)) {

            silverGoldService.saleContract.events.SaleStateChanged({
                fromBlock: 'latest'
            })
              .on('data', function (event) {
                  handleUpdateSaleState(event);
                  console.log('DATA EVENT:', event); // same results as the optional callback above
              })
              .on('changed', function (event) {
                  // remove event from local database
              })
              .on('error', console.error);

            handleGetSaleState();
        }

        if (silverGoldService && currentUserId && (silverGoldService !== prevProps.silverGoldService || currentUserId !== prevProps.currentUserId)) {

            let referrer = silverGoldService.getReferralId(this.props.location.search);
            console.log('Saved referrer: ', referrer);
            if (referrer && !(await silverGoldService.ifReferrerIsValid(referrer, currentUserId))) {
                referrer = 'some referral link is already used';
            }
            this.setState({referrer});
            console.log('state-state:', this.state);

            handleGetUserBalance(currentUserId);
        }
    }

    render() {
        const geodeBlockStyle = {
            maxWidth: '23em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '50px 3% 0 3%',
            minWidth: '300px',
            fontSize: '18px',
            fontWeight: '600',
            color: 'lightgrey',
            flex: '1'
        };

        const smallScreenGeode = {
            margin: '10px 0',
            borderRadius: '10px',
        }

        const buyArea = {
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            borderRadius: '15px 15px 0 0',
            padding: '10px 10px 5px 5px',
        };

        const chosenCounter = {
            flex: '1',
            fontSize: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }

        const arrows = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: '1',
            fontSize: '20px',
            height: '60px',
            justifyContent: 'space-around'
        };

        const fixedOverlayStyle = {
            position: 'fixed',
            //width: '35%',
            //maxWidth: '50rem',
            //height: '20rem',
            //backgroundColor: '#dedede',
            margin: 'auto',
            left: '0',
            right: '0',
            top: '0rem',
            bottom: '0',
            zIndex: '10',
            display: 'flex',
            cursor: 'pointer',
            backgroundColor: 'rgba(101,101,101,0.4)',
        };

        const silverColor = {
            color: '#8ca0b4',
        }

        const goldColor = {
            color: 'gold',
        }

        const buyButton = {
            flex: '4',
            backgroundImage: 'url(' + buyNowImage + ')',
            //backgroundColor: 'magenta',
            backgroundPosition: 'center center',
            width: '100%',
            height: '100%',
            textAlign: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            padding: '12px',
            cursor: 'pointer',
            color: 'white',
            fontSize: '16px'
        };

        const disabledBuyButton = {
            flex: '4',
            backgroundImage: 'url(' + buyNowImage + ')',
            //backgroundColor: 'magenta',
            backgroundPosition: 'center center',
            width: '100%',
            height: '100%',
            textAlign: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            padding: '5px',
            cursor: 'pointer'
        };

        const arrowButton = {
            cursor: 'pointer',
            WebkitUserSelect: 'none', /* Chrome all / Safari all */
            MozUserSelect: 'none', /* Firefox all */
            msUserSelect: 'none', /* IE 10+ */
            userSelect: 'none',
            width: '24px',
            height: '23px',
        };

        const upArrowButton = {
            ...arrowButton,
            backgroundImage: 'url(' + upArrow + ')',
            backgroundSize: 'contain'
        }

        const downArrowButton = {
            ...arrowButton,
            backgroundImage: 'url(' + downArrow + ')',
            backgroundSize: 'contain'
        }

        const referralPointsPrices = {
            '0': 20,
            '1': 80,
            '2': 200,
        }

        const {
            handleConfirmBuy, saleState, userBalance, windowWidth, currentUserId, provider, accountExists,
            handleShowSignInBox, chestValue
        } = this.props;
        const {referrer, currentTime, smallScreen} = this.state;

        const price = (type, amount) => {
            const index = {
                'Silver Geode': '0',
                'Rotund Silver Geode': '1',
                'Goldish Silver Geode': '2'
            }[type];
            return {
                'ether': (saleState[index].currentPrice * amount).toFixed(5),
                'points': (referralPointsPrices[index] * amount)
            }
        }
        console.log('SALE STATE PROP:', saleState);

        const saleStarted = saleState['3'] && saleState['3'].saleStart * 1000 <= Math.round(new Date().getTime());
        const timeLeftInHours = t => Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const timeLeftInMinutes = t => Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        const timeLeftInDays = t => Math.floor(t / (1000 * 60 * 60 * 24));

        let saleValue = saleState['3'] && (20 - timeLeftInDays(currentTime - saleState['3'].saleStart * 1000));
        if (saleValue < 0) saleValue = 0;
        if (saleValue > 20) saleValue = 20;

        return (
          <div className="bg-off-black white" data-testid="market-page"
               style={{paddingTop: '0px', padding: '0 20px 20px'}}>
              {this.state.proceedBuy ?
                <div style={fixedOverlayStyle}
                     onClick={() => this.setState({proceedBuy: false})}>
                    <ConfirmBuyPopup type={this.state.proceedBuyType} amount={this.state.proceedBuyAmount}
                                     price={price(this.state.proceedBuyType, this.state.proceedBuyAmount)}
                                     referrer={referrer}
                                     refPointsAvailable={userBalance.referralPoints}
                                     handleConfirmBuy={handleConfirmBuy} hidePopup={() => {
                        this.setState({proceedBuy: false})
                    }}/>
                </div> : ""
              }
              <div style={{display: 'flex', flexWrap: 'wrap-reverse'}}>
                  <div style={{flex: '3', paddingTop: '20px', minWidth: '300px', display: 'flex',
                      flexWrap: 'wrap', alignItems:'center', justifyContent:'center'}}>
                      <div style={{maxWidth:'420px', alignSelf: 'flex-end'}}>
                          <div style={{
                              display: 'flex',
                              alignItems: 'flex-end',
                              flexWrap: 'wrap'
                          }}>
                              <img src={foundersChest} style={{
                                  flex: '3',
                                  minWidth: '125px',
                                  maxWidth: '175px',
                                  marginLeft: '-10px',
                                  marginRight: '16px'
                              }}/>
                              <div style={{
                                  minWidth: '180px',
                                  flex: '4',
                                  paddingBottom: '12px',
                                  fontSize: '18px',
                                  fontWeight: 'bold'
                              }}>
                                  <div style={{color: '#ff00ce'}}>{chestValue} ETH</div>
                                  <div>In Founder's Chest</div>
                              </div>
                          </div>
                          <div><span style={{color: '#ff00ce'}}>5%</span> of all sales go to the Founder's Chest!</div>
                      </div>
                      <div style={{
                          fontSize: '14px',
                          color: 'rgb(140, 160, 180)',
                          marginTop: '10px',
                          maxWidth: '500px',
                          alignSelf: 'flex-start'
                      }}>Don’t worry if you do not have any Founder’s Plots.
                          Yes, they are the only way to find Founder’s
                          Keys, which are the only thing that can open the
                          Founder’s Chest. But you will be able
                          to buy keys or even Founder’s Plots
                          From other players in the market
                          once mining starts!
                      </div>
                      {/*<CountdownTimer message={<span style={{fontSize: '20px'}}>Sale started!</span>}*/}
                      {/*deadline={saleState['3'].saleStart}/>*/}
                      <p></p>
                      {/*{saleState['3'] ?*/}
                      {/*<CountdownTimer message={'Lower prices before'}*/}
                      {/*deadline={saleState['3'].nextPriceTimestamp}/> : ""*/}
                      {/*}*/}
                  </div>
                  <div style={{flex: '10'}}>
                      <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          flexWrap: windowWidth < 900 ? 'wrap' : 'nowrap'
                      }}>
                          <div style={windowWidth < 900 ? {
                                ...geodeBlockStyle, ...smallScreenGeode,
                                backgroundColor: '#2f353c'
                            }
                            : {...geodeBlockStyle, backgroundColor: '#2f353c'}}>
                              <p style={{marginBottom: '0.5em', fontSize: '24px'}}>Silver Geode</p>
                              <img src={smallSilver} alt='geode image'
                                   style={{maxHeight: '155px', marginBottom: '5px'}}/>
                              <p>{saleState['0'].currentPrice} ETH {/*or {referralPointsPrices['0']} referral
                               points*/}</p>
                              <p style={{flexGrow: '1'}}>20-30 <span style={silverColor}> Silver </span> pieces</p>
                              <p>{saleState['0'].boxesAvailable}/500 Left</p>
                              <div style={{...buyArea, backgroundColor: '#24292f'}}>
                                  <div style={chosenCounter}>
                                      {this.state.silverGeodeChosen}
                                  </div>
                                  <div style={arrows}>
                                      <div style={upArrowButton}
                                           onClick={() => {
                                               this.setState({
                                                   silverGeodeChosen: this.state.silverGeodeChosen + 1
                                               })
                                           }}
                                      >
                                      </div>
                                      <div style={downArrowButton}
                                           onClick={() => {
                                               this.setState({
                                                   silverGeodeChosen: this.state.silverGeodeChosen > 1 ? this.state.silverGeodeChosen - 1 : 1
                                               })
                                           }}
                                      >
                                      </div>
                                  </div>
                                  {(saleStarted || !saleStarted) ?
                                    <div style={buyButton} onClick={() => {
                                        if (provider && accountExists) {
                                            this.setState({
                                                proceedBuy: true,
                                                proceedBuyType: 'Silver Geode',
                                                proceedBuyAmount: this.state.silverGeodeChosen
                                            });
                                        } else {
                                            handleShowSignInBox();
                                        }
                                    }}>BUY NOW
                                    </div> :
                                    <div style={disabledBuyButton}>BUY NOW</div>
                                  }
                              </div>
                          </div>
                          <div style={windowWidth < 900 ? {
                                ...geodeBlockStyle, ...smallScreenGeode,
                                backgroundColor: '#2f353c'
                            }
                            : {...geodeBlockStyle}}>
                              <p style={{marginBottom: '0.5em', fontSize: '24px'}}>Rotund Silver Geode</p>
                              <img src={rotundSilver} alt='geode image'
                                   style={{maxHeight: '165px', marginBottom: '5px'}}/>
                              <p>{saleState['1'].currentPrice} ETH {/*or {referralPointsPrices['1']} referral
                               points*/}</p>
                              <p style={{flexGrow: '1'}}>70-90 <span style={silverColor}> Silver </span> pieces</p>
                              <p>{saleState['1'].boxesAvailable}/300 Left</p>
                              <div style={{...buyArea, backgroundColor: '#2f353c'}}>
                                  <div style={chosenCounter}>
                                      {this.state.rotundGeodeChosen}
                                  </div>
                                  <div style={arrows}>
                                      <div style={upArrowButton}
                                           onClick={() => {
                                               this.setState({
                                                   rotundGeodeChosen: this.state.rotundGeodeChosen + 1
                                               })
                                           }}
                                      >
                                      </div>
                                      <div style={downArrowButton}
                                           onClick={() => {
                                               this.setState({
                                                   rotundGeodeChosen: this.state.rotundGeodeChosen > 1 ? this.state.rotundGeodeChosen - 1 : 1
                                               })
                                           }}
                                      >
                                      </div>
                                  </div>
                                  {(saleStarted || !saleStarted) ?
                                    <div style={buyButton} onClick={() => {
                                        if (provider && accountExists) {
                                            this.setState({
                                                proceedBuy: true,
                                                proceedBuyType: 'Rotund Silver Geode',
                                                proceedBuyAmount: this.state.rotundGeodeChosen
                                            });
                                        } else {
                                            handleShowSignInBox();
                                        }
                                    }}>BUY NOW
                                    </div> :
                                    <div style={disabledBuyButton}>BUY NOW</div>
                                  }
                              </div>
                          </div>
                          <div style={windowWidth < 900 ? {
                                ...geodeBlockStyle, ...smallScreenGeode,
                                backgroundColor: '#2f353c'
                            }
                            : {...geodeBlockStyle, backgroundColor: '#2f353c'}}>
                              <p style={{marginBottom: '0.5em', fontSize: '24px'}}><span
                                style={goldColor}>Goldish</span> Silver Geode</p>
                              <img src={goldishSilver} alt='geode image'
                                   style={{maxHeight: '165px', marginBottom: '5px'}}/>
                              <p>{saleState['2'].currentPrice} ETH {/*or {referralPointsPrices['2']} referral
                               points*/}</p>
                              <div>100-200 <span style={silverColor}> Silver </span> pieces</div>
                              <div style={goldColor}>0-1 Gold pieces*</div>
                              <p style={{flexGrow: '1', fontSize: '14px'}}><span style={goldColor}>42%</span> chance of
                                  finding <span style={goldColor}>Gold</span></p>
                              <p>{saleState['2'].boxesAvailable}/<span style={goldColor}>150 Left</span></p>
                              <div style={{...buyArea, backgroundColor: '#24292f'}}>
                                  <div style={chosenCounter}>
                                      {this.state.goldishGeodeChosen}
                                  </div>
                                  <div style={arrows}>
                                      <div style={upArrowButton}
                                           onClick={() => {
                                               this.setState({
                                                   goldishGeodeChosen: this.state.goldishGeodeChosen + 1
                                               })
                                           }}
                                      >
                                      </div>
                                      <div style={downArrowButton}
                                           onClick={() => {
                                               this.setState({
                                                   goldishGeodeChosen: this.state.goldishGeodeChosen > 1 ? this.state.goldishGeodeChosen - 1 : 1
                                               })
                                           }}
                                      >
                                      </div>
                                  </div>
                                  {(saleStarted || !saleStarted) ?
                                    <div style={buyButton} onClick={() => {
                                        if (provider && accountExists) {
                                            this.setState({
                                                proceedBuy: true,
                                                proceedBuyType: 'Goldish Silver Geode',
                                                proceedBuyAmount: this.state.goldishGeodeChosen
                                            });
                                        } else {
                                            handleShowSignInBox();
                                        }
                                    }}>BUY NOW
                                    </div> :
                                    <div style={disabledBuyButton}>BUY NOW</div>
                                  }
                              </div>
                          </div>
                      </div>
                  </div>
                  <div style={{flex: '1', minWidth: '260px'}}>
                      <div className="flex aic row tc jce flex-wrap-reverse"
                           style={{paddingLeft: '15px', paddingTop: '50px'}}>
                          {currentUserId &&
                          <div className="pr4">
                              <CopyToClipboard
                                text={"https://game.cryptominerworld.com/S_and_G_Sale?refId=" + currentUserId}
                                onCopy={() => this.setState({copied: true})}>
                                  <span
                                    style={{cursor: 'pointer', textDecoration: 'underline'}}>Copy referral link</span>
                              </CopyToClipboard>{this.state.copied ?
                            <span style={{color: 'magenta'}}> copied!</span> : ""}
                          </div>
                          }
                          {currentUserId &&
                          <div className="flex jce flex-wrap" style={{maxWidth: '280px'}}>
                              <div className="flex col tc">
                                  <img src={Gold} alt="Gold" className="h3 w-auto ph3"/>
                                  {userBalance && userBalance.goldAvailable}
                              </div>
                              <div className="flex col tc">
                                  <img src={Silver} alt="Silver" className="h3 w-auto ph3"/>
                                  {userBalance && userBalance.silverAvailable}
                              </div>
                              <div className="pr4">
                                  {!userBalance ? (
                                    <p data-testid="loadingReferralPoints" className="tr o-50 white">
                                        Loading Referral Points...
                                    </p>
                                  ) : (
                                    <small data-testid="referralPoints" className="tr fr o-50 white">
                                        {`${userBalance.referralPoints} REFERRAL ${
                                          userBalance.referralPoints === 1 ? 'POINT' : 'POINTS'
                                          } AVAILABLE `}
                                    </small>
                                  )}
                              </div>
                          </div>}

                          {saleState['3'] ?
                            saleState['3'].saleStart * 1000 > Math.round(new Date().getTime()) ?
                              <CountdownTimer message={'Sale starts on'} deadline={saleState['3'].saleStart}/> : ""
                            : ""
                          }
                      </div>
                  </div>
              </div>
              <div style={{
                  backgroundColor: '#383f45',
                  borderTop: '4px solid #be007d',
                  position: 'absolute', width: '100%',
                  marginTop: '0px', left: 0,
                  textAlign: 'center', fontWeight: 'bold',
                  color: '#a9acaf', fontSize: '20px', padding: '5px 0px 20px 0px',
              }}>
                  {(saleState['3'] && saleValue > 0) ?
                    <div>Prices currently
                        <span style={{fontSize: '40px', color: '#ff00ce'}}> {saleValue}%</span>
                        <span style={{fontSize: '40px'}}> OFF!!!</span>
                    </div> : ""}
                  {(saleState['3'] && saleValue > 0) ?
                    <div>Sale changing to <span style={{fontSize: '20px', color: '#ff00ce'}}> {saleValue - 1}% </span>
                        in <span style={{
                            fontSize: '20px',
                            color: '#ff00ce'
                        }}>{timeLeftInHours(saleState['3'].nextPriceTimestamp * 1000 - currentTime) + (saleStarted ? 0 : 24)}</span>
                        <span style={{fontSize: '16px', color: '#ff00ce'}}>hrs</span>{' & '}
                        <span style={{
                            fontSize: '20px',
                            color: '#ff00ce'
                        }}>{timeLeftInMinutes(saleState['3'].nextPriceTimestamp * 1000 - currentTime)}</span>
                        <span style={{fontSize: '16px', color: '#ff00ce'}}>mins</span>
                    </div>
                    : ""}
              </div>
              <div style={{display: 'flex', paddingTop: '150px'}}>
                  <div style={{order: '1', flex: '3'}}></div>
                  <div style={{order: '3', flex: '3'}}></div>
                  <div style={{order: '2', flex: '5', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <p>The Referral Point System rewards the person that referred, 2 points for every 1 point awarded
                          to
                          the
                          person that was referred. Here is the break down of how points are earned and what someone can
                          get
                          with said referral points!</p>
                      <img src={tableReferralPoints}/>
                      {/*<p style={{borderTop: '2px solid #ea3e34', width: '100%'}}></p>*/}
                      <h1 style={{color: 'white'}}>
                          What is this Silver and Gold Sale about?
                      </h1>
                      <div style={{display: 'flex', flexWrap: 'wrap'}}>
                          <div style={{flex: '6', minWidth: '300px', paddingTop: '20px', paddingRight: '20px'}}>
                              <p>It is a way for you to get your hands on some Silver and Gold, of course! The right
                                  question
                                  to ask is, “What is Silver and Gold?” Silver and Gold are items in CryptoMiner World
                                  used
                                  to
                                  increase the level and the grade of your gems, respectfully. The higher the level the
                                  deeper
                                  your Gem can mine. The higher the grade the faster it can do that mining! The best
                                  loot is
                                  furthest down so you will really want to level up you Gems to max level (Level 5)</p>
                              <p>The Sale will run until every Geode has been sold. The 20% discount will decrease 1%
                                  every
                                  24 hours until the Geodes prices are no longer discounted.</p>
                          </div>
                          <div style={{minWidth: '200px', flex: '4'}}>
                              <img src={gemEating}/>
                          </div>
                      </div>
                      <p style={{marginTop: '5px'}}>
                          Here is a list of the amount of Silver needed for each Gem’s level up.
                      </p>
                      <img src={tableSilverAmounts}/>
                      <p style={{marginTop: '10px'}}>
                          This is how much Gold you need to increase each Gem’s grade.
                      </p>
                      <img src={tableGoldAmounts}/>
                      <div style={{display: 'flex', marginTop: '15px', flexWrap: 'wrap'}}>
                          <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              flex: '4'
                          }}><img src={getLoot} style={{flex: '4', minWidth: '200px'}}/></div>
                          <div style={{flex: '6', minWidth: '300px', paddingTop: '20px', paddingLeft: '20px'}}>
                              <p>Once your Gems can start mining your Gems will be able to find silver and gold as they
                                  mine.
                                  But before that, this sale is the only way to get some of these shiny things! Silver
                                  will
                                  be
                                  relatively common find for your mining Gems, on average you will get 200 Silver after
                                  fully
                                  mining 5 Plots of Land. Gold on the other hand, will be quite rare! On average, one
                                  piece
                                  of
                                  Gold will be found in every 60 Plots of land!
                              </p>
                              <p>Here are the current drop rates of Silver and Gold. These numbers are subject to change
                                  as
                                  a result of playtesting while we are in development.</p>
                          </div>
                      </div>
                      <img src={tableSilverGoldDropRates}/>
                  </div>
              </div>
          </div>
        )
    }
}

const actions = {
    handleConfirmBuy: buyGeode,
    handleGetBoxesAvailable: getBoxesAvailableData,
    handleUpdateSaleState: updateSaleState,
    handleGetSaleState: getSaleState,
    handleGetUserBalance: getUserBalance,
    handleGetChestValue: getChestValue,
    handleShowSignInBox: () => ({type: 'SHOW_SIGN_IN_BOX'}),
};

export default compose(
  withRouter,
  connect(
    select,
    actions,
  ),
  lifecycle({
      componentDidMount() {
      },
  }),
)(windowSize(Sale));


export const subscribeOnSaleEvent = () => {

}


export const ConfirmBuyPopup = ({type, amount, price, refPoints, refPointsAvailable, referrer, handleConfirmBuy, hidePopup}) => {

    const confirmButton1 = {
        //position: 'absolute',
        //bottom: '20px',
        //left: '0',
        //right: '0',
        //margin: 'auto',
        width: '182px',
        height: '53px',
        textAlign: 'center',
        padding: '12px 0px',
        backgroundImage: 'url(' + buyNowImage + ')',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer',
        color: 'white',
        fontWeight: 'bold',
        marginTop: '7px',
        marginBottom: '7px',
        fontSize: '16px'
    }

    const confirmButton2 = {
        //position: 'absolute',
        //bottom: '20px',
        //left: '250px',
        //right: '0',
        //margin: 'auto',
        width: '182px',
        height: '53px',
        textAlign: 'center',
        padding: '12px 0px',
        backgroundImage: 'url(' + buyNowImage + ')',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer',
        color: 'white',
        fontWeight: 'bold',
        marginTop: '7px',
        fontSize: '16px'
    }


    return (
      <div
        onClick={(e) => {
            e.stopPropagation();
        }}
        style={{
            display: 'flex', height: '20rem', width: '35%', maxWidth: '50rem', backgroundColor: 'rgb(105,105,105)',
            margin: 'auto', flexDirection: 'column', position: 'relative',
            cursor: 'default', color: 'white', fontWeight: 'bold'
        }}>
          <div>
              <p style={{
                  margin: '5px 0',
                  borderBottom: '2px solid #ff00ce',
                  fontSize: '24px',
                  textAlign: 'center'
              }}>{type}</p>
          </div>
          <div style={{display: 'flex', flex: '1'}}>
              <div style={{
                  flex: '1',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
              }}>
                  {type === 'Silver Geode' ? <img src={smallSilver} style={{width: '80%'}}/> : ""}
                  {type === 'Rotund Silver Geode' ? <img src={rotundSilver} style={{width: '80%'}}/> : ""}
                  {type === 'Goldish Silver Geode' ? <img src={goldishSilver} style={{width: '80%'}}/> : ""}
              </div>
              <div style={{
                  flex: 1,
                  fontSize: '18px',
                  paddingTop: '10px'
              }}>
                  <p>Count: {amount}</p>
                  <p style={{margin: '0'}}>Total ETH: {price.ether}</p>
                  <div
                    style={confirmButton1}
                    onClick={(e) => {
                        handleConfirmBuy(type, amount, price.ether, 0, referrer, hidePopup);
                    }}
                  >
                      BUY WITH ETH
                  </div>
                  {referrer ? referrer.startsWith('0x') ? <p style={{fontSize: '12px'}}> Referrer: {referrer}</p> :
                    <div style={{
                        fontSize: '14px',
                        lineHeight: '100%'
                    }}>Account not eligible to use Referral codes.
                        Account can give Referral code to others.</div> : ""}
                  {refPointsAvailable >= price.points ?
                    <p style={{margin: '10px 0 0'}}>Referral points: {price.points}</p> : ""}
                  {refPointsAvailable >= price.points ?
                    <div style={confirmButton2}
                         onClick={(e) => {
                             if (refPointsAvailable < price.points) return;
                             handleConfirmBuy(type, amount, 0, price.points, referrer, hidePopup);
                         }}
                    >
                        BUY WITH POINTS
                    </div> : ""}
              </div>
          </div>
      </div>
    )
};

