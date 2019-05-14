import {getGemImage} from "../app/services/GemService";
import React, {Component} from "react";
import Loading from "./Loading";

class GemImage extends Component {

    state = {
        gemImage: this.props.gem.image
    }

    async componentDidMount() {
        const {gem} = this.props;
        if (!this.state.gemImage) {
            const image = await getGemImage({
                color: gem.color,
                level: gem.level,
                gradeType: gem.gradeType,
                gradeValue: gem.gradeValue
            }, gem.id);
            this.props.gem.image = image;
            this.setState({gemImage: image});
        }
    }

    render() {
        return <>
            {this.state.gemImage &&
            <img src={this.state.gemImage} alt="" className=""/>}
            <Loading hidden={this.state.gemImage}/>
        </>
    }
}

export default GemImage;