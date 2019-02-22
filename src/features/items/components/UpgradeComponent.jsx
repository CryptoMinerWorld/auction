import React, {useState} from 'react';
import Icon from "antd/lib/icon";
import {handleUpgradeNow} from "../itemActions";
import silverUpgradePopup from "../../../app/images/sale/silverUpgradePopup.png";
import goldUpgradePopup from "../../../app/images/sale/goldUpgradePopup.png";
import buyNowImage from "../../../app/images/pinkBuyNowButton.png";

export default class UpgradeComponent extends React.Component {

    gradeConverter = gradeValue => ({
        1: 'D',
        2: 'C',
        3: 'B',
        4: 'A',
        5: 'AA',
        6: 'AAA',
        7: 'AAA'
    }[gradeValue]);

    price = (type, from, to) => {
        const levelSilverCumulativeCharges = {
            '1': 0,
            '2': 5,
            '3': 20,
            '4': 65,
            '5': 200,
        }; //0,5,15,45,135
        const gradeGoldCumulativeCharges = {
            '1': 0,
            '2': 1,
            '3': 3,
            '4': 7,
            '5': 15,
            '6': 31,
        } //0,1,2,4,8,16

        let cost = 0;
        switch(type) {
            case 'level':
                cost = levelSilverCumulativeCharges[to] - levelSilverCumulativeCharges[from];
                break;
            case 'grade':
                cost = to > 6 ? 16 * (to-from) : gradeGoldCumulativeCharges[to] - gradeGoldCumulativeCharges[from];
                break;
        }
        return cost;
    }

    constructor(props) {
        super(props);
        console.log('UPGRADE PROPS: ', props.gem);
        this.state = {
            cost: props.metal === 'silver' ?
              this.price('level', props.gem.level, props.gem.level + 1):
              this.price('grade', props.gem.gradeType, props.gem.gradeType + 1),
            total: props.metalAvailable,
            gradeType: props.metal === 'gold' ? props.gem.gradeType + 1 : props.gem.gradeType,
            level: props.metal === 'silver' ? props.gem.level + 1 : props.gem.level,
            initialGrade: props.gem.gradeType,
            initialLevel: props.gem.level,
            loading: false
        };
    }

    render() {
        const {metal, metalAvailable, handleUpgradeGem, gem, hidePopup} = this.props;
        const confirmButton = {
            position: 'absolute',
            bottom: '40px',
            left: '0',
            right: '30px',
            margin: 'auto',
            width: '200px',
            textAlign: 'center',
            padding: '16px 0px',
            //backgroundColor: this.state.cost <= this.state.total ? 'magenta' : 'grey',
            backgroundImage: 'url(' + buyNowImage + ')',
            backgroundSize: 'cover',
            cursor: 'pointer',
            color: 'white',
            fontWeight: 'bold',
        };

        const arrowButton = {
            fontSize: '70px',
            cursor: 'pointer',
            WebkitUserSelect: 'none',  /* Chrome all / Safari all */
            MozUserSelect: 'none',     /* Firefox all */
            MsUserSelect: 'none',    /* IE 10+ */
            userSelect: 'none',
            marginTop: '-20px',
        };

        //const [loading, setLoading] = useState(false);

        return (
              <div
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                style={{display: 'flex', maxWidth: '50rem',
                    backgroundImage: 'url('+ (metal === 'silver' ? silverUpgradePopup : goldUpgradePopup) +')',
                    backgroundSize: 'cover',
                    margin: 'auto', flexDirection: 'row', alignItems: 'stretch', position: 'relative',
                    cursor: 'default',
                    minWidth: '650px',
                    minHeight: metal === 'silver' ? '310px' : '352px',
                    padding: '10px 40px',
                }}>
                  <div style={{flex: '1', display: 'flex', justifyContent: 'flex-end', fontWeight: 'bold', alignItems: 'center'}}>
                      {metal === 'silver' ?
                        (<span style={{fontSize: '110px'}}>{this.state.level}</span>) : ""
                      }
                      {metal === 'gold' ?
                        (<div>
                            <span style={{fontSize: '75px'}}>{this.gradeConverter(this.state.gradeType)}</span>
                              {this.state.gradeType > 6 ? <p style={{fontSize: '14px'}}>Upgrades rate randomly</p> : ""}
                        </div>) : ""
                      }
                  </div>
                  <div style={{
                      flex: '1',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                  }}>
                      <div style={arrowButton}
                           onClick={() => {
                               switch (metal) {
                                   case 'silver':
                                       if (this.state.level < 5) {
                                           this.setState({
                                               level: this.state.level + 1,
                                               cost: this.price('level', this.state.initialLevel, this.state.level + 1)
                                           });
                                       }
                                       break;
                                   case 'gold':
                                       if (this.state.gradeType < 6) {
                                           this.setState({
                                               gradeType: this.state.gradeType + 1,
                                               cost: this.price('grade', this.state.initialGrade, this.state.gradeType + 1)});
                                       }
                                       break;
                               }
                           }}>
                          ▲
                      </div>
                      <div style={arrowButton}
                           onClick={() => {
                               switch (metal) {
                                   case 'silver':
                                       if (this.state.level > this.state.initialLevel + 1) {
                                           this.setState({
                                               level: this.state.level - 1,
                                               cost: this.price('level', this.state.initialLevel, this.state.level - 1)
                                           });
                                       }
                                       break;
                                   case 'gold':
                                       if (this.state.gradeType > this.state.initialGrade + 1) {
                                           this.setState({
                                               gradeType: this.state.gradeType - 1,
                                               cost: this.price('grade', this.state.initialGrade, this.state.gradeType - 1)
                                           });
                                       }
                                       break;
                               }
                           }}>▼</div>
                  </div>
                  <div style={{flex: '3', flexDirection: 'column', display: 'flex'}}>
                      <div style={{
                          flex: '1',
                          display: 'flex',
                          justifyContent: 'space-around',
                          alignItems: 'flex-end',
                          fontSize: '20px'
                      }}>
                          <span>COST ({metal})</span>
                          <span>TOTAL</span>
                      </div>
                      <div style={{
                          flex: '2',
                          display: 'flex',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                          fontSize: '30px'
                      }}>
                          <span>{this.state.cost}</span>
                          <span>/</span>
                          <span>{metalAvailable}</span>
                      </div>
                      <div style={{flex: '1'}}></div>
                  </div>
                  <div
                    style={confirmButton}
                    onClick={() => {
                        if (this.state.loading) {
                            return;
                        }
                        this.setState({loading: true});
                        const gradeUp = this.state.initialGrade < 6 ? this.state.gradeType - this.state.initialGrade : 0;
                        handleUpgradeGem(this.props.gem, this.state.level - this.state.initialLevel, gradeUp, hidePopup, this.state.cost);
                    }}
                  >
                      {this.state.loading && <Icon type="loading" theme="outlined" className="pr3" />
                          }
                      CONFIRM
                  </div>
              </div>

        );

    }
}