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
import {calculateMiningStatus, getUserPlots, processBlocks, releaseGem} from "../plotActions";
import {
    BINDING_GEM,
    CANT_MINE, GEM_BINDING,
    MINED,
    MINING,
    NEW_PLOT,
    NOT_MINING,
    PROCESSING,
    STUCK,
    UNBINDING_GEM
} from "./../plotConstants";
import {NO_GEM, PROCESSED} from "../plotConstants";
import {convertMinutesToTimeString, getTimeLeft, getTimeLeftMinutes} from "../../../app/services/PlotService";
import {preLoadAuctionPage} from "../../market/marketActions";

// import "../../../app/css/slick.min.css";
// import "../../../app/css/slick-theme.min.css";

const select = store => {
    const gems = store.dashboard.userGems;
    const plots = store.plots.userPlots;
    plots && plots.forEach((plot) => {
        if (!plot) return;
        if (plot.gemMinesId) {
            plot.gemMines = gems.find((gem) => gem.id.toString() === plot.gemMinesId);
        }
        if (!plot.miningState || (plot.miningState !== BINDING_GEM && plot.miningState !== UNBINDING_GEM && plot.miningState !== PROCESSING)) {
            plot.miningState = calculateMiningStatus(plot);
        }
    });

    console.log("PLOTS:", plots);
    console.log("SOME GEM:", gems);

    return {
        plots: plots,
        gems: store.dashboard.userGems,
        gemMiningIds: store.plots.gemMinesId,
        plotService: store.app.plotServiceInstance,
        currentAccount: store.auth.currentUserId,
    }
};

const allTierFilterOptions = ["dirt_filter", "clay_filter", "limestone_filter", "marble_filter", "obsidian_filter"];
const allPlotFilterOptions = [NEW_PLOT, MINING, STUCK, NO_GEM, PROCESSED];
const defaultPlotFilterOptions = [NEW_PLOT, STUCK, NO_GEM, MINING];
const defaultTierFilterOptions = ["dirt_filter", "clay_filter", "limestone_filter", "marble_filter", "obsidian_filter"];
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
        optionalPopupData: null,
    };

    componentDidMount() {
        this.setState({
            currentTime: new Date().getTime(),
        });
        if (this.props.plots) {
            this.applyAllFilters();
        }
    }

    componentDidUpdate(prevProps) {
        console.log("state:", this.state);
        const {plots} = this.props;
        if (plots !== prevProps.plots) {
            console.log("NEW PLOTS GOT");
            this.setState({
                currentTime: new Date().getTime(),
            });
            if (this.state.plotSelected) {
                const newSelectedPlot = plots.find(plot => plot.id === this.state.plotSelected.id);
                newSelectedPlot && this.setState({
                    plotSelected: newSelectedPlot
                })
            }
            this.applyAllFilters();
            //this.sortFiltered(this.props.plots || []);
        }
    }

    applyFilterOption = (filterOption) => {
        if (allPlotFilterOptions.includes(filterOption)) {
            this.setState({
                tierFilterOptions: this.state.plotFilterOptions.length === 0 ? allTierFilterOptions : this.state.tierFilterOptions,
                plotFilterOptions: this.state.plotFilterOptions.includes(filterOption) ? this.state.plotFilterOptions.filter(e => e !== filterOption) : this.state.plotFilterOptions.concat(filterOption)
            }, () => {
                this.applyAllFilters();
            });
            return;
        }
        if (allTierFilterOptions.includes(filterOption)) {
            this.setState({
                //plotFilterOptions: this.state.tierFilterOptions.length === 0 ? allPlotFilterOptions :
                // this.state.plotFilterOptions,
                tierFilterOptions: this.state.tierFilterOptions.includes(filterOption) ? this.state.tierFilterOptions.filter(e => e !== filterOption) : this.state.tierFilterOptions.concat(filterOption)
            }, () => {
                this.applyAllFilters();
            });
        }
    };

    setFilterOptions = ({plotFilterOptions, tierFilterOptions}) => {
        this.setState({
            plotFilterOptions: plotFilterOptions,
            tierFilterOptions: tierFilterOptions
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

        console.log('sort filtered fn:', filteredPlotsOptional);

        let plots = filteredPlotsOptional || [...this.state.filteredPlots];
        let sortingFunction;
        const directionFlag = this.state.sortOptionDirection === "sort_btn_up" ? 1 : -1;
        switch (this.state.sortOption) {
            case "mined":
                sortingFunction = (p1, p2) => {
                    if (p1.processedBlocks >= 100) {
                        return -1;
                    }
                    else {
                        if (p2.processedBlocks >= 100) {
                            return 1;
                        }
                    }
                    if (p1.currentPercentage === p2.currentPercentage) {
                        return p1.miningState === MINING ? 1 : -1;
                    }
                    return p1.currentPercentage - p2.currentPercentage;
                };
                break;
            case "time_left":
                sortingFunction = (p1, p2) => p1.processedBlocks >= 100 ? -1 : p1.currentPercentage - p2.currentPercentage;
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

            this.state.tierFilterOptions.length > 0 && this.state.plotFilterOptions.forEach((option) => {
                switch (option) {
                    case MINING:
                        if (plot.miningState === MINING || plot.miningState === BINDING_GEM || plot.miningState === PROCESSING)
                            filterPassed = true;
                        break;
                    case STUCK:
                        if (plot.miningState === STUCK || plot.miningState === MINED) filterPassed = true;
                        break;
                    case NO_GEM:
                        if (plot.miningState === NO_GEM || plot.miningState === UNBINDING_GEM) filterPassed = true;
                        break;
                    case PROCESSED:
                        if (plot.miningState === PROCESSED) filterPassed = true;
                        break;
                    case NEW_PLOT:
                        if (plot.miningState === NEW_PLOT ) filterPassed = true;
                        break;
                    default:
                        filterPassed = false;
                }
            });

            if (filterPassed) {
                filterPassed = false;
                this.state.tierFilterOptions.forEach((option) => {
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
                        default:
                            filterPassed = false;
                    }
                });
            }
            return filterPassed;
        });
        this.sortFiltered(plots);
    }

    calculateAllowedPlotAction(plot) {
        switch (plot.miningState) {
            case STUCK:
                return "upgrade";
            case MINED:
            case MINING:
                return "stop";
            case NO_GEM:
            case NEW_PLOT:
                return "start";
            default:
                return "";
        }
    }

    handleActionButtonClick = (action, plot) => {
        switch (action) {
            case "start":
                break;
            case "stop":
                this.props.handleReleaseGem(plot, () => {}, () => this.setState({showSidebarPopup: false}));
                break;
            case "upgrade":
        }
        this.showSidebarPopup("plot-action-" + action)
    };

    showSidebarPopup = (type, optionalData) => {
        this.setState({
            showSidebarPopup: type,
            optionalPopupData: optionalData || null
        })
    };

    showSidebarFilters = () => {
        this.setState({showSidebarFilters: true})
    };

    // updatePlot = (modifiedPlot) => {
    //     if (this.state.plotSelected.id === modifiedPlot.id) {
    //         this.setState({plotSelected: modifiedPlot});
    //     }
    //     this.setState(prevState => ({
    //         filteredPlots: prevState.filteredPlots.map((plot) => plot.id === modifiedPlot.id ? modifiedPlot : plot)
    //     }));
    // }

    // static generateRandomClipPath() {
    //
    //     const rand = Math.floor(Math.random() * 3);
    //
    //     return (
    //       [
    //           "-webkit-clip-path: polygon(0% 5%,11% 1%,35% 0%,68% 0%,90% 1%,100% 8%,99% 97%,81% 100%,22% 100%,5% 99%,0%" +
    //           " 95%);" + "\n" +
    //           "clip-path: polygon(0% 5%,11% 1%,35% 0%,68% 0%,90% 1%,100% 8%,99% 97%,81% 100%,22% 100%,5% 99%,0% 95%);",
    //
    //           "-webkit-clip-path: polygon(0% 4%,21% 1%,45% 0%,88% 0%,99% 9%,100% 95%,88% 100%,32% 100%,8% 98%,0% 95%);" + "\n" +
    //           "clip-path: polygon(0% 4%,21% 1%,45% 0%,88% 0%,99% 9%,100% 95%,88% 100%,32% 100%,8% 98%,0% 95%);",
    //
    //           "-webkit-clip-path: polygon(1% 5%,3% 2%,19% 0%,82% 0%,95% 3%,100% 10%,99% 92%,97% 98%,88% 100%,14% 100%,0%" +
    //           " 98%);" + "\n" +
    //           "clip-path: polygon(1% 5%,3% 2%,19% 0%,82% 0%,95% 3%,100% 10%,99% 92%,97% 98%,88% 100%,14% 100%,0% 98%);",
    //
    //       ][rand]
    //     );
    // }

    render() {
        //console.log("State: ", this.state);
        //console.log("Props: ", this.props);
        const {sortOption, sortOptionDirection, tierFilterOptions, plotFilterOptions, filteredPlots, plotSelected, sliderIndex} = this.state;
        const {handleBindGem, plots, gems, handleGetUserPlots, currentAccount} = this.props;
        const startStopButton = {};

        const isOwner = filteredPlots && (filteredPlots.length > 0) && filteredPlots[0].owner === currentAccount;
        console.log("is onwer:", isOwner, currentAccount);


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
                          filteredPlots={filteredPlots}
                  >
                      {filteredPlots.map((plot, index) => {
                            const plotAction = this.calculateAllowedPlotAction(plot);
                            return (
                              <div key={plot.id} data-index={index}>
                              <PlotBarContainer key={plot.id}
                                                data-index={plot.id}
                                                plot={plot}
                                                selected={plotSelected && plotSelected.id === plot.id}
                                                //clipPath={PlotDisplay.generateRandomClipPath()}
                                                onClick={() => {
                                                    if (plotSelected && plotSelected.id === plot.id) {
                                                        this.showSidebarPopup("plots-selected")
                                                    } else {
                                                        this.setState({plotSelected: plot});
                                                    }
                                                }}>
                                  <div style={miningStatus}>{plot.miningState}</div>
                                  {plot.miningState === MINING &&
                                    <div style={miningStatus}>{convertMinutesToTimeString(getTimeLeftMinutes(plot, plot.gemMines))}</div>
                                  }
                                  {(plot.miningState === NO_GEM || plot.miningState === NEW_PLOT) &&
                                    <div style={miningStatus}>{plot.currentPercentage} Blocks</div>
                                  }
                                  {(plot.miningState !== MINING && plot.miningState !== NO_GEM && plot.miningState !== NEW_PLOT && plot.miningState !== PROCESSING) &&
                                    <div style={miningStatus}>&nbsp;</div>
                                  }
                                  {(plot.miningState === PROCESSING) &&
                                    <div style={miningStatus}>{plot.currentPercentage - plot.processedBlocks} Blocks</div>
                                  }
                                  <PlotBar plot={plot} onGemClick={(e) => {
                                      e.stopPropagation();
                                      if (!isOwner) return;
                                      this.setState({plotSelected: plot}, () =>
                                      this.showSidebarPopup("gems-selected"));
                                  }}/>
                                  {isOwner &&
                                  (plot.miningState === NO_GEM || plot.miningState === NEW_PLOT || plot.miningState === MINED ||
                                  plot.miningState === MINING ? <PlotActionButton
                                      plot={plot}
                                      inactive={plotSelected && plot.id !== plotSelected.id}
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          if (!isOwner) return;
                                          this.setState({plotSelected: plot}, () =>
                                            this.handleActionButtonClick(plotAction, plot));
                                      }}
                                    >
                                        {plotAction.toUpperCase()}
                                    </PlotActionButton> :
                                    (plot.miningState === STUCK ? <a href={`/gem/${plot.gemMines.id}`}>
                                          <PlotActionButton
                                            plot={plot}
                                            inactive={plotSelected && plot.id !== plotSelected.id}
                                          >
                                              {plotAction.toUpperCase()}
                                          </PlotActionButton>
                                      </a> :
                                      <div style={{height: "32px"}}/>))
                                  }

                              </PlotBarContainer>
                              </div>
                            )
                        }
                      )}
                  </Slider>
              </SliderWrapper>
              <PlotSidebar
                showSidebarPopup={(type) => this.showSidebarPopup(type)}
                plotSelected={plotSelected}
                isOwner={isOwner}
              />
              {/*{this.state.showSidebarFilters ?*/}
              {/*<PlotFilter*/}
              {/*activeControls={[].concat(sortOption, sortOptionDirection, sortTier, sortTierDirection, filterOptions)}*/}
              {/*closeCallback={() => this.setState({showSidebarFilter: false})}*/}
              {/*closeCallback={() => this.setState({showSidebarFilter: false})}*/}
              {/*/> : ""}*/}
              <SidebarPopup type={this.state.showSidebarPopup}
                            activeControls={[].concat(sortOption, sortOptionDirection, plotFilterOptions, tierFilterOptions)}
                            applySort={(sortOption) => {
                                this.applySortOption(sortOption)
                            }}
                            plots={plots}
                            gems={gems}
                            applyFilter={(filterOption) => this.applyFilterOption(filterOption)}
                            setFilterOptions={(filterOptions) => this.setFilterOptions(filterOptions)}
                            selectedPlot={plotSelected}
                            closeCallback={() => this.setState({showSidebarPopup: false})}
                            filterDefault={() => {
                                this.setState({
                                    plotFilterOptions: defaultPlotFilterOptions,
                                    tierFilterOptions: defaultTierFilterOptions
                                }, () => this.applyAllFilters());

                            }}
                            processBlocks={(plot) => {
                                this.props.handleProcessBlocks(plot, () => {
                                    this.setState({showSidebarPopup: false});
                                    handleGetUserPlots();
                                });
                            }}
                            showAnotherPopup={(type) => this.setState({showSidebarPopup: type})}
                            stopMining={(plot) => {
                                this.props.handleReleaseGem(plot, () =>
                                    handleGetUserPlots(), () => this.setState({showSidebarPopup: false}));
                            }}
                            optionalData={this.state.optionalPopupData}
                            updatePlot={handleGetUserPlots}
                            goToGemWorkshop={this.props.goToGemWorkshop}
                            handlePreLoadAuctionPage={this.props.handlePreLoadAuctionPage}
              />
          </div>
        );
    }

    verifyOwnership = () => {
        console.log('verify ownership: ', this.props.currentAccount, this.props.userId);
        return this.props.currentAccount && this.props.currentAccount === this.props.userId;
    }
}

export default compose(
  connect(
    select,
    {
        handleReleaseGem: releaseGem,
        handleProcessBlocks: processBlocks,
        handleGetUserPlots: getUserPlots,
        handlePreLoadAuctionPage: preLoadAuctionPage,
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
        case STUCK:
            return props.selected ? "#EFB1B2" : "#70575A";
        case MINED:
        case PROCESSED:
            return props.selected ? "#b9a3c9" : "#655872";
        case NO_GEM:
        case NEW_PLOT:
            return props.selected ? "#6daf7a" : "#4B6653";
        default:
            return props.selected ? "#98c0d6" : "#536373";
    }
}}
            margin: 0px 10px;
            max-height: 620px;
            z-index: 2;
            cursor: pointer;
            clip-path: polygon(0 3%, 12% 0, 88% 0, 100% 3%, 100% 97%, 88% 100%, 12% 100%, 0 97%); 
        -webkit-clip-path: polygon(0 3%, 12% 0, 88% 0, 100% 3%, 100% 97%, 88% 100%, 12% 100%, 0 97%);
            
            ${props => props.selected &&
  `&:after {
                    position: absolute;
                    z-index: 1;
                    width: 136px;
                    height: 100%;
                    left: -3px;
                    background-color: ${props => {
      switch (props.plot.miningState) {
          case STUCK:
              return "#E12D2C";
          case MINED:
          case PROCESSED:
              return "#655872";
          case NO_GEM:
          case NEW_PLOT:
              return "#4B6653";
          case MINING:
              return "#536373";
          default:
              return "#536373";
      }
  }};
        clip-path: polygon(0 3%, 12% 0, 88% 0, 100% 3%, 100% 97%, 88% 100%, 12% 100%, 0 97%); 
        -webkit-clip-path: polygon(0 3%, 12% 0, 88% 0, 100% 3%, 100% 97%, 88% 100%, 12% 100%, 0 97%);
                }`
  }
        `;

const PlotActionButton = styled.div`
            width: ${props => props.plot.miningState === STUCK ? "108px" : "85px"};    
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
        case STUCK:
            return 'url(' + plotUpgradeButton + ')';
        case MINED:
            return 'url(' + plotFinishButton + ')';
        case NO_GEM:
        case NEW_PLOT:
            return 'url(' + plotStartButton + ')';
        default:
            return 'url(' + plotStopButton + ')';
    }
    }
}}
        `;

const miningStatus = {
    color: "white",
    fontSize: "18px",
};

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