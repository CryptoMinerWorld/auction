import React, {Component} from "react";
import PlotDisplay from "./components/PlotDisplay";
import UnprocessedItemsDisplay from "./components/UnprocessedItemsDisplay";
import Loading from "../../components/Loading";

class PlotDashboard extends Component {

    componentDidMount() {
        const {} = this.props;
    }

    componentDidUpdate(prevProps) {
        const {} = this.props;
    }

    render() {
        const {userGems, dataLoaded, userPlots, userCountryIdList, userId, data} = this.props;

        return (
          <div className="plots" style={{padding: "20px 0px 30px 0"}}>
              {
                  dataLoaded && userPlots ? (
                    userPlots.length > 0 ?
                      (
                        <PlotDisplay userId={this.props.userId} goToGemWorkshop={this.props.goToGemWorkshop}/>
                      ) :
                        (
                          <div style={{textAlign: 'center'}}>No plots found</div>
                        )
                  ) :
                    (
                      <div style={{width: '100%', height: "100px", position: 'relative'}}>
                          <div style={{textAlign: 'center'}}>Plots are loading..</div>
                          <Loading/>
                      </div>
                    )
              }
          </div>
        );
    }
}

export default PlotDashboard;
