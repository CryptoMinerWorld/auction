import React, {Component} from "react";

class PlotBar extends Component {

    state = {};

    componentDidMount() {
        const {} = this.props;
        this.setState({windowWidth: window.innerWidth});
    }

    componentDidUpdate(prevProps) {
        const {} = this.props;
    }

    calculateEmptiedPercentage(plot, tier) {
        //plot.layerEndPercentages[tier]
    }

    render() {
        const {plot} = this.props;
        const barHeight = (this.state.windowWidth && this.state.windowWidth < 560) ? 300 : 450;

        return (
          <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              height: barHeight,
              paddingTop: "20px",
              marginTop: "5px"
          }}>
              <Hat/>
              <Layer tier={0}
                     height={plot.layerPercentages["0"] * barHeight / 100}
                //heightFilled={plot.}
              />
              <Layer tier={1} height={plot.layerPercentages["1"] * barHeight / 100}/>
              <Layer tier={2} height={plot.layerPercentages["2"] * barHeight / 100}/>
              <Layer tier={3} height={plot.layerPercentages["3"] * barHeight / 100}/>
              <Layer tier={4} height={plot.layerPercentages["4"] * barHeight / 100}/>
              {plot.gemMines && <CurrentLevel topOffset={plot.currentPercentage * barHeight / 100}/>}
              {plot.gemMines && <CurrentGemUsed topOffset={0} image={plot.gemMines.image}/>}
          </div>

        );
    }
}

const CurrentGemUsed = ({topOffset, image}) => {

    const imageStyle = {
        width: "74px",
        height: "74px",
        position: "absolute",
        top: topOffset + "px",
        backgroundColor: "#7a7a7a",
        border: "4px solid black",
        left: "-7px",
        zIndex: "10",
    }

    return (
      <div style={imageStyle}>
          <img src={image}/>
      </div>
    )
}

const CurrentLevel = ({topOffset}) => {

    const arrowStyle = {
        width: "80px",
        height: "10px",
        position: "absolute",
        left: "-10px",
        top: topOffset + 20 + "px",
        zIndex: "10"
    }

    const faceRightStyle = {
        transform: "skew(0deg, -10deg)",
        width: "40px",
        height: "10px",
        backgroundColor: "#820906",
        float: "left"
    }

    const faceLeftStyle = {
        transform: "skew(0deg, 10deg)",
        width: "40px",
        height: "10px",
        backgroundColor: "#820906",
        float: "left"
    }

    return (
      <div className="prism" style={arrowStyle}>
          <div className="face-left" style={faceLeftStyle}></div>
          <div className="face-right" style={faceRightStyle}></div>
      </div>
    );
}


const Hat = () => {

    const hatStyle = {
        width: "44px",
        height: "44px",
        backgroundColor: "#664330",
        //backgroundColor: "#A5DB68",
        transform: "rotateX(79deg) rotateZ(45deg)",
        position: "absolute",
        top: "-5px",
        left: "8px",
    }

    return (
      <div className="hat" style={hatStyle}>
      </div>
    );
}

const Layer = ({tier, height}) => {

    //console.log("Height:", height);

    let backgroundColorLeft, backgroundColorRight;
    switch (tier) {
        case 0:
            backgroundColorLeft = "#492F1D";
            backgroundColorRight = "#563621";
            break;
        case 1:
            backgroundColorLeft = "#492518";
            backgroundColorRight = "#592E21";
            break;
        case 2:
            backgroundColorLeft = "#49484F";
            backgroundColorRight = "#525256";
            break;
        case 3:
            backgroundColorLeft = "#CEC9BE";
            backgroundColorRight = "#E2DED3";
            break;
        case 4:
            backgroundColorLeft = "#191515";
            backgroundColorRight = "#281E1E";
            break;
    }

    const faceRightStyle = {
        transform: "skew(0deg, -10deg)",
        width: "30px",
        height: Math.ceil(height) + "px",
        backgroundColor: backgroundColorRight,
        float: "left",
        position: "relative",

    }

    const faceLeftStyle = {
        transform: "skew(0deg, 10deg)",
        width: "30px",
        height: Math.ceil(height) + "px",
        backgroundColor: backgroundColorLeft,
        float: "left",
        position: "relative",
        zIndex: "5",
    }

    const faceLeftTopEdgeStyle = {
        position: "absolute",
        width: "100%",
        height: "10px",
        backgroundColor: backgroundColorLeft,
        top: "-9px",
        clipPath: "polygon(0% 79%, 21% 18%, 28% 66%, 38% 34%, 58% 48%, 53% 64%, 69% 52%, 77% 26%, 99% 57%, 100% 97%, 0% 100%)",
        WebkitClipPath: "polygon(0% 79%, 21% 18%, 28% 66%, 38% 34%, 58% 48%, 53% 64%, 69% 52%, 77% 26%, 99% 57%, 100% 97%, 0% 100%)"
    }

    const faceRightEdgeStyle = {
        position: "absolute",
        width: "100%",
        height: "10px",
        backgroundColor: backgroundColorRight,
        top: "-9px",
        clipPath: "polygon(0% 79%, 21% 18%, 28% 66%, 38% 34%, 58% 48%, 53% 64%, 69% 52%, 77% 26%, 99% 57%, 100% 97%, 0% 100%)",
        WebkitClipPath: "polygon(0% 79%, 21% 18%, 28% 66%, 38% 34%, 58% 48%, 53% 64%, 69% 52%, 77% 26%, 99% 57%, 100% 97%, 0% 100%)"
    }

    const faceLeftSideEdgeStyle = {
        position: "absolute",
        width: "6px",
        height: "100%",
        backgroundColor: backgroundColorLeft,
        right: "-3px",
        top: "-1px",
        clipPath: "polygon(1% 0%, 78% 12%, 45% 22%, 84% 27%, 68% 33%, 85% 38%, 100% 49%, 84% 55%, 62% 63%, 37% 76%, 71% 83%, 1% 92%, 67% 100%, 0% 100%)",
        WebkitClipPath: "polygon(1% 0%, 78% 12%, 45% 22%, 84% 27%, 68% 33%, 85% 38%, 100% 49%, 84% 55%, 62% 63%, 37% 76%, 71% 83%, 1% 92%, 67% 100%, 0% 100%)"
    }

    const prismStyle = {
        //position: "absolute",
        //top: "33px"
    }

    return (
      <div className="prism" style={prismStyle}>
          <div className="face-left" style={faceLeftStyle}>
              {tier !== 0 ? <div style={faceLeftTopEdgeStyle}></div> : ""}
              <div style={faceLeftSideEdgeStyle}></div>
          </div>
          <div className="face-right" style={faceRightStyle}>
              {tier !== 0 ? <div style={faceRightEdgeStyle}></div> : ""}
          </div>
      </div>
    );
}


export default PlotBar;
