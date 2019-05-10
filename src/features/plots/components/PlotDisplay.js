import React, {Component} from "react";
import PlotBar from "./PlotBar";
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
import {releaseGem} from "../plotActions";
import {CANT_MINE, FINISHED, MINING, NOT_MINING} from "../../../app/services/PlotService";

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

const allTierFilterOptions = ["dirt_filter", "clay_filter", "limestone_filter", "marble_filter", "obsidian_filter"];
const allPlotFilterOptions = ["show_gem_mining", "show_not_mining", "show_no_gem", "show_completed"];
const defaultPlotFilterOptions = ["show_gem_mining", "show_not_mining", "show_no_gem", "show_completed"];
const defaultTierFilterOptions = [];
const defaultSortOption = "mined";

class PlotDisplay extends Component {

    state = {
        sortOption: defaultSortOption,
        sortOptionDirection: "sort_btn_down",
        plotFilterOptions: defaultPlotFilterOptions,
        tierFilterOptions: defaultTierFilterOptions,
        filteredPlots: [],
        showSidebarPopup: false,
        showSidebarFilters: false,
        sliderIndex: 0,
    }

    componentDidMount() {
        this.setState({
            currentTime: new Date().getTime(),
        });
        this.sortFiltered(this.props.plots || []);
        const {} = this.props;
    }

    componentDidUpdate(prevProps) {
        const {plots} = this.props;
        if (plots !== prevProps.plots) {
            this.setState({
                currentTime: new Date().getTime(),
            });
            this.sortFiltered(this.props.plots || []);
        }
    }

    applyFilterOption = (filterOption) => {
        if (allTierFilterOptions.includes(filterOption)) {
            this.setState({
                plotFilterOptions: this.state.tierFilterOptions.length === 0 ? allPlotFilterOptions : this.state.plotFilterOptions,
                tierFilterOptions: this.state.tierFilterOptions.includes(filterOption) ? this.state.tierFilterOptions.filter(e => e !== filterOption) : this.state.tierFilterOptions.concat(filterOption)
            }, () => {
                this.applyAllFilters();
            });
            return;
        }
        if (allPlotFilterOptions.includes(filterOption)) {
            this.setState({
                plotFilterOptions: this.state.plotFilterOptions.includes(filterOption) ? this.state.plotFilterOptions.filter(e => e !== filterOption) : this.state.plotFilterOptions.concat(filterOption)
            }, () => {
                this.applyAllFilters();
            });
        }
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
            return directionFlag * sortingFunction(p1, p2);
        });

        this.setState({filteredPlots: plots});
    }

    applyAllFilters() {
        let plots = this.props.plots.filter((plot) => {
            let filterPassed = false;

            this.state.tierFilterOptions.length > 0 && this.state.tierFilterOptions.forEach((option) => {
                switch (option) {
                    case "dirt_filter":
                        if (plot.currentPercentage <= plot.layerEndPercentages[0]) filterPassed = true;
                        break;
                    case "clay_filter":
                        if (plot.currentPercentage < plot.layerEndPercentages[1] && plot.currentPercentage >= plot.layerEndPercentages[0]) filterPassed = true;
                        break;
                    case "limestone_filter":
                        if (plot.currentPercentage <= plot.layerEndPercentages[2] && plot.currentPercentage >= plot.layerEndPercentages[1]) filterPassed = true;
                        break;
                    case "marble_filter":
                        if (plot.currentPercentage <= plot.layerEndPercentages[3] && plot.currentPercentage >= plot.layerEndPercentages[2]) filterPassed = true;
                        break;
                    case "obsidian_filter":
                        if (plot.currentPercentage <= plot.layerEndPercentages[4] && plot.currentPercentage >= plot.layerEndPercentages[3]) filterPassed = true;
                        break;
                }
            });

            if (filterPassed || this.state.tierFilterOptions.length === 0) {
                filterPassed = false;
                this.state.plotFilterOptions.forEach((option) => {
                    switch (option) {
                        case "show_gem_mining":
                            if (plot.miningState === MINING) filterPassed = true;
                            break;
                        case "show_not_mining":
                            if (plot.miningState === CANT_MINE) filterPassed = true;
                            break;
                        case "show_no_gem":
                            if (plot.miningState === NOT_MINING) filterPassed = true;
                            break;
                        case "show_completed":
                            if (plot.miningState === FINISHED) filterPassed = true;
                            break;
                        default:
                            filterPassed = false;
                    }
                })
            }
            return filterPassed;
        });
        this.sortFiltered(plots);
    }

    calculateAllowedPlotAction(plot) {
        switch (plot.miningState) {
            case CANT_MINE:
                return "upgrade";
            case FINISHED:
                return "stop";
            case NOT_MINING:
                return "start";
            case MINING:
                return "stop";
        }
    }

    handleActionButtonClick = (action, plotId) => {
        switch (action) {
            case "start":
                break;
            case "stop":
                this.props.handleReleaseGem(plotId, () => this.setState({showSidebarPopup: false}));
                break;
            case "upgrade":
        }
        this.showSidebarPopup("plot-action-" + action)
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
        //console.log("State: ", this.state);
        //console.log("Props: ", this.props);
        const {sortOption, sortOptionDirection, tierFilterOptions, plotFilterOptions, filteredPlots, plotSelected, sliderIndex} = this.state;
        const {handleBindGem} = this.props;
        const startStopButton = {}

        return (
          <div style={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "flex-end",
              position: "relative"
          }}>
              <SliderWrapper>
                  <Slider ref={slider => (this.slider = slider)}
                          {...sliderSettings}
                          initialSlide={sliderIndex}
                    //beforeChange = {(current, next) => this.setState({ sliderIndex: next })}
                          afterChange={(index) => this.setState({sliderIndex: index})}
                  >
                      {filteredPlots.map(plot => {
                            const plotAction = this.calculateAllowedPlotAction(plot);
                            return (
                              <PlotBarContainer key={plot.id} plot={plot}
                                                selected={plotSelected && plotSelected.id === plot.id}
                                                clipPath={PlotDisplay.generateRandomClipPath()}
                                                onClick={() => {
                                                    this.setState({plotSelected: plotSelected && plotSelected.id === plot.id ? null : plot});
                                                }}>
                                  <div style={miningStatus}>{plot.miningState}</div>
                                  <div style={miningStatus}>{plot.currentPercentage}%</div>
                                  <PlotBar plot={{...plot, timeLeft: plot.deadline * 1000 - this.state.currentTime}}/>
                                  <PlotActionButton
                                    plot={plot}
                                    inactive={plotSelected && plot.id !== plotSelected.id}
                                    onClick={() => {
                                        this.handleActionButtonClick(plotAction, plot.id)
                                    }}>
                                      {plotAction.toUpperCase()}
                                  </PlotActionButton>
                              </PlotBarContainer>
                            )
                        }
                      )}
                  </Slider>
              </SliderWrapper>
              <PlotSidebar
                showSidebarPopup={(type) => this.showSidebarPopup(type)}
                plotSelected={plotSelected}
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
                            activeControls={[].concat(sortOption, sortOptionDirection, plotFilterOptions, tierFilterOptions)}
                            applySort={(sortOption) => {
                                this.applySortOption(sortOption)
                            }}
                            applyFilter={(filterOption) => this.applyFilterOption(filterOption)}
                            selectedPlotId={plotSelected && plotSelected.id}
                            closeCallback={() => this.setState({showSidebarPopup: false})}
                            filterDefault={() => {
                                this.setState({
                                    plotFilterOptions: defaultPlotFilterOptions,
                                    tierFilterOptions: defaultTierFilterOptions
                                }, () => this.applyAllFilters());

                            }}

              />
          </div>
        );
    }
}

export default compose(
  connect(
    select,
    {
        handleReleaseGem: releaseGem,
    }
  )
)(PlotDisplay);

const PlotBarContainer = styled.div`
            padding: 10px 0px 70px;
            position: relative;
            width: 130px !important;
            min-width: 130px;
            max-width: 130px;
            display: flex !important;
            flex-direction: column;
            align-items: center;
            background-color: ${props => {
    switch (props.plot.miningState) {
        case CANT_MINE:
            return props.selected ? "#EFB1B2" : "#70575A";
        case FINISHED:
            return props.selected ? "#b9a3c9" : "#655872";
        case NOT_MINING:
            return props.selected ? "#6daf7a" : "#4B6653";
        default:
            return props.selected ? "#98c0d6" : "#536373";
    }
}}
            margin: 0px 10px;
            max-height: 620px;
            z-index: 2;
            cursor: pointer;
            ${props => props.clipPath};
            
            ${props => props.selected &&
  `&:after {
                    position: absolute;
                    z-index: 1;
                    width: 136px;
                    height: 100%;
                    left: -3px;
                    background-color: ${props => {
      switch (props.plot.miningState) {
          case CANT_MINE:
              return "#E12D2C";
          case FINISHED:
              return "#655872";
          case NOT_MINING:
              return "#4B6653";
          case MINING:
              return "#536373";
          default:
              return "#536373";
      }
  }}  
                ${props => props.clipPath}; 
                }`
  }
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
            opacity: ${props => props.inactive ? "0.6" : "1"};
            background-image: ${props => {
    switch (props.plot.miningState) {
        case CANT_MINE:
            return 'url(' + plotUpgradeButton + ')';
        case FINISHED:
            return 'url(' + plotFinishButton + ')';
        case NOT_MINING:
            return 'url(' + plotStartButton + ')';
        default:
            return 'url(' + plotStopButton + ')';
    }
}}
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
                margin-bottom: 65px;
            }
        `;
