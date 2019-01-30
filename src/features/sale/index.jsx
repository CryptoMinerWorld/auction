import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose, lifecycle} from 'recompose';
import Gold from '../../app/images/dashboard/Gold.png';
import Silver from '../../app/images/dashboard/Silver.png';


const select = store => ({
    buyGoldContract: store.app.buyGoldContractInstance,
    buySilverContract: store.app.buySilverContractInstance,
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
    };

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
            backgroundColor: 'magenta',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            padding: '5px',
            cursor: 'pointer'
        };

        const arrowButton = {
            cursor: 'pointer',
          '-webkit-user-select': 'none',  /* Chrome all / Safari all */
        '-moz-user-select': 'none',     /* Firefox all */
        '-ms-user-select': 'none',    /* IE 10+ */
        'user-select': 'none',
        };


        return (
          <div className="bg-off-black white pa4 " data-testid="market-page">
              {this.state.proceedBuy ?
                <div style = {fixedOverlayStyle}
                     onClick={() => this.setState({proceedBuy: false})}>
                    <ConfirmBuyPopup type={this.state.proceedBuyType} amount={this.state.proceedBuyAmount}/>
                </div> : ""
              }
              <div style={{display: 'flex', justifyContent: 'center'}}>
                  <div style={geodeBlockStyle}>
                      <p>Silver Geode</p>
                      <img src={Silver} alt='geode image' style={{width: '10em'}}/>
                      <p>0.1 ETH</p>
                      <p>20-30 Silver pieces</p>
                      <p>62/500 Left</p>
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
                              >▲</div>
                              <div style={arrowButton}
                                   onClick={() => {
                                       this.setState({
                                           silverGeodeChosen: this.state.silverGeodeChosen > 1 ? this.state.silverGeodeChosen - 1 : 1
                                       })
                                   }}
                              >▼</div>
                          </div>
                          <div style={buyButton} onClick={() => {
                              this.setState({
                                  proceedBuy: true,
                                  proceedBuyType: 'Silver Geode',
                                  proceedBuyAmount: this.state.silverGeodeChosen});
                          }}>BUY NOW
                          </div>
                      </div>
                  </div>
                  <div style={{...geodeBlockStyle, borderLeft: '1px solid grey', borderRight: '1px solid grey'}}>
                      <p>Rotund Silver Geode</p>
                      <img src={Silver} alt='geode image' style={{width: '10em'}}/>
                      <p>0.3 ETH</p>
                      <p>70-90 Silver pieces</p>
                      <p>62/300 Left</p>
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
                              >▲</div>
                              <div style={arrowButton}
                                   onClick={() => {
                                       this.setState({
                                           rotundGeodeChosen: this.state.rotundGeodeChosen > 1 ? this.state.rotundGeodeChosen - 1 : 1
                                       })
                                   }}
                              >▼</div>
                          </div>
                          <div style={buyButton} onClick={() => {
                              this.setState({
                                  proceedBuy: true,
                                  proceedBuyType: 'Rotund Silver Geode',
                                  proceedBuyAmount: this.state.rotundGeodeChosen});
                          }}>BUY NOW
                          </div>
                      </div>
                  </div>
                  <div style={geodeBlockStyle}>
                      <p>Goldish Silver Geode</p>
                      <img src={Gold} alt='geode image' style={{width: '10em'}}/>
                      <p>0.8 ETH</p>
                      <p>100-200 Silver pieces</p>
                      <p>0-1 Gold pieces*</p>
                      <p>23/150 Left</p>
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
                              >▲</div>
                              <div style={arrowButton}
                                   onClick={() => {
                                       this.setState({
                                           goldishGeodeChosen: this.state.goldishGeodeChosen > 1 ? this.state.goldishGeodeChosen - 1 : 1
                                       })
                                   }}
                              >▼</div>
                          </div>
                          <div style={buyButton} onClick={() => {
                              this.setState({
                                  proceedBuy: true,
                                  proceedBuyType: 'Goldish Silver Geode',
                                  proceedBuyAmount: this.state.goldishGeodeChosen});
                          }}>BUY NOW
                          </div>
                      </div>
                  </div>
              </div>

          </div>
        )
    }
}


const actions = {};

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


export const ConfirmBuyPopup = ({type, amount}) => {

    const confirmButton = {
        position: 'absolute',
        bottom: '20px',
        left: '0',
        right: '0',
        margin: 'auto',
        width: '200px',
        textAlign: 'center',
        padding: '10px 0px',
        backgroundColor: 'magenta',
        cursor: 'pointer'
    }

    return (
      <div
        onClick={(e) => {
            e.stopPropagation();
        }}
        style={{display: 'flex', height: '20rem', width: '35%', maxWidth: '50rem', backgroundColor: '#eeeeee',
          margin: 'auto', flexDirection: 'column', position: 'relative',
          cursor: 'default', color: 'black'
      }}>
          <p>Item: {type}</p>
          <p>Count: {amount}</p>
          <p>Total ETH: {price(type, amount)}</p>
          <div style={confirmButton}>
              CONFIRM
          </div>
      </div>
    )
};

const price = (type, amount) => {
    const prices = {
        'Silver Geode' : 0.1,
        'Rotund Silver Geode' : 0.3,
        'Goldish Silver Geode' : 0.8
    }
    return (prices[type] * amount * discount(type, amount)).toFixed(1);
}

const discount = (type, amount) => (1);