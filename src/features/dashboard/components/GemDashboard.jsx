import GemDashboardFilters from "./GemDashboardFilters";
import InfiniteScroll from "react-infinite-scroller";
import LoadingCard from "../../market/components/LoadingCard";
import {Link, withRouter} from "react-router-dom";
import Cards from "./GemCard";
import NoCard from "./NoCard";
import React from "react";
import {transactionResolved} from "../../transactions/txActions";
import {calculateMiningStatus, getUserPlots, refreshUserPlot} from "../../plots/plotActions";
import {
    addGemsToDashboard, applyFilterOption, applySort, deselectAllFilters,
    filterUserGemsOnPageLoad,
    getUserArtifacts, getUserCountries,
    getUserDetails,
    getUserGems,
    scrollGems, setDefaultFilters, useCoupon
} from "../dashboardActions";
import {preLoadAuctionPage} from "../../market/marketActions";
import {getUserBalance} from "../../sale/saleActions";
import {compose} from "redux";
import connect from "react-redux/es/connect/connect";
import styled from "styled-components";
import {gradeConverter, type} from "../../plots/components/propertyPaneStyles";
import {MINING, STUCK} from "../../plots/plotConstants";

const select = store => {
    const gems = store.dashboard.userGems;
    const plots = store.plots.userPlots;
    gems && gems.forEach((gem) => {
        if (gem.auctionIsLive) return;
        if (gem.state) {
            const plotMined = plots.find((plot) => gem.id.toString() === plot.gemMinesId);
            if (plotMined) {
                gem.plotMined = plotMined;
                if (plotMined.currentPercentage < 100) {
                    const blocksLeft = plotMined.layerEndPercentages[gem.level - 1] - plotMined.currentPercentage;
                    if (blocksLeft === 0) {
                        gem.miningState = STUCK;
                    } else {
                        gem.miningState = MINING;
                    }
                }
            }
        }
    });

    return {
        userGems: gems,
        totalGems: gems && gems.length || 0,
        loading: store.dashboard.gemsLoading,
        unselectedFilters: store.dashboard.unselectedGemWorkshopFilters,
        selectedSorting: store.dashboard.selectedGemWorkshopSorting,
    }
};

class GemDashboard extends React.Component {

    state = {
        scrolledGems: [],
        allGems: [],
        hasMoreGems: false,
        mobileFiltersDisplayed: false,
    }

    componentDidMount() {
        const {userGems} = this.props;
        console.log("User gems:", userGems);
        const filteredGems = this.filterGems(userGems);
        this.sortGems(filteredGems);
        this.setState({
            allGems: filteredGems,
            scrolledGems: filteredGems.slice(0, 16),
            hasMoreGems: filteredGems.length > 16,
        }, () => console.log("Did mount:", this.state, this.props))
    }

    componentDidUpdate(prevProps) {
        const {unselectedFilters, selectedSorting, userGems} = this.props;
        if (unselectedFilters !== prevProps.unselectedFilters) {
            const filteredGems = this.filterGems(userGems);
            this.sortGems(filteredGems);
            this.setState({
                allGems: filteredGems,
                scrolledGems: filteredGems.slice(0, 16),
                hasMoreGems: filteredGems.length > 16,
            })
        }
        if (unselectedFilters === prevProps.unselectedFilters && selectedSorting !== prevProps.selectedSorting) {
            this.sortGems(this.state.allGems);
            this.setState({
                allGems: this.state.allGems,
                scrolledGems: this.state.allGems.slice(0, 16),
                hasMoreGems: this.state.hasMoreGems,
            })
        }
    }

    loadMore(page) {
        const scrollTo = Math.min(page*18, this.state.allGems.length);
        this.setState({
            hasMoreGems: scrollTo < this.state.allGems.length,
            scrolledGems: this.state.allGems.slice(0, scrollTo)
        })
    }

    filterGems = (gems) => {
        const unselectedFilters = this.props.unselectedFilters;
        return gems.filter((gem) =>
          !unselectedFilters.grades.includes(gradeConverter(Number(gem.gradeType))) &&
          !unselectedFilters.levels.includes("lvl_" + gem.level) &&
          !unselectedFilters.types.includes(type(gem.color)) &&
          !unselectedFilters.states.includes(resolveGemFilterState(gem)));
    }

    sortGems = (gems) => {
        const {sortOption, sortDirection} = this.props.selectedSorting;
        let sortingFunction;
        switch (sortOption) {
            case "mrb":
                sortingFunction = (p1, p2) => +p1.rate - p2.rate;
                break;
            case "level":
                sortingFunction = (p1, p2) => +p1.level - p2.level;
                break;
            case "acq":
                sortingFunction = (p1, p2) => +p1.ownershipModified - p2.ownershipModified;
                break;
            case "REA":
                sortingFunction = (p1, p2) => (+p1.restingEnergy || 0) - (+p2.restingEnergy || 0);
                break;
        }
        const directionSign = sortDirection === "up" ? 1 : -1;
        gems.sort((p1, p2) => {
            return directionSign*sortingFunction(p1, p2);
        });
    }

    render() {
        const {handlePreLoadAuctionPage, loading, handleApplySort, unselectedFilters, selectedSorting,
            handleApplyFilterOption, handleDeselectAllFilters, handleSetDefaultFilters} = this.props;
        const {scrolledGems, hasMoreGems, mobileFiltersDisplayed} = this.state;

        return (
        <Grid className="ph3">
            <Primary>
                <div className="flex jcb aic">
                    <GemDashboardFilters unselectedFilters={unselectedFilters}
                                         applyFilter={(option, optionType) => {
                                             handleApplyFilterOption(option, optionType)
                                         }}
                                         clearFilters={() => handleDeselectAllFilters()}
                                         setDefaultFilters={() => handleSetDefaultFilters()}
                                         selectedSort={selectedSorting}
                                         applySort={(sortOption, sortDirection) => {
                                             handleApplySort(sortOption, sortDirection);
                                         }}
                                         mobileFiltersDisplayed={mobileFiltersDisplayed}
                                         toggleMobileFilters={() => this.setState({mobileFiltersDisplayed: !this.state.mobileFiltersDisplayed})}
                    />
                </div>
                {/*<><><><><><><><><><><><><><><>*/}
                <div style={infiniteScrollContainer}>
                    <InfiniteScroll
                      pageStart={0}
                      loadMore={(page) => this.loadMore(page)}
                      hasMore={hasMoreGems}
                      loader={<div key={0}>Loading ...</div>}
                      style={{width: "100%"}}
                      treshold={200}
                      useWindow={true}
                    >
                        <CardBox>
                            {loading && [1, 2, 3, 4, 5, 6].map(num => <LoadingCard key={num}/>)}
                            {!loading && scrolledGems && scrolledGems.length === 0 &&
                            <p>No matching gems found</p>}
                            {!loading && scrolledGems && scrolledGems.length >= 0 ? (
                                scrolledGems.map(userGem => {
                                    //console.log('USER GEM: ', userGem);
                                    return (
                                      <Link
                                        to={`/gem/${userGem.id}`}
                                        key={userGem.id}
                                        onClick={() => handlePreLoadAuctionPage(userGem)}
                                      >
                                          <Cards auction={userGem}/>
                                      </Link>
                                    )
                                })
                              ) :
                              !loading ? <NoCard/> : ""
                            }
                        </CardBox>
                    </InfiniteScroll>
                </div>
            </Primary>
        </Grid>)
    }
}

const actions = {
    handleApplySort: applySort,
    handleApplyFilterOption: applyFilterOption,
    handleDeselectAllFilters: deselectAllFilters,
    handleSetDefaultFilters: setDefaultFilters,
    handlePreLoadAuctionPage: preLoadAuctionPage,
};

export default compose(
  withRouter,
  connect(
    select,
    actions,
  ),
)(GemDashboard);

const resolveGemFilterState = (gem) => {
    if (gem.auctionIsLive) return "auction";
    if (!gem.state) return "idle";
    if (gem.miningState === STUCK) return "stuck";
    if (gem.miningState === MINING) return "mining";
    //todo: return actual gem state: idle, mining, auction, stuck;
    return "idle";
}


const Grid = styled.article`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-column-gap: 20px;
`;

const CardBox = styled.section`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minMax(280px, 1fr));
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  padding-bottom: 20px;
`;

const Primary = styled.section`
  grid-column-start: span 5;
  width: 100%;
`;

const infiniteScrollContainer = {
    display: "flex",
    overflow: "hidden",
}