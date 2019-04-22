import React, {Component} from "react";
import PlotBar from "./PlotBar";
import buyNowImage from "../../../app/images/pinkBuyNowButton.png";
import PlotSidebar from "./PlotSidebar";
import SidebarPopup from "./SidebarPopup";
import styled from "styled-components";
import plotUpgradeButton from "../../../app/images/upgradeButton.png";
import plotStartButton from "../../../app/images/startButton.png";
import plotStopButton from "../../../app/images/stopButton.png";
import plotFinishButton from "../../../app/images/finishButton.png";

class PlotDisplay extends Component {

    state = {
        sortOption: "time_left",
        sortOptionDirection: "sort_btn_down",
        sortTier: "clay",
        sortTierDirection: "tier_btn_down",
        filterOptions: ["show_gem_mining", "show_not_mining", "show_no_gem"],
        filteredPlots: [],
        showSidebarPopup: false,
        showSidebarFilters: false,
    }

    componentDidMount() {
        this.setState({
            currentTime: new Date().getTime(),
            filteredPlots: this.props.plots
        });
        const {} = this.props;
    }

    componentDidUpdate(prevProps) {
        const {plots} = this.props;
        if (plots !== prevProps.plots) {
        }
    }

    applyFilterOption = (filterOption) => {
        this.setState({
            filterOptions: this.state.filterOptions.includes(filterOption) ? this.state.filterOptions.filter(e => e !== filterOption) : this.state.filterOptions.concat(filterOption)
        }, () => {
            this.applyAllFilters();
        });
    };

    applySortOption = (sortOption) => {
        this.setState({sortOption}, () => {
            this.sortFiltered();
        });
    };

    sortFiltered(filteredPlotsOptional) {

        let plots = filteredPlotsOptional || [...this.state.filteredPlots];
        let sortingFunction;

        switch (this.state.sortOption) {
            case "mined":
                sortingFunction = (p1, p2) => p1.currentPercentage - p2.currentPercentage;
                break;
            case "time_left":
                sortingFunction = (p1, p2) => p1.deadline - p2.deadline;
                break;
        }

        plots.sort((p1, p2) => {
            console.log("sort: ", p1, " vs ", p2);
            return sortingFunction(p1, p2);
        });

        this.setState({filteredPlots: plots});
    }

    applyAllFilters() {
        let plots = this.props.plots.filter((plot) => {
            let filterPassed = false;
            this.state.filterOptions.forEach((option) => {
                switch (option) {
                    case "show_gem_mining":
                        if (plot.gemMines) filterPassed = true;
                        break;
                    case "show_not_mining":
                        if (!plot.gemMines) filterPassed = true;
                        break;
                    case "show_no_gem":
                        break;
                    case "show_completed":
                        break;
                    case "dirt":
                        if (plot.gemMines && plot.currentPercentage <= plot.layerPercentages[0]) filterPassed = true;
                        break;
                    case "clay":
                        if (plot.gemMines && plot.currentPercentage <= plot.layerPercentages[1]) filterPassed = true;
                        break;
                    case "limestone":
                        if (plot.gemMines && plot.currentPercentage <= plot.layerPercentages[2]) filterPassed = true;
                        break;
                    case "marble":
                        if (plot.gemMines && plot.currentPercentage <= plot.layerPercentages[3]) filterPassed = true;
                        break;
                    case "obsidian":
                        if (plot.gemMines && plot.currentPercentage <= plot.layerPercentages[4]) filterPassed = true;
                        break;
                }
            });
            return filterPassed;
        });
        this.sortFiltered(plots);
    }

    calculateMiningStatus(plot) {
        const timeLeftInHours = t => Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const timeLeftInMinutes = t => Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        const timeLeftInDays = t => Math.floor(t / (1000 * 60 * 60 * 24));

        if (plot.deadline === 0) {
            return "Not Mining";
        }

        const timeLeft = plot.deadline * 1000 - this.state.currentTime;
        if (timeLeft < 0) {
            return "Finished!";
        }

        const hoursLeft = timeLeftInHours(timeLeft);
        const minutesLeft = timeLeftInMinutes(timeLeft);
        const daysLeft = timeLeftInDays(timeLeft);

        return daysLeft + "d " + hoursLeft + "h";
    }

    calculateAllowedPlotAction(plot) {
        switch (this.calculateMiningStatus(plot)) {
            case "Can't Mine":
                return "UPGRADE";
            case "Finished!":
                return "STOP";
            case "Not Mining":
                return "START";
            default:
                return "STOP";
        }
    }

    showSidebarPopup = (type) => {
        this.setState({showSidebarPopup: type})
    }

    showSidebarFilters = () => {
        this.setState({showSidebarFilters: true})
    }

    static generateRandomClipPath() {

        const rand = Math.floor(Math.random() * 3);

        return (
          [
              "-webkit-clip-path: polygon(0% 5%,11% 1%,35% 0%,68% 0%,90% 1%,100% 8%,99% 97%,81% 100%,22% 100%,5% 99%,0%" +
              " 95%);" + "\n" +
              "clip-path: polygon(0% 5%,11% 1%,35% 0%,68% 0%,90% 1%,100% 8%,99% 97%,81% 100%,22% 100%,5% 99%,0% 95%);",

              "-webkit-clip-path: polygon(0% 4%,21% 1%,45% 0%,88% 0%,99% 9%,100% 95%,88% 100%,32% 100%,8% 98%,0% 95%);" + "\n" +
              "clip-path: polygon(0% 4%,21% 1%,45% 0%,88% 0%,99% 9%,100% 95%,88% 100%,32% 100%,8% 98%,0% 95%);",

              "-webkit-clip-path: polygon(1% 5%,3% 2%,19% 0%,82% 0%,95% 3%,100% 10%,99% 92%,97% 98%,88% 100%,14% 100%,0%" +
              " 98%);" + "\n" +
              "clip-path: polygon(1% 5%,3% 2%,19% 0%,82% 0%,95% 3%,100% 10%,99% 92%,97% 98%,88% 100%,14% 100%,0% 98%);",

          ][rand]
        );
    }

    render() {

        const PlotBarContainer = styled.div`
            padding: 10px 0px 70px;
            width: 130px;
            min-width: 130px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: ${props => {
            switch (this.calculateMiningStatus(props.plot)) {
                case "Can't Mine":
                    return "#70575A";
                case "Finished!":
                    return "#655872";
                case "Not Mining":
                    return "#4B6653";
                default:
                    return "#536373";
            }
        }}
            margin: 0px 10px;
            max-height: 620px;
            ${props => PlotDisplay.generateRandomClipPath()}
        `;

        const PlotActionButton = styled.div`
            width: 85px;
            height: 32px;
            text-align: center;
            padding: 6px 0px;         
            background-position: center center;
            background-size: cover;
            background-repeat: no-repeat;
            cursor: pointer;
            color: white;
            font-weight: bold;
            margin-top: 40px;
            margin-bottom: 7px;
            font-size: 13px;
            background-image: ${props => {
                switch (this.calculateMiningStatus(props.plot)) {
                    case "Can't Mine":
                        return 'url(' + plotUpgradeButton + ')';
                    case "Finished!":
                        return 'url(' + plotFinishButton + ')';
                    case "Not Mining":
                        return 'url(' + plotStartButton + ')';
                    default:
                        return 'url(' + plotStopButton + ')';
            }}}
        `;

        console.log("State: ", this.state);
        const {filteredPlots} = this.state;
        const {sortOption, sortOptionDirection, sortTier, sortTierDirection, filterOptions} = this.state;
        const startStopButton = {

        }

        const miningStatus = {
            color: "white",
            fontSize: "18px",
        }

        return (
          <div style={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "flex-end",
              position: "relative"
          }}>
              <div style={{display: "flex", overflowX: "scroll", maxHeight: "640px"}}>
                  {filteredPlots.map(plot =>
                    <PlotBarContainer key={plot.plotId} plot={plot}>
                        <div style = {miningStatus}>{this.calculateMiningStatus(plot)}</div>
                        <div style = {miningStatus}>{plot.currentPercentage}%</div>
                        <PlotBar plot={{...plot, timeLeft: plot.deadline * 1000 - this.state.currentTime}}/>
                        <PlotActionButton plot={plot} onClick={() => this.showSidebarPopup("gem-selection")}>
                            {this.calculateAllowedPlotAction(plot)}
                            </PlotActionButton>
                    </PlotBarContainer>
                  )}
              </div>
              <PlotSidebar
                activeControls={[].concat(sortOption, sortOptionDirection, sortTier, sortTierDirection, filterOptions)}
                showSidebarPopup={(type) => this.showSidebarPopup(type)}
                showSidebarFilters={() => this.showSidebarFilters()}
                nextPage={() => {
                }}
                prevPage={() => {
                }}
              />
              {/*{this.state.showSidebarFilters ?*/}
                {/*<PlotFilter*/}
                  {/*activeControls={[].concat(sortOption, sortOptionDirection, sortTier, sortTierDirection, filterOptions)}*/}
                  {/*applySort={(sortOption) => {*/}
                      {/*this.applySortOption(sortOption)*/}
                  {/*}}*/}
                  {/*applyFilter={(filterOption) => this.applyFilterOption(filterOption)}*/}
                  {/*closeCallback={() => this.setState({showSidebarFilter: false})}*/}
                {/*/> : ""}*/}
              <SidebarPopup type={this.state.showSidebarPopup}
                            userGems={this.props.userGems}
                            closeCallback={() => this.setState({showSidebarPopup: false})}/>
          </div>
        );
    }
}

export default PlotDisplay;
