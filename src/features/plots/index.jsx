import React, {Component} from "react";
import PlotDisplay from "./components/PlotDisplay";
import UnprocessedItemsDisplay from "./components/UnprocessedItemsDisplay";

class PlotDashboard extends Component {

    componentDidMount() {
        const {} = this.props;
    }

    componentDidUpdate(prevProps) {
        const {} = this.props;
    }

    render() {
        const {userGems, userPlots, userCountryIdList, userId, data} = this.props;

        console.warn("USER PLOTS::", userPlots);
        console.warn("USER GEMS::", userGems);

        return (
          <div className="plots" style={{padding: "20px 0px 30px 0"}}>
              <PlotDisplay userId={this.props.userId} goToGemWorkshop={this.props.goToGemWorkshop}/>
              {/*<UnprocessedItemsDisplay/>*/}
          </div>
        );
    }
}

export default PlotDashboard;
