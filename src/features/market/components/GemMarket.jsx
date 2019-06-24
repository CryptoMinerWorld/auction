import LoadingCard from "./LoadingCard";
import {Link, withRouter} from "react-router-dom";
import Cards from "./Card";
import React from "react";
import {gradeConverter, type} from "../../plots/components/propertyPaneStyles";
import InfiniteScroll from "react-infinite-scroller";
import GemMarketFilters from "./GemMarketFilters";
import styled from "styled-components";
import {
    applyFilterOption,
    applySort,
    deselectAllFilters,
    preLoadAuctionPage,
    setDefaultFilters
} from "../marketActions";
import {compose} from "redux";
import connect from "react-redux/es/connect/connect";
import GemDashboardFilters from "../../dashboard/components/GemDashboardFilters";

const select = store => ({
    auctions: store.market.auctions,
    loading: store.market.auctions ? store.market.auctionsLoading : true,
    error: store.marketActions.error,
    unselectedFilters: store.market.unselectedGemMarketFilters,
    selectedSorting: store.market.selectedGemMarketSorting,
});

class GemMarket extends React.Component {

    state = {
        scrolledGems: [],
        allGems: [],
        hasMoreGems: false,
        minPrice: 0,
        maxPrice: 100,
        mobileFiltersDisplayed: false,
    }

    componentDidMount() {
        const {auctions} = this.props;
        console.log("AUCTIONS 1:", auctions, auctions.length);
        const [filteredGems, minPrice, maxPrice] = this.filterGems(auctions);
        this.sortGems(filteredGems);
        this.setState({
            minPrice: minPrice,
            maxPrice: maxPrice,
            allGems: filteredGems,
            scrolledGems: filteredGems.slice(0, 16),
            hasMoreGems: filteredGems.length > 16,
        });
    }

    componentDidUpdate(prevProps) {
        const {unselectedFilters, selectedSorting, auctions} = this.props;
        console.log("AUCTIONS 2:", auctions, auctions.length);
        if (unselectedFilters !== prevProps.unselectedFilters || auctions !== prevProps.auctions) {
            console.log("new unselectedFilters", unselectedFilters);
            const [filteredGems, minPrice, maxPrice] = this.filterGems(auctions);
            console.log("Filtered gems", filteredGems, minPrice, maxPrice);
            this.sortGems(filteredGems);
            this.setState({
                minPrice: minPrice,
                maxPrice: maxPrice,
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
        const scrollTo = Math.min(page * 18, this.state.allGems.length);
        this.setState({
            hasMoreGems: scrollTo < this.state.allGems.length,
            scrolledGems: this.state.allGems.slice(0, scrollTo)
        })
    }

    filterGems = (gems) => {
        let minPrice = 1000;
        let maxPrice = 0;
        const unselectedFilters = this.props.unselectedFilters;
        const filteredGems = gems.filter((gem) => {
            minPrice = gem.currentPrice < minPrice ? gem.currentPrice : minPrice;
            maxPrice = gem.currentPrice > maxPrice ? gem.currentPrice : maxPrice;
              return !unselectedFilters.grades.includes(gradeConverter(Number(gem.gradeType))) &&
                !unselectedFilters.levels.includes("lvl_" + gem.level) &&
                !unselectedFilters.types.includes(type(gem.color)) &&
                (!isNaN(unselectedFilters.prices[0]) && Number(unselectedFilters.prices[0]) <= gem.currentPrice) &&
                (!isNaN(unselectedFilters.prices[1]) && Number(unselectedFilters.prices[1]) >= gem.currentPrice);
          });
        return [filteredGems || [], minPrice, maxPrice];

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
            case "price":
                sortingFunction = (p1, p2) => +p1.currentPrice - p2.currentPrice;
                break;
            case "REA":
                sortingFunction = (p1, p2) => +p1.level - p2.level;
                break;
        }
        const directionSign = sortDirection === "up" ? 1 : -1;
        gems.sort((p1, p2) => {
            return directionSign * sortingFunction(p1, p2);
        });
    }

    render() {
        const {
            handlePreLoadAuctionPage, loading, handleApplySort, unselectedFilters, selectedSorting,
            handleApplyFilterOption, handleDeselectAllFilters, handleSetDefaultFilters
        } = this.props;
        const {scrolledGems, hasMoreGems, minPrice, maxPrice, mobileFiltersDisplayed} = this.state;

        console.log("SCROLED GEMS:", scrolledGems, scrolledGems.length);

        return (
          <div>
              <FixedFiltersColumn>
                  <GemMarketFilters unselectedFilters={unselectedFilters}
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
                                    minPrice={minPrice}
                                    maxPrice={maxPrice}
                  />
              </FixedFiltersColumn>
              <Grid>
                  <Primary>
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
                                  {!loading && scrolledGems && scrolledGems.length >= 0 ? (
                                      scrolledGems.map(auction => (
                                        <Link
                                          to={`/gem/${auction.id}`}
                                          key={auction.id}
                                          onClick={() => handlePreLoadAuctionPage(auction)}
                                        >
                                            <Cards auction={auction}/>
                                        </Link>
                                      ))
                                    ) :
                                    !loading ?
                                      <Card className="bg-dark-gray h5 flex x wrap">
                                          <p className="f4 tc">No Auctions Available.</p>
                                      </Card> : ""
                                  }
                              </CardBox>
                          </InfiniteScroll>
                      </div>
                  </Primary>
              </Grid>
          </div>
          )
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
)(GemMarket);

const FixedFiltersColumn = styled.div`
    width: 240px;
    float: left;
    //position: fixed;
    //top: 150px;
    //left: 0;
`;

const Card = styled.aside`
  clip-path: polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%);
`;

const Grid = styled.article`
  width: calc(100% - 260px);
  margin-left: 260px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 20px;
`;


const CardBox = styled.section`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minMax(280px, 1fr));
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;


const Primary = styled.section`
  grid-column: 1/5;
`;


const infiniteScrollContainer = {
    display: "flex",
    overflow: "hidden",
}