import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose, lifecycle} from 'recompose';
import Gold from '../../app/images/dashboard/Gold.png';
import Silver from '../../app/images/dashboard/Silver.png';


const select = store => ({
    goldContract: store.app.goldContractInstance,
    silverContract: store.app.silverContractInstance,
});

class Sale extends Component {

    state = {
        silverGeodeChosen: 1,
        rotundGeodeChosen: 1,
        goldishGeodeChosen: 1,
        totalEth: 0
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
        const buyButton = {
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


        return (
          <div className="bg-off-black white pa4 " data-testid="market-page">
              <div style={{display: 'flex', justifyContent: 'center'}}>
                  <div style={geodeBlockStyle}>
                      <p>Silver Geode</p>
                      <img src={Silver} alt='geode image' style={{width: '10em'}}/>
                      <p>0.1 ETH</p>
                      <p>20-30 Silver pieces</p>
                      <p>62/500 Left</p>
                      <div style={buyButton}>
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
                              <div style={{cursor: 'pointer', userSelect: 'none'}}
                                   onClick={() => {
                                       this.setState({
                                           silverGeodeChosen: this.state.silverGeodeChosen + 1
                                       })
                                   }}
                              >▲</div>
                              <div style={{cursor: 'pointer', userSelect: 'none'}}
                                   onClick={() => {
                                       this.setState({
                                           silverGeodeChosen: this.state.silverGeodeChosen > 1 ? this.state.silverGeodeChosen - 1 : 1
                                       })
                                   }}
                              >▼</div>
                          </div>
                          <div style={{
                              flex: '4',
                              backgroundColor: 'magenta',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              padding: '5px',
                              cursor: 'pointer'
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
                      <div style={buyButton}>
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
                              <div style={{cursor: 'pointer', userSelect: 'none'}}
                                   onClick={() => {
                                       this.setState({
                                           rotundGeodeChosen: this.state.rotundGeodeChosen + 1
                                       })
                                   }}
                              >▲</div>
                              <div style={{cursor: 'pointer', userSelect: 'none'}}
                                   onClick={() => {
                                       this.setState({
                                           rotundGeodeChosen: this.state.rotundGeodeChosen > 1 ? this.state.rotundGeodeChosen - 1 : 1
                                       })
                                   }}
                              >▼</div>
                          </div>
                          <div style={{
                              flex: '4',
                              backgroundColor: 'magenta',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              padding: '5px',
                              cursor: 'pointer'
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
                      <div style={buyButton}>
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
                              <div style={{cursor: 'pointer', userSelect: 'none'}}
                                   onClick={() => {
                                       this.setState({
                                           goldishGeodeChosen: this.state.goldishGeodeChosen + 1
                                       })
                                   }}
                              >▲</div>
                              <div style={{cursor: 'pointer', userSelect: 'none'}}
                                   onClick={() => {
                                       this.setState({
                                           goldishGeodeChosen: this.state.goldishGeodeChosen > 1 ? this.state.goldishGeodeChosen - 1 : 1
                                       })
                                   }}
                              >▼</div>
                          </div>
                          <div style={{
                              flex: '4',
                              backgroundColor: 'magenta',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              padding: '5px',
                              cursor: 'pointer'
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
