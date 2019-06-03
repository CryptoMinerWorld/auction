import GemDashboardFilters from "./GemDashboardFilters";
import InfiniteScroll from "react-infinite-scroller";
import LoadingCard from "../../market/components/LoadingCard";
import {Link, withRouter} from "react-router-dom";
import Cards from "./GemCard";
import NoCard from "./NoCard";
import React from "react";
import {transactionResolved} from "../../transactions/txActions";
import {getUserPlots, refreshUserPlot} from "../../plots/plotActions";
import {
    addGemsToDashboard,
    filterUserGemsOnPageLoad,
    getUserArtifacts, getUserCountries,
    getUserDetails,
    getUserGems,
    scrollGems, useCoupon
} from "../dashboardActions";
import {preLoadAuctionPage} from "../../market/marketActions";
import {getUserBalance} from "../../sale/saleActions";
import {compose} from "redux";
import connect from "react-redux/es/connect/connect";
import styled from "styled-components";
import {gradeConverter, type} from "../../plots/components/propertyPaneStyles";

const select = store => ({
    userGems: store.dashboard.userGems,
    totalGems: store.dashboard && store.dashboard.userGems && store.dashboard.userGems.length,
    userGemsFiltered: (store.dashboard.userGemsFiltered && store.dashboard.userGemsFiltered.length >= 0) ?
      store.dashboard.userGemsFiltered :
      store.dashboard.userGems,
    userGemsScrolled: store.dashboard.userGemsScrolled ? store.dashboard.userGemsScrolled :
      (store.dashboard.userGemsFiltered && store.dashboard.userGemsFiltered.length >= 0) ?
        store.dashboard.userGemsFiltered.slice(0, store.dashboard.end) :
        store.dashboard.userGems.slice(0, store.dashboard.end),
    hasMoreGems: store.dashboard.hasMoreGems,
    loading: store.dashboard.gemsLoading,
});

const defaultFiltersUnselected = {
    types: ["Per", "Aqu", "Dia", "Eme", "Pea", "Top", "Tur"],
    levels: [],
    grades: [],
};

const deselectAllFilters = {
    types: ["Ame", "Gar", "Opa", "Sap", "Rub", "Per", "Aqu", "Dia", "Eme", "Pea", "Top", "Tur"],
    levels: ["lvl_1", "lvl_2", "lvl_3", "lvl_4", "lvl_5"],
    grades: ["D", "C", "B", "A", "AA", "AAA"],
}

class GemDashboard extends React.Component {

    state = {
        allGems: this.props.userGems,
        scrolledGems: this.props.userGems.slice(0, 16),
        hasMoreGems: this.props.userGems.length > 16,
        unselectedFilters: {
            types: ["Per", "Aqu", "Dia", "Eme", "Pea", "Top", "Tur"],
            levels: [],
            grades: [],
        },
        filterIsClean: false,
        selectedSort: ""
    };

    loadMore(page) {
        this.props.handleScroll(page, 18);
        console.log("Load more ", page);
    }

    setDefaultFilters = () => {
        const newFilters = defaultFiltersUnselected;
        const filteredGems = this.props.userGems.filter((gem) =>
          !newFilters.grades.includes(gradeConverter(Number(gem.gradeType))) && !newFilters.levels.includes("lvl_" + gem.level) && !newFilters.types.includes(type(gem.color)));
        this.setState({
            allGems: filteredGems,
            unselectedFilters: newFilters,
            scrolledGems: filteredGems.slice(0, 16),
            hasMoreGems: filteredGems.length > 16
        }, () => this.sortGems(this.state.selectedSort))
    }

    deselectAllFilters = () => {
        const newFilters = {...deselectAllFilters};
        this.setState({
            allGems: [],
            unselectedFilters: newFilters,
            scrolledGems: [],
            hasMoreGems: false
        });
    }

    filterIsClean = () => {
        return this.state.unselectedFilters.grades.length === deselectAllFilters.grades.length &&
          this.state.unselectedFilters.levels.length === deselectAllFilters.levels.length &&
          this.state.unselectedFilters.types.length === deselectAllFilters.types.length;
    }

    addFilterOption = (filterOption, optionType) => {
        let newFilters;
        if (this.filterIsClean()) {
            newFilters = {...defaultFiltersUnselected};
            newFilters[optionType] = deselectAllFilters[optionType].filter(e => e !== filterOption);
            console.log("NEW FILTERS:", newFilters);
        } else {
            newFilters = {...this.state.unselectedFilters};
            newFilters[optionType] = this.state.unselectedFilters[optionType].includes(filterOption) ?
              this.state.unselectedFilters[optionType].filter(e => e !== filterOption) :
              this.state.unselectedFilters[optionType].concat(filterOption);
        }
        const filteredGems = this.props.userGems.filter((gem) =>
          !newFilters.grades.includes(gradeConverter(Number(gem.gradeType))) && !newFilters.levels.includes("lvl_" + gem.level) && !newFilters.types.includes(type(gem.color)));
        this.setState({
            allGems: filteredGems,
            unselectedFilters: newFilters,
            scrolledGems: filteredGems.slice(0, 16),
            hasMoreGems: filteredGems.length > 16
        }, () => this.sortGems(this.state.selectedSort))
    };

    sortGems = (sortOption, sortDirection) => {
        if (sortOption === this.state.selectedSort && sortDirection === this.state.selectedSortDirection) return;
        let sortingFunction;
        switch (sortOption) {
            case "mrb":
                sortingFunction = (p1, p2) => +p1.rate - p2.rate;
                break;
            case "level":
                sortingFunction = (p1, p2) => +p1.level - p2.level;
                break;
            case "acq":
                sortingFunction = (p1, p2) => +p1.level - p2.level;
                break;
            case "REA":
                sortingFunction = (p1, p2) => +p1.level - p2.level;
                break;

        }
        const directionSign = sortDirection === "up" ? 1 : -1;
        const sortedGems = this.state.allGems.sort((p1, p2) => {
            return directionSign*sortingFunction(p1, p2);
        });
        this.setState({
            allGems: sortedGems,
            selectedSort: sortOption,
            scrolledGems: sortedGems.slice(0, 16),
            hasMoreGems: sortedGems.length > 16
        });
    }


    render() {
        const {hasMoreGems, userGemsScrolled, handlePreLoadAuctionPage, loading} = this.props;
        const {unselectedFilters, selectedSort} = this.state;

        return (
        <Grid className="ph3">
            <Primary>
                <div className="flex jcb aic">
                    {/*<GemSortBox/>*/}
                    {/*{sortBox && <SortBox/>}*/}
                    <GemDashboardFilters unselectedFilters={unselectedFilters}
                                         toggleFilter={(option, optionType) => {
                                             this.addFilterOption(option, optionType)
                                         }}
                                         clearFilters={() => this.deselectAllFilters()}
                                         setDefaultFilters={() => this.setDefaultFilters()}
                                         selectedSort={selectedSort}
                                         toggleSort={(sortOption, sortDirection) => {
                                             this.sortGems(sortOption, sortDirection)
                                         }}
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
                            {!loading && userGemsScrolled && userGemsScrolled.length === 0 &&
                            <p>No matching gems found</p>}
                            {!loading && userGemsScrolled && userGemsScrolled.length >= 0 ? (
                                userGemsScrolled.map(userGem => {
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
    handleScroll: scrollGems,
    handlePreLoadAuctionPage: preLoadAuctionPage,
};

export default compose(
  withRouter,
  connect(
    select,
    actions,
  ),
)(GemDashboard);

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