import React from 'react';
import PropTypes from 'prop-types';
import Progress from 'antd/lib/progress';
import format from 'date-fns/format';
import Tilt from 'react-tilt';
import {calculatePercentage} from '../helpers';
import MiniGemBox from '../../../components/MiniGemBox';
import Loading from "../../../components/Loading";
import {getGemImage} from "../../../app/services/GemService";

require('antd/lib/progress/style/css');

class Cards extends React.Component {

    state = {
        gemImage: this.props.auction.image
    };

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
        const isSpecialGem = Number(auction.id) > 0xF100 && Number(auction.id) < 0xF200;

        return (
          <Tilt className="Tilt" options={{max: 20, scale: 1}}>
              <div
                className="bg-dark-gray shadow-3 white Tilt-inner"
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
                    strokeColor="#c214a7"
                    className="o-70"
                  />
                  <div className="flex jcb ph3">
                      <small className="basic">
                          Ξ
                          {' '}
                          <small>{auction.maxPrice.toFixed(3)}</small>
                      </small>
                      <big className="db b f3 o-70">
          <span className="basic" style={{color: '#FFB700'}}>
            Ξ
          </span>
                          {' '}
                          <span style={{color: '#FFB700'}}>{auction.currentPrice.toFixed(3)}</span>
                      </big>
                      <small className="basic">
                          Ξ
                          {' '}
                          <small>{auction.minPrice.toFixed(3)}</small>
                      </small>
                  </div>
                  <div className="tc">
                      <small>
                          Lowest price on
                          {auction.deadline && format(new Date(auction.deadline * 1000), ' do LLL')}
                      </small>
                  </div>

                  <div className="flex col pa3 pb0 w-100">
                      <MiniGemBox
                        level={auction.level}
                        grade={auction.gradeType}
                        rate={auction.rate}
                        baseRate={auction.baseRate}
                        restingEnergy={auction.restingEnergy}
                        market
                      />
                      {isSpecialGem ?
                        <div className="flex aic pl3 o-70 w-100">
                            <div className="db">
                                <p className="ma0 truncate mw5 mt3 mb3">{auction.name}</p>
                            </div>
                        </div>
                        :
                        <div className="flex aic o-70 pl3 mb2 w-100">
                            <img
                              src={auction.userImage}
                              alt={auction.userName}
                              className="h2 ma2"
                            />
                            <div className="db">
                                <p className="pl2 ma0 truncate mw5">{auction.userName}</p>
                            </div>
                        </div>
                      }
                  </div>
              </div>
          </Tilt>
        );

    }
}

Cards.propTypes = {
    auction: PropTypes.shape({
        id: PropTypes.number,
        minPrice: PropTypes.number,
        maxPrice: PropTypes.number,
        price: PropTypes.number,
        deadline: PropTypes.oneOfType([
            PropTypes.shape({
                seconds: PropTypes.number.isRequired,
            }).isRequired,
            PropTypes.number,
        ]).isRequired,
        image: PropTypes.string,
        owner: PropTypes.string,
        grade: PropTypes.number,
        quality: PropTypes.number,
        rate: PropTypes.number,
    }).isRequired,
};

export default Cards;
