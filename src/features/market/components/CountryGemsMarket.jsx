import LoadingCard from "./LoadingCard";
import {Link, withRouter} from "react-router-dom";
import Cards from "./Card";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import styled from "styled-components";
import {preLoadAuctionPage} from "../marketActions";
import {compose} from "redux";
import connect from "react-redux/es/connect/connect";
import CountryGemsFilter from "./CountryGemsFilter";
import {COUNTRY_LIST} from "../country_list";
import {COUNTRY_FILTER_SELECTED} from "../marketConstants";

const select = store => ({
    auctions: store.market.auctions,
    loading: store.market.auctions ? store.market.auctionsLoading : true,
    error: store.marketActions.error,
    selectedCountry: store.market.selectedCountryFilter,
});

const countries = COUNTRY_LIST.map((country, index) => {
    return {countryId: index + 1, name: country};
}).sort((a, b) => a.name.localeCompare(b.name));

class CountryGemsMarket extends React.Component {

    state = {
        scrolledGems: [],
        allGems: [],
        hasMoreGems: false,
        minPrice: 0,
        maxPrice: 100,
        mobileFiltersDisplayed: false,
        searchValue: this.props.selectedCountry ? this.props.selectedCountry.name : "",
    };

    componentDidMount() {
        const {auctions} = this.props;
        const filteredGems = this.filterGems(auctions);
        filteredGems.sort((gem1, gem2) => gem1.id - gem2.id);
        this.setState({
            allGems: filteredGems,
            scrolledGems: filteredGems.slice(0, 16),
            hasMoreGems: filteredGems.length > 16,
        });
    }

    componentDidUpdate(prevProps) {
        const {selectedCountry, auctions} = this.props;
        if (selectedCountry !== prevProps.selectedCountry || auctions !== prevProps.auctions) {
            const filteredGems = this.filterGems(auctions);
            filteredGems.sort((gem1, gem2) => gem1.id - gem2.id);
            this.setState({
                allGems: filteredGems,
                scrolledGems: filteredGems.slice(0, 16),
                hasMoreGems: filteredGems.length > 16,
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
        if (this.props.selectedCountry) {
            return gems.filter((gem) => {
                return (Number(gem.id) > 61696 && Number(gem.id) < 61952) && (Number(gem.id) - 61696 === Number(this.props.selectedCountry.countryId));
            });
        }
        else {
            return gems.filter((gem) => {
                return (Number(gem.id) > 61696) && (Number(gem.id) < 61952);
            });
        }
    };

    render() {
        const {
            handlePreLoadAuctionPage, loading, handleSelectCountry, handleClearFilter, selectedCountry
        } = this.props;
        const {scrolledGems, hasMoreGems, minPrice, maxPrice, mobileFiltersDisplayed, searchValue} = this.state;

        return (
          <div>
              <FixedFiltersColumn>
                  <CountryGemsFilter countries={countries}
                                     selectedCountry={selectedCountry}
                                     selectCountry={handleSelectCountry}
                                     clearFilter={() => {this.setState({searchValue: ""}); handleClearFilter()}}
                                     searchCountryValue={searchValue}
                                     searchCountry={(searchValue) => this.setState({searchValue})}
                                     mobileFiltersDisplayed={mobileFiltersDisplayed}
                                     toggleMobileFilters={() => this.setState({mobileFiltersDisplayed: !this.state.mobileFiltersDisplayed})}
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
                                  {!loading && scrolledGems && scrolledGems.length > 0 ? (
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
    handleSelectCountry: (country) => (dispatch) => dispatch({type: COUNTRY_FILTER_SELECTED, payload: {country}}),
    handleClearFilter: () => (dispatch) => dispatch({type: COUNTRY_FILTER_SELECTED, payload: {country: null}}),
    handlePreLoadAuctionPage: preLoadAuctionPage,
};

export default compose(
  withRouter,
  connect(
    select,
    actions,
  ),
)(CountryGemsMarket);

const FixedFiltersColumn = styled.div`
    width: 240px;
    float: left;
    z-index: 2;
    position: relative;
    //position: fixed;
    //top: 150px;
    //left: 0;
    
     @media(max-width: 800px) {
        width: 0;
    }
    
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
  
    @media(max-width: 800px) {
        width: 100%;
        margin-left: 0;
        padding: 0 5px;
        min-height: 210px;
    }
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
};