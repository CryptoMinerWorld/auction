import React, {Component} from "react";
import PropTypes from 'prop-types';
import Tilt from 'react-tilt';
import Loading from "../../../components/Loading";
import {getGemImage} from "../../../app/services/GemService";
import {CutEdgesButton} from "./CutEdgesButton";
import {
    gradeConverter,
    gradeOutlineColor,
    gradePaneColors,
    levelOutlineColor,
    levelPaneColors,
    mrbOutlineColor,
    mrbPaneColor,
    type,
    typePaneColors,
    typePaneOutlineColors
} from "./propertyPaneStyles";

const transitionRules = {
    //transitionDelay: 'display 2s'
}


class GemSelectionCard extends Component {

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
                }}>
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
                  <div className="flex w-100" style={{padding: "2px"}}>
                      <div style={{flex: 2, margin: "2px 3px", fontWeight: "normal"}}>
                          <CutEdgesButton outlineColor={gradeOutlineColor}
                                          backgroundColor={() => gradePaneColors(auction.gradeType)}
                                          edgeSizes={20}
                                          outlineWidth={1}
                                          height={32}
                                          fontSize={16}
                                          content={() => gradeConverter(auction.gradeType)}/>
                      </div>
                      <div style={{flex: 2, margin: "2px 3px", fontWeight: "normal"}}>
                          <CutEdgesButton outlineColor={levelOutlineColor}
                                          backgroundColor={() => levelPaneColors(auction.level)}
                                          edgeSizes={20}
                                          outlineWidth={1}
                                          height={32}
                                          fontSize={16}
                                          content={auction.level}/>
                      </div>
                      <div style={{flex: 2, margin: "2px 3px", fontWeight: "normal"}}>
                          <CutEdgesButton outlineColor={() => typePaneOutlineColors(auction.color)}
                                          backgroundColor={() => typePaneColors(auction.color)}
                                          edgeSizes={20}
                                          outlineWidth={1}
                                          height={32}
                                          fontSize={12}
                                          content={() => type(auction.color)}/>
                      </div>
                      <div style={{flex: 3, margin: "2px 3px", fontWeight: "normal"}}>
                          <CutEdgesButton outlineColor={mrbOutlineColor}
                                          backgroundColor={mrbPaneColor}
                                          edgeSizes={[15, 20]}
                                          outlineWidth={1}
                                          height={32}
                                          fontSize={11}
                                          content={auction.rate.toFixed(2) + "%"}/>
                      </div>
                  </div>
              </div>
          </Tilt>
        )
    }
}

GemSelectionCard.propTypes = {
    auction: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        minPrice: PropTypes.number,
        maxPrice: PropTypes.number,
        price: PropTypes.number,
        image: PropTypes.string,
        owner: PropTypes.string,
        grade: PropTypes.number,
        quality: PropTypes.number,
        rate: PropTypes.number,
    }).isRequired,
};

export default GemSelectionCard;
