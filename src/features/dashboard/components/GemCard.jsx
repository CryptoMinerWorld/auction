import React, {Component} from "react";
import PropTypes from 'prop-types';
import Progress from 'antd/lib/progress';
import Tilt from 'react-tilt';
import { calculatePercentage } from '../../market/helpers';
import MiniGemBox from '../../../components/MiniGemBox';
import { calculateGemName } from '../helpers';
import Loading from "../../../components/Loading";
import {getGemImage} from "../../../app/services/GemService";
require('antd/lib/progress/style/css');

const transitionRules = {
    //transitionDelay: 'display 2s'
}

class Cards extends Component {

    state = {
        gemImage: this.props.auction.image
    }

    async componentDidMount() {
        const {auction} = this.props;
        if (!this.state.gemImage) {
            const image = await getGemImage({
                color: auction.color,
                level: auction.level,
                gradeType: auction.gradeType,
                gradeValue: auction.gradeValue
            }, auction.id);
            this.props.auction.image = image;
            this.setState({gemImage: image});
        }
    }

    render() {

        const {auction} = this.props;
        const {gemImage} = this.state;

        return (
          <Tilt className="Tilt" options={{max: 20, scale: 1}}>
              <div
                className="bg-off-black shadow-3 white"
                style={{
                    WebkitClipPath:
                      'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
                    clipPath:
                      'polygon(100.23% 96.54%, 95.12% 99.87%, 8.69% 100.01%, 1.21% 98.76%, -0.22% 92.82%, 0.03% 2.74%, 4.31% -0.23%, 92.22% -0.24%, 98.41% 1.33%, 100.1% 5.29%)',
                }}
              >
                  <figure className="ma0 pa0">
                      <div className="w-100" style={{position: 'relative', display: 'block', paddingTop: '100%'}}>
                          <div style={{
                              position: 'absolute',
                              top: 0,
                              bottom: 0,
                              left: 0,
                              right: 0,
                          }}>
                              {gemImage ?
                                <img src={gemImage} alt="" className="ma0 pa3 pb0"/> : ""}
                              <Loading hidden={gemImage}/>
                          </div>
                      </div>
                      <figcaption hidden>{auction.quality}</figcaption>
                  </figure>
                  <Progress
                    strokeLinecap="square"
                    percent={calculatePercentage(auction.minPrice, auction.maxPrice, auction.currentPrice)}
                    status="active"
                    showInfo={false}
                    strokeColor="#ffc584"
                    className="o-50"
                  />
                  <div className="tc">
                      <big className="db b f3">{calculateGemName(auction.color, auction.id)}</big>
                  </div>
                  <div className="flex pa3 pb0 w-100 jcc">
                      <MiniGemBox level={auction.level} grade={auction.gradeType} rate={auction.rate} restingEnergy={auction.restingEnergy} market/>
                  </div>
              </div>
          </Tilt>
        )
    }
}

export default Cards;
