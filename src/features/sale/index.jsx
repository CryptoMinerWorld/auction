import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose, lifecycle} from 'recompose';
import Gold from '../../app/images/dashboard/Gold.png';
import Silver from '../../app/images/dashboard/Silver.png';
import buyNowImage from "../../app/images/pinkBuyNowButton.png";
import {buyGeode, getBoxesAvailableData, getGeodesData} from "./saleActions";
import {Link} from "react-router-dom";


const select = store => ({
    silverGoldService: store.app.silverGoldServiceInstance,
    currentUserId: store.auth.currentUserId,
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
        boxesPrices: []
    };

    async componentDidMount() {
        const {handleGetBoxesAvailable, silverGoldService, currentUserId} = this.props;

        if (silverGoldService && currentUserId) {
            const boxesAvailable = await handleGetBoxesAvailable();
            const goldAvailable = await silverGoldService.getAvailableGold(currentUserId);
            const silverAvailable = await silverGoldService.getAvailableSilver(currentUserId);
            this.setState({...boxesAvailable, goldAvailable, silverAvailable});
        }
    }

    async componentDidUpdate(prevProps) {
        const {handleGetBoxesAvailable, silverGoldService, currentUserId} = this.props;

        console.log('11111 PROPS: ', this.props);
        console.log('22222 PROPS: ', prevProps);
        if (silverGoldService && currentUserId && (prevProps.silverGoldService !== silverGoldService || currentUserId !== prevProps.currentUserId)) {
            const boxesAvailable = await handleGetBoxesAvailable();
            const goldAvailable = await silverGoldService.getAvailableGold(currentUserId);
            const silverAvailable = await silverGoldService.getAvailableSilver(currentUserId);
            this.setState({...boxesAvailable, goldAvailable, silverAvailable});
            //console.log('state:', this.state);
        }
    }

    render() {
        const geodeBlockStyle = {
            maxWidth: '20em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px 3em',
            minWidth: '350px'
        };
        const buyArea = {
            display: 'flex',
            width: '100%',
            alignItems: 'center',
        };

        const arrows = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            flex: '1',
            fontSize: '20px'
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
        };

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
            padding: '5px',
            cursor: 'pointer'
        };

        const arrowButton = {
            cursor: 'pointer',
            WebkitUserSelect: 'none', /* Chrome all / Safari all */
            MozUserSelect: 'none', /* Firefox all */
            msUserSelect: 'none', /* IE 10+ */
            userSelect: 'none',
        };

        const {handleConfirmBuy} = this.props;
        const {boxesPrices, boxesAvailable, goldAvailable, silverAvailable} = this.state;

        const price = (type, amount) => {
            const index = {
                'Silver Geode': 0,
                'Rotund Silver Geode': 1,
                'Goldish Silver Geode': 2
            }[type];
            return (this.state.boxesPrices[index] * amount).toFixed(5);
        }


        return (
          <div className="bg-off-black white pa4 " data-testid="market-page">
              {this.state.proceedBuy ?
                <div style={fixedOverlayStyle}
                     onClick={() => this.setState({proceedBuy: false})}>
                    <ConfirmBuyPopup type={this.state.proceedBuyType} amount={this.state.proceedBuyAmount}
                                     price = {price(this.state.proceedBuyType, this.state.proceedBuyAmount)}
                                     handleConfirmBuy={handleConfirmBuy} hidePopup={() => {this.setState({proceedBuy: false})}}/>
                </div> : ""
              }
              <div style={{display: 'flex'}}>
                  <div style={{flex:'1'}}></div>
                  <div style={{flex:'3'}}>
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                          <div style={geodeBlockStyle}>
                              <p>Silver Geode</p>
                              <img src={Silver} alt='geode image' style={{width: '10em'}}/>
                              <p>{boxesPrices[0]} ETH</p>
                              <p>20-30 Silver pieces</p>
                              <p>{boxesAvailable[0]}/500 Left</p>
                              <div style={buyArea}>
                                  <div style={{
                                      flex: '1',
                                      fontSize: '24px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                  }}>
                                      {this.state.silverGeodeChosen}
                                  </div>
                                  <div style={arrows}>
                                      <div style={arrowButton}
                                           onClick={() => {
                                               this.setState({
                                                   silverGeodeChosen: this.state.silverGeodeChosen + 1
                                               })
                                           }}
                                      >▲
                                      </div>
                                      <div style={arrowButton}
                                           onClick={() => {
                                               this.setState({
                                                   silverGeodeChosen: this.state.silverGeodeChosen > 1 ? this.state.silverGeodeChosen - 1 : 1
                                               })
                                           }}
                                      >▼
                                      </div>
                                  </div>
                                  <div style={buyButton} onClick={() => {
                                      this.setState({
                                          proceedBuy: true,
                                          proceedBuyType: 'Silver Geode',
                                          proceedBuyAmount: this.state.silverGeodeChosen
                                      });
                                  }}>BUY NOW
                                  </div>
                              </div>
                          </div>
                          <div style={{...geodeBlockStyle, borderLeft: '1px solid grey', borderRight: '1px solid grey'}}>
                              <p>Rotund Silver Geode</p>
                              <img src={Silver} alt='geode image' style={{width: '10em'}}/>
                              <p>{boxesPrices[1]} ETH</p>
                              <p>70-90 Silver pieces</p>
                              <p>{boxesAvailable[1]}/300 Left</p>
                              <div style={buyArea}>
                                  <div style={{
                                      flex: '1',
                                      fontSize: '24px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                  }}>
                                      {this.state.rotundGeodeChosen}
                                  </div>
                                  <div style={arrows}>
                                      <div style={arrowButton}
                                           onClick={() => {
                                               this.setState({
                                                   rotundGeodeChosen: this.state.rotundGeodeChosen + 1
                                               })
                                           }}
                                      >▲
                                      </div>
                                      <div style={arrowButton}
                                           onClick={() => {
                                               this.setState({
                                                   rotundGeodeChosen: this.state.rotundGeodeChosen > 1 ? this.state.rotundGeodeChosen - 1 : 1
                                               })
                                           }}
                                      >▼
                                      </div>
                                  </div>
                                  <div style={buyButton} onClick={() => {
                                      this.setState({
                                          proceedBuy: true,
                                          proceedBuyType: 'Rotund Silver Geode',
                                          proceedBuyAmount: this.state.rotundGeodeChosen
                                      });
                                  }}>BUY NOW
                                  </div>
                              </div>
                          </div>
                          <div style={geodeBlockStyle}>
                              <p>Goldish Silver Geode</p>
                              <img src={Gold} alt='geode image' style={{width: '10em'}}/>
                              <p>{boxesPrices[2]} ETH</p>
                              <p>100-200 Silver pieces</p>
                              <p>0-1 Gold pieces*</p>
                              <p>{boxesAvailable[2]}/150 Left</p>
                              <div style={buyArea}>
                                  <div style={{
                                      flex: '1',
                                      fontSize: '24px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                  }}>
                                      {this.state.goldishGeodeChosen}
                                  </div>
                                  <div style={arrows}>
                                      <div style={arrowButton}
                                           onClick={() => {
                                               this.setState({
                                                   goldishGeodeChosen: this.state.goldishGeodeChosen + 1
                                               })
                                           }}
                                      >▲
                                      </div>
                                      <div style={arrowButton}
                                           onClick={() => {
                                               this.setState({
                                                   goldishGeodeChosen: this.state.goldishGeodeChosen > 1 ? this.state.goldishGeodeChosen - 1 : 1
                                               })
                                           }}
                                      >▼
                                      </div>
                                  </div>
                                  <div style={buyButton} onClick={() => {
                                      this.setState({
                                          proceedBuy: true,
                                          proceedBuyType: 'Goldish Silver Geode',
                                          proceedBuyAmount: this.state.goldishGeodeChosen
                                      });
                                  }}>BUY NOW
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div style={{flex:'1'}}>
                      <div className="flex-ns dn col tc">
                          <div className="flex jcc">
                              <div className="flex col tc">
                                  <img src={Gold} alt="Gold" className="h3 w-auto ph3"/>
                                  {goldAvailable}
                              </div>
                              <div className="flex col tc">
                                  <img src={Silver} alt="Silver" className="h3 w-auto ph3"/>
                                  {silverAvailable}
                              </div>
                          </div>
                    </div>
                  </div>
              </div>

          </div>
        )
    }
}


const actions = {
    handleConfirmBuy: buyGeode,
    handleGetBoxesAvailable: getBoxesAvailableData,
};

export default compose(
  connect(
    select,
    actions,
  ),
  lifecycle({
      componentDidMount() {
      },
  }),
)(Sale);


export const ConfirmBuyPopup = ({type, amount, price, handleConfirmBuy, hidePopup}) => {

    const confirmButton = {
        position: 'absolute',
        bottom: '20px',
        left: '0',
        right: '0',
        margin: 'auto',
        width: '200px',
        textAlign: 'center',
        padding: '10px 0px',
        backgroundImage: 'url(' + buyNowImage + ')',
        backgroundPosition: 'center center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer',
        color: 'white',
        fontWeight: 'bold'
    }

    return (
      <div
        onClick={(e) => {
            e.stopPropagation();
        }}
        style={{
            display: 'flex', height: '20rem', width: '35%', maxWidth: '50rem', backgroundColor: '#eeeeee',
            margin: 'auto', flexDirection: 'column', position: 'relative',
            cursor: 'default', color: 'black'
        }}>
          <p>Item: {type}</p>
          <p>Count: {amount}</p>
          <p>Total ETH: {price}</p>
          <div
            style={confirmButton}
            onClick={(e) => {
                handleConfirmBuy(type, amount, price, 0, hidePopup);
            }}
          >
              CONFIRM
          </div>
      </div>
    )
};

