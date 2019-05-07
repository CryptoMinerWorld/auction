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
import Slider from "react-slick";
import {compose} from "redux";
import connect from "react-redux/es/connect/connect";
import {GemSelectionPopup} from "./GemSelectionPopup";

// import "../../../app/css/slick.min.css";
// import "../../../app/css/slick-theme.min.css";

const select = store => {
    return {
        plots: store.plots.userPlots,
    }
}

const sliderSettings = {
    dots: true,
    speed: 500,
    arrows: true,
    infinite: false,
    slidesToShow: 10,
    slidesToScroll: 3,
    responsive: [
        {
            breakpoint: 4000,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 20,
                slidesToScroll: 10,
            }
        },
        {
            breakpoint: 3800,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 15,
                slidesToScroll: 6,
            }
        },
        {
            breakpoint: 2500,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 13,
                slidesToScroll: 5,
            }
        },
        {
            breakpoint: 2300,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 12,
                slidesToScroll: 5,
            }
        },
        {
            breakpoint: 2100,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 11,
                slidesToScroll: 4,
            }
        },
        {
            breakpoint: 1900,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 10,
                slidesToScroll: 3,
            }
        },
        {
            breakpoint: 1740,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 10,
                slidesToScroll: 3,
            }
        },
        {
            breakpoint: 1680,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 9,
                slidesToScroll: 3,
            }
        },
        {
            breakpoint: 1520,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 8,
                slidesToScroll: 3,
            }
        },
        {
            breakpoint: 1360,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 7,
                slidesToScroll: 3,
            }
        },
        {
            breakpoint: 1200,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 6,
                slidesToScroll: 2,
            }
        },
        {
            breakpoint: 1040,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 5,
                slidesToScroll: 2,
            }
        },
        {
            breakpoint: 880,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 4,
                slidesToScroll: 2,
            }
        },
        {
            breakpoint: 740,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 3,
                slidesToScroll: 2,
            }
        },
        {
            breakpoint: 600,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 3,
                slidesToScroll: 1,
            }
        },
        {
            breakpoint: 440,
            settings: {
                dots: true,
                speed: 500,
                infinite: false,
                arrows: true,
                slidesToShow: 2,
                slidesToScroll: 1,
            }
        }
    ]
};


class PlotDisplay extends Component {

    state = {
        sortOption: "time_left",
        sortOptionDirection: "sort_btn_down",
        filterOptions: ["show_gem_mining", "show_not_mining", "show_no_gem"],
        filteredPlots: [],
        showSidebarPopup: false,
        showSidebarFilters: false,
    }

    componentDidMount() {
        this.setState({
            currentTime: new Date().getTime(),
            filteredPlots: this.props.plots || [],
        });
        const {} = this.props;
    }

    componentDidUpdate(prevProps) {
        const {plots} = this.props;
        if (plots !== prevProps.plots) {
            this.setState({
                currentTime: new Date().getTime(),
                filteredPlots: this.props.plots || [],
            });
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
        let sortDirection;
        let sortBy;
        if (sortOption === "sort_btn_up" || sortOption === "sort_btn_down") {
            sortDirection = sortOption;
            sortBy = this.state.sortOption;
        }
        else {
            sortDirection = this.state.sortOptionDirection;
            sortBy = sortOption;
        }
        if (sortBy === this.state.sortOption && sortDirection === this.state.sortOptionDirection)
            return;
        this.setState({sortOption: sortBy, sortOptionDirection: sortDirection}, () => {
            this.sortFiltered();
        });
    };

    sortFiltered(filteredPlotsOptional) {

        let plots = filteredPlotsOptional || [...this.state.filteredPlots];
        let sortingFunction;
        const directionFlag = this.state.sortOptionDirection === "sort_btn_up" ? 1 : -1;
        switch (this.state.sortOption) {
            case "mined":
                sortingFunction = (p1, p2) => p1.currentPercentage - p2.currentPercentage;
                break;
            case "time_left":
                sortingFunction = (p1, p2) => p1.deadline - p2.deadline;
                break;
            case "dirt":
                sortingFunction = (p1, p2) => p1.layerPercentages["0"] - p2.layerPercentages["0"];
                break;
            case "clay":
                sortingFunction = (p1, p2) => p1.layerPercentages["1"] - p2.layerPercentages["1"];
                break;
            case "limestone":
                sortingFunction = (p1, p2) => p1.layerPercentages["2"] - p2.layerPercentages["2"];
                break;
            case "marble":
                sortingFunction = (p1, p2) => p1.layerPercentages["3"] - p2.layerPercentages["3"];
                break;
            case "obsidian":
                sortingFunction = (p1, p2) => p1.layerPercentages["4"] - p2.layerPercentages["4"];
                break;
        }

        plots.sort((p1, p2) => {
            console.log("sort: ", p1, " vs ", p2);
            return directionFlag * sortingFunction(p1, p2);
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
                    case "dirt_filter":
                        if (plot.gemMines && plot.currentPercentage <= plot.layerEndPercentages[0]) filterPassed = true;
                        break;
                    case "clay_filter":
                        if (plot.gemMines && plot.currentPercentage < plot.layerEndPercentages[1] && plot.currentPercentage >= plot.layerEndPercentages[0]) filterPassed = true;
                        break;
                    case "limestone_filter":
                        if (plot.gemMines && plot.currentPercentage <= plot.layerEndPercentages[2] && plot.currentPercentage >= plot.layerEndPercentages[1]) filterPassed = true;
                        break;
                    case "marble_filter":
                        if (plot.gemMines && plot.currentPercentage <= plot.layerEndPercentages[3] && plot.currentPercentage >= plot.layerEndPercentages[2]) filterPassed = true;
                        break;
                    case "obsidian_filter":
                        if (plot.gemMines && plot.currentPercentage <= plot.layerEndPercentages[4] && plot.currentPercentage >= plot.layerEndPercentages[3]) filterPassed = true;
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

        if (!plot.gemMines) {
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
        console.log("State: ", this.state);
        console.log("Props: ", this.props);
        const {sortOption, sortOptionDirection, sortTier, sortTierDirection, filterOptions, filteredPlots} = this.state;
        const startStopButton = {

        }

        const PlotBarContainer = styled.div`
            padding: 10px 0px 70px;
            width: 130px !important;
            min-width: 130px;
            max-width: 130px;
            display: flex !important;
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

        const miningStatus = {
            color: "white",
            fontSize: "18px",
        }

        const SliderWrapper = styled.div`
            @media(min-width: 600px) {
                max-height: 640px;
                width: calc(100% - 185px);
                padding-left: 20px;
            }
            
            @media(max-width: 599px) {
                width: 100%;
                padding: 0 20px;
            }
        `;

        return (
          <div style={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "flex-end",
              position: "relative"
          }}>
              <SliderWrapper>
                  <Slider {...sliderSettings}>
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
                  </Slider>
              </SliderWrapper>
              <PlotSidebar
                showSidebarPopup={(type) => this.showSidebarPopup(type)}
                nextPage={() => {
                }}
                prevPage={() => {
                }}
              />
              {/*{this.state.showSidebarFilters ?*/}
                {/*<PlotFilter*/}
                  {/*activeControls={[].concat(sortOption, sortOptionDirection, sortTier, sortTierDirection, filterOptions)}*/}
                  {/*closeCallback={() => this.setState({showSidebarFilter: false})}*/}
                {/*/> : ""}*/}
              <SidebarPopup type={this.state.showSidebarPopup}
                            activeControls={[].concat(sortOption, sortOptionDirection, filterOptions)}
                            applySort={(sortOption) => {
                                this.applySortOption(sortOption)
                            }}
                            applyFilter={(filterOption) => this.applyFilterOption(filterOption)}
                            userGems={this.props.userGems}
                            closeCallback={() => this.setState({showSidebarPopup: false})}/>
          </div>
        );
    }
}

export default compose(
  connect(
    select,
    {}
  )
)(PlotDisplay);